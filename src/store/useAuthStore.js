import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../services/axiosInstance";
const getUserFromLocalstorage =
  JSON.parse(localStorage.getItem("Chitzy_userDetails")) || null;
export const useAuthStore = create((set) => ({
  authUser: getUserFromLocalstorage || null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  accessToken: getUserFromLocalstorage
    ? getUserFromLocalstorage.accessToken
    : null,

  // checkAuth: async () => {
  //   try {
  //     const res = await axiosInstance.get(`/auth/check-auth`);
  //     console.log("checkAuth Success:", res);
  //     set({
  //       authUser: res.data.user,
  //       accessToken: res.data.user.accessToken || null,
  //     });
  //   } catch (err) {
  //     console.error("checkAuth Failed:", err);
  //     set({ authUser: null, accessToken: null });
  //     localStorage.removeItem("Chitzy_userDetails"); // optional
  //   } finally {
  //     set({ isCheckingAuth: false });
  //   }
  // },

  signup: async (data) => {
    try {
      set({ isSigningUp: true });
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/signup`,
        data,
        {
          withCredentials: true,
        }
      );
      localStorage.setItem("Chitzy_userDetails", JSON.stringify(res.data.user));
      const userDetails = JSON.parse(
        localStorage.getItem("Chitzy_userDetails")
      );
      set({ authUser: userDetails, accessToken: userDetails.accessToken });
      toast.success(res.data.msg);
    } catch (err) {
      toast.error(err.response?.data?.msg);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    try {
      set({ isLoggingIn: true });
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        data,
        {
          withCredentials: true,
        }
      );
      console.log(res);
      localStorage.setItem("Chitzy_userDetails", JSON.stringify(res.data.user));
      const userDetails = JSON.parse(
        localStorage.getItem("Chitzy_userDetails")
      );
      set({ authUser: userDetails, accessToken: userDetails.accessToken });
      set({});
      toast.success(res.data.msg);
    } catch (err) {
      toast.error(err.response?.data?.msg);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      const res = await axiosInstance.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/logout`
      );
      set({ authUser: null, accessToken: null });
      set({});
      localStorage.removeItem("Chitzy_userDetails");
      toast.success(res.data.msg);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg);
    }
  },

  updateProfileDetails: async (data) => {
    try {
      set({ isUpdatingProfile: true });
      const res = await axiosInstance.put(
        `${import.meta.env.VITE_BACKEND_URL}/auth/update`,
        data
      );
      console.log(res);
      const existingUserDetails = JSON.parse(
        localStorage.getItem("Chitzy_userDetails")
      );
      const updatedUser = {
        ...existingUserDetails,
        fullName: res.data.user.fullName,
        profilePic: res.data.user.profilePic,
      };
      localStorage.setItem("Chitzy_userDetails", JSON.stringify(updatedUser));
      const updatedDataFromLocalStorage = JSON.parse(
        localStorage.getItem("Chitzy_userDetails")
      );
      set({
        authUser: updatedDataFromLocalStorage,
        accessToken: updatedDataFromLocalStorage.accessToken,
      });
      toast.success(res.data.msg);
    } catch (err) {
      toast.error(err.response?.data?.msg);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
