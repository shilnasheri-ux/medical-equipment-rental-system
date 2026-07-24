# 🏥 Medical Equipment Rental & Pharmacy Management System

A full-stack healthcare web application built using **Django REST Framework** and **React.js**. The system allows users to rent medical equipment, order medicines, and receive rule-based recovery kit recommendations based on their medical condition.

---

# 📌 Features

## 🔐 Authentication
- User Registration
- User Login
- JWT Authentication
- Protected API Endpoints

---

## 🏥 Medical Equipment Module
- Browse available medical equipment
- View equipment details
- Book equipment rentals
- Track equipment bookings
- Equipment availability management

---

## 💊 Pharmacy Module
- View available medicines
- Search medicines
- Order medicines
- Medicine image support
- Stock status display

### Admin Features
- Add new medicines
- Edit medicine details
- Delete medicines
- Manage medicine inventory

---

## 🤖 Rule-Based AI Recovery Kit Recommendation

The system recommends a recovery kit based on the selected medical condition.

Supported Conditions:

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

## 📊 Admin Dashboard

Administrators can manage:

- Medical Equipment
- Medicine Inventory
- Equipment Bookings
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
medical-equipment-django/
│
├── authentication/
├── backend/
├── booking/
├── dashboard/
├── frontend/
├── media/
├── notifications/
├── pharmacy/
├── rental/
│
├── db.sqlite3
├── manage.py
├── requirements.txt
└── README.md
```

---

# ⚙️ Installation

## 1. Clone Repository

```bash
git clone <repository-url>
cd medical-equipment-django
```

---

## 2. Backend Setup

Install dependencies

```bash
pip install -r requirements.txt
```

Apply migrations

```bash
python manage.py migrate
```

Run Django Server

```bash
python manage.py runserver
```

Backend runs at:

```
http://127.0.0.1:8000/
```

---

## 3. Frontend Setup

Open another terminal

```bash
cd frontend
```

Install packages

```bash
npm install
```

Start React

```bash
npm start
```

Frontend runs at:

```
http://localhost:3000/
```

---

# 🔑 API Authentication

The project uses **JWT Authentication**.

After login, the backend returns:

- Access Token
- Refresh Token

These tokens are used to access protected APIs.

---

# 🤖 AI Recommendation

This project includes a **Rule-Based AI Recommendation System**.

Users select their medical condition, and the application recommends:

- Suitable Medical Equipment
- Estimated Rental Cost
- Expected Recovery Period

This feature is implemented using predefined rule-based logic.

---

# 📦 Python Packages

Dependencies are listed in **requirements.txt**.

Main packages include:

- Django
- Django REST Framework
- django-cors-headers
- Simple JWT
- Pillow

---

# 📸 Screenshots

Screenshots can be added here in future.

Example:

```
Home Page

Equipment List

Medicine Management

Recovery Kit Recommendation
```

---

# 👩‍💻 Developer

**Shilna Sherin**

Python Full Stack Developer

---

# 📄 License

This project was developed for educational and internship purposes.