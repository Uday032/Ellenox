from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class CryptoWatchList(models.Model):
    coinid = models.CharField(max_length=30)
    userid = models.ForeignKey(User, on_delete=models.CASCADE)

