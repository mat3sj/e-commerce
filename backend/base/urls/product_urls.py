from django.urls import path

from base.views import products

urlpatterns = [
    path('', products.get_all_products, name='products'),
    path('create/', products.create_product, name='product-create'),
    path('upload/', products.upload_image, name='image-upload'),

    path('<str:product_id>', products.get_product, name='product-detail'),
    path('update/<str:product_id>/', products.update_product, name='product-update'),
    path('delete/<str:product_id>/', products.delete_product, name='product-delete'),

]
