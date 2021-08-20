from django.urls import path
from . import views

urlpatterns =[
    path('', views.get_routes, name='routes'),
    path('products/', views.get_all_products, name='products'),
    path('products/<str:product_id>', views.get_product, name='product-detail'),
]