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
from django.db.models import Q

class AuthorViewSet(viewsets.ViewSet):
    
    def get_authors(self, request, *args, **kwargs):
        '''
        Get all the authors
        '''
        author = User.objects.all()
        serializer = UserSerializer(author,many=True)
        return Response(serializer.data)

    def get_profile(self, request,pk, *args, **kwargs):
        '''
        /author/{author_id}: Get a author's profile with id = {author_id}
        '''
        
        author = get_object_or_404(User, pk=pk)
        serializer = User_AuthorFriendSerializer(author)
        friends = Friend.objects.filter(fromUser_id=author)
        newSerializer = AuthorFriendSerializer(friends,many = True)
        print(newSerializer.data)
        print(serializer.data["id"])
        friends_list = []
        for i in newSerializer.data:
            value = list(list(list(i.items())[0])[1].items())
            friends_dict = {}
            for j in value:
                friends_dict[j[0]] = j[1]
            friends_list.append(friends_dict.copy())
        print(friends_list)

        return Response({"id":serializer.data["id"],"host":serializer.data["host"],"displayName":serializer.data["displayName"],"url":serializer.data["url"],
                        "Friends":friends_list})  

    def get_friends(self, request,pk, *args, **kwargs):
        '''
        /author/{author_id}/friends: Get all the friends of the author
        '''
        
        author = get_object_or_404(User, pk=pk)
        friends = Friend.objects.filter(fromUser_id=author)
        serializer = FriendSerializer(friends,many = True)
        id_List = []
        for i in serializer.data:
            id_List.append(list(list(i.items())[0][1].items())[0][1])
            
        return Response({"query":"friends","Author":id_List})
