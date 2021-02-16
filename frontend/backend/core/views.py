import jwt
from rest_framework_jwt.settings import api_settings
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework.decorators import action
from django.conf import settings
from django.contrib import auth
from django.contrib.auth.hashers import check_password
from .serializers import UserSerializerWithToken, UserSerializerLoginwithToken, CryptoWatchListSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import permissions, status
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect

# models
from django.contrib.auth.models import User
from .models import CryptoWatchList

class CurrentUser(APIView):

    permission_classes = (permissions.AllowAny,)

    def get(self, request, format=None):
        token = request.META['HTTP_AUTHORIZATION']
        token = token.split(' ')[1]
        jwt_decode_handler = api_settings.JWT_DECODE_HANDLER
        data = jwt_decode_handler(token)
        return Response(data)


class UserList(APIView):
    """
    Create a new user. It's called 'UserList' because normally we'd have a get
    method here too, for retrieving a list of all User objects.
    """

    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = UserSerializerWithToken(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLogin(APIView):

    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        user = User.objects.filter(username=request.data['username'])
        serializer = UserSerializerLoginwithToken(user, many=True)
        if(len(serializer.data) == 0):
            return Response("Wrong UserName", status=status.HTTP_400_BAD_REQUEST)
        passcheck = check_password(
            request.data['password'], serializer.data[0]['password'])
        if(passcheck != True):
            return Response("Wrong Password", status=status.HTTP_400_BAD_REQUEST)
        payload = {
            'user_id': serializer.data[0]['id'],
            'username': request.data['username'],
            'exp': 1609569034,
            'email': serializer.data[0]['email'],
            # 'password': request.data['password']
        }
        return Response(serializer.data[0], status=status.HTTP_200_OK)

class CryptoWatchListViewSet(APIView):

    permission_classes = (permissions.AllowAny,)

    def get(self, request, format=None):
        cryptos = CryptoWatchList.objects.all()
        serializer = CryptoWatchListSerializer(cryptos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, format=None):
        user = User.objects.get(username=request.data["userid"])
        request.data['userid'] = user.id
        cryptos = CryptoWatchList.objects.filter(coinid=request.data['coinid'], userid=user.id)
        serializer = CryptoWatchListSerializer(cryptos, many=True)
        if(len(serializer.data)!=0):
            return Response({"error" : "Already in the Watchlist"})
            
        serializersave = CryptoWatchListSerializer(data=request.data)
        if serializersave.is_valid():
            serializersave.save()
            return Response(serializersave.data, status = status.HTTP_201_CREATED)
        return Response(serializersave.errors, status = status.HTTP_400_BAD_REQUEST)
    

class CryptoDeleteViewset(APIView):
    
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        user = User.objects.get(username=request.data["userid"])
        print(user.id)
        request.data['userid'] = user.id
        crypto = CryptoWatchList.objects.get(coinid=request.data['coinid'], userid=user.id)
        crypto.delete()
        return Response("Coin removed from watchlist", status=status.HTTP_200_OK)


