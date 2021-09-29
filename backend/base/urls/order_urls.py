from django.urls import path

from base.views import orders

urlpatterns = [
    path('add/', orders.add_order_items, name='orders-add')
]
