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
from backend.apiviews.paginations import CommentPagination
from backend.utils import *
from backend.server import *
import requests


class CommentViewSet(viewsets.ModelViewSet):
    """
    Viewset for all the operation related to Comment
    """
    queryset = Comments.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = CommentPagination

    def get_post_comment(self, request, postId):
        request_post = Post.objects.get(postId=postId)
        if self.request.user in request_post.get_visible_users():
            queryset = self.get_queryset().filter(post__postId=postId).order_by("-published")

            page = self.paginate_queryset(queryset)
            serializer = self.get_serializer(page, many=True)

            return self.get_paginated_response(serializer.data)
        else:
            return Response({"message": "Not Authorized to view the comments"},
                         status=status.HTTP_401_UNAUTHORIZED)

    def add_comment(self, request, postId):
        
        request_user = get_object_or_404(User, fullId=protocol_removed(request.data["comment"]["author"]["id"]))
        post = Post.objects.filter(pk=postId)
        if not post:

            host_url = request.get_host()
            host = Host.objects.get(url=host_url)
            endpoint = "/posts/{}/comments/".format(postId)

            response = post_to_host(endpoint,host,request.data)
            if response.status_code == 200:
                print(response.status_code)

            # endpoint= "/posts/{}/comments/".format('253c1388-c927-47a7-acc0-bffa0d066e90')

            
        else:
            if request.data and request.data["query"] == "addComment" and request.data["post"]:
                if Post.objects.filter(postId=postId).exists():
                    requested_post = Post.objects.get(postId=postId)
                    viewable_users = requested_post.get_visible_users()

                    if request_user in viewable_users:
                        comment_data = request.data["comment"]

                        comment_data["content"] = comment_data["comment"]
                        request_user_id = protocol_removed(request.data["comment"]["author"]["id"])
                        comment_data["author"] = request_user_id

                        serializer = CommentSerializer(
                            data=comment_data, context={"request": request, "postId": postId})

                        if serializer.is_valid():
                            serializer.save()
                            return Response({"query": "addComment", "success": True, "message": "Comment Added"}, status=status.HTTP_201_CREATED)
                        else:
                            return Response({"query": "addComment", "success": False, "message": serializer.errors}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)

                    else:
                        return Response({"query": "addComment", "success": False, "message": "Comment not allowed"},
                                status=status.HTTP_403_FORBIDDEN)

                else:
                    Response({"query": "addComment", "success": False, "message": "Post not Found"},
                            status=status.HTTP_404_NOT_FOUND)
            else:
                Response({"query": "addComment", "success": False, "message": "Wrong request body format"},
                        status=status.HTTP_400_BAD_REQUEST)

