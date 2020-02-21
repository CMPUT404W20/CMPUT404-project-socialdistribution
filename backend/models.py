# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.sites.models import Site

import uuid


class Host(models.Model):
    url = models.URLField(max_length=400)
    serviceAccountUsername = models.CharField(max_length=100, null=True, blank=True)
    serviceAccountPassword = models.CharField(max_length=100, null=True, blank=True)


class User(AbstractUser):
    githubUrl = models.URLField(max_length=400, blank=True)
    host = models.ForeignKey(
        Host, null=True, blank=True, on_delete=models.CASCADE)
        

class Post(models.Model):
    VISIBILITY_CHOICES = (
        ("PUBLIC", "PUBLIC"),
        ("FOAF", "FOAF"),
        ("FRIENDS", "FRIENDS"),
        ("PRIVATE", "PRIVATE"),
        ("SERVERONLY", "SERVERONLY"),
        ("UNLISTED", "UNLISTED"),
    )

    postId = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=50)
    timestamp = models.DateTimeField(auto_now_add=True)
    content = models.TextField()
    # Visibility can be one of the followings : "PUBLIC","PRIVATE","Private","FRIENDS","FOF" or specific user ID
    visibility = models.CharField(
        max_length=10, choices=VISIBILITY_CHOICES, default="PUBLIC")


class Comments(models.Model):
    commentId = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    content = models.TextField()
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    postedBy = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="comment_postedBy")
    postedTo = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="comment_postedTo")


class FriendRequest(models.Model):
    fromUser = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="friendRequest_fromUser")
    toUser = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="friendRequest_toUser")
    isAccepted = models.BooleanField(default=False)
    sentDate = models.DateTimeField(auto_now_add=True)


class Friend(models.Model):
    fromUser = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="friend_fromUser")
    toUser = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="friend_toUser")
    friendDate = models.DateTimeField(auto_now_add=True)
    unfriendDate = models.DateTimeField(null=True, blank=True)
