import axiosInstance from './axiosInstance';

export const loginAdmin = async (email, password) => {
  const response = await axiosInstance.post('/auth/admin/login', { email, password });
  return response.data;
};

export const loginFaculty = async (email, password) => {
  const response = await axiosInstance.post('/auth/faculty/login', { email, password });
  return response.data;
};

export const registerAdmin = async (userData) => {
  const response = await axiosInstance.post('/auth/admin/register', userData);
  return response.data;
};

export const registerFaculty = async (userData) => {
  const response = await axiosInstance.post('/auth/faculty/register', userData);
  return response.data;
};

export const forgotPasswordAdmin = async (email) => {
  const response = await axiosInstance.post('/auth/admin/forgotpassword', { email });
  return response.data;
};

export const resetPasswordAdmin = async (token, password) => {
  const response = await axiosInstance.put(`/auth/admin/resetpassword/${token}`, { password });
  return response.data;
};

export const forgotPasswordFaculty = async (email) => {
  const response = await axiosInstance.post('/auth/faculty/forgotpassword', { email });
  return response.data;
};

export const resetPasswordFaculty = async (token, password) => {
  const response = await axiosInstance.put(`/auth/faculty/resetpassword/${token}`, { password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

// Validate Reset Token
export const validateResetToken = async (token) => {
  const response = await axiosInstance.get(`/auth/validate-reset-token/${token}`);
  return response.data;
};

// Get current user details and verify session
export const getMe = async () => {
  const response = await axiosInstance.get('/auth/me');
  return response.data;
};
