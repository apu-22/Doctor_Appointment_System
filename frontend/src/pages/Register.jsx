import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

//Register Page 
const Register = () => {

  //State 
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'patient',      
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Hooks 
  const { register } = useAuth();
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

    // validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('name, email and password are required');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
 
    //
    const result = await register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      role: formData.role,
      password: formData.password,
    });

    setLoading(false);

    if (result.success) {
      if (result.user.role === 'patient') {
        navigate('/patient/dashboard');
      } else if (result.user.role === 'doctor') {
        navigate('/doctor/dashboard');
      } else {
        navigate('/');
      }
    } else {
      setError(result.message);
    }
  };

  //JSX
  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h2 style={styles.title}>🏥 MediBook</h2>
        <p style={styles.subtitle}>create a new account</p>

        {error && (
          <div style={styles.errorBox}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>

          {/* Name */}
          <div style={styles.field}>
            <label style={styles.label}>Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              style={styles.input}
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div style={styles.field}>
            <label style={styles.label}>Email *</label>
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

          {/* Phone */}
          <div style={styles.field}>
            <label style={styles.label}>Phone Number (optional)</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="01XXXXXXXXX"
              style={styles.input}
              disabled={loading}
            />
          </div>

          {/* Role */}
          <div style={styles.field}>
            <label style={styles.label}>Account type *</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={styles.input}
              disabled={loading}
            >
              <option value="patient">Patient (patient)</option>
              <option value="doctor">Doctor (doctor)</option>
            </select>
          </div>

          {/* Password */}
          <div style={styles.field}>
            <label style={styles.label}>Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="min 6 characters"
              style={styles.input}
              disabled={loading}
            />
          </div>

          {/* Confirm Password */}
          <div style={styles.field}>
            <label style={styles.label}>Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="write again"
              style={styles.input}
              disabled={loading}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            style={{ ...styles.button, opacity: loading ? 0.6 : 1 }}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Login</Link>
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
    maxWidth: '450px',
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
    gap: '16px',
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
    backgroundColor: '#16a34a',
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

export default Register;
