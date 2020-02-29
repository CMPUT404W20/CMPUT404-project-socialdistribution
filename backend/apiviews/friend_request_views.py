from django.contrib.auth.models import User

from rest_framework import viewsets
from rest_framework import mixins
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from rest_framework.decorators import permission_classes

from backend.serializers import UserSerializer, FriendSerializer, FriendRequestSerializer
from backend.models import User, Friend, FriendRequest
from backend.permissions import *
from rest_framework.decorators import action
from django.http import Http404
from django.db.models import Q


class FriendRequestViewSet(viewsets.ModelViewSet):
    queryset = FriendRequest.objects.all()
    serializer_class = FriendRequestSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def list(self, request):
        print(request)
        # user = request.fromUser
        # queryset = FriendRequest.objects.filter(user=user).all()
        # TODO add pagination
        # page = self.paginate_queryset(queryset)
        # if page is not None:
        #     serializer = self.get_serializer(page, many=True)
        #     return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def create_friend_request(self, request, pk=None):
        friend_request = get_object_or_404(self.queryset, pk=pk)
        return Response(status=rest_framework.status.HTTP_200_OK)
