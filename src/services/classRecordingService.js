import axios from 'axios';

const API_URL = '/api/v1/class-recordings';

export const getClassRecordings = async (params = {}) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
    params
  });
  return response.data;
};

export const getClassRecording = async (id) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const updateClassRecording = async (id, data) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deleteClassRecording = async (id) => {
  const token = localStorage.getItem('token');
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// Recording Controls
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const startRecording = async (roomName) => {
  const response = await axios.post(`${API_URL}/start`, { roomName }, getAuthHeaders());
  return response.data;
};

export const pauseRecording = async (roomName) => {
  const response = await axios.post(`${API_URL}/pause`, { roomName }, getAuthHeaders());
  return response.data;
};

export const resumeRecording = async (roomName) => {
  const response = await axios.post(`${API_URL}/resume`, { roomName }, getAuthHeaders());
  return response.data;
};

export const stopRecording = async (roomName) => {
  const response = await axios.post(`${API_URL}/stop`, { roomName }, getAuthHeaders());
  return response.data;
};

export const getRecordingStatus = async (roomName) => {
  const response = await axios.get(`${API_URL}/status/${roomName}`, getAuthHeaders());
  return response.data;
};

