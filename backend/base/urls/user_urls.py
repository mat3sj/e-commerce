from django.urls import path
from base.views import users

urlpatterns = [
    path('login/', users.MyTokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    path('register/', users.register_user, name='register'),

    path('profile', users.get_user_detail, name='user-detail'),
    path('', users.get_all_users, name='user-list'),
]
