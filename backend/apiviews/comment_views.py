from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model

from rest_framework import viewsets
from rest_framework import mixins
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from rest_framework.decorators import permission_classes

from backend.serializers import CommentSerializer
from backend.models import Comments, Post, User
from backend.permissions import *
from backend.utils import *
from backend.apiviews.paginations import CommentPagination

class CommentViewSet(viewsets.ModelViewSet):
    """
    Viewset for all the operation related to Comment
    """
    queryset = Comments.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    pagination_class = CommentPagination

    def get_post_comment(self, request, postId):
        queryset = self.get_queryset().filter(post__postId=postId)

        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True)

        return self.get_paginated_response(serializer.data)


