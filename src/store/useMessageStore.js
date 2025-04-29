import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../services/axiosInstance";
// import { useAuthStore } from "./useAuthStore";
export const useMessageStore = create((set, get) => ({
  messages: [],
  user: [],
  selectedUser: null,
  isUserLoading: false,
  isMessageLoading: false,

  getUser: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get(
        `${import.meta.env.VITE_BACKEND_URL}/message/users`
      );
      console.log(res.data);
      set({ user: res.data.filteredUser });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg);
    } finally {
      set({ isUserLoading: false });
    }
  },

  getMessage: async (id) => {
    set({ isMessageLoading: true });
    try {
      const res = await axiosInstance.get(
        `${import.meta.env.VITE_BACKEND_URL}/message/${id}`
      );
      console.log(res.data);
      set({ messages: res.data.messages });
    } catch (err) {
      toast.error(err.response?.data?.msg);
    } finally {
      set({ isMessageLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `${import.meta.env.VITE_BACKEND_URL}/message/send/${selectedUser.id}`,
        messageData
      );
      console.log(res.data);
      set({ messages: [...messages, res.data.messages] });
    } catch (err) {
      toast.error(err.response?.data?.msg);
    }
  },

  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
  },
}));
