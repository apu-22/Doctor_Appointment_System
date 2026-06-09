import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getMySlots,
  createSlot,
  blockSlot,
  unblockSlot,
  deleteSlot
} from '../api/doctorApi';

const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

// Slot Management
const SlotManager = () => {
  const navigate = useNavigate();

  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [newSlot, setNewSlot] = useState({
    day_of_week: '1',
    start_time: '09:00',
    end_time: '10:00',
    max_patients: '10',
  });

  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const data = await getMySlots();
      setSlots(data.slots);
    } catch (err) {
      setError('Failed to load slots');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSlot = async (e) => {
    e.preventDefault();

    setFormLoading(true);
    setError('');
    setSuccess('');

    try {
      await createSlot({
        day_of_week: parseInt(newSlot.day_of_week),
        start_time: newSlot.start_time + ':00',
        end_time: newSlot.end_time + ':00',
        max_patients: parseInt(newSlot.max_patients),
      });

      setSuccess('New slot created successfully');
      fetchSlots();

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create slot');
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleBlock = async (slot) => {
    try {
      setError('');

      if (slot.is_blocked) {
        await unblockSlot(slot.id);
        setSuccess('Slot unblocked');
      } else {
        await blockSlot(slot.id);
        setSuccess('Slot blocked');
      }

      fetchSlots();

    } catch (err) {
      setError('Something went wrong');
    }
  };

  // Slot delete handler
  const handleDelete = async (slotId) => {
    if (!window.confirm('Are you sure you want to delete this slot?')) return;

    try {
      setError('');
      await deleteSlot(slotId);

      setSuccess('Slot deleted successfully');
      fetchSlots();

    } catch (err) {
      setError('Failed to delete slot');
    }
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');

    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;

    return `${displayH}:${minutes} ${ampm}`;
  };

  const slotsByDay = DAY_NAMES.reduce((acc, day, index) => {
    acc[index] = slots.filter(s => s.day_of_week === index);
    return acc;
  }, {});

  // Render slots by day
  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>

        <div style={styles.header}>
          <h1 style={styles.title}>🗓️ Slot Management</h1>

          <button
            onClick={() => navigate('/doctor/dashboard')}
            style={styles.backBtn}
          >
            ← Dashboard
          </button>
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
          <h2 style={styles.cardTitle}>Add New Slot</h2>

          <form onSubmit={handleCreateSlot} style={styles.form}>

            <div style={styles.field}>
              <label style={styles.label}>Day</label>

              <select
                value={newSlot.day_of_week}
                onChange={e =>
                  setNewSlot(p => ({
                    ...p,
                    day_of_week: e.target.value
                  }))
                }
                style={styles.input}
              >
                {DAY_NAMES.map((day, i) => (
                  <option key={i} value={i}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Start Time</label>

              <input
                type="time"
                value={newSlot.start_time}
                onChange={e =>
                  setNewSlot(p => ({
                    ...p,
                    start_time: e.target.value
                  }))
                }
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>End Time</label>

              <input
                type="time"
                value={newSlot.end_time}
                onChange={e =>
                  setNewSlot(p => ({
                    ...p,
                    end_time: e.target.value
                  }))
                }
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Maximum Patients</label>

              <input
                type="number"
                value={newSlot.max_patients}
                onChange={e =>
                  setNewSlot(p => ({
                    ...p,
                    max_patients: e.target.value
                  }))
                }
                style={styles.input}
                min="1"
                max="50"
              />
            </div>

            <button
              type="submit"
              style={{
                ...styles.addBtn,
                opacity: formLoading ? 0.6 : 1
              }}
              disabled={formLoading}
            >
              {formLoading ? 'Adding...' : '+ Add Slot'}
            </button>
          </form>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>My Weekly Schedule</h2>

          {loading ? (
            <p style={styles.emptyText}>Loading...</p>

          ) : slots.length === 0 ? (
            <p style={styles.emptyText}>
              No slots available yet. Add one above.
            </p>

          ) : (
            DAY_NAMES.map((dayName, dayIndex) => {
              const daySlots = slotsByDay[dayIndex];

              if (daySlots.length === 0) return null;

              return (
                <div key={dayIndex} style={styles.dayGroup}>
                  <h3 style={styles.dayTitle}>{dayName}</h3>

                  {daySlots.map(slot => (
                    <div
                      key={slot.id}
                      style={{
                        ...styles.slotRow,
                        borderLeft: slot.is_blocked
                          ? '4px solid #dc2626'
                          : '4px solid #16a34a',
                      }}
                    >
                      <div>
                        <span style={styles.slotTime}>
                          {formatTime(slot.start_time)} — {formatTime(slot.end_time)}
                        </span>

                        <span style={styles.slotMeta}>
                          Maximum {slot.max_patients} patients
                        </span>

                        {slot.is_blocked && (
                          <span style={styles.blockedBadge}>
                            BLOCKED
                          </span>
                        )}
                      </div>

                      <div style={styles.actions}>
                        <button
                          onClick={() => handleToggleBlock(slot)}
                          style={{
                            ...styles.actionBtn,
                            backgroundColor: slot.is_blocked
                              ? '#16a34a'
                              : '#f59e0b',
                            color: '#fff',
                          }}
                        >
                          {slot.is_blocked ? 'Unblock' : 'Block'}
                        </button>

                        <button
                          onClick={() => handleDelete(slot.id)}
                          style={{
                            ...styles.actionBtn,
                            backgroundColor: '#dc2626',
                            color: '#fff'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })
          )}
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
    maxWidth: '700px',
    margin: '0 auto',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },

  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#222',
  },

  backBtn: {
    padding: '8px 16px',
    backgroundColor: '#6b7280',
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
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    marginBottom: '20px',
  },

  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '18px',
  },

  form: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '14px',
  },

  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },

  label: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#555',
  },

  input: {
    padding: '9px 12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    outline: 'none',
    backgroundColor: '#fafafa',
  },

  addBtn: {
    gridColumn: '1 / -1',
    padding: '12px',
    fontSize: '15px',
    fontWeight: '600',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },

  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: '14px',
    padding: '20px 0',
  },

  dayGroup: {
    marginBottom: '20px',
  },

  dayTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#444',
    marginBottom: '8px',
    paddingBottom: '4px',
    borderBottom: '1px solid #eee',
  },

  slotRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    backgroundColor: '#f9f9f9',
    borderRadius: '6px',
    marginBottom: '8px',
    borderLeft: '4px solid #16a34a',
  },

  slotTime: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#222',
    display: 'block',
  },

  slotMeta: {
    fontSize: '12px',
    color: '#888',
    marginTop: '2px',
    display: 'block',
  },

  blockedBadge: {
    fontSize: '11px',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '2px 8px',
    borderRadius: '99px',
    fontWeight: '600',
    display: 'inline-block',
    marginTop: '4px',
  },

  actions: {
    display: 'flex',
    gap: '8px',
  },

  actionBtn: {
    padding: '6px 12px',
    fontSize: '13px',
    fontWeight: '500',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default SlotManager;