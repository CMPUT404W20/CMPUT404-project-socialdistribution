from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from rest_framework import viewsets
from rest_framework import mixins
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from rest_framework.decorators import permission_classes

from backend.serializers import UserSerializer
from backend.models import User
from backend.permissions import *

class AuthorViewSet(viewsets.ModelViewSet):

    #ViewSet for operations related to authors.

    serializer_class = UserSerializer
    queryset = User.objects.all()
    lookup_field = "id"

    def retrieve(self, request, *args, **kwargs):
        #/author/{author_id}: Get a author's profile with id = {author_id}
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        print(request.data)
        return Response({"query": "author", "count": 1, "size": 1, "Profile": [serializer.data]})


