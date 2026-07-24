from django.urls import path
from .views import medicine_list_view, medicine_detail_view, place_medicine_order

app_name = "pharmacy"

urlpatterns = [
    path("medicines/", medicine_list_view, name="medicine-list"),
    path("medicines/<int:pk>/", medicine_detail_view, name="medicine-detail"),
    path("orders/", place_medicine_order, name="place-medicine-order"),
]