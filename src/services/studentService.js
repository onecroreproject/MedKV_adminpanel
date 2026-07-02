import axiosInstance from './axiosInstance';

export const getStudents = async (courseId) => {
  const url = courseId ? `/students?courseId=${courseId}` : '/students';
  const response = await axiosInstance.get(url);
  return response.data;
};

export const getStudentById = async (id) => {
  const response = await axiosInstance.get(`/students/${id}`);
  return response.data;
};

export const sendMessageToStudent = async (id, messageData) => {
  const response = await axiosInstance.post(`/students/${id}/message`, messageData);
  return response.data;
};
