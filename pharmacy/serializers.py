from rest_framework import serializers
from .models import Medicine, MedicineOrder


class MedicineSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(
        source="get_category_display",
        read_only=True
    )

    stock_status_display = serializers.CharField(
        source="get_stock_status_display",
        read_only=True
    )

    class Meta:
        model = Medicine
        fields = (
            "id",
            "name",
            "brand",
            "generic_name",
            "description",
            "category",
            "category_display",
            "dosage_form",
            "strength",
            "price",
            "stock_quantity",
            "stock_status",
            "stock_status_display",
            "requires_prescription",
            "image",
        )


class MedicineOrderSerializer(serializers.ModelSerializer):
    medicine_name = serializers.CharField(source='medicine.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = MedicineOrder
        fields = [
            'id',
            'medicine',
            'medicine_name',
            'quantity',
            'total_price',
            'delivery_address',
            'phone_number',
            'status',
            'status_display',
            'ordered_at',
        ]
        read_only_fields = [
            'id',
            'medicine_name',
            'total_price',
            'status',
            'status_display',
            'ordered_at'
        ]


class MedicinePaymentCreateSerializer(serializers.Serializer):
    """
    Input validation for the pharmacy dummy-payment endpoint.
    Mirrors bookings.PaymentCreateSerializer in shape/spirit, but for
    medicine orders — the MedicineOrder is only created after this
    payload validates and the dummy payment "succeeds".
    """

    PAYMENT_METHOD_CHOICES = (
        ('upi', 'UPI'),
        ('card', 'Card'),
        ('cash', 'Cash'),
    )

    medicine_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)
    delivery_address = serializers.CharField()
    phone_number = serializers.CharField()
    payment_method = serializers.ChoiceField(choices=PAYMENT_METHOD_CHOICES)