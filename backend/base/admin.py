from django.contrib import admin
# Register your models here.
from .models.order import Order
from .models.product import Product
from .models.order_item import OrderItem
from .models.review import Review
from .models.shipping_address import ShippingAddress

admin.site.register(Product)
admin.site.register(Review)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(ShippingAddress)