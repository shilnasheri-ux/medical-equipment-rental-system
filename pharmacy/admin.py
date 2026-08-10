from django.contrib import admin
from .models import Medicine, MedicineOrder

admin.site.register(Medicine)


@admin.register(MedicineOrder)
class MedicineOrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'medicine', 'quantity', 'total_price', 'status', 'ordered_at')
    list_filter = ('status',)
    search_fields = ('user__username', 'medicine__name')
    list_editable = ('status',)