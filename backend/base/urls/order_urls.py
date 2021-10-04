from django.urls import path

from base.views import orders

urlpatterns = [
    path('add/', orders.add_order_items, name='orders-add'),
    path('<str:pk>/', orders.get_order_by_id, name='get-order'),
    path('<str:pk>/pay/', orders.update_order_to_paid, name='pay-order'),
]
