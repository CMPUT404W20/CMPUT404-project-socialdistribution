from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from rest_framework import viewsets
from rest_framework import mixins
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from rest_framework.decorators import permission_classes

from backend.serializers import *
from backend.models import User, Friend
from backend.permissions import *
from backend.utils import *
from django.db.models import Q
from django.conf import settings
import requests
import json


class AuthorViewSet(viewsets.ViewSet):

    def get_authors(self, request, *args, **kwargs):
        '''
        Get all the authors
        '''
        author = User.objects.all()
        serializer = UserSerializer(author, many=True)
        return Response(serializer.data)

    def get_profile(self, request, pk, *args, **kwargs):
        '''
        /author/{author_id}: Get a author's profile with fullId = {author_id}
        '''
        fullId = protocol_removed(pk)
        author = get_object_or_404(User, fullId=fullId)
        serializer = User_AuthorFriendSerializer(author)
        friends = Friend.objects.filter(fromUser__fullId=author.fullId)
        newSerializer = AuthorFriendSerializer(friends, many=True)

        friends_list = []
        for i in newSerializer.data:
            value = list(list(list(i.items())[0])[1].items())
            friends_dict = {}
            for j in value:
                friends_dict[j[0]] = j[1]
            friends_list.append(friends_dict.copy())

        return Response({"id": serializer.data["id"], "host": serializer.data["host"], "displayName": serializer.data["displayName"], "url": serializer.data["url"],
                         "friends": friends_list})

    def get_friends(self, request, pk, *args, **kwargs):
        '''
        /author/{author_id}/friends: Get all the friends of the author
        '''
        fullId = protocol_removed(pk)
        author = get_object_or_404(User, fullId=fullId)
        pk = protocol_removed(pk)
        friends = Friend.objects.filter(fromUser__fullId=author.fullId)
        serializer = FriendSerializer(friends, many=True)
        id_List = []
        for i in serializer.data:
            id_List.append(list(list(i.items())[0][1].items())[0][1])

        return Response({"query": "friends", "authors": id_List})

    def get_current_user(self, request):
        # Return information about currently logged in user
        if request.user.is_authenticated:
            current_user = request.user
            serializer = UserSerializer(current_user)

            return Response(serializer.data)
        else:
            return Response({"authenticated": False}, status=status.HTTP_401_UNAUTHORIZED)

    def get_github_activity(self, request):
        github_token = 'token  ' + settings.GITHUB_TOKEN

        #If the url field is empty, returns HTTP 400.
        if request.user.githubUrl == "":
            return Response("No gitHub url provided",status=status.HTTP_400_BAD_REQUEST)

        id = github_urlparser(request.user.githubUrl)
        request_url = 'https://api.github.com/users/{}/received_events'.format(id)
        headers = {
            'Authorization': github_token,
        }
        response = requests.get(request_url,headers=headers)
        data = response.json()

        parsed_data = {}
        parsed_list = []
        for item in data:
            if item['type'] == 'ForkEvent':
                parsed_data["name"] = item['actor']['display_login']
                parsed_data["event"] = item['type']
                parsed_data["Forked_Repo"] = item['payload']['forkee']['full_name']
                parsed_data["repo"] = item['repo']['name']

            else:
                parsed_data["name"] = item['actor']['display_login']
                parsed_data["event"] = item['type']
                parsed_data["repo"] = item['repo']['name']
                parsed_data.pop("Forked_Repo", None)

            parsed_list.append(parsed_data.copy())
            
        

        return Response({"data": parsed_list})
