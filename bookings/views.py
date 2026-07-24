import uuid

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone

from .models import Booking, Payment
from django.shortcuts import get_object_or_404
from rental.models import Equipment
from .serializers import (
    BookingSerializer,
    BookingCreateSerializer,
    PaymentSerializer,
    PaymentCreateSerializer,
)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_bookings_view(request):

    bookings = Booking.objects.filter(
        user=request.user
    ).select_related('equipment')

    serializer = BookingSerializer(bookings, many=True)

    return Response(
        {
            'success':  True,
            'count':    bookings.count(),
            'bookings': serializer.data,
        },
        status=status.HTTP_200_OK,
    )
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_booking_view(request):

    serializer = BookingCreateSerializer(
        data=request.data,
        context={'request': request}
    )

    if serializer.is_valid():
        booking = serializer.save()

        return Response(
            {
                'success': True,
                'message': 'Booking created successfully.',
                'booking': BookingSerializer(booking).data,
            },
            status=status.HTTP_201_CREATED,
        )

    return Response(
        {
            'success': False,
            'errors': serializer.errors,
        },
        status=status.HTTP_400_BAD_REQUEST,
    )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_booking_view(request, pk):

    try:
        booking = Booking.objects.get(
            pk=pk,
            user=request.user
        )

    except Booking.DoesNotExist:
        return Response(
            {
                'success': False,
                'message': 'Booking not found.',
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    booking.status = 'cancelled'
    booking.notification = "❌ You cancelled this booking."
    booking.save()

    return Response(
        {
            'success': True,
            'message': 'Booking cancelled.',
        }
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def booking_detail_view(request, pk):

    try:
        booking = Booking.objects.get(
            pk=pk,
            user=request.user
        )

    except Booking.DoesNotExist:
        return Response(
            {
                'success': False,
                'message': 'Booking not found.',
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    return Response(
        {
            'success': True,
            'booking': BookingSerializer(booking).data,
        }
    )
    

@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def update_booking_status_view(request, pk):
    
    print("PATCH API HIT")
    print(request.data)


    booking = get_object_or_404(Booking, pk=pk)

    new_status = request.data.get("status")

    if new_status not in [
        Booking.Status.PENDING,
        Booking.Status.CONFIRMED,
        Booking.Status.ACTIVE,
        Booking.Status.RETURNED,
        Booking.Status.CANCELLED,
    ]:
        return Response(
            {
                "success": False,
                "message": "Invalid status."
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    if new_status == Booking.Status.CONFIRMED and booking.equipment_id:
        overlapping_count = Booking.objects.filter(
            equipment_id=booking.equipment_id,
            status__in=[Booking.Status.CONFIRMED, Booking.Status.ACTIVE],
            start_date__lt=booking.end_date,
            end_date__gt=booking.start_date,
        ).exclude(pk=booking.pk).count()

        if overlapping_count >= booking.equipment.stock:
            return Response(
                {
                    "success": False,
                    "message": "This equipment is no longer available for the selected dates.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

    booking.status = new_status

    if new_status == Booking.Status.PENDING:
        booking.notification = "⏳ Your booking is awaiting admin approval."

    elif new_status == Booking.Status.CONFIRMED:
        booking.notification = "🎉 Your booking has been approved."

    elif new_status == Booking.Status.ACTIVE:
        booking.notification = "🚚 Your equipment has been delivered."

    elif new_status == Booking.Status.RETURNED:
        booking.notification = "✅ Thank you! Equipment returned successfully."

    elif new_status == Booking.Status.CANCELLED:
        booking.notification = "❌ Your booking has been rejected."

    booking.save()

    return Response(
        {
            "success": True,
            "message": "Booking status updated.",
            "booking": BookingSerializer(booking).data,
        }
    )
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_bookings_view(request):

    if not request.user.is_staff:
        return Response(
            {
                "success": False,
                "message": "Permission denied."
            },
            status=status.HTTP_403_FORBIDDEN
        )

    bookings = Booking.objects.select_related(
        "user",
        "equipment"
    ).all()

    serializer = BookingSerializer(bookings, many=True)

    return Response(serializer.data)


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def mark_notification_read(request, pk):
    booking = get_object_or_404(
        Booking,
        pk=pk,
        user=request.user
    )

    booking.notification = ""
    booking.save()

    return Response({
        "success": True
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_payment_view(request):

    serializer = PaymentCreateSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(
            {
                'success': False,
                'errors': serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    booking_id = serializer.validated_data['booking_id']
    payment_method = serializer.validated_data['payment_method']

    try:
        booking = Booking.objects.get(pk=booking_id, user=request.user)
    except Booking.DoesNotExist:
        return Response(
            {
                'success': False,
                'message': 'Booking not found.',
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    if booking.status != Booking.Status.CONFIRMED:
        return Response(
            {
                'success': False,
                'message': 'This booking is not eligible for payment.',
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    if hasattr(booking, 'payment'):
        return Response(
            {
                'success': False,
                'message': 'Payment already exists for this booking.',
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    transaction_id = f"TXN{uuid.uuid4().hex[:10].upper()}"

    payment = Payment.objects.create(
        booking=booking,
        amount=booking.total_price,
        payment_method=payment_method,
        payment_status=Payment.PaymentStatus.PAID,
        transaction_id=transaction_id,
        paid_at=timezone.now(),
    )

    booking.status = Booking.Status.ACTIVE
    booking.notification = "💳 Payment successful. Your equipment is being prepared for delivery."
    booking.save()

    return Response(
        {
            'success': True,
            'message': 'Payment successful.',
            'payment': PaymentSerializer(payment).data,
            'booking': BookingSerializer(booking).data,
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def request_return_view(request, pk):

    try:
        booking = Booking.objects.get(pk=pk, user=request.user)
    except Booking.DoesNotExist:
        return Response(
            {
                'success': False,
                'message': 'Booking not found.',
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    if booking.status != Booking.Status.ACTIVE:
        return Response(
            {
                'success': False,
                'message': 'Return can only be requested for active bookings.',
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    booking.return_requested = True
    booking.save()

    return Response(
        {
            'success': True,
            'message': 'Return request submitted successfully.',
            'booking': BookingSerializer(booking).data,
        }
    )


@api_view(['POST'])
@permission_classes([IsAdminUser])
def complete_return_view(request, pk):

    booking = get_object_or_404(Booking, pk=pk)

    if not booking.return_requested:
        return Response(
            {
                'success': False,
                'message': 'This booking has no pending return request.',
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    booking.status = Booking.Status.RETURNED
    booking.return_requested = False
    booking.notification = "✅ Thank you! Equipment returned successfully."
    booking.save()

    if booking.equipment:
        booking.equipment.availability_status = Equipment.AvailabilityStatus.AVAILABLE
        booking.equipment.save()

    return Response(
        {
            'success': True,
            'message': 'Return completed successfully.',
            'booking': BookingSerializer(booking).data,
        }
    )