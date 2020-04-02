from django.contrib import admin
from .models import *


class UserAdmin(admin.ModelAdmin):
    model = User
    list_display = ("username", "email")
    list_filter = ('is_superuser', 'is_active', "is_staff")


class PostAdmin(admin.ModelAdmin):
    list_display = ("author", "title", "timestamp", "visibility")
    list_filter = ('visibility',)


class CommentsAdmin(admin.ModelAdmin):
    list_display = ("postedBy", "published", "contentType")
    list_filter = ("contentType",)


class FriendAdmin(admin.ModelAdmin):
    list_display = ("fromUser", "toUser", "friendDate")


class FriendRequestAdmin(admin.ModelAdmin):
    list_display = ("fromUser", "toUser", "isAccepted")
    list_filter = ("isAccepted",)


class HostAdmin(admin.ModelAdmin):
    list_display = ("serviceAccountUsername", "url")
    list_filter = ("url",)


# Registering all Database Model
admin.site.register(User, UserAdmin)
admin.site.register(Post, PostAdmin)
admin.site.register(Comments, CommentsAdmin)
admin.site.register(FriendRequest, FriendRequestAdmin)
admin.site.register(Friend, FriendAdmin)
admin.site.register(Host, HostAdmin)
