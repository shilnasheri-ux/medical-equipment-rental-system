from django.urls import path
from .views import (
    medicine_list_view,
    medicine_detail_view,
    place_medicine_order,
    create_medicine_payment_view,
    my_medicine_orders_view,
    medicine_order_detail_view,
    admin_medicine_orders_view,
    update_medicine_order_status_view,
)

app_name = "pharmacy"

urlpatterns = [
    path("medicines/", medicine_list_view, name="medicine-list"),
    path("medicines/<int:pk>/", medicine_detail_view, name="medicine-detail"),
    path("orders/", place_medicine_order, name="place-medicine-order"),
    path("orders/my-orders/", my_medicine_orders_view, name="my-medicine-orders"),
    path("orders/<int:pk>/", medicine_order_detail_view, name="medicine-order-detail"),
    path("payments/create/", create_medicine_payment_view, name="create-medicine-payment"),
    path("orders/admin/", admin_medicine_orders_view, name="admin-medicine-orders"),
    path("orders/admin/<int:pk>/status/", update_medicine_order_status_view, name="update-medicine-order-status" ),
]