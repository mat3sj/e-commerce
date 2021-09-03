from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

__all__ = ['UserSerializer', 'UserSerializerWithToken']


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    is_admin = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'name',
            'is_admin',
        ]

    def get_is_admin(self, obj):
        return obj.is_staff

    # todo remove when not needed
    def get_name(self, obj):
        name = obj.first_name
        if name == '':
            name = obj.email
        return name


class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'name',
            'is_admin',
            'token',

        ]

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token)
