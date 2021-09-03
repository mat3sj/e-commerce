from django.urls import path
from . import views
from .views import MyTokenObtainPairView

urlpatterns = [
    path('users/login/', MyTokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    path('users/register/', views.register_user, name='register'),
    path('products/', views.get_all_products, name='products'),
    path('products/<str:product_id>', views.get_product, name='product-detail'),

    path('users/profile', views.get_user_detail, name='user-detail'),
    path('users/', views.get_all_users, name='user-list'),
]
