from django.urls import path, include
from .views import *
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register("salesdata", SalesDataViewSet)
router.register(r"prediction", PredictionViewSet, basename="prediction")

urlpatterns = [
    path("api/", include(router.urls)),
    path("api/data/", dataList.as_view(), name="data_list"),
    # path("", home, name="home"),
]
