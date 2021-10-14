from django.urls import path
from base.views import users

urlpatterns = [
    path('', users.UserListView.as_view(), name='user-list'),
    path('login/', users.MyTokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    path('register/', users.register_user, name='register'),

    path('profile', users.UserProfileView.as_view(), name='user-profile'),
    path('<str:user_id>', users.UserDetailView.as_view(), name='user-detail'),

]
