from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAdminUser
from django.shortcuts import get_object_or_404

from .models import Equipment
from .serializers import (
    EquipmentSerializer,
    EquipmentRecommendationSerializer,
)

from rest_framework.generics import ListAPIView
from .models import RecoveryKit
from .serializers import RecoveryKitSerializer
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import IsAdminUser
from rest_framework_simplejwt.authentication import JWTAuthentication


class EquipmentListCreateView(APIView):

    def get(self, request):
        print("User:", request.user)
        print("Authenticated:", request.user.is_authenticated)
        print("Staff:", request.user.is_staff)

        queryset = Equipment.objects.all()

        # NEW Availability Status Filter
        status_filter = request.query_params.get("status")
        if status_filter:
            queryset = queryset.filter(
                availability_status=status_filter
            )
            
            
        # Existing Category Filter
        category = request.query_params.get("category")
        if category:
            queryset = queryset.filter(category=category)

        # Existing Search
        search = request.query_params.get("search")
        if search:
            queryset = queryset.filter(name__icontains=search)

        serializer = EquipmentSerializer(
            queryset,
            many=True,
            context={"request": request},
        )

        return Response(
            {
                "count": queryset.count(),
                "results": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def post(self, request):
        serializer = EquipmentSerializer(
            data=request.data,
            context={"request": request},
        )

        if serializer.is_valid():
            serializer.save()
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )


def get_recommended_equipment(equipment, limit=4):

    base_filters = {
        "availability_status": Equipment.AvailabilityStatus.AVAILABLE,
    }

    # Same category
    same_category = (
        Equipment.objects
        .filter(category=equipment.category, **base_filters)
        .exclude(pk=equipment.pk)
        .order_by("-created_at")[:limit]
    )

    same_category_ids = list(
        same_category.values_list("id", flat=True)
    )

    remaining_slots = limit - len(same_category_ids)

    if remaining_slots <= 0:
        return same_category

    # Other categories
    other_equipment = (
        Equipment.objects
        .filter(**base_filters)
        .exclude(pk=equipment.pk)
        .exclude(pk__in=same_category_ids)
        .order_by("-created_at")[:remaining_slots]
    )

    return list(same_category) + list(other_equipment)

class EquipmentDetailView(APIView):

    parser_classes = [
        MultiPartParser,
        FormParser,
        JSONParser,
    ]

    def get_object(self, pk):
        return get_object_or_404(
            Equipment,
            pk=pk,
        )

    def get(self, request, pk):
        equipment = self.get_object(pk)

        serializer = EquipmentSerializer(
            equipment,
            context={"request": request},
        )

        # Get recommended equipment
        recommended = get_recommended_equipment(
            equipment,
            limit=4,
        )

        recommended_serializer = EquipmentRecommendationSerializer(
            recommended,
            many=True,
            context={"request": request},
        )

        data = serializer.data
        data["recommended_equipment"] = recommended_serializer.data

        return Response(data)    
    
    
    def put(self, request, pk):
        equipment = self.get_object(pk)

        serializer = EquipmentSerializer(
            equipment,
            data=request.data,
            context={"request": request},
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

    def patch(self, request, pk):
        equipment = self.get_object(pk)

        serializer = EquipmentSerializer(
            equipment,
            data=request.data,
            partial=True,
            context={"request": request},
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

    def delete(self, request, pk):
        equipment = self.get_object(pk)
        equipment.delete()

        return Response(
            {
                "message": "Equipment deleted successfully."
            },
            status=status.HTTP_204_NO_CONTENT,
        )


# ===========================
# NEW ADMIN AVAILABILITY VIEW
# ===========================

class UpdateAvailabilityView(APIView):

    permission_classes = [IsAdminUser]

    def patch(self, request, pk):

        equipment = get_object_or_404(
            Equipment,
            pk=pk,
        )

        status_value = request.data.get(
            "availability_status"
        )

        if status_value not in [
            Equipment.AvailabilityStatus.AVAILABLE,
            Equipment.AvailabilityStatus.OUT_OF_STOCK,
            Equipment.AvailabilityStatus.UNDER_MAINTENANCE,
        ]:
            return Response(
                {
                    "error": "Invalid availability status."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        equipment.availability_status = status_value
        equipment.save()

        serializer = EquipmentSerializer(
            equipment,
            context={"request": request},
        )

        return Response(
            {
                "success": True,
                "message": "Availability updated successfully.",
                "equipment": serializer.data,
            },
            status=status.HTTP_200_OK,
        )
        
        
class RecoveryKitListView(ListAPIView):
    queryset = RecoveryKit.objects.all()
    serializer_class = RecoveryKitSerializer
    

SYMPTOM_RULES = {
    frozenset(["fever", "cough", "breathlessness"]): {
        "condition": "Possible Respiratory Infection",
        "recommended_equipment": "Oxygen Concentrator, Nebulizer, Pulse Oximeter",
        "advice": "Monitor oxygen levels regularly and consult a doctor if breathlessness worsens.",
    },
    frozenset(["joint_pain", "swelling", "difficulty_walking"]): {
        "condition": "Possible Joint / Mobility Issue",
        "recommended_equipment": "Walker, Wheelchair, Knee Brace",
        "advice": "Avoid putting excess weight on the affected joint and consult an orthopedic specialist.",
    },
    frozenset(["back_pain", "difficulty_walking"]): {
        "condition": "Possible Back Strain",
        "recommended_equipment": "Lumbar Support Belt, Orthopedic Mattress",
        "advice": "Avoid heavy lifting and maintain proper posture. Consult a doctor if pain persists.",
    },
    frozenset(["weakness", "dizziness", "difficulty_walking"]): {
        "condition": "Possible Post-Surgical Weakness / Elderly Frailty",
        "recommended_equipment": "Wheelchair, Walker, Patient Monitor",
        "advice": "Ensure supervised movement and adequate rest. Consult a physician for a full evaluation.",
    },
    frozenset(["fever", "weakness"]): {
        "condition": "Possible General Infection",
        "recommended_equipment": "Patient Monitor, Thermometer",
        "advice": "Stay hydrated, rest, and monitor temperature. Seek medical advice if fever persists.",
    },
}

DEFAULT_RESULT = {
    "condition": "No specific condition matched",
    "recommended_equipment": "General Health Monitoring Kit",
    "advice": "Symptoms are not specific enough. Please consult a doctor for proper diagnosis.",
}


@api_view(["POST"])
def analyze_symptoms(request):
    symptoms = request.data.get("symptoms", [])

    if not isinstance(symptoms, list) or not symptoms:
        return Response({
            "success": False,
            "error": "Please provide a non-empty list of symptoms."
        }, status=400)

    symptom_set = set(symptoms)
    best_match = None
    best_match_count = 0

    for rule_symptoms, result in SYMPTOM_RULES.items():
        overlap = len(rule_symptoms & symptom_set)
        if overlap > best_match_count:
            best_match_count = overlap
            best_match = result

    result = best_match if best_match else DEFAULT_RESULT

    return Response({
        "success": True,
        "condition": result["condition"],
        "recommended_equipment": result["recommended_equipment"],
        "advice": result["advice"],
    })