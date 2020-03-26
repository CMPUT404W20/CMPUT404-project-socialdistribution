import pytest
from django.contrib.auth import get_user_model
from backend.models import *
import dj_database_url

User = get_user_model()
test_user_1_username = "testuser001"
test_user_1_email = "testemail001@gmail.com"
test_user_1_password = "ualberta!"
test_user_1_github_url = "https://github.com/testuser001"

test_user_2_username = "testuser002"
test_user_2_email = "testemail002@gmail.com"
test_user_2_password = "ualberta!"
test_user_2_github_url = "https://github.com/testuser002"


@pytest.fixture
def test_host(db):
    test_host = Host.objects.create(url=settings.APP_HOST)
    return test_host


@pytest.fixture
def test_user(db, test_host):
    test_user = User.objects.create_user(
        username=test_user_1_username, email=test_user_1_email, password=test_user_1_password, githubUrl=test_user_1_github_url, host=test_host)
    return test_user

@pytest.fixture
def test_user_2(db, test_host):
    test_user = User.objects.create_user(
        username=test_user_2_username, email=test_user_2_email, password=test_user_2_password, githubUrl=test_user_2_github_url, host=test_host)
    return test_user


@pytest.fixture
def friend_user(db, test_host):
    friend_user2 = User.objects.create_user(
        username="user02", email="user02@gmail.com", password="cmput404!", githubUrl="https://github.com/user02",  host=test_host)
    friend_user3 = User.objects.create_user(
        username="user03", email="user03@gmail.com", password="cmput404!", githubUrl="https://github.com/user03",  host=test_host)
    return friend_user2, friend_user3
