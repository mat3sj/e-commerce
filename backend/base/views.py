from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Product
import base.serializers as serializers

# Create your views here.

@api_view(['GET'])
def get_routes(request):
    routes = [
        '/api/products/',
        '/api/products/create/',
        '/api/products/upload/',
        '/api/products/top/',
        '/api/products/<id>',
        '/api/products/<id>/reviews',

    ]
    return Response(routes)


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
