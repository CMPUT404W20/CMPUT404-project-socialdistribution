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
            username="commenter", password="ualberta01!", host=test_host, githubUrl="https://github.com/CMPUT404W20/")
        no_access_user = User.objects.create_user(
            username="noaccess", password="ualberta01!", host=test_host, githubUrl="https://github.com/CMPUT404W20/")

        test_post = Post.objects.create(
            author=test_user, title="post title", content="post content", visibility=PRIVATE, visibleTo=[comment_user.get_full_user_id()])
        
        test_comment_content = "test comment 123"
        post_body_1 = json.dumps({
            "query": "addComment",
            "post": test_host.url+"/post/"+str(test_post.postId),
            "comment": {
                "author":{
                    "id" : no_access_user.get_full_user_id(),
                    "host" : test_host.url,
                    "displayName": no_access_user.username,
                    "url": no_access_user.get_full_user_id(),
                    "github": no_access_user.githubUrl,
                },
                "comment": test_comment_content,
                "contentType": "text/markdown",
                "published":"2015-03-09T13:07:04+00:00",
                "id":"de305d54-75b4-431b-adb2-eb6b9e546013"
            }
        })

        post_body_2 = json.dumps({
            "query": "addComment",
            "post": test_host.url+"/post/"+str(test_post.postId),
            "comment": {
                "author":{
                    "id" : comment_user.get_full_user_id(),
                    "host" : test_host.url,
                    "displayName": comment_user.username,
                    "url": comment_user.get_full_user_id(),
                    "github": comment_user.githubUrl,
                },
                "comment": test_comment_content,
                "contentType": "text/markdown",
                "published":"2015-03-09T13:07:04+00:00",
                "id":"de305d54-75b4-431b-adb2-eb6b9e546013"
            }
        })

        response = client.post('/posts/{}/comments'.format(test_post.postId), data=post_body_1,
                               content_type='application/json', charset='UTF-8')
        assert response.status_code == 401

        client.force_login(no_access_user)
        response = client.post('/posts/{}/comments'.format(test_post.postId), data=post_body_1,
                               content_type='application/json', charset='UTF-8')
        print(response.data)
        assert response.status_code == 403
        assert response.data["success"] is not True
        assert response.data["message"] == "Comment not allowed"


        client.force_login(comment_user)
        response = client.post('/posts/{}/comments/'.format(test_post.postId), data=post_body_2,
                               content_type='application/json', charset='UTF-8')
        assert response.status_code == 201
        assert response.data["success"]
        assert response.data["message"] == "Comment Added"
        assert Comments.objects.filter(content=test_comment_content, post=test_post, postedBy=comment_user).exists()
