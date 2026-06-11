const appointmentModel = require("../models/appointmentModel");
const doctorModel = require("../models/doctorModel");
const slotModel = require("../models/slotModel");
const { createNotification } = require('./notificationController');

const book = async (req, res) => {
  try {
    const { doctor_id, slot_id, appt_date, notes } = req.body;

    if (!doctor_id || !slot_id || !appt_date) {
      return res.status(400).json({
        success: false,
        message: "doctor_id, slot_id and appt_date are required",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDate = new Date(appt_date);

    if (bookingDate < today) {
      return res.status(400).json({
        success: false,
        message: "Cannot book appointment for a past date",
      });
    }

    const slot = await slotModel.findById(slot_id);
    if (!slot) {
      return res.status(404).json({ success: false, message: "Slot not found" });
    }
    if (slot.is_blocked) {
      return res.status(400).json({ success: false, message: "This slot is blocked" });
    }

    const bookingDayOfWeek = new Date(appt_date).getDay();
    if (slot.day_of_week !== bookingDayOfWeek) {
      return res.status(400).json({
        success: false,
        message: "This slot is not available for the selected day",
      });
    }

    const bookedCount = await appointmentModel.countBySlotAndDate(slot_id, appt_date);
    if (bookedCount >= slot.max_patients) {
      return res.status(400).json({ success: false, message: "This slot is fully booked" });
    }

    const duplicate = await appointmentModel.isDuplicate(req.user.id, doctor_id, appt_date);
    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: "You already have an appointment with this doctor on this date",
      });
    }

    const appointmentId = await appointmentModel.create({
      patient_id: req.user.id,
      doctor_id,
      slot_id,
      appt_date,
      notes,
    });

    // notify patient when appointment is booked
    await createNotification({
      user_id: req.user.id,
      title: 'Appointment Booked',
      message: 'Your appointment has been booked successfully.',
      type: 'appointment',
      link: '/patient/dashboard'
    });

    // notify doctor when appointment is booked
    const doctorProfile = await doctorModel.getById(doctor_id);
    if (doctorProfile) {
      await createNotification({
        user_id: doctorProfile.user_id,
        title: 'New Appointment Request',
        message: 'A patient has booked an appointment with you.',
        type: 'appointment',
        link: '/doctor/dashboard'
      });
    }

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment_id: appointmentId,
    });
  } catch (error) {
    console.error("Book appointment error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel.getByPatient(req.user.id);
    res.json({ success: true, appointments });
  } catch (error) {
    console.error("Get appointments error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getTodayQueue = async (req, res) => {
  try {
    const profile = await doctorModel.getByUserId(req.user.id);
    if (!profile) {
      return res.status(404).json({ success: false, message: "Doctor profile not found" });
    }
    const appointments = await appointmentModel.getTodayByDoctor(profile.doctor_id);
    res.json({ success: true, appointments });
  } catch (error) {
    console.error("Get today queue error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getByDate = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ success: false, message: "date is required" });
    }
    const profile = await doctorModel.getByUserId(req.user.id);
    if (!profile) {
      return res.status(404).json({ success: false, message: "Doctor profile not found" });
    }
    const appointments = await appointmentModel.getByDoctorAndDate(profile.doctor_id, date);
    res.json({ success: true, appointments });
  } catch (error) {
    console.error("Get by date error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "confirmed", "in_progress", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const appointment = await appointmentModel.findById(id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    await appointmentModel.updateStatus(id, status);

    if (status === 'confirmed') {
      await createNotification({
        user_id: appointment.patient_id,
        title: 'Appointment Confirmed',
        message: 'Your appointment has been confirmed by the doctor.',
        type: 'appointment',
        link: '/patient/dashboard'
      });
    }

    if (status === 'cancelled') {
      await createNotification({
        user_id: appointment.patient_id,
        title: 'Appointment Cancelled',
        message: 'Your appointment has been cancelled.',
        type: 'alert',
        link: '/patient/dashboard'
      });
    }

    res.json({ success: true, message: `Status updated to "${status}"` });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await appointmentModel.cancelByPatient(id, req.user.id);

    if (!success) {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel appointment. It may not be pending or does not belong to you.",
      });
    }

    res.json({ success: true, message: "Appointment cancelled successfully" });
  } catch (error) {
    console.error("Cancel error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAvailableSlots = async (req, res) => {
  try {
    const { doctor_id, date } = req.query;
    if (!doctor_id || !date) {
      return res.status(400).json({ success: false, message: "doctor_id and date are required" });
    }

    const [year, month, day] = date.split("-").map(Number);
    const dayOfWeek = new Date(year, month - 1, day).getDay();
    const slots = await slotModel.getAvailable(doctor_id, dayOfWeek);

    const slotsWithAvailability = await Promise.all(
      slots.map(async (slot) => {
        const bookedCount = await appointmentModel.countBySlotAndDate(slot.id, date);
        const availableSpots = slot.max_patients - bookedCount;
        return {
          ...slot,
          booked_count: bookedCount,
          available_spots: availableSpots,
          is_full: availableSpots <= 0,
        };
      })
    );

    res.json({ success: true, slots: slotsWithAvailability });
  } catch (error) {
    console.error("Get available slots error:", error);
    res.status(500).json({ success: false, message: "Server error" });
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