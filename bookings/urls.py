from django.urls import path
from .views import (
    my_bookings_view,
    create_booking_view,
    cancel_booking_view,
    booking_detail_view,
    admin_bookings_view,
    update_booking_status_view,
    mark_notification_read,
    request_return_view,
    complete_return_view,
    create_payment_view,
)

app_name = 'bookings'

urlpatterns = [
    path(
        'my-bookings/',
        my_bookings_view,
        name='my-bookings',
    ),

    path(
        'create/',
        create_booking_view,
        name='create',
    ),

    path(
        '<int:pk>/',
        booking_detail_view,
        name='detail',
    ),

    path(
        '<int:pk>/cancel/',
        cancel_booking_view,
        name='cancel',
    ),
    
    path(
        "admin/",
        admin_bookings_view,
        name="admin-bookings",
    ),
    
    path(
        '<int:pk>/status/',
        update_booking_status_view,
        name='update-status',
    ),
    
    path(
        "<int:pk>/mark-notification-read/",
        mark_notification_read,
        name="mark-notification-read",
    ),

    path(
        "<int:pk>/request-return/",
        request_return_view,
        name="request-return",
    ),

    path(
        "<int:pk>/complete-return/",
        complete_return_view,
        name="complete-return",
    ),
    
    path(
        "payments/create/",
        create_payment_view,
        name="create-payment",
    ),
]