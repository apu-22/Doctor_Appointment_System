const express = require('express');
const router = express.Router();

const doctorController = require('../controllers/doctorController');
const { verifyToken } = require('../middleware/authMiddleware');
const { roleGuard } = require('../middleware/roleMiddleware');

// Public Routes

router.get('/', doctorController.getAllDoctors);

// Doctor Only Routes

router.get(
  '/profile',
  verifyToken,
  roleGuard('doctor'),
  doctorController.getMyProfile
);

router.post(
  '/profile',
  verifyToken,
  roleGuard('doctor'),
  doctorController.setupProfile
);

router.get(
  '/slots',
  verifyToken,
  roleGuard('doctor'),
  doctorController.getMySlots
);

router.post(
  '/slots',
  verifyToken,
  roleGuard('doctor'),
  doctorController.createSlot
);

router.put(
  '/slots/:slotId/block',
  verifyToken,
  roleGuard('doctor'),
  doctorController.blockSlot
);

router.put(
  '/slots/:slotId/unblock',
  verifyToken,
  roleGuard('doctor'),
  doctorController.unblockSlot
);

router.delete(
  '/slots/:slotId',
  verifyToken,
  roleGuard('doctor'),
  doctorController.deleteSlot
);

module.exports = router;