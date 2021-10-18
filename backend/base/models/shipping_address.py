from django.db import models

from base.models.order import Order


class ShippingAddress(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, null=True, blank=True)
    address = models.CharField(max_length=200, null=True, blank=True)
    city = models.CharField(max_length=200, null=True, blank=True)
    postal_code = models.CharField(max_length=200, null=True, blank=True)
    country = models.CharField(max_length=200, null=True, blank=True)
    shipping_price = models.DecimalField(max_digits=7, decimal_places=2, null=True,
                                blank=True)
    id = models.AutoField(primary_key=True, editable=False)
    def __str__(self):
        return str(self.address)