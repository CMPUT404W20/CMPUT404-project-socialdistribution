from django.shortcuts import get_object_or_404
from django.conf import settings
from django.core.cache import caches
from django.http import HttpResponse
from django.db.models import Q

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

import json
import uuid
import base64

github_cache = caches['github']
post_cache = caches['post']


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
        user = request.user

        # Check if the post is image
        if instance.is_image():
            image = instance.content
            return HttpResponse(base64.b64decode(image), content_type=instance.content_type)

        # Check if user has permission to view the post
        if instance.visibility != PUBLIC:
            if not user in instance.get_visible_users():
                return Response({"success": False, "msg": "You don't have the permission to view this post"}, status=status.HTTP_401_UNAUTHORIZED)

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
                new_post = serializer.save()
                if new_post.is_image():
                    return Response({"query": "createPost", "success": True, "message": "Image uploaded", "uuid": new_post.postId}, status=status.HTTP_201_CREATED)

                return Response({"query": "createPost", "success": True, "message": "Post created"}, status=status.HTTP_201_CREATED)
            else:
                return Response({"query": "createPost", "success": False, "message": serializer.errors}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        else:
            return Response({"query": "createPost", "success": False, "message": "wrong request"},
                            status=status.HTTP_400_BAD_REQUEST)

    def update_post(self, request, *args, **kwargs):
        post = self.get_object()
        if post.author.fullId == request.user.fullId:
            kwargs['partial'] = True
            return self.update(request, *args, **kwargs)
        else:
            return Response({"query": "UpdatePost", "success": False, "message": "No access to post"},
                            status=status.HTTP_400_BAD_REQUEST)

    def get_user_visible_posts(self, request):
        user = request.user
        visible_posts = Post.objects.none()

        for post in self.get_queryset():
            if user == post.author or user in post.get_visible_users():
                visible_posts |= Post.objects.filter(postId=post.postId)
                visible_posts &= Post.objects.filter(
                    Q(content_type="text/plain") | Q(content_type="text/markdown"))

        serializer = self.get_serializer(visible_posts, many=True)
        # check if foreign users' posts is cached
        foreign_posts = post_cache.get(request.user.fullId)
        if foreign_posts is None:
            # get foreign users' posts
            user_friends = user.get_friends().exclude(host__url=settings.APP_HOST)
            foreign_posts = []

            for friend in user_friends:
                if not friend.fullId.startswith("https://"):
                    friend.fullId = "https://" + friend.fullId

                response = get_from_host(
                    "{}/posts".format(friend.fullId), friend.host)
                try:
                    response_data = response.json()
                    foreign_posts += response_data["posts"]
                except:
                    continue

            for host in Host.objects.exclude(url=settings.APP_HOST):
                response = get_from_host(
                    "{}author/posts".format(host.url), host)

                if response.status_code == 200:
                    response_data = response.json()
                    posts = response_data["posts"]

                    for post in posts:
                        if post["visibility"] == "PUBLIC" and post not in foreign_posts:
                            foreign_posts.append(post)
            post_cache.set(request.user.fullId, foreign_posts, 600)

        post_data = json.dumps(serializer.data)
        post_data = json.loads(post_data)
        post_data += foreign_posts

        if request.user.githubUrl:
            cached_github_posts = github_cache.get(request.user.githubUrl)
            if cached_github_posts:
                post_data += cached_github_posts
            else:
                # load github activity and merge with posts
                github_events = load_github_events(
                    request.user.githubUrl, settings.GITHUB_TOKEN)
                github_posts = []  # github events in the format of a regular Post object
                for event in github_events:
                    event["author"] = UserSerializer(request.user).data
                    # use the hash of the content and time as the ID so it stays consistent between
                    # api calls - required to make sure that react can render efficiently
                    event["id"] = uuid.uuid3(
                        uuid.NAMESPACE_X500, event["content"]+event["published"])
                    github_posts.append(event)

                github_cache.set(request.user.githubUrl, github_posts, 900)
                post_data += github_posts

        post_data.sort(key=lambda x: x["published"] if isinstance(
            x, dict) else str(x.timestamp), reverse=True)
        page = self.paginate_queryset(post_data)

        return self.get_paginated_response(page)

    def visible_posts(self, request, author_id):
        '''
        http://service/author/{AUTHOR_ID}/posts all posts made by {AUTHOR_ID} visible to the currently authenticated user
        '''
        user = request.user

        if User.objects.filter(fullId=protocol_removed(author_id)).exists():
            requested_user = User.objects.get(
                fullId=protocol_removed(author_id))

            if requested_user.host.url == settings.APP_HOST:
                posts = Post.objects.filter(
                    author__fullId=protocol_removed(author_id))
                viewable_posts = Post.objects.none()

                for post in posts:
                    visible_users = post.get_visible_users()
                    if user in visible_users:
                        viewable_posts |= Post.objects.filter(
                            postId=post.postId)
                        viewable_posts &= Post.objects.filter(
                            Q(content_type="text/plain") | Q(content_type="text/markdown"))

                page = self.paginate_queryset(
                    viewable_posts.order_by('-timestamp'))
                serializer = self.get_serializer(page, many=True)

                return self.get_paginated_response(serializer.data)

        author_host = get_host_from_id(author_id)
        visible_posts = []

        if Host.objects.filter(url=author_host).exists():
            host = Host.objects.get(url=author_host)
            response = get_from_host(
                "{}author/posts".format(author_host), host)

            if response.status_code == 200:
                response_data = response.json()
                posts = response_data["posts"]

                for post in posts:
                    if post["author"] and (post["author"]["id"] == author_id or post["author"]["id"] == protocol_removed(author_id)) and post["visibility"] == "PUBLIC":
                        visible_posts.append(post)

                page = self.paginate_queryset(visible_posts)
                return self.get_paginated_response(page)
            else:
                return Response(data={"success": False, "msg": "Can't connect to user's host at the moment"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(data={"success": False, "msg": "No such user or user's host not connected"}, status=status.HTTP_400_BAD_REQUEST)
