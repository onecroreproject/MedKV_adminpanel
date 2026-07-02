import axiosInstance from './axiosInstance';

export const getRecordings = async () => {
  const response = await axiosInstance.get('/recordings');
  return response.data;
};

export const getRecording = async (id) => {
  const response = await axiosInstance.get(`/recordings/${id}`);
  return response.data;
};

export const createRecording = async (recordingData) => {
  const response = await axiosInstance.post('/recordings', recordingData);
  return response.data;
};

export const updateRecording = async (id, recordingData) => {
  const response = await axiosInstance.put(`/recordings/${id}`, recordingData);
  return response.data;
};

export const deleteRecording = async (id) => {
  const response = await axiosInstance.delete(`/recordings/${id}`);
  return response.data;
};

export const uploadRecordingFile = async (formData, onUploadProgress) => {
  const response = await axiosInstance.post('/recordings/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress
  });
  return response.data;
};
