from django.contrib.auth import get_user_model
from backend.models import User, Friend, Host, FriendRequest
from backend.utils import *
import json
import pytest
import urllib


@pytest.mark.django_db
class TestFriend:
    user_notFound_id = "https://example/20"

    def test_create_friend_request(self, client, test_user, friend_user, test_host):

        # checking scenario of a normal friend request

        post_body_1 = json.dumps({
            "query": "friendrequest",
            "author": {
                "id": test_user.fullId,
            },
            "friend": {
                "id": friend_user[0].fullId,
            }
        })

        response = client.post('/friendrequest', data=post_body_1,
                               content_type='application/json', charset='UTF-8')
        assert response.status_code == 201

        assert FriendRequest.objects.filter(
            fromUser__fullId=test_user.fullId, toUser__fullId=friend_user[0].fullId).exists()
        assert response.data["query"] == "createFriendRequest"
        assert response.data["success"] == True
        assert response.data["message"] == "FriendRequest created"

        # checking scenario where data is invalid

        response = client.post('/friendrequest', data={},
                               content_type='application/json', charset='UTF-8')
        assert response.status_code == 400

        # checking accepting friend request

        post_body_2 = json.dumps({
            "query": "friend",
            "toUser": {
                "id": test_user.fullId,
                "host": test_user.host.url,
                "displayName": test_user.username,
                "url": test_user.fullId
            }
        })

        response = client.post('/friend/accept/', data={},
                               content_type='application/json', charset='UTF-8')
        assert response.status_code == 401
        client.force_login(friend_user[0])
        response = client.post('/friend/accept/', data=post_body_2,
                               content_type='application/json', charset='UTF-8')
        assert response.status_code == 201
        assert response.data["message"] == "Friendship created"
        assert Friend.objects.filter(
            fromUser__fullId=test_user.fullId, toUser__fullId=friend_user[0].fullId).exists()
        assert Friend.objects.filter(
            fromUser__fullId=friend_user[0].fullId, toUser__fullId=test_user.fullId).exists()

        # checking if freind request is accepted with invalid data

        response = client.post('/friend/accept/', data={},
                               content_type='application/json', charset='UTF-8')
        assert response.status_code == 400

    
    def test_check_friends(self, client, test_user, friend_user):

        # check one way friends
        Friend.objects.create(
            fromUser=test_user, toUser=friend_user[0])
        test_auth_id = test_user.get_full_user_id()

        # Checking scenario where they are friends

        response = client.get(
            '/author/{}/friends/{}'.format(test_auth_id, friend_user[0].get_full_user_id()))

        assert response.status_code == 200
        assert response.data["query"] == "friends"
        assert response.data["authors"] is not None

        assert response.data["authors"] == [
            test_user.get_full_user_id(), friend_user[0].get_full_user_id()]
        assert response.data['friends'] == False

        Friend.objects.create(
            toUser=test_user, fromUser=friend_user[0])

        response = client.get(
            '/author/{}/friends/{}'.format(test_auth_id, friend_user[0].get_full_user_id()))

        # check two way friendship
        assert response.status_code == 200
        assert response.data["query"] == "friends"
        assert response.data["authors"] is not None

        assert response.data["authors"] == [
            test_user.get_full_user_id(), friend_user[0].get_full_user_id()]
        assert response.data['friends'] == True

        # Checking scenario where they are not friends
        notFriendsResponse = client.get(
            '/author/{}/friends/{}'.format(test_auth_id, friend_user[1].get_full_user_id()))

        assert notFriendsResponse.status_code == 200
        assert notFriendsResponse.data["query"] == "friends"
        assert notFriendsResponse.data["authors"] is not None

        assert notFriendsResponse.data["authors"] == [
            test_user.get_full_user_id(), friend_user[1].get_full_user_id()]
        assert notFriendsResponse.data['friends'] == False

        # Checking scenario where the user(s) does not exist, 404 Error

        nouserResponse = client.get(
            '/author/{}/friends/{}'.format(test_auth_id, self.user_notFound_id))
        assert nouserResponse.status_code == 404

    def test_reject_friend_request(self, client, test_user, friend_user, test_host):
        # checking scenario where a friend request is rejected

        post_body = json.dumps({
            "query": "friendrequest",
            "author": {
                "id": test_user.fullId,
            },
            "friend": {
                "id": friend_user[0].fullId,
            }
        })

        client.force_login(test_user)

        # test failure since friendreuqest does not exist

        response = client.post(
            '/friendrequest/reject/', data=post_body, content_type='application/json', charset='UTF-8')
        assert response.status_code == 403
        assert response.data["success"] == False
        assert response.data["msg"] == "Forbidden"

        # create friend request and check if reject works

        response = client.post('/friendrequest', data=post_body,
                               content_type='application/json', charset='UTF-8')
        assert response.status_code == 201
        assert FriendRequest.objects.filter(
            fromUser__fullId=test_user.fullId, toUser__fullId=friend_user[0].fullId).exists()
        response = client.post(
            '/friendrequest/reject/', data=post_body, content_type='application/json', charset='UTF-8')
        assert response.status_code == 204
        assert not FriendRequest.objects.filter(
            fromUser__fullId=test_user.fullId, toUser__fullId=friend_user[0].fullId).exists()

    def test_query_friends(self, client, test_user, friend_user, test_host):

        Friend.objects.create(
            fromUser=test_user, toUser=friend_user[0])
        test_auth_id = test_user.get_full_user_id()
        client.force_login(test_user)

        # Checking scenario where they are friends

        post_body = json.dumps({
            "query": "friends",
            "author": test_auth_id,
            "authors": [
                "http://127.0.0.1:5454/author/de305d54-75b4-431b-adb2-eb6b9e546013",
                friend_user[0].get_full_user_id(),
                test_auth_id,
                "http://127.0.0.1:5454/author/asdfasdf-75b4-431b-adb2-eb6b9e546013",
                "hi",
            ]
        })
        url = '/author/{}/friends/'.format(test_auth_id)
        print(url)
        response = client.post(url, data=post_body,
                               content_type='application/json', charset='UTF-8')

        assert response.status_code == 200

        # check to see if users are present

        for author in response.data["authors"]:
            assert Friend.objects.filter(
                fromUser__fullId=test_user.fullId, toUser__fullId=protocol_removed(author)).exists()

        # check for invalid data
        response = client.post(url, data={},
                               content_type='application/json', charset='UTF-8')
        assert response.status_code == 400

    def test_unfriend(self, client, test_user, friend_user, test_host):

        Friend.objects.create(
            fromUser=test_user, toUser=friend_user[0])
        Friend.objects.create(
            fromUser=friend_user[0], toUser=test_user)
        client.force_login(test_user)

        assert Friend.objects.filter(
            fromUser__fullId=test_user.fullId, toUser__fullId=friend_user[0].fullId).exists()
        assert Friend.objects.filter(
            toUser__fullId=test_user.fullId, fromUser__fullId=friend_user[0].fullId).exists()

        post_body = json.dumps({
            "query": "unfriend",
            "friend": {
                "id": friend_user[0].get_full_user_id()
            }
        })

        response = client.post("/friend/unfriend/", data=post_body,
                               content_type="application/json", charset="UTF-8")
        assert response.status_code == 204
        assert response.data['query'] == "unfriend"
        assert response.data["message"] == "Successful unfriend"
        # check if they are deleted in table

        assert not Friend.objects.filter(
            fromUser__fullId=test_user.fullId, toUser__fullId=friend_user[0].fullId).exists()
        assert not Friend.objects.filter(
            toUser__fullId=test_user.fullId, fromUser__fullId=friend_user[0].fullId).exists()
