"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import include, path, re_path
from django.contrib import admin
from django.conf.urls import url

from rest_framework.routers import DefaultRouter
from backend.apiviews.post_views import PostViewSet
from backend.apiviews.author_views import AuthorViewSet
from backend.apiviews.friend_request_views import FriendRequestViewSet
from backend.apiviews.friend_views import FriendViewSet
from backend.apiviews.comment_views import CommentViewSet
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi


from .views import index
router = DefaultRouter()

schema_view = get_schema_view(
    openapi.Info(
        title="Snippets API",
        default_version='v1',
        description="Test description",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@snippets.local"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('', index, name='index'),
    path('admin/', admin.site.urls),
    path('auth/', include('rest_auth.urls')),
    path('auth/registration/', include('rest_auth.registration.urls')),
    path('api-auth/', include('rest_framework.urls')),
    path('accounts/', include('allauth.urls')),

    # url for Post Operations
    path('posts', PostViewSet.as_view({
        "get": "list"
    })),
    path('posts/<uuid:postId>', PostViewSet.as_view({
        "get": "retrieve",
        "delete": "destroy",
        "put": "update_post",
    })),
    re_path(r'author/posts/?$', PostViewSet.as_view({
        "get": "get_user_visible_posts",
        "post": "create_post"
    })),
    path('author/<path:author_id>/posts', PostViewSet.as_view({
        "get": "visible_posts"
    })),

    # url of Author Operations
    path('author', AuthorViewSet.as_view({
        "get": "get_local_authors"
    })),

    path('author/all/', AuthorViewSet.as_view({
        "get": "get_all_authors"
    })),

    # get current authenticated user information
    path('author/current/', AuthorViewSet.as_view({
        "get": "get_current_user"
    })),

    # query by username
    path("author/search/<str:userName>", AuthorViewSet.as_view(({
        "get": "get_author_by_username"
    }))),

    path('author/<path:pk>/friends/', AuthorViewSet.as_view(({
        "get": "get_friends"
    }))),

    path('author/update/', AuthorViewSet.as_view(({
         "put": "update_user"
    }))),

    path('author/<path:authorId>/friends', FriendViewSet.as_view(({
        "post": "post_query_friends"
    }))),

    path('author/<path:authorId1>/friends/<path:authorId2>', FriendViewSet.as_view(({
        "get": "check_friends"
    }))),


    path('author/<path:pk>', AuthorViewSet.as_view({
        "get": "get_profile"
    })),

    path('friend/accept/', FriendViewSet.as_view(({
        "post": "post_friendship"
    }))),

    path('friend/unfriend/', FriendViewSet.as_view(({
        "post": "unfriend"
    }))),

    path('following/<path:authorId>', FriendRequestViewSet.as_view(({
        "get": "check_following"
    }))),

    path('friendrequest', FriendRequestViewSet.as_view(({
        "get": "get_friend_request",
        "post": "send_friend_request"
    }))),
    path('friendrequest/reject/', FriendRequestViewSet.as_view(({
        "post": "delete_friend_request"
    }))),

    # url of Comment Operations
    path('posts/<uuid:postId>/comments/', CommentViewSet.as_view({
        "get": "get_post_comment",
        "post": "add_comment"
    })),


    # Swagger Documentation
    url(r'^swagger(?P<format>\.json|\.yaml)$',
        schema_view.without_ui(cache_timeout=0), name='schema-json'),
    url(r'^swagger/$', schema_view.with_ui('swagger',
                                           cache_timeout=0), name='schema-swagger-ui'),
    url(r'^redoc/$', schema_view.with_ui('redoc',
                                         cache_timeout=0), name='schema-redoc'),

    # Everything
    re_path(r'^(?:.*)/?$', index),
]
