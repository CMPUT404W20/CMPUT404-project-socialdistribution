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
from backend.utils import *

import json


class FriendRequestViewSet(viewsets.ViewSet):

    permission_classes = [permissions.IsAuthenticated]

    def get_friend_request(self, request):
        user = request.user

        user_friendrequests = FriendRequest.objects.filter(toUser=user)
        serializer = FriendRequestSerializer(user_friendrequests, many=True)
        
        return Response(data=serializer.data)

    def reverse_friendrequest_exists(self, requester, receiver):
        '''
        check if the friend request from receiver to requester has already existed
        '''

        return FriendRequest.objects.filter(fromUser=receiver, toUser=requester).exists()

    def make_friend(self, requester, receiver):
        '''
        Make 2 users friends of each other and remove the friendrequests
        '''
        Friend.objects.create(fromUser=requester, toUser=receiver)
        Friend.objects.create(fromUser=receiver, toUser=requester)
        FriendRequest.objects.filter(
            fromUser=receiver, toUser=requester).delete()

    def send_friend_request(self, request, *args, **kwargs):
        # /friendrequest : create a friendrequest between authenticated user and another user
        request_data = dict(request.data)
        requester = request_data["author"]
        receiver = request_data["friend"]
        requester["id"] = protocol_removed(requester["id"])
        receiver["id"] = protocol_removed(receiver["id"])

        if request_data.get("query") == "friendrequest":
            # Check if requester is a local author
            if requester["host"] != settings.APP_HOST:
                # if foreign user doesn't have an entry in our db, then create an entry for them
                if not User.objects.filter(fullId=requester["id"]).exists():

                    if Host.objects.filter(url=requester["host"]).exists():
                        host_obj = Host.objects.get(url=requester["host"])
                        User.objects.create_user(username=requester["displayName"],
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
                        User.objects.create_user(username=receiver["displayName"],
                                                 fullId=receiver["id"],
                                                 host=host_obj)

                    else:
                        return Response({"query": "createFriendRequest", "success": False, "message": "Receiver host not allowed"}, status=status.HTTP_400_BAD_REQUEST)

            received_user = User.objects.get(fullId=receiver["id"])

            # if friend request has already exists
            if self.reverse_friendrequest_exists(requested_user, received_user):
                self.make_friend(requested_user, received_user)
                return Response({"query": "createFriendRequest", "success": True, "message": "FriendRequest created"}, status=status.HTTP_201_CREATED)
            else:
                if received_user.host.url != settings.APP_HOST:
                    response = post_to_host(
                        "friendrequest", received_user.host, request_data)

                    if response.status_code == 201:
                        if not FriendRequest.objects.filter(fromUser=requested_user, toUser=received_user).exists():
                            FriendRequest.objects.create(
                                fromUser=requested_user, toUser=received_user)
                        return Response({"query": "createFriendRequest", "success": True, "message": "FriendRequest created"}, status=status.HTTP_201_CREATED)
                    else:
                        return Response({"query": "createFriendRequest", "success": False, "message": "Unable to create Friend Request"}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    if not FriendRequest.objects.filter(fromUser=requested_user, toUser=received_user).exists():
                        FriendRequest.objects.create(
                            fromUser=requested_user, toUser=received_user)
                    return Response({"query": "createFriendRequest", "success": True, "message": "FriendRequest created"}, status=status.HTTP_201_CREATED)
        else:
            return Response({"query": "createFriend", "success": False, "message": "wrong request"}, status=status.HTTP_400_BAD_REQUEST)

    def delete_friend_request(self, request):
        #  delete a freindrequest if the author rejects request
        request_data = dict(request.data)
        user_id = protocol_removed(request_data["author"].get("id"))
        friend_id = protocol_removed(request_data["friend"].get("id"))
        
        does_exist = FriendRequest.objects.filter(
            toUser__fullId=user_id, fromUser__fullId=friend_id).exists()

        # check to see if exist then delete
        if does_exist:
            FriendRequest.objects.filter(
                toUser__fullId=user_id, fromUser__fullId=friend_id).delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        else:
            return Response(data={"success": False, "msg": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)
