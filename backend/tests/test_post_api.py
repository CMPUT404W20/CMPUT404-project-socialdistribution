from django.contrib.auth import get_user_model
from backend.models import Post

import pytest

User = get_user_model()
test_user_username = "testuser001"
test_user_email = "testemail001@gmail.com"
test_user_password = "ualberta!"
test_user_github_url = "https://github.com/testuser001"


@pytest.mark.django_db
class TestPostAPI:

    @pytest.fixture
    def test_user(self, db):
        test_user = User.objects.create_user(
            username=test_user_username, email=test_user_email, password=test_user_password, githubUrl=test_user_github_url)
        return test_user

    def test_get_post_by_id(self, client, test_user):
        test_post = Post.objects.create(author=test_user, title="post title", content="post content")
        test_post_id = test_post.postId

        response = client.get('/posts/{}/'.format(test_post_id))
        assert response.status_code == 200
        assert response.data["query"] == "posts"
        assert response.data["count"] == 1
        assert response.data["size"] == 1

        assert response.data["post"] is not None
        assert len(response.data["post"]) == 1
        assert response.data["post"][0]["title"] == "post title"
        assert response.data["post"][0]["content"] == "post content"

        assert response.data["post"][0]["author"] is not None
        assert response.data["post"][0]["author"]["displayName"] == test_user.username
        assert response.data["post"][0]["author"]["github"] == test_user.githubUrl

        



