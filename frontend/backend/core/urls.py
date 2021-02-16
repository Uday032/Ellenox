from django.urls import path
from .views import UserList, CurrentUser, UserLogin, CryptoWatchListViewSet, CryptoDeleteViewset

urlpatterns = [
    path('current_user/', CurrentUser.as_view()),
    path('users/', UserList.as_view()),
    path('loginuser/', UserLogin.as_view()),
    path('cryptos/delete/', CryptoDeleteViewset.as_view()),
    path('cryptos/', CryptoWatchListViewSet.as_view())
    
]
