from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.conf import settings

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
from backend.server import *

from django.db.models import Q
from django.conf import settings
import requests
import json


class AuthorViewSet(viewsets.ViewSet):

    def get_authors(self, request, *args, **kwargs):
        '''
        Get all the authors
        '''
        foreign_author = []
        for host in Host.objects.all():
            if host.serviceAccountUsername and host.serviceAccountPassword:

                response = requests.get(
                    host.url+"author",
                    auth=(host.serviceAccountUsername,
                        host.serviceAccountPassword)
                )

                if response.status_code == 200:
                    response_data = response.json()
                    # if they followe swagger format, then use "data" as key
                    if "data" in response_data:
                        foreign_author = response_data["data"]
                    else:
                        foreign_author += response_data

        author = User.objects.all()
        serializer = UserSerializer(author, many=True)
        return Response(serializer.data+foreign_author)

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
    
        url = get_host_from_id(pk)
        if url != settings.APP_HOST:
            if Host.objects.filter(url=url).exists():
                host = Host.objects.get(url=url)
                endpoint = get_url_path(pk)

                response = get_from_host("{}/friends/".format(endpoint), host)

                if response.status_code == 200:
                    return Response(response.json())
                else:
                    return Response({"query": "friends", "authors": [], "message": "can't fetch friend information about the user"}, status=status.HTTP_404_NOT_FOUND)

            else:
                return Response({"query": "friends", "authors": [], "message": "no such user"}, status=status.HTTP_404_NOT_FOUND)

        else:
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

    def get_author_by_username(self, request, userName, *args, **kwargs):
        # Given some string, searches all users and returns matching users
        # /authors/search/<str:userName>
        queryset_of_authors = User.objects.filter(username__contains=userName)
        list_of_authors = list([user.username for user in queryset_of_authors])
        if len(list_of_authors) != 0:
            return Response({"authors": list_of_authors}, status=status.HTTP_200_OK)
        else:
            return Response({"authors": list_of_authors}, status=status.HTTP_400_BAD_REQUEST)
