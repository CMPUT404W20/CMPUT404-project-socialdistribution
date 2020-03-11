from django.conf import settings

from backend.models import Post, Comments, User
from backend.permissions import *

import pytest
import json


@pytest.mark.django_db
class TestCommentAPI:

    def test_get_comment(self, client, test_user, test_host):
        comment_user = User.objects.create_user(
            username="commenter", password="ualberta01!", host=test_host)
        no_access_user = User.objects.create_user(
            username="noaccess", password="ualberta01!", host=test_host)

        test_post = Post.objects.create(
            author=test_user, title="post title", content="post content", visibility=PRIVATE, visibleTo=[comment_user.get_full_user_id()])
        test_comment = Comments(
            content="test content", postedBy=comment_user, post=test_post)
        test_comment.save()

        response = client.get("/posts/{}/comments".format(test_post.pk))
        assert response.status_code == 401

        client.force_login(no_access_user)
        response = client.get("/posts/{}/comments".format(test_post.pk))
        assert response.status_code == 401
        client.logout()

        client.force_login(comment_user)
        response = client.get("/posts/{}/comments".format(test_post.pk))
        assert response.status_code == 200
        assert response.data["query"] == "comments"
        assert response.data["count"] is not None
        assert response.data["comments"] is not None
        assert len(response.data["comments"]) > 0

        comment = response.data["comments"][0]
        assert comment["author"]["id"] == comment_user.get_full_user_id()
        assert comment["comment"] == test_comment.content
        client.logout()

    def test_create_comment(self, client, test_user, test_host):
        comment_user = User.objects.create_user(
            username="commenter", password="ualberta01!", host=test_host)
        no_access_user = User.objects.create_user(
            username="noaccess", password="ualberta01!", host=test_host)

        test_post = Post.objects.create(
            author=test_user, title="post title", content="post content", visibility=PRIVATE, visibleTo=[comment_user.get_full_user_id()])
        
        pass
        # client.post("/posts/{}/comments".format(test_post.pk))
