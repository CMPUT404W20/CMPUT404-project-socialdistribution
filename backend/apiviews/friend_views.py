from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework import mixins
from rest_framework.response import Response
from rest_framework import views, status
from rest_framework import permissions
from rest_framework.decorators import permission_classes

from backend.serializers import UserSerializer, FriendSerializer, FriendRequestSerializer
from backend.models import User, Friend, FriendRequest
from backend.permissions import *
from rest_framework.decorators import action
from django.http import Http404
from django.db.models import Q
import json
from backend.utils import *


class FriendViewSet(viewsets.ViewSet):
    # Friendships between two users
    serializer_class = FriendSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def make_friend(self, user, friend):
        # our model needs two relationships in the table: Author + Friend (and vice versa)

        Friend.objects.create(
            fromUser=user, toUser=friend).save()
        Friend.objects.create(
            fromUser=friend, toUser=user).save()
        # delete the friend request
        FriendRequest.objects.filter(
            fromUser__fullId=user.fullId).delete()

    def check_friends(self, request, authorId1, authorId2, *args, **kwargs):
        # author/<path:authorId1>/friends/<path:authorId2>
        id1 = protocol_removed(authorId1)
        id2 = protocol_removed(authorId2)
        
        try:
            author1 = User.objects.get(fullId=id1)
            author2 = User.objects.get(fullId=id2)
        except:
            return Response({"query": "friends", "authors": [authorId1, authorId2], "friends": False})
        else:
            # check for two-way friendship
            friends = Friend.objects.filter(toUser__fullId=id1, fromUser__fullId=id2).exists() and Friend.objects.filter(fromUser__fullId=id1, toUser__fullId=id2).exists()
            return Response({"query": "friends", "authors": [author1.get_full_user_id(), author2.get_full_user_id()], "friends": friends})



    def post_query_friends(self, request, authorId, *args, **kwargs):
        # /author/<path:authorId>/friends
        user_id = protocol_removed(authorId)
        request_data = dict(request.data)
        new_author_list = []

        if request_data.get('query') == "friends":
            author_list = request_data.get('authors')
            # iterate through authors and find all friendships if they exist
            for author in author_list:
                author_id = protocol_removed(author)
                if (Friend.objects.filter(fromUser__fullId=user_id, toUser__fullId=author_id).exists()):
                    # add friend to reutrned list
                    new_author_list.append(author)
            return Response({"query": "friends", "author": authorId, "authors": new_author_list}, status=status.HTTP_200_OK)
        return Response({"query": "friends", "author": [], "message": "wrong request"}, status=status.HTTP_400_BAD_REQUEST)

    def post_friendship(self, request):
        # /friend/accept: Set freindship between author and friend

        request_data = dict(request.data)
        if request_data.get("query") == "friend":
            # grab the userids and friend
            user_id = request.user.fullId
            friend_id = protocol_removed(request_data["toUser"].get("id"))
            # check if friend request was made
            does_exist = FriendRequest.objects.filter(
                toUser__fullId=user_id, fromUser__fullId=friend_id).exists()
            if does_exist:

                # get user and friend object
                user = get_object_or_404(User, fullId=user_id)
                friend = get_object_or_404(User, fullId=friend_id)

                # check if they are already friends
                if not Friend.objects.filter(fromUser=user, toUser=friend).exists() or not Friend.objects.filter(fromUser=friend, toUser=user).exists():
                    # make them friends
                    self.make_friend(user, friend)
                    return Response({"query": "createFriend", "success": True, "message": "Friendship created"}, status=status.HTTP_201_CREATED)
                else:
                    return Response({"query": "createFriend", "success": False, "message": "Already Friends"}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
            else:
                return Response({"query": "createFriend", "success": False, "message": "No Friend Request"}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        else:
            return Response({"query": "createFriend", "success": False, "message": "wrong request"}, status=status.HTTP_400_BAD_REQUEST)

    def unfriend(self, request):
        # friend/unfriend
        request_data = dict(request.data)
        if request_data.get("query") == "unfriend":
            user_id = request.user.fullId
            friend_id = protocol_removed(request_data["friend"].get("id"))
            if friend_id:
                # if they are friends then delete both instances of the relationship
                Friend.objects.get(fromUser__fullId=user_id, toUser__fullId=friend_id).delete()
                Friend.objects.get(toUser__fullId=user_id, fromUser__fullId=friend_id).delete()
                return Response({"query": "unfriend", "success": True, "message": "Successful unfriend"}, status=status.HTTP_200_OK)
            else:
                return Response({"query": "unfriend", "success": False, "message": "Wrong Post Body"}, status=status.HTTP_406_NOT_ACCEPTABLE)
        return Response({"query": "unfriend", "success": False, "message": "wrong request"}, status=status.HTTP_400_BAD_REQUEST)
