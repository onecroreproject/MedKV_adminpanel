import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1/settings';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const getSettings = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const updateSettings = async (settingsData) => {
  const response = await axios.put(API_URL, settingsData, getAuthHeaders());
  return response.data;
};
