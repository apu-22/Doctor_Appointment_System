import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  getTodayQueue,
  updateAppointmentStatus
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

// Next status action button
const NEXT_STATUS = {
  pending: {
    label: 'Confirm',
    next: 'confirmed'
  },

  confirmed: {
    label: 'Start',
    next: 'in_progress'
  },

  in_progress: {
    label: 'Complete',
    next: 'completed'
  },
};

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchTodayQueue();
  }, []);

  const fetchTodayQueue = async () => {
    try {
      setLoading(true);

      const data = await getTodayQueue();

      setAppointments(data.appointments);

    } catch (err) {

      // Redirect if doctor profile does not exist
      if (err.response?.status === 404) {
        navigate('/doctor/profile-setup');

      } else {
        setError('Failed to load today’s queue');
      }

    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      setError('');

      await updateAppointmentStatus(id, newStatus);

      setSuccess('Status updated successfully');

      fetchTodayQueue();

    } catch (err) {
      setError('Failed to update status');
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

  const todayFormatted = new Date().toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
  );

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>

        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>
              🩺 Doctor Dashboard
            </h1>

            <p style={styles.subtitle}>
              Dr. {user?.name} | Today: {todayFormatted}
            </p>
          </div>

          <div style={styles.headerActions}>
            <button
              onClick={() => navigate('/doctor/slots')}
              style={styles.slotsBtn}
            >
              🗓️ Slots
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
            Today’s Patient Queue ({appointments.length})
          </h2>

          {loading ? (
            <p style={styles.centerText}>
              Loading...
            </p>

          ) : appointments.length === 0 ? (
            <div style={styles.emptyBox}>
              No appointments today 🎉
            </div>

          ) : (
            appointments.map((appt, index) => (
              <div
                key={appt.id}
                style={styles.apptCard}
              >

                <div style={styles.queueNum}>
                  {index + 1}
                </div>

                <div style={styles.apptInfo}>
                  <div style={styles.patientName}>
                    {appt.patient_name}
                  </div>

                  <div style={styles.patientContact}>
                    📞 {appt.patient_phone || 'N/A'} |
                    ✉️ {appt.patient_email}
                  </div>

                  <div style={styles.apptTime}>
                    🕐 {formatTime(appt.start_time)} —{' '}
                    {formatTime(appt.end_time)}
                  </div>

                  {appt.notes && (
                    <div style={styles.apptNotes}>
                      📝 {appt.notes}
                    </div>
                  )}
                </div>

                <div style={styles.apptActions}>
                  <span
                    style={{
                      ...styles.statusBadge,
                      backgroundColor:
                        STATUS_CONFIG[appt.status]?.bg,
                      color:
                        STATUS_CONFIG[appt.status]?.color,
                    }}
                  >
                    {STATUS_CONFIG[appt.status]?.label}
                  </span>

                  {NEXT_STATUS[appt.status] && (
                    <button
                      onClick={() =>
                        handleStatusUpdate(
                          appt.id,
                          NEXT_STATUS[appt.status].next
                        )
                      }
                      style={styles.nextStatusBtn}
                    >
                      {NEXT_STATUS[appt.status].label}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={styles.statNum}>
              {
                appointments.filter(
                  a => a.status === 'pending'
                ).length
              }
            </div>

            <div style={styles.statLabel}>
              Pending
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statNum}>
              {
                appointments.filter(
                  a => a.status === 'confirmed'
                ).length
              }
            </div>

            <div style={styles.statLabel}>
              Confirmed
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statNum}>
              {
                appointments.filter(
                  a => a.status === 'completed'
                ).length
              }
            </div>

            <div style={styles.statLabel}>
              Completed
            </div>
          </div>
        </div>
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

  slotsBtn: {
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
    fontSize: '15px',
  },

  apptCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
    padding: '14px 16px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    marginBottom: '10px',
  },

  queueNum: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#2563eb',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '14px',
    flexShrink: 0,
  },

  apptInfo: {
    flex: 1,
  },

  patientName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#222',
  },

  patientContact: {
    fontSize: '12px',
    color: '#888',
    marginTop: '3px',
  },

  apptTime: {
    fontSize: '13px',
    color: '#555',
    marginTop: '5px',
  },

  apptNotes: {
    fontSize: '12px',
    color: '#888',
    marginTop: '4px',
    fontStyle: 'italic',
  },

  apptActions: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '8px',
    flexShrink: 0,
  },

  statusBadge: {
    fontSize: '12px',
    fontWeight: '600',
    padding: '3px 10px',
    borderRadius: '99px',
    whiteSpace: 'nowrap',
  },

  nextStatusBtn: {
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: '500',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },

  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
  },

  statCard: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow:
      '0 2px 8px rgba(0,0,0,0.08)',
    textAlign: 'center',
  },

  statNum: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#2563eb',
  },

  statLabel: {
    fontSize: '13px',
    color: '#888',
    marginTop: '4px',
  },
};

export default DoctorDashboard;