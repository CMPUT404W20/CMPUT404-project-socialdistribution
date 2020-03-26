from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.conf import settings
from django.forms.models import model_to_dict
from django.core.cache import cache

from rest_framework import viewsets
from rest_framework import mixins
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from rest_framework.decorators import permission_classes

from backend.serializers import PostSerializer, UserSerializer
from backend.models import Post, User
from backend.permissions import *
from backend.utils import *
from backend.server import *
from backend.apiviews.paginations import PostPagination
from backend.helpers.github import *
from backend.apiviews.paginations import PostPagination

import json, uuid


class PostViewSet(viewsets.ModelViewSet):
    """
    Viewset for all the operation related to Post
    """

    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = "postId"
    pagination_class = PostPagination

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset().filter(visibility=PUBLIC)

        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True)
        return self.get_paginated_response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        '''
        GET /posts/{POST_ID} : access to a single post with id = {POST_ID}
        '''
        instance = self.get_object()
        queryset = Post.objects.none()
        queryset |= Post.objects.filter(pk=instance.pk).order_by("pk")

        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True)
        return self.get_paginated_response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        '''
        DELETE /posts/{POST_ID} : delete post with id = {POST_ID}
        '''
        post_id = self.kwargs.get(self.lookup_field)
        deleted_post = get_object_or_404(Post, pk=post_id)

        if deleted_post.author.id == request.user.id:
            self.perform_destroy(deleted_post)
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(data={"success": False, "msg": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)

    def create_post(self, request, *args, **kwargs):
        '''
        POST /author/posts : create a post for currently authenticated user
        '''

        post_data = request.data
        if post_data:
            '''
            Our model takes in a pk rather than Json, since only this endpoint will only be used by logged in user,
            therefore, we just grab the id from request after they authenticated successfully
            '''
            post_data["author"] = self.request.user.id
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

    def get_user_visible_posts(self, request):
        user = request.user
        visible_posts = Post.objects.none()

        for post in self.get_queryset():
            if user == post.author or user in post.get_visible_users():
                visible_posts |= Post.objects.filter(postId=post.postId)

        page = self.paginate_queryset(visible_posts)
        serializer = self.get_serializer(page, many=True)

        # get foreign users' posts
        user_friends = user.get_friends().exclude(host__url=settings.APP_HOST)
        foreign_posts = []

        for friend in user_friends:
            response = get_from_host(
                "author/{}/posts".format("https://"+friend.fullId), friend.host)
            if response.status_code == 404:
                friend_uid = friend.fullId.split("/")[-1]
                response = get_from_host(
                    "author/{}/posts".format(friend_uid), friend.host)
            try:
                response_data = response.json()
            except:
                continue
            else:
                foreign_posts += response_data["posts"]

        post_data = json.dumps(serializer.data)
        post_data = json.loads(post_data)
        post_data += foreign_posts

        if request.user.githubUrl:
            cached_github_posts = cache.get(request.user.githubUrl)
            if cached_github_posts:
                post_data += cached_github_posts
            else:
                # load github activity and merge with posts
                github_events = load_github_events(request.user.githubUrl, settings.GITHUB_TOKEN)
                github_posts = [] # github events in the format of a regular Post object
                for event in github_events:
                    event["author"] = UserSerializer(request.user).data
                    # use the hash of the content and time as the ID so it stays consistent between 
                    # api calls - required to make sure that react can render efficiently
                    event["id"] = uuid.uuid3(uuid.NAMESPACE_X500, event["content"]+event["published"])
                    github_posts.append(event)
                
                cache.set(request.user.githubUrl, github_posts, 300)
                post_data += github_posts
            
        post_data.sort(key=lambda x : x["published"] if isinstance(x, dict) else str(x.timestamp), reverse=True)
        page = self.paginate_queryset(post_data)

        return self.get_paginated_response(page)

    def visible_posts(self, request, author_id):
        '''
        http://service/author/{AUTHOR_ID}/posts all posts made by {AUTHOR_ID} visible to the currently authenticated user
        '''
        user = request.user
        author_id = protocol_removed(author_id)
        
        if User.objects.filter(fullId=author_id).exists():
            posts = Post.objects.filter(author__fullId=author_id)
            viewable_posts = Post.objects.none()

            for post in posts:
                visible_users = post.get_visible_users()
                if user in visible_users:
                    viewable_posts |= Post.objects.filter(postId=post.postId)

            page = self.paginate_queryset(
                viewable_posts.order_by('-timestamp'))
            serializer = self.get_serializer(page, many=True)

            return self.get_paginated_response(serializer.data)
        else:
            return Response(data={"success": False, "msg": "No such user"}, status=status.HTTP_400_BAD_REQUEST)
