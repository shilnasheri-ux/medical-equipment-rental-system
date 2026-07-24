from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from django.db.models import Count, Sum

from rental.models import Equipment      # adjust import to match your app name
from bookings.models import Booking


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_dashboard_view(request):
    equipment_counts = (
        Equipment.objects
        .values('availability_status')
        .annotate(count=Count('id'))
    )

    # Convert the list into a lookup dict keyed by status string
    # so individual values are O(1) to retrieve below
    eq_map = {row['availability_status']: row['count'] for row in equipment_counts}

    total_equipment       = sum(eq_map.values())
    available_equipment   = eq_map.get('available', 0)
    under_maintenance     = eq_map.get('under_maintenance', 0)
    out_of_stock          = eq_map.get('out_of_stock', 0)

    # ── Booking counts ────────────────────────────────────────────────────────
    # Same pattern — one query, grouped by status
    booking_counts = (
        Booking.objects
        .values('status')
        .annotate(count=Count('id'))
    )

    bk_map = {row['status']: row['count'] for row in booking_counts}

    total_bookings     = sum(bk_map.values())
    pending_bookings   = bk_map.get('pending',   0)
    confirmed_bookings = bk_map.get('confirmed', 0)
    active_bookings    = bk_map.get('active',    0)
    returned_bookings  = bk_map.get('returned',  0)
    cancelled_bookings = bk_map.get('cancelled', 0)

    # ── User count ────────────────────────────────────────────────────────────
    total_users = User.objects.count()

    # ── Stock summary ─────────────────────────────────────────────────────────
    # Total Stock: sum of stock across all equipment.
    # Reserved: confirmed bookings (holding stock, awaiting delivery).
    # Active: bookings currently out with the customer.
    # Available: Stock - Reserved - Active
    total_stock = Equipment.objects.aggregate(total=Sum('stock'))['total'] or 0
    reserved_stock = confirmed_bookings
    active_stock = active_bookings
    available_stock = total_stock - reserved_stock - active_stock

    # ── Response ──────────────────────────────────────────────────────────────
    return Response({
        'equipment': {
            'total':            total_equipment,
            'available':        available_equipment,
            'under_maintenance': under_maintenance,
            'out_of_stock':     out_of_stock,
        },
        'bookings': {
            'total':     total_bookings,
            'pending':   pending_bookings,
            'confirmed': confirmed_bookings,
            'active':    active_bookings,
            'returned':  returned_bookings,
            'cancelled': cancelled_bookings,
        },
        'users': {
            'total': total_users,
        },
        'stock': {
            'total_stock': total_stock,
            'reserved':    reserved_stock,
            'active':      active_stock,
            'available':   available_stock,
        },
    })