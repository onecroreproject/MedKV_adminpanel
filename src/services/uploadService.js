import axiosInstance from './axiosInstance';

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const token = localStorage.getItem('token');
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
  
  const response = await fetch(`${baseURL}/upload`, {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': `Bearer ${token}`
      // Do NOT set Content-Type here, let the browser set it with the correct boundary
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'File upload failed on server');
  }
  
  return response.json();
};
