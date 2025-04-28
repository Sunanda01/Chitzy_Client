import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../services/axiosInstance";
export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  accessToken: null,

  checkAuth: async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/auth/check-auth`,
        {
          withCredentials: true,
        }
      );
      set({ authUser: res.data });
    } catch (err) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/signup`,
        data,
        {
          withCredentials: true,
        }
      );
      set({ authUser: res.data.user });
      set({ accessToken: res.data.user.accessToken });
      localStorage.setItem(
        "Chitzy_accessToken",
        JSON.stringify(res.data.user.accessToken)
      );
      toast.success(res.data.msg);
    } catch (err) {
      toast.error(err.response.data.msg);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        data,
        {
          withCredentials: true,
        }
      );
      set({ authUser: res.data.user });
      set({ accessToken: res.data.user.accessToken });
      localStorage.setItem("Chitzy_accessToken", res.data.user.accessToken);
      toast.success(res.data.msg);
    } catch (err) {
      toast.error(err.response.data.msg);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      set({ authUser: null });
      set({ accessToken: null });
      localStorage.removeItem("Chitzy_accessToken");
      const res = await axiosInstance.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/logout`
      );
      toast.success(res.data.msg);
    } catch (err) {
      console.error(err)
      toast.error(err.response.data.msg);
    }
  },
}));
