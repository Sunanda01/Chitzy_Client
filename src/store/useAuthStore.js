import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../services/axiosInstance";
import { io } from "socket.io-client";
const getUserFromLocalstorage =
  JSON.parse(localStorage.getItem("Chitzy_userDetails")) || null;
export const useAuthStore = create((set, get) => ({
  authUser: getUserFromLocalstorage || null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  accessToken: getUserFromLocalstorage
    ? getUserFromLocalstorage.accessToken
    : null,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get(
        `${import.meta.env.VITE_BACKEND_URL}/auth/check-auth`
      );
      const userDetails = JSON.parse(
        localStorage.getItem("Chitzy_userDetails")
      );
      set({ authUser: userDetails, accessToken: userDetails.accessToken });
      get().connectSocket();
    } catch (err) {
      localStorage.removeItem("Chitzy_userDetails");
      set({ authUser: null, accessToken: null });
      console.error("checkAuth Failed:", err);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

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
      const userDetails = res.data.user;
      localStorage.setItem("Chitzy_userDetails", JSON.stringify(userDetails));
      set({ authUser: userDetails, accessToken: userDetails.accessToken });
      toast.success(res.data.msg);
      get().connectSocket();
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
      const userDetails = res.data.user;
      localStorage.setItem("Chitzy_userDetails", JSON.stringify(userDetails));
      set({ authUser: userDetails, accessToken: userDetails.accessToken });
      toast.success(res.data.msg);
      get().connectSocket();
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
      const socket = get().socket;
      if (socket) socket.disconnect();
      set({
        authUser: null,
        accessToken: null,
        onlineUsers: [],
        socket: null,
      });
      localStorage.removeItem("Chitzy_userDetails");
      toast.success(res.data.msg);
      get().disconnectSocket();
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
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
    const socket = io(`${import.meta.env.VITE_BACKEND_URL}`, {
      query: {
        userId: authUser.id,
      },
    });

    socket.connect();
    set({ socket: socket });
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
