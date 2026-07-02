import axiosInstance from './axiosInstance';

export const getLiveClasses = async () => {
  const response = await axiosInstance.get('/live-classes');
  return response.data;
};

export const getLiveClass = async (id) => {
  const response = await axiosInstance.get(`/live-classes/${id}`);
  return response.data;
};

export const createLiveClass = async (classData) => {
  const response = await axiosInstance.post('/live-classes', classData);
  return response.data;
};

export const updateLiveClass = async (id, classData) => {
  const response = await axiosInstance.put(`/live-classes/${id}`, classData);
  return response.data;
};

export const deleteLiveClass = async (id) => {
  const response = await axiosInstance.delete(`/live-classes/${id}`);
  return response.data;
};
