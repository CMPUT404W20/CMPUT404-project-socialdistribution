from backend.models import *
from django.conf import settings

from rest_framework import serializers
from rest_auth.registration.serializers import RegisterSerializer
from allauth.account.adapter import get_adapter
from allauth.account.utils import setup_user_email

import uuid


class AuthRegisterSerializer(RegisterSerializer):

    def get_cleaned_data(self):
        return {
            'username': self.validated_data.get('username', ''),
            'password1': self.validated_data.get('password1', ''),
            'email': self.validated_data.get('email', ''),
            'is_active': False  # Set to False because newly created user needs to get approval from system admin in order to sign in
        }

    def save(self, request):
        # Get the cleaned JSON data
        adapter = get_adapter()
        user = adapter.new_user(request)
        user.is_active = False

        current_host = settings.APP_HOST
        if Host.objects.filter(url=current_host).exists():
            host_obj = Host.objects.filter(url=current_host)
        else:
            host_obj = Host.objects.create(url=current_host)
        user.host = host_obj

        self.cleaned_data = self.get_cleaned_data()
        adapter.save_user(request, user, self)
        setup_user_email(request, user, [])

        return user


class UserSerializer(serializers.ModelSerializer):

    displayName = serializers.CharField(source="username")
    github = serializers.URLField(source="githubUrl")
    id = serializers.CharField(source="get_full_user_id")
    host = serializers.CharField(source="host.url")
    url = serializers.CharField(source="get_full_user_id")

    class Meta:
        model = User
        fields = ["id", "host", "displayName", "url", "github"]


class PostSerializer(serializers.ModelSerializer):

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['author'] = UserSerializer(instance.author).data
        return response

    class Meta:
        model = Post
        fields = '__all__'


class UserFriendSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="get_full_user_id")

    class Meta:
        model = User
        fields = ["id"]


class FriendSerializer(serializers.ModelSerializer):
    toUser = UserFriendSerializer()

    class Meta:
        model = Friend
        fields = ["toUser"]

# class UserFriendRequestSerializer(serializers.ModelSerializer):
#     # id = serializers.CharField(source="get_full_user_id")
#     # id = serializers.CharField(source="id")
#     host = serializers.URLField(source="host.url")
#     displayName = serializers.CharField(source="username")
#     url = serializers.CharField(source="get_full_user_id")

#     class Meta:
#         model = User
#         fields = ['id','host','displayName','url']


class FriendRequestSerializer(serializers.ModelSerializer):
    fromUser = UserSerializer(read_only=True)
    toUser = UserSerializer(read_only=True)

    class Meta:
        model = FriendRequest
        fields = ["fromUser", "toUser"]

    '''
    Defined the create function below

    '''

    def create(self, validated_data):
        user_id = self.context['fromUser'].get("id").rsplit('/', 1)[1]
        friend_id = self.context['toUser'].get("id").rsplit('/', 1)[1]
        user = User.objects.get(id=int(user_id))
        friend = User.objects.get(id=int(friend_id))
        req = FriendRequest.objects.create(fromUser=user, toUser=friend)
        req.save()
        return req
