from django.contrib.auth import get_user_model
from backend.models import User

import pytest

User = get_user_model()
test_username = "user01"
test_first_name ="user"
test_last_name = "testing"
test_email = "user01@gmail.com"
test_password = "cmput404!"
test_github_url = "https://github.com/user01"

@pytest.mark.django_db
class TestAuthorAPI:

    @pytest.fixture
    def test_user(self, db):
        test_user = User.objects.create_user(
            username=test_username, email=test_email, password=test_password, githubUrl=test_github_url, 
            first_name= test_first_name, last_name= test_last_name)
        return test_user

    def test_get_profile_by_author_id(self, client,test_user):
        test_author_id = test_user.id
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
        assert response.data["Profile"][0]["id"] == test_user.get_full_user_id()

        assert response.data["Profile"][0]["displayName"] == test_username
        assert response.data["Profile"][0]["github"] == test_github_url

