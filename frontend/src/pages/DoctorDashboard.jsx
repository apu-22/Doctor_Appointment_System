import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Doctor Dashboard
const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h1 style={styles.title}>Doctor Dashboard</h1>
        <p style={styles.welcome}>welcome, Dr. {user?.name}! 🩺</p>

        {/* User Info */}
        <div style={styles.infoBox}>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Phone:</strong> {user?.phone || 'Not provided'}</p>
          <p><strong>Role:</strong> {user?.role}</p>
        </div>

        {/* Placeholder note */}
        <div style={styles.noteBox}>
          📌 Step 4: slot creation, slot blocking
          <br />
          📌 Step 5: today's patient queue, status update
        </div>

        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </div>
  );
};

//Styles
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    padding: '20px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '500px',
    textAlign: 'center',
  },
  title: {
    fontSize: '26px',
    fontWeight: 'bold',
    color: '#222',
    marginBottom: '8px',
  },
  welcome: {
    fontSize: '16px',
    color: '#555',
    marginBottom: '24px',
  },
  infoBox: {
    backgroundColor: '#f8f9fa',
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'left',
    marginBottom: '20px',
    lineHeight: '2',
    fontSize: '14px',
    color: '#444',
  },
  noteBox: {
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '8px',
    padding: '14px',
    fontSize: '14px',
    color: '#15803d',
    marginBottom: '24px',
    lineHeight: '1.8',
  },
  logoutBtn: {
    padding: '12px 28px',
    fontSize: '15px',
    fontWeight: '600',
    backgroundColor: '#dc2626',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default DoctorDashboard;
