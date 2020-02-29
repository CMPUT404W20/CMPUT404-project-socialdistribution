from django.contrib.auth.models import User

from rest_framework import viewsets
from rest_framework import mixins
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from rest_framework.decorators import permission_classes

from backend.serializers import UserSerializer, FriendSerializer
from backend.models import User, Friend
from backend.permissions import *

from django.http import Http404
from django.db.models import Q

class AuthorViewSet(viewsets.ViewSet):
    
    def get_authors(self, request, *args, **kwargs):
        '''
        Get all the authors
        '''
        author = User.objects.all()
        serializer = UserSerializer(author,many=True)
        return Response(serializer.data)


    def get_object(self, pk):
        try:
            return User.objects.get(pk=pk)
        except User.DoesNotExist:
            raise Http404

    def get_profile(self, request,pk, *args, **kwargs):
        '''
        /author/{author_id}: Get a author's profile with id = {author_id}
        '''
        author = self.get_object(pk)
        serializer = UserSerializer(author)
        return Response({"query": "author", "count": 1, "size": 1, "Profile": [serializer.data]})

    def get_friends(self, request,pk, *args, **kwargs):
        '''
        /author/{author_id}/friends: Get all the friends of the author
        '''
        
        author = self.get_object(pk)
        friends = Friend.objects.filter(Q(fromUser_id=author))
        serializer = FriendSerializer(friends,many=True)
        return Response({"query":"friends","Author":serializer.data})
        # return Response(serializer.data)

    