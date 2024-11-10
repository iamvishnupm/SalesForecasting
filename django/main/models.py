from django.db import models


class SalesData(models.Model):
    Date = models.DateField()
    Country = models.CharField(max_length=100)
    Place = models.CharField(max_length=100)
    Category = models.CharField(max_length=100)
    Product_ID = models.CharField(max_length=100)
    Price = models.FloatField()
    Discount = models.FloatField()
    Quantity_Sold = models.IntegerField()
    Customer_Rating = models.FloatField()
    Total_Sales = models.FloatField()


class DailySales(models.Model):
    Date = models.DateField()
    Category = models.CharField(max_length=100)
    Quantity_Sold = models.IntegerField()
    Prediction = models.FloatField()
    Total_Sales = models.FloatField()
