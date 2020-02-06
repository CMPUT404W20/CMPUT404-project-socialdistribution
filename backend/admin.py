from django.contrib import admin
from .models import User,Post,PostAccess,Comments,FriendRequest,Friend

#Registering User model
admin.site.register(User)

#Registering Post model
admin.site.register(Post)

#Registering PostAccess model
admin.site.register(PostAccess)

#Registering Comments model
admin.site.register(Comments)

#Registering FriendRequest model
admin.site.register(FriendRequest)

#Registering Friend model
admin.site.register(Friend)