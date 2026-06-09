import { Routes, Route, Navigate } from 'react-router-dom';

// Component
import PrivateRoute from '../components/PrivateRoute';

// Pages
import Login from '../pages/Login';
import Register from '../pages/Register';
import PatientDashboard from '../pages/PatientDashboard';
import DoctorDashboard from '../pages/DoctorDashboard';
import Unauthorized from '../pages/Unauthorized';

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

      {/* ── 404  */}
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  );
};

export default AppRoutes;
