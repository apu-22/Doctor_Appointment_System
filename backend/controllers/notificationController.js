const NotificationModel = require('../models/notificationModel');
const sseManager = require('../services/sseManager');

//create notification and push it in real-time
const createNotification = async ({ user_id, title, message, type, link }) => {
  try {
    const notification = await NotificationModel.create({ user_id, title, message, type, link });
    sseManager.sendToUser(user_id, { type: 'new_notification', data: notification });
    return notification;
  } catch (err) {
    console.error('Notification create error:', err.message);
  }
};


const streamNotifications = (req, res) => {
  const user_id = req.user.id;
  sseManager.addClient(user_id, res);
};

const getNotifications = async (req, res) => {
  try {
    const notifications = await NotificationModel.getByUser(req.user.id);
    const unreadCount = await NotificationModel.getUnreadCount(req.user.id);
    res.json({ notifications, unreadCount });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};


const markAsRead = async (req, res) => {
  try {
    await NotificationModel.markAsRead(req.params.id, req.user.id);
    res.json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update' });
  }
};

const markAllRead = async (req, res) => {
  try {
    await NotificationModel.markAllRead(req.user.id);
    res.json({ message: 'All marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update' });
  }
};

const clearAll = async (req, res) => {
  try {
    await NotificationModel.clearAll(req.user.id);
    res.json({ message: 'Cleared all notifications' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to clear' });
  }
};

module.exports = {
  createNotification, 
  streamNotifications,
  getNotifications,
  markAsRead,
  markAllRead,
  clearAll
};