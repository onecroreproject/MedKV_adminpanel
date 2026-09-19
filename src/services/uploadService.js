import axiosInstance from './axiosInstance';

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await axiosInstance.post('/upload', formData);
  
  return response.data;
};
