from django.contrib.auth.models import User
from django.conf import settings

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import views, status
from rest_framework import permissions
from rest_framework.decorators import permission_classes

from backend.serializers import UserSerializer, FriendSerializer, FriendRequestSerializer
from backend.models import User, Friend, FriendRequest, Host
from backend.server import *

import json


class FriendRequestViewSet(viewsets.ViewSet):

    serializer_class = FriendRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def send_friend_request(self, request, *args, **kwargs):
        # /friendrequest/ : create a friendrequest between authenticated user and another user
        request_data = dict(request.data)
        requester = request_data["author"]
        receiver = request_data["friend"]

        if request_data.get("query") == "friendrequest":
            # Check if requester is a local author
            if requester["host"] != settings.APP_HOST:
                # if foreign user doesn't have an entry in our db, then create an entry for them
                if not User.objects.filter(fullId=requester["id"]).exists():

                    if Host.objects.filter(url=requester["host"]).exists():
                        host_obj = Host.objects.get(url=requester["host"])
                        requested_user = User.objects.create_user(username=requester["displayName"],
                                                                  fullId=requester["id"],
                                                                  host=host_obj)
                    else:
                        return Response({"query": "createFriend",
                                         "success": False,
                                         "message": "unauthorized host"},
                                        status=status.HTTP_403_FORBIDDEN)
            requested_user = User.objects.get(fullId=requester["id"])
            # check if friend request receiver is a local author
            if receiver["host"] != settings.APP_HOST:
                if not User.objects.filter(fullId=receiver["id"]).exists():
                    if Host.objects.filter(url=receiver["host"]).exists():
                        host_obj = Host.objects.get(url=receiver["host"])
                        response = post_to_host(
                            "/friendrequest", host_obj, request_data)

                        if response.status_code == 200:
                            receiver_obj = User.objects.create_user(username=receiver["displayName"],
                                                                    fullId=receiver["id"],
                                                                    host=host_obj)
                            FriendRequest.objects.create(
                                fromUser=requested_user, toUser=receiver_obj)
                            return Response({"query": "createFriendRequest", "success": True, "message": "FriendRequest created"}, status=status.HTTP_200_OK)
                        else:
                            return Response({"query": "createFriendRequest", "success": False, "message": "Unable to create Friend Request"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                host_obj = Host.objects.get(url=settings.APP_HOST)
                receiver_obj = User.objects.get(fullId=receiver["id"])
                FriendRequest.objects.create(
                    fromUser=requested_user, toUser=receiver_obj)
                
                return Response({"query": "createFriendRequest", "success": True, "message": "FriendRequest created"}, status=status.HTTP_200_OK)
        else:
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
