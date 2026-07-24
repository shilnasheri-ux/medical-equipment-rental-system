from django.db import models


class Category(models.TextChoices):
    MOBILITY = 'mobility', 'Mobility Aids'
    RESPIRATORY = 'respiratory', 'Respiratory Equipment'
    DIAGNOSTIC = 'diagnostic', 'Diagnostic Tools'
    ORTHOPEDIC = 'orthopedic', 'Orthopedic Supports'
    MONITORING = 'monitoring', 'Patient Monitoring'
    OTHER = 'other', 'Other'


class Equipment(models.Model):

    class AvailabilityStatus(models.TextChoices):
        AVAILABLE = "available", "Available"
        OUT_OF_STOCK = "out_of_stock", "Out of Stock"
        UNDER_MAINTENANCE = "under_maintenance", "Under Maintenance"

    name = models.CharField(max_length=200)

    category = models.CharField(
        max_length=50,
        choices=Category.choices,
        default=Category.OTHER,
    )

    price_per_day = models.DecimalField(
        max_digits=8,
        decimal_places=2
    )

    availability_status = models.CharField(
        max_length=20,
        choices=AvailabilityStatus.choices,
        default=AvailabilityStatus.AVAILABLE,
        db_index=True,
    )

    stock = models.PositiveIntegerField(default=1)

    description = models.TextField(blank=True)

    image = models.ImageField(
        upload_to='equipment_images/',
        blank=True,
        null=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Equipment'
        verbose_name_plural = 'Equipment'

    def __str__(self):
        return f"{self.name} ({self.get_category_display()})"
    
    
class RecoveryKit(models.Model):
    condition_name = models.CharField(max_length=100, unique=True)
    recommended_equipment = models.TextField()
    estimated_cost = models.DecimalField(max_digits=10, decimal_places=2)
    recovery_days = models.PositiveIntegerField()

    def __str__(self):
        return self.condition_name