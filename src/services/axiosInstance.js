import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});
axiosInstance.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
export const setupInterceptors = () => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      const { logout } = useAuthStore.getState();
      if (error.response?.status === 401) {
        logout();
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );
};
