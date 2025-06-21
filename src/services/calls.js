import axiosInstance from "./axiosInstance";

export const login = async (data) => axiosInstance.post("api/login/", data);

export const register = async (data) =>
  axiosInstance.post("api/register/", data);

export const getRefreshToken = async () =>
  axiosInstance.post("api/token/refresh/");

export const getCourses = async () => axiosInstance.get("courses/");
export const getCourseDetails = async (courseId) =>
  axiosInstance.get(`courses/${courseId}/`);

export const getCourseVideo = async (courseId) =>
  axiosInstance.get(`videos/?course_id=${courseId}`);

export const getVideoDetails = async (videoId) =>
  axiosInstance.get(`videos/${videoId}`);
export const getVideoProgress = async (course_id) =>
  axiosInstance.get(`progress/?course_id=${course_id}`);
export const createVideoProgress = async (data) =>
  axiosInstance.post(`progress/`, data);
export const updateVideoProgress = async (progressId, data) =>
  axiosInstance.patch(`progress/${progressId}/`, data);
export const getMCQs = async (videoId) =>
  axiosInstance.get(`videos/${videoId}/questions/`);
export const submitAnswers = async (videoId, data) =>
  axiosInstance.post(`videos/${videoId}/submit-quiz/`, data);
export const getDashboardData = async (courseId) =>
  axiosInstance.get(`api/course/dashboard/?course_id=${courseId}`);
