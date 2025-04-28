import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});
axiosInstance.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    //   const userAccessToken = localStorage.getItem("cartzy_token");
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
        window.location.href = "/auth/login";
      }
      return Promise.reject(error);
    }
  );
};
