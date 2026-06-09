import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { getAllDoctors } from '../api/doctorApi';
import {
  getAvailableSlots,
  bookAppointment
} from '../api/appointmentApi';

const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

const PatientBooking = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [doctors, setDoctors] = useState([]);
  const [specialty, setSpecialty] = useState('');
  const [doctorsLoading, setDoctorsLoading] = useState(true);

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');

  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, [specialty]);

  const fetchDoctors = async () => {
    try {
      setDoctorsLoading(true);

      const data = await getAllDoctors(
        specialty || null
      );

      setDoctors(data.doctors);

    } catch (err) {
      setError('Failed to load doctor list');

    } finally {
      setDoctorsLoading(false);
    }
  };

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedDate('');
    setSlots([]);
    setSelectedSlot(null);
    setError('');
    setStep(2);
  };

  const handleDateChange = async (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setError('');

    if (!date) return;

    try {
      setSlotsLoading(true);

      const data = await getAvailableSlots(
        selectedDoctor.doctor_id,
        date
      );

      setSlots(data.slots);

      if (data.slots.length === 0) {
        setError('No available slots for this date');
      }

    } catch (err) {
      setError('Failed to load slots');

    } finally {
      setSlotsLoading(false);
    }
  };

  const handleSelectSlot = (slot) => {
    if (slot.is_full) return;

    setSelectedSlot(slot);
    setStep(3);
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    setError('');

    try {
      await bookAppointment({
        doctor_id: selectedDoctor.doctor_id,
        slot_id: selectedSlot.id,
        appt_date: selectedDate,
        notes: notes || undefined
      });

      setSuccess('Appointment booked successfully!');

      setTimeout(() => {
        navigate('/patient/dashboard');
      }, 2000);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to book appointment'
      );

    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');

    const h = parseInt(hours);

    const ampm = h >= 12 ? 'PM' : 'AM';

    const displayH =
      h > 12 ? h - 12 : h === 0 ? 12 : h;

    return `${displayH}:${minutes} ${ampm}`;
  };

  const today = new Date()
    .toISOString()
    .split('T')[0];

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>

        <div style={styles.header}>
          <h1 style={styles.title}>
            📅 Book Appointment
          </h1>

          <button
            onClick={() => navigate('/patient/dashboard')}
            style={styles.backBtn}
          >
            ← Dashboard
          </button>
        </div>

        <div style={styles.progressBar}>
          {[
            'Select Doctor',
            'Choose Date & Slot',
            'Confirm'
          ].map((label, i) => (
            <div
              key={i}
              style={styles.progressStep}
            >
              <div
                style={{
                  ...styles.stepCircle,
                  backgroundColor:
                    step > i + 1
                      ? '#16a34a'
                      : step === i + 1
                      ? '#2563eb'
                      : '#d1d5db',
                  color: '#fff'
                }}
              >
                {step > i + 1 ? '✓' : i + 1}
              </div>

              <span
                style={{
                  fontSize: '12px',
                  color:
                    step === i + 1
                      ? '#2563eb'
                      : '#888'
                }}
              >
                {label}
              </span>
            </div>
          ))}
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

        {step === 1 && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>
              Select Doctor
            </h2>

            <select
              value={specialty}
              onChange={(e) =>
                setSpecialty(e.target.value)
              }
              style={{
                ...styles.input,
                marginBottom: '16px'
              }}
            >
              <option value="">
                All Specialties
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

              <option value="ENT">
                ENT
              </option>

              <option value="Dentistry">
                Dentistry
              </option>
            </select>

            {doctorsLoading ? (
              <p style={styles.centerText}>
                Loading...
              </p>

            ) : doctors.length === 0 ? (
              <p style={styles.centerText}>
                No doctors found
              </p>

            ) : (
              <div style={styles.doctorGrid}>
                {doctors.map((doctor) => (
                  <div
                    key={doctor.doctor_id}
                    style={styles.doctorCard}
                    onClick={() =>
                      handleSelectDoctor(doctor)
                    }
                  >
                    <div style={styles.doctorAvatar}>
                      {doctor.name
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <div style={styles.doctorName}>
                        Dr. {doctor.name}
                      </div>

                      <div style={styles.doctorSpecialty}>
                        {doctor.specialty}
                      </div>

                      <div style={styles.doctorFee}>
                        ৳ {doctor.fee} / visit
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 2 && selectedDoctor && (
          <div style={styles.card}>

            <div style={styles.selectedDoctorBox}>
              <strong>
                Dr. {selectedDoctor.name}
              </strong>

              <span style={styles.tag}>
                {selectedDoctor.specialty}
              </span>

              <button
                onClick={() => setStep(1)}
                style={styles.changeBtn}
              >
                Change
              </button>
            </div>

            <h2 style={styles.cardTitle}>
              Choose Date
            </h2>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) =>
                handleDateChange(e.target.value)
              }
              min={today}
              style={{
                ...styles.input,
                marginBottom: '20px'
              }}
            />

            {selectedDate && (
              <>
                <h3 style={styles.subTitle}>
                  Available Slots — {
                    DAY_NAMES[
                      new Date(selectedDate).getDay()
                    ]
                  }
                </h3>

                {slotsLoading ? (
                  <p style={styles.centerText}>
                    Loading...
                  </p>

                ) : slots.length === 0 ? (
                  <p style={styles.centerText}>
                    No slots available
                  </p>

                ) : (
                  <div style={styles.slotGrid}>
                    {slots.map((slot) => (
                      <div
                        key={slot.id}
                        onClick={() =>
                          handleSelectSlot(slot)
                        }
                        style={{
                          ...styles.slotChip,
                          backgroundColor:
                            slot.is_full
                              ? '#f3f4f6'
                              : selectedSlot?.id === slot.id
                              ? '#2563eb'
                              : '#eff6ff',

                          color:
                            slot.is_full
                              ? '#9ca3af'
                              : selectedSlot?.id === slot.id
                              ? '#fff'
                              : '#1d4ed8',

                          cursor:
                            slot.is_full
                              ? 'not-allowed'
                              : 'pointer',

                          border:
                            selectedSlot?.id === slot.id
                              ? '2px solid #2563eb'
                              : '1px solid #bfdbfe',

                          opacity:
                            slot.is_full ? 0.6 : 1,
                        }}
                      >
                        <div
                          style={{
                            fontWeight: '600',
                            fontSize: '14px'
                          }}
                        >
                          {formatTime(
                            slot.start_time
                          )}
                        </div>

                        <div
                          style={{
                            fontSize: '11px',
                            marginTop: '2px'
                          }}
                        >
                          {slot.is_full
                            ? 'Full'
                            : `${slot.available_spots} spots left`}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedSlot && (
                  <button
                    onClick={() => setStep(3)}
                    style={{
                      ...styles.nextBtn,
                      marginTop: '16px'
                    }}
                  >
                    Next Step →
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {step === 3 &&
          selectedDoctor &&
          selectedSlot && (
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>
                Confirm Appointment
              </h2>

              <div style={styles.summaryBox}>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>
                    Doctor
                  </span>

                  <span style={styles.summaryValue}>
                    Dr. {selectedDoctor.name}
                  </span>
                </div>

                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>
                    Specialty
                  </span>

                  <span style={styles.summaryValue}>
                    {selectedDoctor.specialty}
                  </span>
                </div>

                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>
                    Date
                  </span>

                  <span style={styles.summaryValue}>
                    {new Date(
                      selectedDate
                    ).toLocaleDateString(
                      'en-US',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }
                    )}
                  </span>
                </div>

                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>
                    Time
                  </span>

                  <span style={styles.summaryValue}>
                    {formatTime(
                      selectedSlot.start_time
                    )}{' '}
                    —{' '}
                    {formatTime(
                      selectedSlot.end_time
                    )}
                  </span>
                </div>

                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>
                    Fee
                  </span>

                  <span style={styles.summaryValue}>
                    ৳ {selectedDoctor.fee}
                  </span>
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>
                  Problem Details (Optional)
                </label>

                <textarea
                  value={notes}
                  onChange={(e) =>
                    setNotes(e.target.value)
                  }
                  placeholder="Briefly describe your problem..."
                  style={{
                    ...styles.input,
                    height: '80px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={styles.btnRow}>
                <button
                  onClick={() => setStep(2)}
                  style={styles.changeBtn}
                >
                  ← Back
                </button>

                <button
                  onClick={handleConfirm}
                  style={{
                    ...styles.nextBtn,
                    opacity: submitting ? 0.6 : 1
                  }}
                  disabled={submitting}
                >
                  {submitting
                    ? 'Booking...'
                    : '✓ Book Appointment'}
                </button>
              </div>
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
    maxWidth: '680px',
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

  progressBar: {
    display: 'flex',
    justifyContent: 'center',
    gap: '40px',
    marginBottom: '24px',
  },

  progressStep: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
  },

  stepCircle: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '600',
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
  },

  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '16px',
  },

  subTitle: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#555',
    marginBottom: '12px',
  },

  input: {
    width: '100%',
    padding: '10px 14px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    outline: 'none',
    backgroundColor: '#fafafa',
    boxSizing: 'border-box',
  },

  doctorGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },

  doctorCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '14px 16px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'border-color 0.15s',
    backgroundColor: '#fafafa',
  },

  doctorAvatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#2563eb',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: 'bold',
    flexShrink: 0,
  },

  doctorName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#222',
  },

  doctorSpecialty: {
    fontSize: '13px',
    color: '#2563eb',
    marginTop: '2px',
  },

  doctorFee: {
    fontSize: '13px',
    color: '#16a34a',
    marginTop: '2px',
    fontWeight: '500',
  },

  selectedDoctorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    backgroundColor: '#eff6ff',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
  },

  tag: {
    backgroundColor: '#dbeafe',
    color: '#1d4ed8',
    padding: '2px 8px',
    borderRadius: '99px',
    fontSize: '12px',
  },

  changeBtn: {
    padding: '6px 12px',
    backgroundColor: '#f3f4f6',
    border: '1px solid #d1d5db',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '13px',
    color: '#374151',
    marginLeft: 'auto',
  },

  slotGrid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '10px',
  },

  slotChip: {
    padding: '10px',
    borderRadius: '8px',
    textAlign: 'center',
    transition: 'all 0.15s',
  },

  nextBtn: {
    display: 'block',
    width: '100%',
    padding: '13px',
    fontSize: '15px',
    fontWeight: '600',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },

  summaryBox: {
    backgroundColor: '#f8f9fa',
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '20px',
  },

  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #eee',
    fontSize: '14px',
  },

  summaryLabel: {
    color: '#888',
    fontWeight: '500',
  },

  summaryValue: {
    color: '#222',
    fontWeight: '500',
  },

  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '20px',
  },

  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#444',
  },

  btnRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },

  centerText: {
    textAlign: 'center',
    color: '#888',
    fontSize: '14px',
    padding: '20px 0',
  },
};

export default PatientBooking;