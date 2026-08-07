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