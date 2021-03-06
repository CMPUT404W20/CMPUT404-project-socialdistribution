from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.conf import settings
from backend.utils import *
from backend.models import User, Friend, Host

import pytest
import json


@pytest.mark.django_db
class TestAuthorAPI:
    user_notFound_id = "https://example/20"

    def test_get_profile_by_author_id(self, client, test_user, friend_user):

        # Checking scenario where the user does not exist, 404 Error

        nouserResponse = client.get('/author/{}'.format(self.user_notFound_id))
        assert nouserResponse.status_code == 404

        # Checking user's profile

        test_author_id = test_user.get_full_user_id()
        Friend.objects.create(
            fromUser=test_user, toUser=friend_user[0])
        Friend.objects.create(
            fromUser=test_user, toUser=friend_user[1])

        response = client.get('/author/{}'.format(test_author_id))
        assert response.status_code == 200

        assert response.data["id"] == test_user.get_full_user_id()

        assert response.data["displayName"] == test_user.username
        assert response.data["host"] is not None
        assert response.data["url"] == test_user.get_profile_url()
        assert response.data["friends"] is not None

        assert response.data["friends"][0]["id"] == friend_user[0].get_full_user_id(
        )
        assert response.data["friends"][1]["id"] == friend_user[1].get_full_user_id(
        )

    def test_get_friends(self, client, test_user, friend_user):

        test_auth_id = test_user.get_full_user_id()

        # Checking scenario where the user doesnt have friends

        noFriendsresponse = client.get(
            '/author/{}/friends/'.format(test_auth_id))
        assert noFriendsresponse.status_code == 200
        assert noFriendsresponse.data["query"] == "friends"
        assert noFriendsresponse.data["authors"] == []

        # checking scenario where the user has friends

        Friend.objects.create(
            fromUser=test_user, toUser=friend_user[0])
        Friend.objects.create(
            fromUser=test_user, toUser=friend_user[1])

        response = client.get('/author/{}/friends/'.format(test_auth_id))

        assert response.status_code == 200
        assert response.data["query"] == "friends"
        assert response.data["authors"] is not None
        assert response.data["authors"][0] == friend_user[0].get_full_user_id()
        assert response.data["authors"][1] == friend_user[1].get_full_user_id()

        # Checking scenario where the user does not exist, 404 Error

        nouserResponse = client.get(
            '/author/{}/friends/'.format(self.user_notFound_id))
        assert nouserResponse.status_code == 404

    def test_get_username(self, client, test_user, friend_user):
        client.force_login(test_user)
        test_auth_id = test_user.get_full_user_id()
        # test if author exists
        response = client.get("/author/search/testuser001")
        assert response.status_code == 200
        assert response.data["authors"] != []

        # test if author exists with common substring: stu
        test_user1_username = "testusernumero2"
        test_user1_email = "teste1@gmail.com"
        test_user1_password = "ualberta!!"
        post_body_1 = json.dumps({
            "username": test_user1_username,
            "email": test_user1_email,
            "password1": test_user1_password,
            "password2": test_user1_password
        })

        response = client.post('/auth/registration/', data=post_body_1,
                               content_type='application/json', charset='UTF-8')
        assert response.status_code == 201
        response = client.get("/author/search/stu")
        assert response.status_code == 200
        assert response.data["authors"] != []

    def test_update_password(self, client, test_user, friend_user):
        client.force_login(test_user)
        test_auth_id = test_user.get_full_user_id()
        response = client.get("/author/search/testuser001")
        assert response.status_code == 200
        assert response.data["authors"] != []

        # update password only
        assert not User.objects.filter(password="liluzi").exists()
        post_body_1 = json.dumps({
            "password": "liluzi",
        })
        response = client.put("/author/update/", data=post_body_1,
                              content_type='application/json', charset='UTF-8')
        assert response.status_code == 200
        author = get_object_or_404(User, username=test_user.username)
        assert author.check_password("liluzi")

    def test_update_githubURL(self, client, test_user, friend_user):
        # update github url only
        client.force_login(test_user)
        assert not test_user.githubUrl == "liluzi@gmail.com"
        post_body_1 = json.dumps({
            "github_URL": "liluzi@gmail.com",
        })
        response = client.put("/author/update/", data=post_body_1,
                              content_type='application/json', charset='UTF-8')
        assert response.status_code == 200
        author = get_object_or_404(User, username=test_user.username)
        assert author.githubUrl == "liluzi@gmail.com"

    def test_update_profile(self, client, test_user, friend_user):
        client.force_login(test_user)
        assert not test_user.githubUrl == "liluzi1@gmail.com"
        post_body_1 = json.dumps({
            "github_URL": "liluzi1@gmail.com",
            "password": "somepassword"
        })
        response = client.put("/author/update/", data=post_body_1,
                              content_type='application/json', charset='UTF-8')
        assert response.status_code == 200
        author = get_object_or_404(User, username=test_user.username)
        assert author.githubUrl == "liluzi1@gmail.com"
        assert author.check_password("somepassword")

    def test_update_profile_error(self, client, test_user, friend_user):
        post_body_1 = json.dumps({
            "somebody": "liluzi1@gmail.com",
            "something": "somepassword"
        })
        response = client.put("/author/update/", data=post_body_1,
                              content_type='application/json', charset='UTF-8')
        assert response.status_code == 401
        client.force_login(test_user)
        response = client.put("/author/update/", data=post_body_1,
                              content_type='application/json', charset='UTF-8')
        assert response.status_code == 406
