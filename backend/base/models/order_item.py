from django.db import models

from base.models.order import Order
from base.models.product import Product


class OrderItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    qty = models.IntegerField(null=True, blank=True, default=0)
    price = models.DecimalField(max_digits=7, decimal_places=2, null=True,
                                blank=True)
    image = models.CharField(max_length=200, null=True, blank=True)
    id = models.AutoField(primary_key=True, editable=False)
    def __str__(self):
        return str(self.name)