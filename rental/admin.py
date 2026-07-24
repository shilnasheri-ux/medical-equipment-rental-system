from django.contrib import admin
from .models import Equipment, RecoveryKit

admin.site.register(RecoveryKit)

@admin.register(Equipment)
class EquipmentAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'category',
        'price_per_day',
        'availability_status',
        'stock',
        'created_at',
    )

    list_filter = (
        'category',
        'availability_status',
    )

    search_fields = (
        'name',
        'description',
    )

    list_editable = (
        'availability_status',
        'price_per_day',
        'stock',
    )

    ordering = ('-created_at',)

    readonly_fields = (
        'created_at',
        'updated_at',
    )