from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, APIView
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from base import serializers as serializers
from base.models.product import Product
from base.models.review import Review
from base.permissions import IsAdminOrReadOnly


class ProductDetailView(APIView):
    """

    """
    permission_classes = [IsAdminOrReadOnly]

    def get(self, request, product_id):
        product = Product.objects.get(id=product_id)
        serializer = serializers.ProductSerializer(product, many=False)

        return Response(serializer.data)

    def put(self, request, product_id):
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

    def delete(self, request, product_id):
        product = Product.objects.get(id=product_id)
        product.delete()
        return Response('Product deleted')


class ProductListView(APIView):
    """

    """
    permission_classes = [IsAdminOrReadOnly]

    def get(self, request):
        products = Product.objects.all()
        serializer = serializers.ProductSerializer(products, many=True)
        return Response(data=serializer.data)

    def post(self, request):
        product = Product.objects.create(
            user=request.user,
            name='sample_name',
            price=0,
            brand='sample_brand',
            count_in_stock=0,
            category='sample',
            description=''
        )

        serializer = serializers.ProductSerializer(product, many=False)

        return Response(serializer.data)


class ProductImagesView(APIView):
    """

    """

    def post(self, request):
        data = request.data

        product_id = data['product_id']
        product = Product.objects.get(id=product_id)

        product.image = request.FILES.get('image')
        product.save()
        return Response('Image was uploaded')


class ProductReviewView(APIView):
    """

    """
    permission_classes = [IsAuthenticated]



    def post(self, request, product_id):
        user = request.user
        product = Product.objects.get(id=product_id)
        data = request.data

        if product.review_set.filter(user=user).exists():
            return Response({'details': 'Product already reviewed'},
                            status=status.HTTP_400_BAD_REQUEST)

        elif data['rating'] == 0:
            return Response({'details': 'Please select a rating'})

        else:
            review = Review.objects.create(
                user=user,
                product=product,
                name=user.first_name,
                rating=data['rating'],
                comment=data['comment'],
            )

            reviews = product.review_set.all()
            product.num_reviews = len(reviews)

            total = 0
            for i in reviews:
                total += i.rating

            product.rating = total / len(reviews)
            product.save()

            return Response({'detail': 'Review added'})
