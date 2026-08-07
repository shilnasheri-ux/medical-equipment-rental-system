from rest_framework import serializers
from .models import Booking, Payment
from django.utils import timezone
from rental.models import Equipment


class BookingSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(
        source='get_status_display',
        read_only=True,
    )

    # Not a DB field on Booking — derived from the related Payment (if any),
    # via Payment.payment_status. Defaults to "pending" when no Payment
    # exists yet. This is what OrderTrackingPage already expects on
    # `booking.payment_status`, and what MyBookingsPage now uses to decide
    # whether to show "Pay Now" vs a "Paid" badge.
    payment_status = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = (
            'id',
            'equipment_name',
            'start_date',
            'end_date',
            'status',
            'status_display',
            'notification',
            'total_price',
            'return_requested',
            'created_at',
            'payment_status',
        )
        read_only_fields = fields

    def get_payment_status(self, obj):
        payment = getattr(obj, 'payment', None)
        if payment:
            return payment.payment_status
        return Payment.PaymentStatus.PENDING


class BookingCreateSerializer(serializers.ModelSerializer):

    equipment_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Booking
        fields = (
            'equipment_id',
            'start_date',
            'end_date',
        )

    def validate_start_date(self, value):
        if value < timezone.now().date():
            raise serializers.ValidationError(
                'Start date cannot be in the past.'
            )
        return value

    def validate(self, attrs):
        start = attrs['start_date']
        end = attrs['end_date']

        if end <= start:
            raise serializers.ValidationError(
                {'end_date': 'End date must be after start date.'}
            )

        duration = (end - start).days

        if duration > 365:
            raise serializers.ValidationError(
                {'end_date': 'Rental period cannot exceed 365 days.'}
            )

        equipment_id = attrs.get('equipment_id')

        try:
            equipment = Equipment.objects.get(id=equipment_id)
        except Equipment.DoesNotExist:
            raise serializers.ValidationError(
                {'equipment_id': 'Equipment not found.'}
            )

        status_messages = {
            Equipment.AvailabilityStatus.OUT_OF_STOCK:
                "This equipment is currently out of stock.",

            Equipment.AvailabilityStatus.UNDER_MAINTENANCE:
                "This equipment is under maintenance and cannot be booked.",
        }

        if equipment.availability_status != Equipment.AvailabilityStatus.AVAILABLE:
            message = status_messages.get(
                equipment.availability_status,
                "This equipment is not available for booking.",
            )
            raise serializers.ValidationError(
                {"equipment_id": message}
            )

        overlapping_count = Booking.objects.filter(
            equipment=equipment,
            status__in=[Booking.Status.CONFIRMED, Booking.Status.ACTIVE],
            start_date__lt=end,
            end_date__gt=start,
        ).count()

        if overlapping_count >= equipment.stock:
            raise serializers.ValidationError(
                {'equipment_id': 'This equipment is not available for the selected dates.'}
            )

        attrs['equipment_obj'] = equipment

        return attrs

    def create(self, validated_data):

        equipment = validated_data.pop('equipment_obj')

        start = validated_data['start_date']
        end = validated_data['end_date']

        duration = (end - start).days

        total_price = equipment.price_per_day * duration

        booking = Booking.objects.create(
            user=self.context['request'].user,
            equipment=equipment,
            equipment_name=equipment.name,
            start_date=start,
            end_date=end,
            total_price=total_price,
            notification="⏳ Your booking request has been submitted and is awaiting admin approval.",
        )

        return booking


class PaymentSerializer(serializers.ModelSerializer):
    booking_id = serializers.IntegerField(source='booking.id', read_only=True)
    equipment_name = serializers.CharField(source='booking.equipment_name', read_only=True)

    class Meta:
        model = Payment
        fields = (
            'id',
            'booking_id',
            'equipment_name',
            'amount',
            'payment_method',
            'payment_status',
            'transaction_id',
            'paid_at',
            'created_at',
        )
        read_only_fields = fields


class PaymentCreateSerializer(serializers.Serializer):
    booking_id = serializers.IntegerField()
    payment_method = serializers.ChoiceField(choices=Payment.PaymentMethod.choices)