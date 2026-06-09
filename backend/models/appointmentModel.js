const pool = require('../config/db');

// Create new appointment
const create = async (data) => {
  const { patient_id, doctor_id, slot_id, appt_date, notes } = data;

  const query = `
    INSERT INTO appointments 
    (patient_id, doctor_id, slot_id, appt_date, status, notes)
    VALUES (?, ?, ?, ?, 'pending', ?)
  `;

  const [result] = await pool.query(query, [
    patient_id,
    doctor_id,
    slot_id,
    appt_date,
    notes || null
  ]);

  return result.insertId;
};

// Count appointments in a specific slot and date
const countBySlotAndDate = async (slot_id, appt_date) => {
  const query = `
    SELECT COUNT(*) AS total
    FROM appointments
    WHERE slot_id = ?
    AND appt_date = ?
    AND status != 'cancelled'
  `;

  const [rows] = await pool.query(query, [slot_id, appt_date]);

  return rows[0].total;
};

// Get all appointments of a patient
const getByPatient = async (patient_id) => {
  const query = `
    SELECT
      a.id,
      a.appt_date,
      a.status,
      a.notes,
      a.created_at,
      s.start_time,
      s.end_time,
      d.id AS doctor_id,
      d.specialty,
      d.fee,
      u.name AS doctor_name,
      u.phone AS doctor_phone
    FROM appointments a
    JOIN slots s ON a.slot_id = s.id
    JOIN doctors d ON a.doctor_id = d.id
    JOIN users u ON d.user_id = u.id
    WHERE a.patient_id = ?
    ORDER BY a.appt_date DESC, s.start_time DESC
  `;

  const [rows] = await pool.query(query, [patient_id]);

  return rows;
};

// Get today's queue for a doctor
const getTodayByDoctor = async (doctor_id) => {
  const query = `
    SELECT
      a.id,
      a.appt_date,
      a.status,
      a.notes,
      s.start_time,
      s.end_time,
      u.id AS patient_user_id,
      u.name AS patient_name,
      u.phone AS patient_phone,
      u.email AS patient_email
    FROM appointments a
    JOIN slots s ON a.slot_id = s.id
    JOIN users u ON a.patient_id = u.id
    WHERE a.doctor_id = ?
    AND a.appt_date = CURDATE()
    AND a.status != 'cancelled'
    ORDER BY s.start_time ASC
  `;

  const [rows] = await pool.query(query, [doctor_id]);

  return rows;
};

// Get doctor's appointments by date
const getByDoctorAndDate = async (doctor_id, appt_date) => {
  const query = `
    SELECT
      a.id,
      a.appt_date,
      a.status,
      a.notes,
      s.start_time,
      s.end_time,
      u.name AS patient_name,
      u.phone AS patient_phone
    FROM appointments a
    JOIN slots s ON a.slot_id = s.id
    JOIN users u ON a.patient_id = u.id
    WHERE a.doctor_id = ?
    AND a.appt_date = ?
    ORDER BY s.start_time ASC
  `;

  const [rows] = await pool.query(query, [doctor_id, appt_date]);

  return rows;
};

// Find appointment by ID
const findById = async (id) => {
  const query = `
    SELECT
      a.*,
      s.start_time,
      s.end_time,
      s.max_patients,
      u_patient.name AS patient_name,
      u_patient.phone AS patient_phone,
      u_doctor.name AS doctor_name,
      d.specialty,
      d.fee
    FROM appointments a
    JOIN slots s ON a.slot_id = s.id
    JOIN users u_patient ON a.patient_id = u_patient.id
    JOIN doctors d ON a.doctor_id = d.id
    JOIN users u_doctor ON d.user_id = u_doctor.id
    WHERE a.id = ?
  `;

  const [rows] = await pool.query(query, [id]);

  return rows[0];
};

// Update appointment status
const updateStatus = async (id, status) => {
  const query = `
    UPDATE appointments
    SET status = ?
    WHERE id = ?
  `;

  const [result] = await pool.query(query, [status, id]);

  return result.affectedRows > 0;
};

// Cancel appointment by patient
const cancelByPatient = async (id, patient_id) => {
  const query = `
    UPDATE appointments
    SET status = 'cancelled'
    WHERE id = ?
    AND patient_id = ?
    AND status = 'pending'
  `;

  const [result] = await pool.query(query, [id, patient_id]);

  return result.affectedRows > 0;
};

// Check duplicate booking
const isDuplicate = async (patient_id, doctor_id, appt_date) => {
  const query = `
    SELECT id
    FROM appointments
    WHERE patient_id = ?
    AND doctor_id = ?
    AND appt_date = ?
    AND status != 'cancelled'
  `;

  const [rows] = await pool.query(query, [
    patient_id,
    doctor_id,
    appt_date
  ]);

  return rows.length > 0;
};

module.exports = {
  create,
  countBySlotAndDate,
  getByPatient,
  getTodayByDoctor,
  getByDoctorAndDate,
  findById,
  updateStatus,
  cancelByPatient,
  isDuplicate,
};