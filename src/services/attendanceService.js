import axiosInstance from './axiosInstance';

export const getAttendanceByClass = async (liveClassId) => {
  const response = await axiosInstance.get(`/attendance/${liveClassId}`);
  return response.data;
};

export const markAttendance = async (liveClassId, attendanceData) => {
  const response = await axiosInstance.post(`/attendance/${liveClassId}`, attendanceData);
  return response.data;
};
