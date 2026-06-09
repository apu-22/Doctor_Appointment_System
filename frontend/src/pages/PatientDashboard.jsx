import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';

import {
  getMyAppointments,
  cancelAppointment
} from '../api/appointmentApi';

const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    bg: '#fef9c3',
    color: '#854d0e'
  },

  confirmed: {
    label: 'Confirmed',
    bg: '#dbeafe',
    color: '#1e40af'
  },

  in_progress: {
    label: 'In Progress',
    bg: '#e0e7ff',
    color: '#3730a3'
  },

  completed: {
    label: 'Completed',
    bg: '#dcfce7',
    color: '#166534'
  },

  cancelled: {
    label: 'Cancelled',
    bg: '#fee2e2',
    color: '#991b1b'
  },
};

const PatientDashboard = () => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const data = await getMyAppointments();

      setAppointments(data.appointments);

    } catch (err) {
      setError('Failed to load appointments');

    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (
      !window.confirm(
        'Do you want to cancel this appointment?'
      )
    ) {
      return;
    }

    try {
      setError('');

      await cancelAppointment(id);

      setSuccess(
        'Appointment cancelled successfully'
      );

      fetchAppointments();

    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to cancel appointment'
      );
    }
  };

  const handleLogout = () => {
    logout();

    navigate('/login');
  };

  const formatTime = (time) => {
    if (!time) return '';

    const [hours, minutes] = time.split(':');

    const h = parseInt(hours);

    const ampm = h >= 12 ? 'PM' : 'AM';

    const displayH =
      h > 12 ? h - 12 : h === 0 ? 12 : h;

    return `${displayH}:${minutes} ${ampm}`;
  };

  // Split appointments into upcoming and past
  const today = new Date()
    .toISOString()
    .split('T')[0];

  const upcoming = appointments.filter(
    (a) =>
      a.appt_date >= today &&
      a.status !== 'cancelled'
  );

  const past = appointments.filter(
    (a) =>
      a.appt_date < today ||
      a.status === 'cancelled' ||
      a.status === 'completed'
  );

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>

        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>
              Patient Dashboard
            </h1>

            <p style={styles.subtitle}>
              Welcome, {user?.name}!
            </p>
          </div>

          <div style={styles.headerActions}>
            <button
              onClick={() => navigate('/book')}
              style={styles.bookBtn}
            >
              + Book Appointment
            </button>

            <button
              onClick={handleLogout}
              style={styles.logoutBtn}
            >
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div style={styles.errorBox}>
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div style={styles.successBox}>
            ✅ {success}
          </div>
        )}

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            📅 Upcoming Appointments (
            {upcoming.length})
          </h2>

          {loading ? (
            <p style={styles.centerText}>
              Loading...
            </p>

          ) : upcoming.length === 0 ? (
            <div style={styles.emptyBox}>
              <p>
                No upcoming appointments found.
              </p>

              <button
                onClick={() => navigate('/book')}
                style={styles.bookBtn}
              >
                Book Appointment Now
              </button>
            </div>

          ) : (
            upcoming.map((appt) => (
              <div
                key={appt.id}
                style={styles.apptCard}
              >
                <div style={styles.apptLeft}>
                  <div style={styles.apptDoctor}>
                    Dr. {appt.doctor_name}
                  </div>

                  <div style={styles.apptSpecialty}>
                    {appt.specialty}
                  </div>

                  <div style={styles.apptDateTime}>
                    📅 {
                      new Date(
                        appt.appt_date
                      ).toLocaleDateString(
                        'en-US',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }
                      )
                    }

                    &nbsp;|&nbsp;

                    🕐 {
                      formatTime(
                        appt.start_time
                      )
                    }
                  </div>

                  {appt.notes && (
                    <div style={styles.apptNotes}>
                      📝 {appt.notes}
                    </div>
                  )}
                </div>

                <div style={styles.apptRight}>
                  <span
                    style={{
                      ...styles.statusBadge,
                      backgroundColor:
                        STATUS_CONFIG[
                          appt.status
                        ]?.bg,

                      color:
                        STATUS_CONFIG[
                          appt.status
                        ]?.color,
                    }}
                  >
                    {
                      STATUS_CONFIG[
                        appt.status
                      ]?.label
                    }
                  </span>

                  <div style={styles.apptFee}>
                    ৳ {appt.fee}
                  </div>

                  {appt.status === 'pending' && (
                    <button
                      onClick={() =>
                        handleCancel(appt.id)
                      }
                      style={styles.cancelBtn}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {past.length > 0 && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>
              🕐 Past Appointments (
              {past.length})
            </h2>

            {past.map((appt) => (
              <div
                key={appt.id}
                style={{
                  ...styles.apptCard,
                  opacity: 0.7
                }}
              >
                <div style={styles.apptLeft}>
                  <div style={styles.apptDoctor}>
                    Dr. {appt.doctor_name}
                  </div>

                  <div style={styles.apptSpecialty}>
                    {appt.specialty}
                  </div>

                  <div style={styles.apptDateTime}>
                    📅 {
                      new Date(
                        appt.appt_date
                      ).toLocaleDateString(
                        'en-US',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }
                      )
                    }
                  </div>
                </div>

                <div style={styles.apptRight}>
                  <span
                    style={{
                      ...styles.statusBadge,
                      backgroundColor:
                        STATUS_CONFIG[
                          appt.status
                        ]?.bg,

                      color:
                        STATUS_CONFIG[
                          appt.status
                        ]?.color,
                    }}
                  >
                    {
                      STATUS_CONFIG[
                        appt.status
                      ]?.label
                    }
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    padding: '20px',
  },

  wrapper: {
    maxWidth: '720px',
    margin: '0 auto',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '12px',
  },

  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#222',
    marginBottom: '4px',
  },

  subtitle: {
    fontSize: '14px',
    color: '#888',
  },

  headerActions: {
    display: 'flex',
    gap: '10px',
  },

  bookBtn: {
    padding: '10px 18px',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },

  logoutBtn: {
    padding: '10px 18px',
    backgroundColor: '#dc2626',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },

  errorBox: {
    backgroundColor: '#fff0f0',
    border: '1px solid #ffcccc',
    color: '#cc0000',
    padding: '12px',
    borderRadius: '6px',
    fontSize: '14px',
    marginBottom: '16px',
  },

  successBox: {
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    color: '#15803d',
    padding: '12px',
    borderRadius: '6px',
    fontSize: '14px',
    marginBottom: '16px',
  },

  card: {
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '10px',
    boxShadow:
      '0 2px 8px rgba(0,0,0,0.08)',
    marginBottom: '20px',
  },

  cardTitle: {
    fontSize: '17px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '16px',
  },

  centerText: {
    textAlign: 'center',
    color: '#888',
    fontSize: '14px',
    padding: '20px 0',
  },

  emptyBox: {
    textAlign: 'center',
    padding: '30px 0',
    color: '#888',
    fontSize: '14px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },

  apptCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '14px 16px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    marginBottom: '10px',
    gap: '12px',
  },

  apptLeft: {
    flex: 1,
  },

  apptDoctor: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#222',
  },

  apptSpecialty: {
    fontSize: '13px',
    color: '#2563eb',
    marginTop: '2px',
  },

  apptDateTime: {
    fontSize: '13px',
    color: '#666',
    marginTop: '6px',
  },

  apptNotes: {
    fontSize: '12px',
    color: '#888',
    marginTop: '4px',
  },

  apptRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '6px',
    flexShrink: 0,
  },

  statusBadge: {
    fontSize: '12px',
    fontWeight: '600',
    padding: '3px 10px',
    borderRadius: '99px',
  },

  apptFee: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#16a34a',
  },

  cancelBtn: {
    padding: '5px 12px',
    fontSize: '12px',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    border: '1px solid #fca5a5',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: '500',
  },
};

export default PatientDashboard;