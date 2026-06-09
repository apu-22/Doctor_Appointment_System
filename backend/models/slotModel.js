const pool = require('../config/db');

// Create Slot

const create = async (slotData) => {
  const {
    doctor_id,
    day_of_week,
    start_time,
    end_time,
    max_patients
  } = slotData;

  const query = `
    INSERT INTO slots (
      doctor_id,
      day_of_week,
      start_time,
      end_time,
      max_patients
    )
    VALUES (?, ?, ?, ?, ?)
  `;

  const [result] = await pool.query(query, [
    doctor_id,
    day_of_week,
    start_time,
    end_time,
    max_patients
  ]);

  return result.insertId;
};

// Get All Slots By Doctor

const getByDoctor = async (doctor_id) => {
  const query = `
    SELECT * FROM slots
    WHERE doctor_id = ?
    ORDER BY day_of_week, start_time
  `;

  const [rows] = await pool.query(query, [doctor_id]);

  return rows;
};

// Get Available Slots

const getAvailable = async (
  doctor_id,
  day_of_week
) => {
  const query = `
    SELECT * FROM slots
    WHERE doctor_id = ?
    AND day_of_week = ?
    AND is_blocked = 0
    ORDER BY start_time
  `;

  const [rows] = await pool.query(query, [
    doctor_id,
    day_of_week
  ]);

  return rows;
};

// Block Slot

const blockSlot = async (
  slot_id,
  doctor_id
) => {
  const query = `
    UPDATE slots
    SET is_blocked = 1
    WHERE id = ? AND doctor_id = ?
  `;

  const [result] = await pool.query(query, [
    slot_id,
    doctor_id
  ]);

  return result.affectedRows > 0;
};

// Unblock Slot

const unblockSlot = async (
  slot_id,
  doctor_id
) => {
  const query = `
    UPDATE slots
    SET is_blocked = 0
    WHERE id = ? AND doctor_id = ?
  `;

  const [result] = await pool.query(query, [
    slot_id,
    doctor_id
  ]);

  return result.affectedRows > 0;
};

// Delete Slot

const deleteSlot = async (
  slot_id,
  doctor_id
) => {
  const query = `
    DELETE FROM slots
    WHERE id = ? AND doctor_id = ?
  `;

  const [result] = await pool.query(query, [
    slot_id,
    doctor_id
  ]);

  return result.affectedRows > 0;
};

// Find Slot By ID

const findById = async (slot_id) => {
  const query = 'SELECT * FROM slots WHERE id = ?';

  const [rows] = await pool.query(query, [slot_id]);

  return rows[0];
};

// Check Duplicate Slot

const isDuplicate = async (
  doctor_id,
  day_of_week,
  start_time
) => {
  const query = `
    SELECT id FROM slots
    WHERE doctor_id = ?
    AND day_of_week = ?
    AND start_time = ?
  `;

  const [rows] = await pool.query(query, [
    doctor_id,
    day_of_week,
    start_time
  ]);

  return rows.length > 0;
};

module.exports = {
  create,
  getByDoctor,
  getAvailable,
  blockSlot,
  unblockSlot,
  deleteSlot,
  findById,
  isDuplicate,
};