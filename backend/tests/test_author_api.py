from django.contrib.auth import get_user_model
from backend.models import User, Friend

import pytest

User = get_user_model()
test_username = "user01"
test_first_name ="user"
test_last_name = "testing"
test_email = "user01@gmail.com"
test_password = "cmput404!"
test_github_url = "https://github.com/user01"

test_username2 = "user02"
test_first_name2 ="user2"
test_last_name2 = "testing2"
test_email2 = "user02@gmail.com"
test_password2 = "cmput404!"
test_github_url2 = "https://github.com/user02"


@pytest.mark.django_db
class TestAuthorAPI:

    @pytest.fixture
    def test_user(self, db):
        test_user = User.objects.create_user(
            username=test_username, email=test_email, password=test_password, githubUrl=test_github_url, 
            first_name= test_first_name, last_name= test_last_name)
        
        test_user2 = User.objects.create_user(
            username=test_username2, email=test_email2, password=test_password2, githubUrl=test_github_url2, 
            first_name= test_first_name2, last_name= test_last_name2)
        
        test_user3 = User.objects.create_user(
            username="user03", email="user03@gmail.com", password="NewUser", githubUrl="https://github.com/user03", 
            first_name= "user3", last_name= "testing3")
        return (test_user, test_user2, test_user3)

    def test_get_profile_by_author_id(self, client,test_user):
        test_author_id = test_user[0].id
        test_firstName = test_username

        response = client.get('/author/{}/'.format(test_author_id))
        assert response.status_code == 200
        assert response.data["query"] == "author"
        assert response.data["count"] == 1
        assert response.data["size"] == 1

        assert response.data["Profile"] is not None
        assert len(response.data["Profile"]) == 1
    
        assert response.data["Profile"][0]["firstName"] == test_first_name
        assert response.data["Profile"][0]["lastName"] == test_last_name

        #The id displayed is currently the full host id:'https://cmput404-socialdistribution.herokuapp.com/author/1'
        assert response.data["Profile"][0]["id"] == test_user[0].get_full_user_id()

        assert response.data["Profile"][0]["displayName"] == test_username
        assert response.data["Profile"][0]["github"] == test_github_url
    
    def test_get_friends(self,client,test_user):
        test_friend = Friend.objects.create(fromUser = test_user[0], toUser = test_user[1])
        test_friend2 = Friend.objects.create(fromUser = test_user[0], toUser = test_user[2])
        # print(test_friend.toUser)
        test_auth_id = test_user[0].id

        response = client.get('/author/{}/friends'.format(test_auth_id))

        assert response.status_code == 200

        assert list(response.data[0].items()) is not None
        assert list(response.data[1].items()) is not None

        assert list(response.data[0].items())[3][1] == test_user[1].id
        assert list(response.data[1].items())[3][1] == test_user[2].id
    
    def test_get_authors(self,client,test_user):
        response = client.get('/author/')

        assert list(response.data[0].items())[3][1] == test_user[0].username
        assert list(response.data[1].items())[3][1] == test_user[1].username
        assert list(response.data[2].items())[3][1] == test_user[2].username

        

        

