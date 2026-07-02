import axiosInstance from './axiosInstance';

export const getCourses = async () => {
  const response = await axiosInstance.get('/courses');
  return response.data;
};

export const getCourseById = async (id) => {
  const response = await axiosInstance.get(`/courses/${id}`);
  return response.data;
};

export const createCourse = async (courseData) => {
  const response = await axiosInstance.post('/courses', courseData);
  return response.data;
};

export const updateCourse = async (id, courseData) => {
  const response = await axiosInstance.put(`/courses/${id}`, courseData);
  return response.data;
};

export const deleteCourse = async (id) => {
  const response = await axiosInstance.delete(`/courses/${id}`);
  return response.data;
};

export const addCourseModule = async (courseId, moduleData) => {
  const response = await axiosInstance.post(`/courses/${courseId}/modules`, moduleData);
  return response.data;
};

export const updateCourseModule = async (moduleId, moduleData) => {
  const response = await axiosInstance.put(`/courses/modules/${moduleId}`, moduleData);
  return response.data;
};

export const deleteCourseModule = async (moduleId) => {
  const response = await axiosInstance.delete(`/courses/modules/${moduleId}`);
  return response.data;
};

export const reorderCourseModules = async (courseId, items) => {
  const response = await axiosInstance.put(`/courses/${courseId}/modules/reorder`, { items });
  return response.data;
};

export const addLesson = async (moduleId, lessonData) => {
  let config = {};
  if (lessonData instanceof FormData) {
    config = { headers: { 'Content-Type': 'multipart/form-data' } };
  }
  const response = await axiosInstance.post(`/courses/modules/${moduleId}/lessons`, lessonData, config);
  return response.data;
};

export const updateLesson = async (lessonId, lessonData) => {
  let config = {};
  if (lessonData instanceof FormData) {
    config = { headers: { 'Content-Type': 'multipart/form-data' } };
  }
  const response = await axiosInstance.put(`/courses/lessons/${lessonId}`, lessonData, config);
  return response.data;
};

export const deleteLesson = async (lessonId) => {
  const response = await axiosInstance.delete(`/courses/lessons/${lessonId}`);
  return response.data;
};

export const reorderLessons = async (moduleId, items) => {
  const response = await axiosInstance.put(`/courses/modules/${moduleId}/lessons/reorder`, { items });
  return response.data;
};

export const addLessonResource = async (lessonId, formData) => {
  const response = await axiosInstance.post(`/courses/lessons/${lessonId}/resources`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const deleteLessonResource = async (lessonId, resourceId) => {
  const response = await axiosInstance.delete(`/courses/lessons/${lessonId}/resources/${resourceId}`);
  return response.data;
};
