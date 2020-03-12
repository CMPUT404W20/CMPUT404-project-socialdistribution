from django.contrib.auth import get_user_model
from backend.models import User, Friend, Host, FriendRequest

import json
import pytest

User = get_user_model()
test_user_username = "testuser001"
test_user_email = "testemail001@gmail.com"
test_user_password = "ualberta!"
test_user_github_url = "https://github.com/testuser001"

test_user_username2 = "testuser002"
test_user_email2 = "testemail002@gmail.com"
test_user_password2 = "ualberta!!!"
test_user_github_url2 = "https://github.com/testuser002"


@pytest.mark.django_db
class TestFriend:
    user_notFound_id = "https://example/20"
    
    def test_create_friend_request(self, client, test_host):
        test_user2 = User.objects.create_user(
            username=test_user_username2, email=test_user_email2, password=test_user_password2, githubUrl=test_user_github_url2, host=test_host)

        test_user = User.objects.create_user(
            username="test_user_username", email=test_user_email, password=test_user_password, githubUrl=test_user_github_url, host=test_host)
        post_body_1 = json.dumps({
            "query": "friendrequest",
            "author": {
                "id": test_user.fullId,
                "host": test_user.host.url,
                "displayName": test_user.username,
                "url": test_user.fullId
            },
            "friend": {
                "id": test_user2.fullId,
                "host": test_user2.host.url,
                "displayName": test_user2.username,
                "url": test_user2.fullId
            }
        })
        response = client.post('/friendrequest/', data=post_body_1,
                               content_type='application/json', charset='UTF-8')
        assert response.status_code == 201
        # TODO also check if request in the model (filter to check if the data exists)
        assert FriendRequest.objects.filter(
            fromUser__fullId=test_user.fullId, toUser__fullId=test_user2.fullId).exists()

        # TODO check response body after
        assert response.data["query"] == "createFriendRequest"
        assert response.data["success"] == True
        assert response.data["message"] == "FriendRequest created"
        response = client.post('/friendrequest/', data={},
                               content_type='application/json', charset='UTF-8')
        assert response.status_code == 400

        post_body_2 = json.dumps({
            "query": "friend",
            "toUser": {
                "id": test_user.fullId,
                "host": test_user.host.url,
                "displayName": test_user.username,
                "url": test_user.fullId
            }
        })

        response = client.post('/friend/accept/', data=post_body_2,
                               content_type='application/json', charset='UTF-8')
        assert response.status_code == 401
        client.force_login(test_user2)
        response = client.post('/friend/accept/', data=post_body_2,
                               content_type='application/json', charset='UTF-8')
        assert response.status_code == 201
        assert response.data["message"] == "Friendship created"
        assert Friend.objects.filter(
            fromUser__fullId=test_user.fullId, toUser__fullId=test_user2.fullId).exists()
        assert Friend.objects.filter(
            fromUser__fullId=test_user2.fullId, toUser__fullId=test_user.fullId).exists()
        response = client.post('/friend/accept/', data={},
                               content_type='application/json', charset='UTF-8')
        assert response.status_code == 400

    def test_check_friends(self, client, test_user, friend_user):
    
        Friend.objects.create(
            fromUser=test_user, toUser=friend_user[0])
        test_auth_id = test_user.get_full_user_id()

        # Checking scenario where they are friends
        
        response = client.get('/author/{}/friends/{}'.format(test_auth_id,friend_user[0].get_full_user_id()))

        assert response.status_code == 200
        assert response.data["query"] == "friends"
        assert response.data["authors"] is not None

        assert response.data["authors"] == [test_user.get_full_user_id(),friend_user[0].get_full_user_id()]
        assert response.data['friends'] == True

        # Checking scenario where they are not friends
        
        notFriendsResponse = client.get('/author/{}/friends/{}'.format(test_auth_id,friend_user[1].get_full_user_id()))

        assert notFriendsResponse.status_code == 200
        assert notFriendsResponse.data["query"] == "friends"
        assert notFriendsResponse.data["authors"] is not None
  
        assert notFriendsResponse.data["authors"] == [test_user.get_full_user_id(),friend_user[1].get_full_user_id()]
        assert notFriendsResponse.data['friends'] == False

        # Checking scenario where the user(s) does not exist, 404 Error
        
        nouserResponse = client.get('/author/{}/friends/{}'.format(test_auth_id,self.user_notFound_id))
        assert nouserResponse.status_code == 404
