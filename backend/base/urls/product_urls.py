from django.urls import path

from base.views import products

urlpatterns = [
    path('', products.get_all_products, name='products'),
    path('<str:product_id>', products.get_product, name='product-detail'),
    path('delete/<str:product_id>/', products.delete_product, name='product-delete'),

]
