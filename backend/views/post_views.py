from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from rest_framework import viewsets
from rest_framework import mixins
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework.decorators import permission_classes

from backend.serializers import PostSerializer
from backend.models import Post


class PostViewSet(mixins.CreateModelMixin,
                  mixins.ListModelMixin,
                  mixins.RetrieveModelMixin,
                  viewsets.GenericViewSet):
    """
    Viewset for all the operation related to Post
    """

    serializer_class = PostSerializer
    queryset = Post.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


    def get(self, request, *args, **kwargs):
        # TODO add permission check for post
        return self.list(request, *args, **kwargs)

    def create_post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
