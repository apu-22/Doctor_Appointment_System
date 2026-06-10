import api from './axios';
export const getAvailableSlots = async (doctorId, date) => {
  const response = await api.get(
    '/appointments/available-slots',
    {
      params: {
        doctor_id: doctorId,
        date
      }
    }
  );

  return response.data;
};

export const bookAppointment = async (data) => {
  const response = await api.post(
    '/appointments',
    data
  );

  return response.data;
};

export const getMyAppointments = async () => {
  const response = await api.get(
    '/appointments/my'
  );

  return response.data;
};

export const cancelAppointment = async (id) => {
  const response = await api.put(
    `/appointments/${id}/cancel`
  );

  return response.data;
};

export const getTodayQueue = async () => {
  const response = await api.get(
    '/appointments/today'
  );

  return response.data;
};

export const getAppointmentsByDate = async (date) => {
  const response = await api.get(
    '/appointments/by-date',
    {
      params: { date }
    }
  );

  return response.data;
};

export const updateAppointmentStatus = async (id, status) => {
  const response = await api.put(
    `/appointments/${id}/status`,
    { status }
  );

  return response.data;
};