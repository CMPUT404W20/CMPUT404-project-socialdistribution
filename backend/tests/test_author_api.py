from django.contrib.auth import get_user_model
from backend.models import User, Friend, Host

import pytest

@pytest.mark.django_db
class TestAuthorAPI:

    def test_get_profile_by_author_id(self, client,test_user):
        test_author_id = test_user.id

        response = client.get('/author/{}/'.format(test_author_id))
        assert response.status_code == 200
        assert response.data["query"] == "author"
        assert response.data["count"] == 1
        assert response.data["size"] == 1

        assert response.data["Profile"] is not None
        assert len(response.data["Profile"]) == 1

        assert response.data["Profile"][0]["id"] == test_user.get_full_user_id()

        assert response.data["Profile"][0]["displayName"] == test_user.username
        assert response.data["Profile"][0]["github"] == test_user.githubUrl
    
    def test_get_friends(self,client,test_user,friend_user):
        test_friend = Friend.objects.create(fromUser = test_user, toUser = friend_user[0])
        test_friend2 = Friend.objects.create(fromUser = test_user, toUser = friend_user[1])
        test_auth_id = test_user.id

        response = client.get('/author/{}/friends'.format(test_auth_id))
        
        assert response.status_code == 200
        assert response.data["query"] == "friends"
        assert response.data["Author"] is not None
        assert response.data["Author"][0] == friend_user[0].get_full_user_id()
        assert response.data["Author"][1] == friend_user[1].get_full_user_id()
    