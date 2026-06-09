import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setupProfile } from '../api/doctorApi';

// Doctor Profile Setup
const DoctorProfileSetup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    specialty: '',
    bio: '',
    fee: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (error) setError('');
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.specialty || !formData.fee) {
      setError('Specialty and consultation fee are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await setupProfile({
        specialty: formData.specialty,
        bio: formData.bio,
        fee: parseFloat(formData.fee),
      });

      navigate('/doctor/slots');

    } catch (err) {
      const message =
        err.response?.data?.message || 'Something went wrong';

      setError(message);

    } finally {
      setLoading(false);
    }
  };

  // Render the component
  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h1 style={styles.title}>
          🩺 Doctor Profile Setup
        </h1>

        <p style={styles.subtitle}>
          You only need to set this up once
        </p>

        {error && (
          <div style={styles.errorBox}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>

          <div style={styles.field}>
            <label style={styles.label}>
              Specialty *
            </label>

            <select
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              style={styles.input}
              disabled={loading}
            >
              <option value="">
                Select Specialty
              </option>

              <option value="General Physician">
                General Physician
              </option>

              <option value="Cardiology">
                Cardiology
              </option>

              <option value="Dermatology">
                Dermatology
              </option>

              <option value="Orthopedics">
                Orthopedics
              </option>

              <option value="Pediatrics">
                Pediatrics
              </option>

              <option value="Gynecology">
                Gynecology
              </option>

              <option value="Neurology">
                Neurology
              </option>

              <option value="Ophthalmology">
                Ophthalmology
              </option>

              <option value="ENT">
                ENT
              </option>

              <option value="Dentistry">
                Dentistry
              </option>
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>
              Consultation Fee (BDT) *
            </label>

            <input
              type="number"
              name="fee"
              value={formData.fee}
              onChange={handleChange}
              placeholder="Example: 500"
              style={styles.input}
              disabled={loading}
              min="0"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>
              Bio (Optional)
            </label>

            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Write something about yourself..."
              style={{
                ...styles.input,
                height: '100px',
                resize: 'vertical'
              }}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            style={{
              ...styles.button,
              opacity: loading ? 0.6 : 1
            }}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

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
    maxWidth: '480px',
  },

  title: {
    fontSize: '24px',
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
    width: '100%',
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
};

export default DoctorProfileSetup;