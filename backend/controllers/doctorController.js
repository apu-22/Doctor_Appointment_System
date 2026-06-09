const doctorModel = require('../models/doctorModel');
const slotModel = require('../models/slotModel');

// Doctor Profile Setup

const setupProfile = async (req, res) => {
  try {
    const { specialty, bio, fee } = req.body;

    if (!specialty || !fee) {
      return res.status(400).json({
        success: false,
        message: 'Specialty and fee are required'
      });
    }

    const exists = await doctorModel.existsByUserId(req.user.id);

    if (exists) {
      await doctorModel.update(req.user.id, {
        specialty,
        bio,
        fee
      });

      return res.json({
        success: true,
        message: 'Profile updated successfully'
      });
    }

    await doctorModel.create({
      user_id: req.user.id,
      specialty,
      bio,
      fee
    });

    res.status(201).json({
      success: true,
      message: 'Profile created successfully'
    });

  } catch (error) {
    console.error('Setup profile error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get My Profile

const getMyProfile = async (req, res) => {
  try {
    const profile = await doctorModel.getByUserId(req.user.id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found. Please setup your profile first.'
      });
    }

    res.json({
      success: true,
      doctor: profile
    });

  } catch (error) {
    console.error('Get profile error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get All Doctors

const getAllDoctors = async (req, res) => {
  try {
    const { specialty } = req.query;

    const doctors = await doctorModel.getAll(
      specialty || null
    );

    res.json({
      success: true,
      doctors
    });

  } catch (error) {
    console.error('Get doctors error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Create Slot

const createSlot = async (req, res) => {
  try {
    const {
      day_of_week,
      start_time,
      end_time,
      max_patients
    } = req.body;

    if (
      day_of_week === undefined ||
      !start_time ||
      !end_time
    ) {
      return res.status(400).json({
        success: false,
        message: 'day_of_week, start_time and end_time are required'
      });
    }

    if (day_of_week < 0 || day_of_week > 6) {
      return res.status(400).json({
        success: false,
        message: 'day_of_week must be between 0 (Sunday) and 6 (Saturday)'
      });
    }

    const profile = await doctorModel.getByUserId(req.user.id);

    if (!profile) {
      return res.status(400).json({
        success: false,
        message: 'Please setup doctor profile first'
      });
    }

    const duplicate = await slotModel.isDuplicate(
      profile.doctor_id,
      day_of_week,
      start_time
    );

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: 'A slot already exists for this day and time'
      });
    }

    const slotId = await slotModel.create({
      doctor_id: profile.doctor_id,
      day_of_week,
      start_time,
      end_time,
      max_patients: max_patients || 10
    });

    res.status(201).json({
      success: true,
      message: 'Slot created successfully',
      slot_id: slotId
    });

  } catch (error) {
    console.error('Create slot error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get My Slots

const getMySlots = async (req, res) => {
  try {
    const profile = await doctorModel.getByUserId(req.user.id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found'
      });
    }

    const slots = await slotModel.getByDoctor(
      profile.doctor_id
    );

    res.json({
      success: true,
      slots
    });

  } catch (error) {
    console.error('Get slots error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Block Slot

const blockSlot = async (req, res) => {
  try {
    const { slotId } = req.params;

    const profile = await doctorModel.getByUserId(req.user.id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found'
      });
    }

    const success = await slotModel.blockSlot(
      slotId,
      profile.doctor_id
    );

    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Slot not found'
      });
    }

    res.json({
      success: true,
      message: 'Slot blocked successfully'
    });

  } catch (error) {
    console.error('Block slot error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Unblock Slot

const unblockSlot = async (req, res) => {
  try {
    const { slotId } = req.params;

    const profile = await doctorModel.getByUserId(req.user.id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found'
      });
    }

    const success = await slotModel.unblockSlot(
      slotId,
      profile.doctor_id
    );

    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Slot not found'
      });
    }

    res.json({
      success: true,
      message: 'Slot unblocked successfully'
    });

  } catch (error) {
    console.error('Unblock slot error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Delete Slot

const deleteSlot = async (req, res) => {
  try {
    const { slotId } = req.params;

    const profile = await doctorModel.getByUserId(req.user.id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found'
      });
    }

    const success = await slotModel.deleteSlot(
      slotId,
      profile.doctor_id
    );

    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Slot not found'
      });
    }

    res.json({
      success: true,
      message: 'Slot deleted successfully'
    });

  } catch (error) {
    console.error('Delete slot error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  setupProfile,
  getMyProfile,
  getAllDoctors,
  createSlot,
  getMySlots,
  blockSlot,
  unblockSlot,
  deleteSlot,
};