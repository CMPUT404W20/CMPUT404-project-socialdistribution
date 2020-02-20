from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from rest_framework import viewsets
from rest_framework import mixins
from rest_framework.response import Response
from rest_framework import status
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
        body = request.data
        request_query = body.get("query")
        post_data = body.get("post")

        if request_query == "createPost" and post_data:
            '''
            Our model takes in a pk rather than Json, since only this endpoint will only be used by logged in user,
            therefore, we just grab the id from request after they authenticated successfully
            '''
            current_user_id = self.request.user.id
            post_data["author"] = current_user_id

            serializer = PostSerializer(
                data=post_data, context={"request": request})
            if serializer.is_valid():
                serializer.save()
                return Response({"query": "createPost", "success": True, "message": "Post created"}, status=status.HTTP_201_CREATED)
            else:
                return Response({"query": "createPost", "success": False, "message": serializer.errors}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        else:
            return Response({"query": "createPost", "success": False, "message": "wrong request"},
                            status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
