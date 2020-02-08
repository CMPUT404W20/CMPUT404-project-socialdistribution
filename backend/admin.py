from django.contrib import admin
from .models import User, Post, PostAccess, Comments, FriendRequest, Friend

# #Registering all Database Model
admin.site.register(User)
admin.site.register(Post)
admin.site.register(PostAccess)
admin.site.register(Comments)
admin.site.register(FriendRequest)
admin.site.register(Friend)
