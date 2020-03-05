from django.contrib.auth import get_user_model
from backend.models import User, Friend, Host

import pytest

@pytest.mark.django_db
class TestAuthorAPI:

    @pytest.fixture
    def test_user(self, db):
        host = Host.objects.create(
            url = "http://www.example.com/index.html"
        )
        test_user = User.objects.create_user(
            username="user01", email="user01@gmail.com", password="cmput404!", githubUrl="https://github.com/user01", host_id = host.id)
        
        test_user2 = User.objects.create_user(
            username="user02", email= "user02@gmail.com", password="cmput404!", githubUrl="https://github.com/user02",  host_id = host.id)
        
        test_user3 = User.objects.create_user(
            username="user03", email="user03@gmail.com", password="NewUser", githubUrl="https://github.com/user03", host_id = host.id)
        return (test_user, test_user2, test_user3)

    def test_get_profile_by_author_id(self, client,test_user):
        test_author_id = test_user[0].id
        # test_firstName = test_username

        response = client.get('/author/{}/'.format(test_author_id))
        assert response.status_code == 200
        assert response.data["query"] == "author"
        assert response.data["count"] == 1
        assert response.data["size"] == 1

        assert response.data["Profile"] is not None
        assert len(response.data["Profile"]) == 1

        #The id displayed is currently the full host id:'https://cmput404-socialdistribution.herokuapp.com/author/1'
        assert response.data["Profile"][0]["id"] == test_user[0].get_full_user_id()

        assert response.data["Profile"][0]["displayName"] == test_user[0].username
        assert response.data["Profile"][0]["github"] == test_user[0].githubUrl
    
    def test_get_friends(self,client,test_user):
        test_friend = Friend.objects.create(fromUser = test_user[0], toUser = test_user[1])
        test_friend2 = Friend.objects.create(fromUser = test_user[0], toUser = test_user[2])
        # print(test_friend.toUser)
        test_auth_id = test_user[0].id

        response = client.get('/author/{}/friends'.format(test_auth_id))

        assert response.status_code == 200
        assert response.data["query"] == "friends"
        assert response.data["Author"] is not None

        # print(response.data)
        assert list(list(response.data["Author"][0].items())[0][1].items()) is not None
        assert list(list(response.data["Author"][1].items())[0][1].items())is not None
        assert list(list(response.data["Author"][0].items())[0][1].items())[0][1] == test_user[1].get_full_user_id()
        assert list(list(response.data["Author"][1].items())[0][1].items()) [0][1] == test_user[2].get_full_user_id()
    