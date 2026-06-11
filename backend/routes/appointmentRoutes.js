const express = require('express');
const router = express.Router();

const appointmentController = require('../controllers/appointmentController');
const verifyToken = require('../middleware/authMiddleware');
const { roleGuard } = require('../middleware/roleMiddleware');

// Public
router.get(
  '/available-slots',
  appointmentController.getAvailableSlots
);

// Patient
router.post(
  '/',
  verifyToken,
  roleGuard('patient'),
  appointmentController.book
);

router.get(
  '/my',
  verifyToken,
  roleGuard('patient'),
  appointmentController.getMyAppointments
);

router.put(
  '/:id/cancel',
  verifyToken,
  roleGuard('patient'),
  appointmentController.cancelAppointment
);

// Doctor
router.get(
  '/today',
  verifyToken,
  roleGuard('doctor'),
  appointmentController.getTodayQueue
);

router.get(
  '/by-date',
  verifyToken,
  roleGuard('doctor'),
  appointmentController.getByDate
);

router.put(
  '/:id/status',
  verifyToken,
  roleGuard('doctor'),
  appointmentController.updateStatus
);

module.exports = router;