from django.urls import path

from base.views import products

urlpatterns = [
    path('', products.ProductListView.as_view(), name='products'),
    path('images/', products.ProductImagesView.as_view(), name='product-images'),
    path('<str:product_id>/reviews/', products.ProductReviewView.as_view(), name='reviews'),
    path('<str:product_id>', products.ProductDetailView.as_view(), name='product-detail'),

]
