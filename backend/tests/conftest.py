import pytest
from django.contrib.auth import get_user_model
from backend.models import *


User = get_user_model()
test_user_username = "testuser001"
test_user_email = "testemail001@gmail.com"
test_user_password = "ualberta!"
test_user_github_url = "https://github.com/testuser001"


@pytest.fixture
def test_host(db):
    test_host = Host.objects.create(url=settings.APP_HOST)
    return test_host


@pytest.fixture
def test_user(db, test_host):
    test_user = User.objects.create_user(
        username=test_user_username, email=test_user_email, password=test_user_password, githubUrl=test_user_github_url, host=test_host)
    return test_user

# Uncomment this if you need access to real db
# import os
# BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# @pytest.fixture(scope='session')
# def django_db_setup():
#     settings.DATABASES['default'] = {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
#     }
