from django.urls import path
from .views import (
    medicine_list_view,
    medicine_detail_view,
    place_medicine_order,
    admin_medicine_orders_list,
    update_medicine_order_status,
)

app_name = "pharmacy"

urlpatterns = [
    path("medicines/", medicine_list_view, name="medicine-list"),
    path("medicines/<int:pk>/", medicine_detail_view, name="medicine-detail"),
    path("orders/", place_medicine_order, name="place-medicine-order"),
    path("admin/orders/", admin_medicine_orders_list, name="admin-medicine-orders-list"),
    path("admin/orders/<int:pk>/status/", update_medicine_order_status, name="admin-medicine-order-update-status"),
]