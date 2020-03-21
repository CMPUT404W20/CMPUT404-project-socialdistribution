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
        print("TESTING")
        headers = {
            # replace <TOKEN> with your token
            'Authorization': 'token  3e48a2aeb3eb0a1c1804ccb412f39569fed8b100',
        }
        response = requests.get('https://api.github.com/users/<username>/received_events',
                                headers=headers)  # replace <username> with your user name
        data = response.json()
        print(data)
        return Response({"data": data})
    # event_actions = {'WatchEvent': 'starred', 'PushEvent': 'pushed to'}

    # for event in data:
    #     if event['type'] in event_actions:
    #         name = event['actor']['display_login']
    #         action = event_actions[event['type']]
    #         repo = event['repo']['name']
    #         print('{name} {action} {repo}'.format(
    #             name=name, action=action, repo=repo))

    #     if event['type'] == 'ForkEvent':
    #         name = event['actor']['display_login']
    #         repo = event['repo']['name']
    #         forked_repo = event['payload']['forkee']['full_name']
    #         print('{name} forked {forked_repo} from {repo}'.format(
    #             name=name, forked_repo=forked_repo, repo=repo))
