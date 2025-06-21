import axios from "axios";
import { toast } from "react-toastify";

export const setAccessToken = (token) => {
  accessToken = token;
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const access_token = localStorage.getItem("access_token");
    if (access_token) {
      config.headers["Authorization"] = `Bearer ${access_token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token) {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = []; // clear the list
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh_token = localStorage.getItem("refresh_token");

      if (!refresh_token) {
        toast.error("Session expired. Please login again.");
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // wait for the ongoing refresh to finish
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken) => {
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/token/refresh/`,
          { refresh: refresh_token },
          { withCredentials: true }
        );

        const newToken = res.data.access;
        const newRefreshToken = res.data.refresh;

        localStorage.setItem("access_token", newToken);
        localStorage.setItem("refresh_token", newRefreshToken);
        setAccessToken(newToken);

        onRefreshed(newToken); // resolve all queued requests
        isRefreshing = false;

        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        isRefreshing = false;
        refreshSubscribers = []; // clear any subscribers
        toast.error("Session expired. Please login again.");
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
