const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const {
  streamNotifications,
  getNotifications,
  markAsRead,
  markAllRead,
  clearAll
} = require('../controllers/notificationController');

// Real-time SSE connection
router.get('/stream', verifyToken, streamNotifications);

// REST endpoints
router.get('/',              verifyToken, getNotifications);
router.patch('/:id/read',   verifyToken, markAsRead);
router.patch('/read-all',   verifyToken, markAllRead);
router.delete('/clear',     verifyToken, clearAll);

module.exports = router;