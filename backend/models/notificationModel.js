const pool = require('../config/db');

const NotificationModel = {

  async create({ user_id, title, message, type = 'system', link = null }) {
    const [result] = await pool.execute(
      `INSERT INTO notifications (user_id, title, message, type, link)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, title, message, type, link]
    );
    // return new notification
    const [rows] = await pool.execute(
      `SELECT * FROM notifications WHERE id = ?`,
      [result.insertId]
    );
    return rows[0];
  },

  async getByUser(user_id) {
    const [rows] = await pool.execute(
      `SELECT * FROM notifications
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 30`,
      [user_id]
    );
    return rows;
  },

  async markAsRead(id, user_id) {
    await pool.execute(
      `UPDATE notifications SET is_read = 1
       WHERE id = ? AND user_id = ?`,
      [id, user_id]
    );
  },

  async markAllRead(user_id) {
    await pool.execute(
      `UPDATE notifications SET is_read = 1
       WHERE user_id = ? AND is_read = 0`,
      [user_id]
    );
  },

  async clearAll(user_id) {
    await pool.execute(
      `DELETE FROM notifications WHERE user_id = ?`,
      [user_id]
    );
  },

  async getUnreadCount(user_id) {
    const [rows] = await pool.execute(
      `SELECT COUNT(*) as count FROM notifications
       WHERE user_id = ? AND is_read = 0`,
      [user_id]
    );
    return rows[0].count;
  }
};

module.exports = NotificationModel;