# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
from django.contrib.postgres.fields import ArrayField

from backend.utils import *

import uuid


class Host(models.Model):
    url = models.URLField(max_length=400)
    serviceAccountUsername = models.CharField(
        max_length=100, null=True, blank=True)
    serviceAccountPassword = models.CharField(
        max_length=100, null=True, blank=True)


class User(AbstractUser):
    githubUrl = models.URLField(max_length=400, blank=True)
    host = models.ForeignKey(
        Host, null=True, blank=True, on_delete=models.CASCADE)
    fullId = models.CharField(max_length=400, default='')

    def get_full_user_id(self):
        user_host = self.host.url
        if user_host[-1] == "/":
            user_host = user_host[:-1]

        return "{}/author/{}".format(user_host, self.id)

    def get_friends(self):
        friend_ids = Friend.objects.filter(
            fromUser__fullId=self.fullId).values_list('toUser__fullId', flat=True)
        friend_list = User.objects.filter(fullId__in=friend_ids)

        return friend_list

    def get_foaf(self):
        foaf = User.objects.none()
        friends = self.get_friends()

        for friend in friends:
            foaf |= friend.get_friends().exclude(fullId=self.fullId)

        return foaf.distinct()

    def save(self, *args, **kwargs):
        # save twice to get auto-increment id
        super().save(*args, **kwargs)

        if not self.host:
            current_host = settings.APP_HOST
            if Host.objects.filter(url=current_host).exists():
                host_obj = Host.objects.get(url=current_host)
            else:
                host_obj = Host.objects.create(url=current_host)
                host_obj.save()
            self.host = host_obj

        fullId = self.get_full_user_id()
        fullId = protocol_removed(fullId)
        self.fullId = fullId
        super().save(*args, **kwargs)


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
    visibleTo = ArrayField(models.CharField(
        max_length=200), blank=True, default=list)

    def is_unlisted(self):
        if self.visibility == "UNLISTED":
            return True
        else:
            return False

    def get_visible_users(self):
        if self.visibility == "PUBLIC":
            users = User.objects.all()
        elif self.visibility == "FRIENDS":
            users = self.author.get_friends()
        elif self.visibility == "FOAF":
            users = self.author.get_friends()
            users |= self.author.get_fof()
        elif self.visibility == "PRIVATE":
            visible_to = map(protocol_removed, self.visibleTo)
            users = User.objects.filter(fullId__in=visible_to)

        elif self.visibility == "UNLISTED":
            users = User.objects.none()
        # TODO add serveronly

        return users.distinct()


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
