import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1/categories';

// Get token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const getCategories = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createCategory = async (categoryData) => {
  const response = await axios.post(API_URL, categoryData, getAuthHeaders());
  return response.data;
};

export const updateCategory = async (id, categoryData) => {
  const response = await axios.put(`${API_URL}/${id}`, categoryData, getAuthHeaders());
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  return response.data;
};
