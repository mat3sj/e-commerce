import datetime

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from base import serializers as serializers
from base.models import Product, Order, OrderItem, ShippingAddress
from base.serializers import OrderSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_order_items(request):
    user = request.user
    data = request.data
    order_items = data['orderItems']

    if order_items and not len(order_items):
        return Response({'detail': 'No order items'},
                        status=status.HTTP_400_BAD_REQUEST)

    # Create order
    order = Order.objects.create(
        user=user,
        payment_method=data['paymentMethod'],
        tax_price=data['taxPrice'],
        shipping_price=data['shippingPrice'],
        total_price=data['totalPrice']
    )

    # Create shipping address
    shipping_address = ShippingAddress.objects.create(
        order=order,
        address=data['shippingAddress']['address'],
        city=data['shippingAddress']['city'],
        postal_code=data['shippingAddress']['postalCode'],
        country=data['shippingAddress']['country'],

    )

    # Create order items and set order to order items relationship
    for item in order_items:
        product = Product.objects.get(id=item['product'])

        order_item = OrderItem.objects.create(
            product=product,
            order=order,
            name=product.name,
            qty=item['qty'],
            price=item['price'],
            image=product.image.url
        )
        # Update stock
        product.count_in_stock -= order_item.qty
        product.save()

    serializer = OrderSerializer(order, many=False)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_orders(request):
    user = request.user
    orders = user.order_set.all()
    serializer = serializers.OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_order_by_id(request, pk):
    user = request.user
    try:
        order = Order.objects.get(id=pk)
    except:
        return Response({'detail': 'Order has not been found'},
                        status=status.HTTP_400_BAD_REQUEST)

    if user.is_staff or order.user == user:
        serializer = serializers.OrderSerializer(order, many=False)
        return Response(serializer.data)
    else:
        Response({'detail': 'Not authorised to view this order'},
                 status=status.HTTP_403_FORBIDDEN)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_order_to_paid(request, pk):
    order = Order.objects.get(id=pk)

    order.is_paied = True
    order.paid_at = datetime.datetime.now()
    order.save()

    return Response('order was paid')


@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_all_orders(request):
    orders = Order.objects.all()
    serializer = serializers.OrderSerializer(orders, many=True)
    return Response(serializer.data)