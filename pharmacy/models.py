from django.db import models
from django.contrib.auth.models import User


class Medicine(models.Model):

    class Category(models.TextChoices):
        PAIN_RELIEF = 'pain_relief', 'Pain Relief'
        COLD_AND_FLU = 'cold_and_flu', 'Cold & Flu'
        DIGESTIVE_HEALTH = 'digestive_health', 'Digestive Health'
        VITAMINS = 'vitamins', 'Vitamins & Supplements'
        FIRST_AID = 'first_aid', 'First Aid'
        SKIN_CARE = 'skin_care', 'Skin Care'
        EYE_AND_EAR = 'eye_and_ear', 'Eye & Ear Care'
        DIABETES_CARE = 'diabetes_care', 'Diabetes Care'
        ALLERGY = 'allergy', 'Allergy Relief'
        OTHER = 'other', 'Other'

    class StockStatus(models.TextChoices):
        IN_STOCK = 'in_stock', 'In Stock'
        LOW_STOCK = 'low_stock', 'Low Stock'
        OUT_OF_STOCK = 'out_of_stock', 'Out of Stock'

    # Identity
    name = models.CharField(
        max_length=255,
        help_text='Full medicine name including strength, e.g. Paracetamol 500mg',
    )

    brand = models.CharField(
        max_length=255,
        blank=True,
        default='',
        help_text='Manufacturer or brand name, e.g. Crocin, Dolo',
    )

    generic_name = models.CharField(
        max_length=255,
        blank=True,
        default='',
        help_text='Active ingredient name, e.g. Paracetamol',
    )

    description = models.TextField(
        blank=True,
        default='',
    )

    # Classification
    category = models.CharField(
        max_length=30,
        choices=Category.choices,
        default=Category.OTHER,
        db_index=True,
    )

    dosage_form = models.CharField(
        max_length=100,
        blank=True,
        default='',
        help_text='e.g. Tablet, Capsule, Syrup, Cream, Drops',
    )

    strength = models.CharField(
        max_length=100,
        blank=True,
        default='',
        help_text='e.g. 500mg, 10ml, 5%',
    )

    # Pricing & Stock
    price = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        help_text='Price per unit (strip, bottle, tube, etc.)',
    )

    stock_quantity = models.PositiveIntegerField(
        default=0,
        help_text='Number of units currently in stock',
    )

    stock_status = models.CharField(
        max_length=20,
        choices=StockStatus.choices,
        default=StockStatus.IN_STOCK,
        db_index=True,
    )

    # Compliance
    requires_prescription = models.BooleanField(
        default=False,
        help_text='Always False for OTC items. Stored for future use.',
    )

    is_active = models.BooleanField(
        default=True,
        db_index=True,
        help_text='Inactive medicines are hidden from the public API.',
    )

    # Media
    image = models.ImageField(
        upload_to='pharmacy/',
        null=True,
        blank=True,
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'medicines'
        ordering = ['name']
        verbose_name = 'Medicine'
        verbose_name_plural = 'Medicines'

    def __str__(self):
        parts = [self.name]
        if self.brand:
            parts.append(f'({self.brand})')
        return ' '.join(parts)

    def save(self, *args, **kwargs):
        """
        Automatically update stock_status based on stock_quantity.
        """

        if self.stock_quantity == 0:
            self.stock_status = self.StockStatus.OUT_OF_STOCK
        elif self.stock_quantity <= 10:
            self.stock_status = self.StockStatus.LOW_STOCK
        else:
            self.stock_status = self.StockStatus.IN_STOCK

        super().save(*args, **kwargs)


class MedicineOrder(models.Model):

    class Status(models.TextChoices):
        PENDING          = 'pending',          'Pending'
        CONFIRMED        = 'confirmed',        'Confirmed'
        PREPARING        = 'preparing',        'Preparing'
        OUT_FOR_DELIVERY = 'out_for_delivery', 'Out for Delivery'
        DELIVERED        = 'delivered',        'Delivered'
        CANCELLED        = 'cancelled',        'Cancelled'

    # ── Relationships ──────────────────────────────────────────────────────────
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='medicine_orders',
    )
    medicine = models.ForeignKey(
        Medicine,
        on_delete=models.PROTECT,   # PROTECT so deleting a medicine doesn't
        related_name='orders',       # silently delete a user's order history
    )

    # ── Order details ──────────────────────────────────────────────────────────
    quantity = models.PositiveIntegerField()
    total_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )
    delivery_address = models.TextField()
    phone_number = models.CharField(max_length=15)

    # ── Status ─────────────────────────────────────────────────────────────────
    # Order tracking flow (NOT an approval system — payment already happened
    # before this row exists; this only tracks fulfillment progress):
    #   pending -> confirmed -> preparing -> out_for_delivery -> delivered
    # Cancellation is allowed from pending / confirmed / preparing only.
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
        db_index=True,
    )

    # ── Timestamp ──────────────────────────────────────────────────────────────
    ordered_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'medicine_orders'
        ordering = ['-ordered_at']

    def __str__(self):
        return (
            f'Order #{self.id} — {self.user.username} — '
            f'{self.medicine.name} x{self.quantity}'
        )

    def save(self, *args, **kwargs):
        """
        On first save only (new order):
        1. Validate that enough stock exists.
        2. Snapshot total_price from medicine.price × quantity.
        3. Deduct quantity from medicine.stock_quantity.
            The Medicine.save() override then recalculates stock_status
            automatically, so we don't need to touch that field here.
        """
        is_new = self._state.adding   # True only when the row doesn't exist yet

        if is_new:
            # Re-fetch medicine with a DB-level lock so two simultaneous orders
            # can't both pass the stock check on the same row
            from django.db import transaction
            with transaction.atomic():
                medicine = Medicine.objects.select_for_update().get(
                    pk=self.medicine_id
                )

                if self.quantity > medicine.stock_quantity:
                    from django.core.exceptions import ValidationError
                    raise ValidationError(
                        f'Only {medicine.stock_quantity} unit(s) in stock. '
                        f'You requested {self.quantity}.'
                    )

                # Snapshot the price so historical orders aren't affected
                # if the medicine price changes later
                self.total_price = medicine.price * self.quantity

                # Deduct stock — Medicine.save() updates stock_status automatically
                medicine.stock_quantity -= self.quantity
                medicine.save()

                super().save(*args, **kwargs)
                return  # already saved inside the transaction

        super().save(*args, **kwargs)