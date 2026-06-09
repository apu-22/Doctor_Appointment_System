import { useNavigate } from 'react-router-dom';

// Unauthorized Page
const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.icon}>🚫</div>
        <h1 style={styles.title}>Access Denied</h1>
        <p style={styles.message}>
         You don't have permission to access this page. Please login with appropriate credentials or contact support if you believe this is an error.
        </p>
        <button onClick={() => navigate(-1)} style={styles.btn}>
          ← Go back to the previous page
        </button>
      </div>
    </div>
  );
};

// ─── Styles ───────────────────────────────────────────────────
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
    padding: '60px 40px',
    borderRadius: '10px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
    textAlign: 'center',
    maxWidth: '400px',
    width: '100%',
  },
  icon: {
    fontSize: '64px',
    marginBottom: '16px',
  },
  title: {
    fontSize: '26px',
    fontWeight: 'bold',
    color: '#222',
    marginBottom: '12px',
  },
  message: {
    fontSize: '15px',
    color: '#666',
    marginBottom: '28px',
    lineHeight: '1.6',
  },
  btn: {
    padding: '12px 24px',
    fontSize: '15px',
    fontWeight: '500',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default Unauthorized;
