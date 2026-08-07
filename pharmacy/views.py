from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Medicine
from .serializers import MedicineSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import permission_classes
from .serializers import MedicineOrderSerializer
from .models import MedicineOrder
from django.db.models.deletion import ProtectedError
from django.core.exceptions import ValidationError


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
        
            
    
@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def place_medicine_order(request):
    if request.method == "GET":
        orders = MedicineOrder.objects.filter(
            user=request.user
        ).order_by('-ordered_at')

        serializer = MedicineOrderSerializer(orders, many=True)

        return Response(
            {
                "success": True,
                "count": orders.count(),
                "orders": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    serializer = MedicineOrderSerializer(data=request.data)

    if serializer.is_valid():
        try:
            serializer.save(user=request.user)
        except ValidationError as e:
            message = e.messages[0] if getattr(e, 'messages', None) else str(e)
            return Response(
                {
                    "success": False,
                    "message": message,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

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


@api_view(["GET"])
@permission_classes([IsAdminUser])
def admin_medicine_orders_list(request):
    orders = MedicineOrder.objects.select_related('user', 'medicine').order_by('-ordered_at')

    data = [
        {
            "id": order.id,
            "user": order.user.username,
            "medicine_name": order.medicine.name,
            "quantity": order.quantity,
            "total_price": order.total_price,
            "phone_number": order.phone_number,
            "delivery_address": order.delivery_address,
            "status": order.status,
            "status_display": order.get_status_display(),
            "ordered_at": order.ordered_at,
        }
        for order in orders
    ]

    return Response(
        {
            "success": True,
            "count": len(data),
            "orders": data,
        },
        status=status.HTTP_200_OK,
    )


@api_view(["PATCH"])
@permission_classes([IsAdminUser])
def update_medicine_order_status(request, pk):
    try:
        order = MedicineOrder.objects.get(pk=pk)
    except MedicineOrder.DoesNotExist:
        return Response(
            {"success": False, "message": "Medicine order not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    new_status = request.data.get("status")

    if order.status != MedicineOrder.Status.PAID:
        return Response(
            {
                "success": False,
                "message": f"Cannot change status of an order that is already '{order.get_status_display()}'.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    if new_status not in [MedicineOrder.Status.DELIVERED, MedicineOrder.Status.CANCELLED]:
        return Response(
            {
                "success": False,
                "message": "Invalid status. Allowed values: 'delivered', 'cancelled'.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    order.status = new_status
    order.save(update_fields=["status", "updated_at"])

    return Response(
        {
            "success": True,
            "message": f"Order status updated to '{order.get_status_display()}'.",
            "order": {
                "id": order.id,
                "status": order.status,
                "status_display": order.get_status_display(),
            },
        },
        status=status.HTTP_200_OK,
    )