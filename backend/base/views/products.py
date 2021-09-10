from rest_framework.decorators import api_view
from rest_framework.response import Response

from base import serializers as serializers
from base.models import Product


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