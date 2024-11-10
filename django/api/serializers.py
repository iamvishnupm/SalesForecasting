from rest_framework import serializers
from main.models import *
from django.db.models import Sum
from datetime import datetime


class SalesDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesData
        fields = "__all__"


class SalesSummarySerializer(serializers.Serializer):
    day = serializers.DateField(source="Date")  # Adjust to map correctly
    quantity_sold = serializers.IntegerField()
    forecast = serializers.FloatField()  # Assuming Prediction is a float
    revenue = serializers.FloatField()

    class Meta:
        fields = ["day", "quantity_sold", "forecast", "revenue"]


class PredictionSerializer(serializers.Serializer):
    date = serializers.DateField()
    quantity_sold = serializers.IntegerField()
    prediction = serializers.IntegerField()

    @staticmethod
    def get_sales_data(category=None):
        # Filter by category if provided
        print(f"\n\nCategory : {category}\n\n")
        sales_data = (
            (
                DailySales.objects.filter(Category=category)
                if category
                else DailySales.objects.all()
            )
            .values("Date")
            .annotate(
                quantity_sold=Sum("Quantity_Sold"),
                prediction=Sum(
                    "Prediction"
                ),  # Aggregate prediction or use Avg if needed
            )
            .order_by("Date")
        )

        data = []
        for entry in sales_data:
            date = entry["Date"]
            quantity_sold = entry["quantity_sold"]
            prediction = entry["prediction"]  # unable to get this
            data.append(
                {"date": date, "quantity_sold": quantity_sold, "prediction": prediction}
            )
        return data
