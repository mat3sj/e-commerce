from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import Product
from django.contrib.auth.models import User
import base.serializers as serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.hashers import make_password
from rest_framework import status

# Create your views here.
from .serializers import UserSerializerWithToken


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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_detail(request):
    user = request.user

    serializer = serializers.UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_all_users(request):
    users = User.objects.all()
    serializer = serializers.UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_all_products(request):
    products = Product.objects.all()
    serializer = serializers.ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_product(request, product_id):
    product = Product.objects.get(id=product_id)
    serializer = serializers.ProductSerializer(product, many=False)

    return Response(serializer.data)

# class Routes(APIView):
#     """
#     Base view to see some routes
#     """
#
#     def get(self, request):
#         """
#         Return list of urls
#         :param request:
#         :return:
#         """
#         routes = [
#             '/api/products/',
#             '/api/products/create/',
#             '/api/products/upload/',
#             '/api/products/top/',
#             '/api/products/<id>',
#             '/api/products/<id>/reviews',
#
#         ]
#         return Response(routes)
#
#
# class ProductList(APIView):
#     """
#     List of products
#     """
#
#     def get(self, request):
#         """
#         Return a list of products
#         :param request:
#         :return:
#         """
#
#         return Response(products)
