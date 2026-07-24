from django.urls import path
from . import views
from .views import RecoveryKitListView
from .views import analyze_symptoms

app_name = 'rental'

urlpatterns = [
    path(
        "equipment/",
        views.EquipmentListCreateView.as_view(),
        name="equipment-list",
    ),

    path(
        "equipment/<int:pk>/",
        views.EquipmentDetailView.as_view(),
        name="equipment-detail",
    ),

    path(
        "equipment/<int:pk>/availability/",
        views.UpdateAvailabilityView.as_view(),
        name="equipment-availability",
    ),
    
    path(
        'recovery-kits/', RecoveryKitListView.as_view(), name='recovery-kit-list'),
    
     path('health-assistant/analyze/', analyze_symptoms, name='analyze-symptoms'),
]