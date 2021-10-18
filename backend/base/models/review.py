from django.contrib.auth.models import User
from django.db import models

from base.models.product import Product


class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    rating = models.IntegerField(null=True, blank=True, default=0)
    comment = models.TextField(null=True, blank=True)
    id = models.AutoField(primary_key=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return str(self.rating)