// db pool import 
const pool = require('../config/db');


//find user by email
const findByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = ?';
 
  const [rows] = await pool.query(query, [email]);
  
  return rows[0];
};

//find user by id
const findById = async (id) => {

  const query = 'SELECT id, name, email, role, phone, created_at FROM users WHERE id = ?';

  const [rows] = await pool.query(query, [id]);

  return rows[0];
};

//create user
const create = async (userData) => {

  const { name, email, password_hash, role, phone } = userData;
  
  const query = 'INSERT INTO users (name, email, password_hash, role, phone) VALUES (?, ?, ?, ?, ?)';
  
  const [result] = await pool.query(query, [name, email, password_hash, role, phone]);
  
  return result.insertId;
};

//check if email exists
const emailExists = async (email) => {

  const query = 'SELECT id FROM users WHERE email = ?';

  const [rows] = await pool.query(query, [email]);
  
  return rows.length > 0;
};


//all functions export
module.exports = {
  findByEmail,
  findById,
  create,
  emailExists
};