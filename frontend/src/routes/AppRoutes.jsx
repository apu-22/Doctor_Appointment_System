import { Routes, Route, Navigate } from "react-router-dom";

// Component
import PrivateRoute from "../components/PrivateRoute";
import DoctorProfileSetup from "../pages/DoctorProfileSetup";
import SlotManager from "../pages/SlotManager";
import PatientBooking from "../pages/PatientBooking";

// Pages
import Login from "../pages/Login";
import Register from "../pages/Register";
import PatientDashboard from "../pages/PatientDashboard";
import DoctorDashboard from "../pages/DoctorDashboard";
import Unauthorized from "../pages/Unauthorized";

// AppRoutes Component
const AppRoutes = () => {
  return (
    <Routes>
      {/* ── Public Routes  */}

      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* ── Protected Routes  */}

      {/* Patient Dashboard */}
      <Route
        path="/patient/dashboard"
        element={
          <PrivateRoute role="patient">
            <PatientDashboard />
          </PrivateRoute>
        }
      />

      {/* Doctor Dashboard */}
      <Route
        path="/doctor/dashboard"
        element={
          <PrivateRoute role="doctor">
            <DoctorDashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/doctor/profile-setup"
        element={
          <PrivateRoute role="doctor">
            <DoctorProfileSetup />
          </PrivateRoute>
        }
      />

      <Route
        path="/doctor/slots"
        element={
          <PrivateRoute role="doctor">
            <SlotManager />
          </PrivateRoute>
        }
      />

      <Route
        path="/book"
        element={
          <PrivateRoute role="patient">
            <PatientBooking />
          </PrivateRoute>
        }
      />

      {/* ── 404  */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
