# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.postgres.fields import ArrayField

import uuid


class User(AbstractUser):
    githubUrl = models.URLField(max_length=400)
    # Using: username, password, first_name, last_name, email inherited from Abstractuser


class Post(models.Model):
    postId = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=50)
    timestamp = models.DateTimeField(auto_now_add=True)
    content = models.TextField()
    # default posts are public
    isPublic = models.BooleanField(default=True)


class PostAccess(models.Model):
    accessChoices = [
        ("PUBLIC", 'Public'),
        ("PRIVATE", 'Private'),
        ("FRIENDS", 'Friends'),
        ("FOF", 'FoF'),
    ]
    # post = models.ForeignKey(Post, on_delete=models.CASCADE) # remove
    visibility = models.CharField(max_length=10, choices=accessChoices, default="PUBLIC")
    # contains users that are able to access the post
    visible_to = ArrayField(models.CharField(max_length=500), blank=True, default=list)


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
