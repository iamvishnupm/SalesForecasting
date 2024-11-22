from django.shortcuts import render
from django.db.models import Sum, IntegerField, FloatField
from django.db.models.functions import ExtractYear, Cast, TruncDate

import logging
from .serializers import *
from main.models import *

from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action

logger = logging.getLogger(__name__)


def home(request):
    return render(request, "index.html")


class SalesDataViewSet(viewsets.ModelViewSet):
    queryset = DailySales.objects.all()
    serializer_class = SalesSummarySerializer

    def get_queryset(self):
        category = self.request.query_params.get("category", "Electronics")
        year = int(self.request.query_params.get("year", 2021))
        month = int(self.request.query_params.get("month", 1))

        logger.info(
            f"Filtering data with category: {category}, year: {year}, month: {month}"
        )

        return self.queryset.filter(
            Category=category.lower(), Date__year=year, Date__month=month
        )

    @action(detail=False, methods=["get"])
    def filtered_data(self, request):
        category = request.query_params.get("category", "Electronics")
        year = int(request.query_params.get("year", 2021))
        month = int(self.request.query_params.get("month", 1))

        logger.info(
            f"Accessed filtered_data endpoint with category: "
            f"{category}, year: {year}, month: {month}"
        )

        filtered_queryset = self.get_queryset()

        response_data = (
            filtered_queryset.values("Date")
            .annotate(
                quantity_sold=Sum("Quantity_Sold"),
                forecast=Sum("Prediction"),
                revenue=Cast(Sum("Total_Sales"), IntegerField()),
            )
            .order_by("Date")
        )

        return Response(response_data)


class dataList(APIView):
    def get(self, request):
        data_type = request.query_params.get("type", "category")
        if data_type == "category":
            data = DailySales.objects.values_list("Category", flat=True).distinct()
            response_key = "categories"
        elif data_type == "year":
            data = (
                DailySales.objects.annotate(year=ExtractYear("Date"))
                .values_list("year", flat=True)
                .distinct()
            )
            response_key = "years"
        else:
            return Response({"error": "Invalid type parameter"}, status=400)

        return Response({response_key: list(data)})


class PredictionViewSet(viewsets.ViewSet):
    def list(self, request):
        category = request.query_params.get("category")
        data = PredictionSerializer.get_sales_data(category=category)
        serializer = PredictionSerializer(data, many=True)
        return Response(serializer.data)
