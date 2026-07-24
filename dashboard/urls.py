from django.urls import path
from .views import admin_dashboard_view

app_name = 'dashboard'

urlpatterns = [
    path('admin/', admin_dashboard_view, name='admin'),
]