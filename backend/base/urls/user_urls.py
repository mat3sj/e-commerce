from django.urls import path
from base.views import users

urlpatterns = [
    path('login/', users.MyTokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    path('register/', users.register_user, name='register'),

    path('profile/', users.get_user_detail, name='user-detail'),
    path('profile/update/', users.update_user, name='update-user'),
    path('', users.get_all_users, name='user-list'),
    path('<str:pk>/', users.get_user_by_id, name='user-detail-admin'),
    path('update/<str:pk>/', users.update_user_by_id, name='user-update-admin'),
    path('delete/<str:pk>', users.delete_user, name='user-delete'),
]
