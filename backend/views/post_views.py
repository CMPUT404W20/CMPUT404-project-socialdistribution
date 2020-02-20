from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from backend.serializers import PostSerializer
from backend.models import Post
from rest_framework import viewsets
from rest_framework.response import Response

class PostViewSet(viewsets.ModelViewSet):
    """
    Viewset for all the operation related to Post
    """
    
    serializer_class = PostSerializer
    queryset = Post.objects.all()
