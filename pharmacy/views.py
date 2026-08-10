# pharmacy/views.py
import uuid

from django.core.exceptions import ValidationError as DjangoValidationError
from django.db.models.deletion import ProtectedError
from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Medicine, MedicineOrder
from .serializers import (
    MedicineSerializer,
    MedicineOrderSerializer,
    MedicinePaymentCreateSerializer,
)


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


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_medicine_payment_view(request):
    """
    Pharmacy equivalent of bookings.create_payment_view.

    The MedicineOrder does NOT exist before this call. This endpoint:
      1. Validates the payment payload (medicine, quantity, address,
         phone, payment method) coming from the existing PaymentPage
         in pharmacy mode.
      2. Runs the dummy payment (no real gateway, same as Equipment flow).
      3. On success, creates the MedicineOrder — MedicineOrder.save()
         itself validates stock and snapshots total_price — then
         immediately marks it CONFIRMED (mirroring Equipment's
         paid -> active transition), since medicine orders require no
         admin approval.
      4. Returns a payment-shaped response so the existing PaymentPage/
         PaymentSuccessPage code (which reads data.payment.transaction_id,
         data.payment.amount, data.payment.paid_at) keeps working unchanged.

    If validation fails or stock is insufficient, NO MedicineOrder is
    created and a 400 is returned — payment does not "succeed".
    """

    serializer = MedicinePaymentCreateSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(
            {
                'success': False,
                'errors': serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    medicine_id = serializer.validated_data['medicine_id']
    quantity = serializer.validated_data['quantity']
    delivery_address = serializer.validated_data['delivery_address']
    phone_number = serializer.validated_data['phone_number']
    payment_method = serializer.validated_data['payment_method']

    try:
        medicine = Medicine.objects.get(pk=medicine_id, is_active=True)
    except Medicine.DoesNotExist:
        return Response(
            {
                'success': False,
                'message': 'Medicine not found.',
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    try:
        order = MedicineOrder.objects.create(
            user=request.user,
            medicine=medicine,
            quantity=quantity,
            delivery_address=delivery_address,
            phone_number=phone_number,
        )
    except DjangoValidationError as e:
        message = e.messages[0] if getattr(e, 'messages', None) else str(e)
        return Response(
            {
                'success': False,
                'message': message,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Payment succeeded and stock was reserved — move the order straight
    # to Confirmed. No admin approval step for medicine orders.
    order.status = MedicineOrder.Status.CONFIRMED
    order.save()

    transaction_id = f"TXN{uuid.uuid4().hex[:10].upper()}"
    paid_at = timezone.now()

    return Response(
        {
            'success': True,
            'message': 'Payment successful.',
            'payment': {
                'transaction_id': transaction_id,
                'amount': order.total_price,
                'payment_method': payment_method,
                'paid_at': paid_at,
            },
            'order': MedicineOrderSerializer(order).data,
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_medicine_orders_view(request):

    orders = MedicineOrder.objects.filter(
        user=request.user
    ).select_related('medicine')

    serializer = MedicineOrderSerializer(orders, many=True)

    return Response(
        {
            'success': True,
            'count': orders.count(),
            'orders': serializer.data,
        },
        status=status.HTTP_200_OK,
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def medicine_order_detail_view(request, pk):
    """
    Single-order fetch for the Medicine Order Tracking page — mirrors
    bookings.booking_detail_view (owner-only lookup by id).
    """

    order = get_object_or_404(
        MedicineOrder.objects.select_related('medicine'),
        pk=pk,
        user=request.user,
    )

    return Response(
        {
            'success': True,
            'order': MedicineOrderSerializer(order).data,
        },
        status=status.HTTP_200_OK,
    )