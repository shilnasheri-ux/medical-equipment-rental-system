# 🏥 Medical Equipment Rental & Pharmacy Management System

A full-stack healthcare management platform built using **Django REST Framework** and **React.js**.

The system allows users to rent medical equipment, order medicines, make secure (mock) payments, track bookings, monitor medicine orders, receive rule-based recovery kit recommendations, and enables administrators to manage equipment, medicines, bookings, inventory, and medicine orders through a centralized admin dashboard.

---

# 🚀 Live Demo

**Frontend:**  
https://medical-equipment-rental-system-68u.vercel.app/

**Backend API:**  
https://shilnasherin.pythonanywhere.com/

---

# ✨ Features

## 🔐 Authentication

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Role-based Access (User / Admin)

---

# 🏥 Medical Equipment Rental

### User Features

- Browse Medical Equipment
- View Equipment Details
- Equipment Availability Status
- Book Medical Equipment
- My Bookings
- Booking Status Tracking
- Order Tracking
- Mock Payment Integration
- Payment Success Page
- Return Equipment Request

### Admin Features

- Add Equipment
- Edit Equipment
- Delete Equipment
- Manage Equipment Stock
- View Equipment Bookings
- Approve Equipment Returns

---

# 💊 Pharmacy Module

### User Features

- Browse Medicines
- View Medicine Details
- Search Medicines
- Order Medicines
- Medicine Images
- Stock Availability
- Mock Payment for Medicine Orders

### Admin Features

- Add Medicines
- Update Medicines
- Delete Medicines
- Manage Medicine Inventory
- View All Medicine Orders
- Mark Orders as Delivered
- Cancel Orders

---

# 💳 Payment Module

- Mock Payment Integration
- Equipment Payment
- Medicine Payment
- Automatic Transaction ID Generation
- Payment Success Page
- Booking Activation After Successful Payment

> **Note:** This project currently uses a mock payment workflow for demonstration purposes. It can easily be integrated with Razorpay or Stripe in the future.

---

# 🤖 Rule-Based Recovery Kit Recommendation

The application recommends a recovery kit based on the selected medical condition.

### Supported Conditions

- Knee Surgery
- Hip Surgery
- Leg Fracture
- Elderly Care
- Respiratory Problems
- Back Pain

Each recommendation includes:

- Recommended Medical Equipment
- Estimated Rental Cost
- Estimated Recovery Duration

---

# 🩺 Health Assistant

A simple rule-based health assistant that provides recovery suggestions based on the user's selected medical condition.

---

# 📊 Admin Dashboard

Administrators can manage:

- Medical Equipment
- Equipment Stock
- Medicine Inventory
- Equipment Bookings
- Medicine Orders
- Booking Status
- Return Requests
- Recovery Kits

The dashboard also provides stock summary cards showing:

- Total Stock
- Reserved Stock
- Active Stock
- Available Stock

---

# 🛠 Tech Stack

## Backend

- Python
- Django
- Django REST Framework
- JWT Authentication
- SQLite

## Frontend

- React.js
- Bootstrap 5
- Axios
- React Router DOM

---

# 📂 Project Structure

```text
medical-equipment-django/
│
├── authentication/
├── bookings/
├── frontend/
├── media/
├── payments/
├── pharmacy/
├── rental/
│
├── manage.py
├── requirements.txt
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/shilnasheri-ux/medical-equipment-django.git

cd medical-equipment-django
```

---

## Backend Setup

Install dependencies

```bash
pip install -r requirements.txt
```

Run migrations

```bash
python manage.py migrate
```

Create Superuser (Optional)

```bash
python manage.py createsuperuser
```

Start Django Server

```bash
python manage.py runserver
```

Local Backend URL

http://127.0.0.1:8000/

---

Backend URL

https://shilnasherin.pythonanywhere.com/

---

## Frontend Setup

Open another terminal

```bash
cd frontend

npm install

npm start
```

Frontend URL

```
http://localhost:3000/
```

---

# 🔐 Authentication

JWT Authentication is used for secure login.

After successful login the backend returns:

- Access Token
- Refresh Token

These tokens are required to access protected APIs.

---

# 💳 Payment Workflow

### Equipment Booking

1. User books equipment.
2. User proceeds to payment.
3. Mock payment is completed.
4. Transaction ID is generated.
5. Booking becomes Active.
6. Payment Success page is displayed.

### Medicine Order

1. User places medicine order.
2. Mock payment is completed.
3. Order is created.
4. Admin manages delivery status.

---

# 🤖 Recovery Kit Recommendation

The application includes a **Rule-Based Recommendation System**.

Recommendations are generated using predefined rules based on the selected medical condition.

Each recommendation includes:

- Recommended Equipment
- Estimated Rental Cost
- Estimated Recovery Duration

---

# 📦 Main Python Packages

- Django
- Django REST Framework
- djangorestframework-simplejwt
- django-cors-headers
- Pillow

---

# 🚀 Future Enhancements

- Razorpay Payment Gateway
- Stripe Payment Integration
- Email Notifications
- SMS Notifications
- AI Chatbot
- Machine Learning Based Recommendations
- PDF Invoice Generation
- Online Consultation

---

# 👩‍💻 Developer

**Shilna Sherin**

Python Full Stack Developer

### GitHub

[GitHub Profile](https://github.com/shilnasheri-ux)

### LinkedIn

[LinkedIn Profile](https://www.linkedin.com/in/shilna-sherin-81b059364)

---

# 📄 License

This project was developed for educational, internship, and portfolio purposes.