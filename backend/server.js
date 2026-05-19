// app.js importing
const app = require('./app');

//import pool for testing DB connection
const pool = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('MySQL connected successfully!');

    connection.release();

    // server start 
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('MySQL connection failed:', error.message);
    process.exit(1);
  }
};

startServer();