import { Navigate } from 'react-router-dom';

// useAuth hook
import { useAuth } from '../hooks/useAuth';

// PrivateRoute Component
const PrivateRoute = ({ children, role }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }
 
  return children;
};

export default PrivateRoute;
