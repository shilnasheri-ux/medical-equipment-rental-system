from django.urls import path
from .views import create_payment_view

urlpatterns = [
    path("create/", create_payment_view, name="create"),
]