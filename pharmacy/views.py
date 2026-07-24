from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Medicine
from .serializers import MedicineSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from .serializers import MedicineOrderSerializer
from django.db.models.deletion import ProtectedError


@api_view(["GET", "POST"])
def medicine_list_view(request):

    if request.method == "GET":
        medicines = Medicine.objects.filter(is_active=True)

        serializer = MedicineSerializer(
            medicines,
            many=True
        )

        return Response(
            {
                "success": True,
                "count": medicines.count(),
                "medicines": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    elif request.method == "POST":

        serializer = MedicineSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(
                {
                    "success": True,
                    "medicine": serializer.data,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

@api_view(["GET", "PATCH", "DELETE"])
def medicine_detail_view(request, pk):
    try:
        medicine = Medicine.objects.get(pk=pk)
    except Medicine.DoesNotExist:
        return Response(
            {"success": False, "message": "Medicine not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    if request.method == "GET":
        serializer = MedicineSerializer(medicine)
        return Response(
            {
                "success": True,
                "medicine": serializer.data,
            }
        )

    elif request.method == "PATCH":
        serializer = MedicineSerializer(
            medicine,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()

            return Response(
                {
                    "success": True,
                    "medicine": serializer.data,
                }
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    elif request.method == "DELETE":
        try:
            medicine.delete()

            return Response(
                {
                    "success": True,
                    "message": "Medicine deleted successfully."
                },
                status=status.HTTP_200_OK,
            )

        except ProtectedError:
            return Response(
                {
                    "success": False,
                    "message": "This medicine cannot be deleted because it has existing orders."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        
            
    
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def place_medicine_order(request):
    serializer = MedicineOrderSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(user=request.user)

        return Response(
            {
                "success": True,
                "message": "Medicine order placed successfully.",
                "order": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )

    return Response(
        {
            "success": False,
            "errors": serializer.errors,
        },
        status=status.HTTP_400_BAD_REQUEST,
    )