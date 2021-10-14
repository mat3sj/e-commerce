from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from base import serializers as serializers
from base.serializers import UserSerializerWithToken


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        serializer = serializers.UserSerializerWithToken(self.user).data
        for k, v in serializer.items():
            data[k] = v

        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['POST'])
def register_user(request):
    data = request.data
    try:
        user = User.objects.create(
            first_name=data['name'],
            username=data['email'],
            email=data['email'],
            password=make_password(data['password']),
        )
    except:
        message = {'detail': 'User with this email already exists'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
    serializer = UserSerializerWithToken(user, many=False)
    return Response(serializer.data)


class UserProfileView(APIView):
    """

    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        serializer = serializers.UserSerializer(user, many=False)
        return Response(serializer.data)

    def put(self, request):
        user = request.user

        data = request.data
        user.first_name = data['name']
        user.username = data['email']
        user.email = data['email']

        if data['password'] != '':
            user.password = make_password(data['password'])

        user.save()
        serializer = serializers.UserSerializerWithToken(user, many=False)

        return Response(serializer.data)


class UserListView(APIView):
    """

    """
    permission_classes = [IsAdminUser]

    def get(self, request):
        users = User.objects.all()
        serializer = serializers.UserSerializer(users, many=True)
        return Response(serializer.data)


class UserDetailView(APIView):
    """

    """
    permission_classes = [IsAdminUser]

    def get(self, request, user_id):
        user = User.objects.get(id=user_id)

        serializer = serializers.UserSerializer(user, many=False)
        return Response(serializer.data)

    def put(self, request, user_id):
        user = User.objects.get(id=user_id)

        data = request.data

        user.first_name = data['name']
        user.username = data['email']
        user.is_staff = data['is_admin']

        user.save()

        serializer = serializers.UserSerializer(user, many=False)
        return Response(serializer.data)

    def delete(self, request, user_id):
        user = User.objects.get(id=user_id)
        user.delete()
        return Response('User was deleted')
