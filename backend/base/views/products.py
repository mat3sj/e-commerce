from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
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


@api_view(['POST'])
@permission_classes([IsAdminUser])
def create_product(request):
    product = Product.objects.create(
        user=request.user,
        name='sample_name',
        price=0,
        brand='sample_brand',
        count_in_stock=0,
        category='sample',
        descriptin=''
    )

    serializer = serializers.ProductSerializer(product, many=False)

    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def update_product(request, product_id):
    data = request.data
    product = Product.objects.get(id=product_id)

    product.name = data['name']
    product.price = data['price']
    product.brand = data['brand']
    product.count_in_stock = data['count_in_stock']
    product.category = data['category']
    product.description = data['description']

    product.save()

    serializer = serializers.ProductSerializer(product, many=False)

    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_product(request, product_id):
    product = Product.objects.get(id=product_id)
    product.delete()
    return Response('Product deleted')


@api_view(['POST'])
# @permission_classes([IsAdminUser])
def upload_image(request):
    data = request.data

    product_id = data['product_id']
    product = Product.objects.get(id=product_id)

    product.image = request.FILES.get('image')
    product.save()
    return Response('Image was uploaded')


