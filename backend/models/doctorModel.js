const pool = require('../config/db');

// Create Doctor Profile

const create = async (doctorData) => {
  const {
    user_id,
    specialty,
    bio,
    fee
  } = doctorData;

  const query = `
    INSERT INTO doctors (
      user_id,
      specialty,
      bio,
      fee
    )
    VALUES (?, ?, ?, ?)
  `;

  const [result] = await pool.query(query, [
    user_id,
    specialty,
    bio || null,
    fee || 0
  ]);

  return result.insertId;
};

// Get All Doctors

const getAll = async (specialty = null) => {
  let query = `
    SELECT
      d.id AS doctor_id,
      d.specialty,
      d.bio,
      d.fee,
      u.id AS user_id,
      u.name,
      u.email,
      u.phone
    FROM doctors d
    JOIN users u ON d.user_id = u.id
  `;

  if (specialty) {
    query += ' WHERE d.specialty = ?';

    const [rows] = await pool.query(query, [
      specialty
    ]);

    return rows;
  }

  const [rows] = await pool.query(query);

  return rows;
};

// Get Doctor Profile By User ID

const getByUserId = async (user_id) => {
  const query = `
    SELECT
      d.id AS doctor_id,
      d.specialty,
      d.bio,
      d.fee,
      u.id AS user_id,
      u.name,
      u.email,
      u.phone
    FROM doctors d
    JOIN users u ON d.user_id = u.id
    WHERE d.user_id = ?
  `;

  const [rows] = await pool.query(query, [user_id]);

  return rows[0];
};

// Get Doctor Profile By Doctor ID

const getById = async (doctor_id) => {
  const query = `
    SELECT
      d.id AS doctor_id,
      d.specialty,
      d.bio,
      d.fee,
      u.id AS user_id,
      u.name,
      u.email,
      u.phone
    FROM doctors d
    JOIN users u ON d.user_id = u.id
    WHERE d.id = ?
  `;

  const [rows] = await pool.query(query, [doctor_id]);

  return rows[0];
};

// Update Doctor Profile

const update = async (
  user_id,
  updateData
) => {
  const {
    specialty,
    bio,
    fee
  } = updateData;

  const query = `
    UPDATE doctors
    SET specialty = ?, bio = ?, fee = ?
    WHERE user_id = ?
  `;

  const [result] = await pool.query(query, [
    specialty,
    bio,
    fee,
    user_id
  ]);

  return result.affectedRows > 0;
};

// Check Doctor Profile Exists

const existsByUserId = async (user_id) => {
  const query = `
    SELECT id
    FROM doctors
    WHERE user_id = ?
  `;

  const [rows] = await pool.query(query, [user_id]);

  return rows.length > 0;
};

module.exports = {
  create,
  getAll,
  getByUserId,
  getById,
  update,
  existsByUserId,
};