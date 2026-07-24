from rest_framework import serializers
from .models import Equipment, RecoveryKit


class EquipmentSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(
        source='get_category_display',
        read_only=True,
    )
    availability_status_display = serializers.CharField(
        source='get_availability_status_display',
        read_only=True,
    )

    class Meta:
        model = Equipment
        fields = (
            'id',
            'name',
            'category',
            'category_display',
            'price_per_day',
            'availability_status',
            'availability_status_display',
            'stock',
            'description',
            'image',
            'created_at',
            'updated_at',
        )
        read_only_fields = ('id', 'created_at', 'updated_at')


class EquipmentRecommendationSerializer(serializers.ModelSerializer):
    """
    Lightweight equipment serializer used for recommended/related equipment
    (e.g. EquipmentDetailView's "recommended_equipment" field), exposing only
    the fields needed for a summary card rather than the full detail set.
    """

    class Meta:
        model = Equipment
        fields = (
            'id',
            'name',
            'category',
            'price_per_day',
            'availability_status',
            'image',
        )
        read_only_fields = fields


class RecoveryKitSerializer(serializers.ModelSerializer):

    class Meta:
        model = RecoveryKit
        fields = (
            'id',
            'condition_name',
            'recommended_equipment',
            'estimated_cost',
            'recovery_days',
        )
        read_only_fields = ('id',)