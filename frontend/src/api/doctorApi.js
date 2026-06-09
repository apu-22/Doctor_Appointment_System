import api from './axios';

// Doctor Profile

export const getMyProfile = async () => {
  const response = await api.get('/doctors/profile');
  return response.data;
};

export const setupProfile = async (profileData) => {
  const response = await api.post('/doctors/profile', profileData);
  return response.data;
};

export const getAllDoctors = async (specialty = null) => {
  const params = specialty ? { specialty } : {};

  const response = await api.get('/doctors', { params });

  return response.data;
};

// Slot Management

export const getMySlots = async () => {
  const response = await api.get('/doctors/slots');
  return response.data;
};

export const createSlot = async (slotData) => {
  const response = await api.post('/doctors/slots', slotData);
  return response.data;
};

export const blockSlot = async (slotId) => {
  const response = await api.put(`/doctors/slots/${slotId}/block`);
  return response.data;
};

export const unblockSlot = async (slotId) => {
  const response = await api.put(`/doctors/slots/${slotId}/unblock`);
  return response.data;
};

export const deleteSlot = async (slotId) => {
  const response = await api.delete(`/doctors/slots/${slotId}`);
  return response.data;
};