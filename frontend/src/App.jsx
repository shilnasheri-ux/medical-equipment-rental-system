import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';

import HomePage from './pages/HomePage';
import EquipmentListPage from './pages/EquipmentListPage';
import EquipmentDetailPage from './pages/EquipmentDetailPage';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import { AuthProvider } from './context/AuthContext';

import ProfilePage from './pages/ProfilePage';
import MyBookingsPage from './pages/MyBookingsPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import PharmacyPage from "./pages/PharmacyPage";
import MedicineDetailPage from "./pages/MedicineDetailPage";
import MedicineOrderPage from "./pages/MedicineOrderPage";
import RecoveryKitPage from "./pages/RecoveryKitPage";
import HealthAssistantPage from "./pages/HealthAssistantPage";
import BookingSuccessPage from "./pages/BookingSuccessPage";
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import ReturnEquipmentPage from "./pages/ReturnEquipmentPage";
import AdminEquipmentPage from "./pages/AdminEquipmentPage";
import AdminBookingsPage from "./pages/AdminBookingsPage";
import AdminMedicinePage from "./pages/AdminMedicinePage";

function App() {
  return (
    <AuthProvider>
      <Router>

        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route
            path="/equipment"
            element={<EquipmentListPage />}
          />

          <Route
            path="/equipment/:id"
            element={<EquipmentDetailPage />}
          />

          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="/register"
            element={<RegisterPage />}
          />

          <Route
            path="/profile"
            element={<ProfilePage />}
          />


          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookingsPage />
              </ProtectedRoute>
            }
            />

            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
             path="/pharmacy" 
             element={
             <PharmacyPage />
            } 
             />

             <Route
              path="/pharmacy/:id"
              element={<MedicineDetailPage />}
            />

            <Route
              path="/pharmacy/:id/order"
              element={<MedicineOrderPage />}
            />

          <Route
            path="/recovery-kit"
            element={<RecoveryKitPage />}
          />

          <Route
            path="/health-assistant"
            element={<HealthAssistantPage />}
          />

          <Route
            path="/booking-success"
            element={<BookingSuccessPage />}
          />

          <Route
            path="/payment/:bookingId"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment-success"
            element={
              <ProtectedRoute>
                <PaymentSuccessPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/order-tracking/:bookingId"
            element={
              <ProtectedRoute>
                <OrderTrackingPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/return-equipment/:bookingId"
            element={
              <ProtectedRoute>
                <ReturnEquipmentPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/equipment"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminEquipmentPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminBookingsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/medicines"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminMedicinePage />
              </ProtectedRoute>
            }
          />

        </Routes>
        
          <ToastContainer
            position="top-right"
            autoClose={4000}
          />

      </Router>
    </AuthProvider>
  );
}

export default App;