# 🏥 Medical Equipment Rental & Pharmacy Management System

A full-stack healthcare web application built using **Django REST Framework** and **React.js**. The platform enables users to rent medical equipment, order medicines, make secure (mock) payments, track bookings, and receive rule-based recovery kit recommendations based on their medical condition.

---

# ✨ Features

## 🔐 Authentication
- User Registration
- User Login
- JWT Authentication
- Protected API Endpoints

---

## 🏥 Medical Equipment Rental
- Browse Medical Equipment
- View Equipment Details
- Rent Medical Equipment
- Equipment Availability Management
- My Bookings
- Booking Status Tracking
- Cancel Booking
- Return Equipment Request
- Admin Return Approval

---

## 💳 Payment Module
- Mock Payment Integration
- Payment Success Page
- Automatic Transaction ID Generation
- Booking Activation After Successful Payment

> **Note:** The project currently uses a mock payment flow for demonstration purposes. It can be integrated with Razorpay or Stripe in the future.

---

## 💊 Pharmacy Module

### User Features
- Browse Medicines
- View Medicine Details
- Search Medicines
- Order Medicines
- Medicine Images
- Stock Availability

### Admin Features
- Add Medicines
- Update Medicines
- Delete Medicines
- Manage Inventory

---

## 🤖 Rule-Based AI Recovery Kit Recommendation

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

## 🩺 Health Assistant

A simple rule-based health assistant that helps users receive basic recovery recommendations based on their selected condition.

---

## 📊 Admin Dashboard

Administrators can manage:

- Medical Equipment
- Equipment Stock
- Medicine Inventory
- Equipment Bookings
- Booking Status
- Recovery Kits

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

```
medical-equipment-rental-system/
│
├── authentication/
├── backend/
├── bookings/
├── dashboard/
├── frontend/
├── media/
├── notifications/
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
git clone https://github.com/shilnasheri-ux/medical-equipment-rental-system.git

cd medical-equipment-rental-system
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

Start Django Server

```bash
python manage.py runserver
```

Backend URL

```
http://127.0.0.1:8000/
```

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

After login the backend returns:

- Access Token
- Refresh Token

These tokens are required to access protected APIs.

---

# 💳 Payment Workflow

1. User books equipment.
2. User selects a payment method.
3. Payment record is created.
4. A unique transaction ID is generated.
5. Booking status becomes **Active**.
6. Payment Success page is displayed.

---

# 🤖 AI Recommendation

This project includes a **Rule-Based AI Recommendation System**.

The recommendation is generated using predefined rules based on the selected medical condition.

Each recommendation includes:

- Recommended Equipment
- Estimated Rental Cost
- Recovery Duration

---

# 📦 Main Python Packages

- Django
- Django REST Framework
- Simple JWT
- django-cors-headers
- Pillow

---

# 🚀 Future Enhancements

- Razorpay Payment Gateway
- Stripe Integration
- Email Notifications
- SMS Notifications
- Online Consultation
- Machine Learning Based Recommendations

---

# 📸 Screenshots

You can add screenshots after deployment.

Example:

- Home Page
- Equipment List
- Equipment Details
- Booking Page
- Payment Page
- Pharmacy
- Health Assistant
- Recovery Kit Recommendation
- Admin Dashboard

---

# 👩‍💻 Developer

**Shilna Sherin**

Python Full Stack Developer

**GitHub**

https://github.com/shilnasheri-ux

**LinkedIn**

https://www.linkedin.com/in/shilna-sherin-81b059364

---

# 📄 License

This project was developed for educational, internship, and portfolio purposes.