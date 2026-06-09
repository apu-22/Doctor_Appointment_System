import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Login Page Component
const Login = () => {

  // State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);

  // Hooks
  const { login } = useAuth();
  const navigate = useNavigate();

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({ ...prev, [name]: value }));

    if (error) setError('');
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError('input email and password');
      return;
    }

    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);

    setLoading(false);

    if (result.success) {
      if (result.user.role === 'patient') {
        navigate('/patient/dashboard');
      } else if (result.user.role === 'doctor') {
        navigate('/doctor/dashboard');
      } else if (result.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      setError(result.message);
    }
  };

  // JSX
  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* Title */}
        <h2 style={styles.title}>🏥 MediBook</h2>
        <p style={styles.subtitle}>Please login to your account</p>

        {/* Error Box — error */}
        {error && (
          <div style={styles.errorBox}>
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>

          {/* Email */}
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              style={styles.input}
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              style={styles.input}
              disabled={loading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{ ...styles.button, opacity: loading ? 0.6 : 1 }}
            disabled={loading}
          >
            {loading ? 'login is processing...' : 'please login'}
          </button>
        </form>

        {/* Register link */}
        <p style={styles.footer}>
          no account?{' '}
          <Link to="/register" style={styles.link}>please Register</Link>
        </p>
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
    maxWidth: '400px',
  },
  title: {
    fontSize: '26px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '6px',
    color: '#222',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#888',
    marginBottom: '24px',
  },
  errorBox: {
    backgroundColor: '#fff0f0',
    border: '1px solid #ffcccc',
    color: '#cc0000',
    padding: '12px',
    borderRadius: '6px',
    fontSize: '14px',
    marginBottom: '16px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#444',
  },
  input: {
    padding: '11px 14px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    outline: 'none',
    backgroundColor: '#fafafa',
  },
  button: {
    padding: '13px',
    fontSize: '15px',
    fontWeight: '600',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginTop: '4px',
  },
  footer: {
    marginTop: '22px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#666',
  },
  link: {
    color: '#2563eb',
    fontWeight: '500',
    textDecoration: 'none',
  },
};

export default Login;
