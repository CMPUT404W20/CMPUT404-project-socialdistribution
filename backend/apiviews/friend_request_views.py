from django.contrib.auth.models import User

from rest_framework import viewsets
from rest_framework import mixins
from rest_framework.response import Response
from rest_framework import views, status
from rest_framework import permissions
from rest_framework.decorators import permission_classes

from backend.serializers import UserSerializer, FriendSerializer, FriendRequestSerializer
from backend.models import User, Friend, FriendRequest
from backend.permissions import *
from rest_framework.decorators import action
from django.http import Http404
from django.db.models import Q
import json


class FriendRequestViewSet(viewsets.ViewSet):
    # Make a friend request to a user
    serializer_class = FriendRequestSerializer

    def send_friend_request(self, request, *args, **kwargs):
        # /friendrequest/ : create a friendrequest between authenticated user and another user

        request_data = dict(request.data)
        # check if query is friendrequest
        if request_data.get("query") == "friendrequest":
            serializer = FriendRequestSerializer(
                data=request_data, context={"author": request_data["author"], "friend": request_data["friend"]})

            if serializer.is_valid():
                serializer.save()
                return Response({"query": "createFriendRequest", "success": True, "message": "FriendRequest created"}, status=status.HTTP_201_CREATED)
            else:
                return Response({"query": "createFriendRequest", "success": False, "message": serializer.errors}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)

        return Response({"query": "createFriend", "success": False, "message": "wrong request"}, status=status.HTTP_400_BAD_REQUEST)

    def delete_friend_request(self, request):
        #  delete a freindrequest if the friend rejects request
        request_data = dict(request.data)
        user_id = request.user.fullId
        friend_id = request_data["friend"].get("id")
        does_exist = FriendRequest.objects.filter(
            toUser__fullId=friend_id, fromUser__fullId=user_id).exists()
        
        # check to see if exist then delete
        if does_exist:
            FriendRequest.objects.filter(
                toUser__fullId=friend_id, fromUser__fullId=user_id).delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        else:
            return Response(data={"success": False, "msg": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)
