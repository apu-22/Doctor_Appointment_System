const appointmentModel = require("../models/appointmentModel");
const doctorModel = require("../models/doctorModel");
const slotModel = require("../models/slotModel");

// Book appointment
const book = async (req, res) => {
  try {
    const { doctor_id, slot_id, appt_date, notes } = req.body;

    if (!doctor_id || !slot_id || !appt_date) {
      return res.status(400).json({
        success: false,
        message: "doctor_id, slot_id and appt_date are required",
      });
    }

    // Check if booking date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bookingDate = new Date(appt_date);

    if (bookingDate < today) {
      return res.status(400).json({
        success: false,
        message: "Cannot book appointment for a past date",
      });
    }

    // Check slot existence and blocked status
    const slot = await slotModel.findById(slot_id);

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Slot not found",
      });
    }

    if (slot.is_blocked) {
      return res.status(400).json({
        success: false,
        message: "This slot is blocked",
      });
    }

    // Check if slot matches selected day
    const bookingDayOfWeek = new Date(appt_date).getDay();

    if (slot.day_of_week !== bookingDayOfWeek) {
      return res.status(400).json({
        success: false,
        message: "This slot is not available for the selected day",
      });
    }

    // Check slot capacity
    const bookedCount = await appointmentModel.countBySlotAndDate(
      slot_id,
      appt_date,
    );

    if (bookedCount >= slot.max_patients) {
      return res.status(400).json({
        success: false,
        message: "This slot is fully booked",
      });
    }

    // Duplicate booking check
    const duplicate = await appointmentModel.isDuplicate(
      req.user.id,
      doctor_id,
      appt_date,
    );

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message:
          "You already have an appointment with this doctor on this date",
      });
    }

    // Create appointment
    const appointmentId = await appointmentModel.create({
      patient_id: req.user.id,
      doctor_id,
      slot_id,
      appt_date,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment_id: appointmentId,
    });
  } catch (error) {
    console.error("Book appointment error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get patient's appointments
const getMyAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel.getByPatient(req.user.id);

    res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error("Get appointments error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get doctor's today queue
const getTodayQueue = async (req, res) => {
  try {
    const profile = await doctorModel.getByUserId(req.user.id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
    }

    const appointments = await appointmentModel.getTodayByDoctor(
      profile.doctor_id,
    );

    res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error("Get today queue error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get doctor's appointments by date
const getByDate = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "date is required",
      });
    }

    const profile = await doctorModel.getByUserId(req.user.id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
    }

    const appointments = await appointmentModel.getByDoctorAndDate(
      profile.doctor_id,
      date,
    );

    res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error("Get by date error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Update appointment status
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "confirmed",
      "in_progress",
      "completed",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const appointment = await appointmentModel.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    await appointmentModel.updateStatus(id, status);

    res.json({
      success: true,
      message: `Status updated to "${status}"`,
    });
  } catch (error) {
    console.error("Update status error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const success = await appointmentModel.cancelByPatient(id, req.user.id);

    if (!success) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot cancel appointment. It may not be pending or does not belong to you.",
      });
    }

    res.json({
      success: true,
      message: "Appointment cancelled successfully",
    });
  } catch (error) {
    console.error("Cancel error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get available slots
const getAvailableSlots = async (req, res) => {
  try {
    const { doctor_id, date } = req.query;

    if (!doctor_id || !date) {
      return res.status(400).json({
        success: false,
        message: "doctor_id and date are required",
      });
    }

    //const dayOfWeek = new Date(date).getDay();
    const [year, month, day] = date.split("-").map(Number);
    const dayOfWeek = new Date(year, month - 1, day).getDay();

    const slots = await slotModel.getAvailable(doctor_id, dayOfWeek);

    // Add availability information to each slot
    const slotsWithAvailability = await Promise.all(
      slots.map(async (slot) => {
        const bookedCount = await appointmentModel.countBySlotAndDate(
          slot.id,
          date,
        );

        const availableSpots = slot.max_patients - bookedCount;

        return {
          ...slot,
          booked_count: bookedCount,
          available_spots: availableSpots,
          is_full: availableSpots <= 0,
        };
      }),
    );

    res.json({
      success: true,
      slots: slotsWithAvailability,
    });
  } catch (error) {
    console.error("Get available slots error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  book,
  getMyAppointments,
  getTodayQueue,
  getByDate,
  updateStatus,
  cancelAppointment,
  getAvailableSlots,
};
