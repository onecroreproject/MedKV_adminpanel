import axiosInstance from './axiosInstance';

export const getFaculty = async () => {
  const response = await axiosInstance.get('/faculty');
  return response.data;
};
