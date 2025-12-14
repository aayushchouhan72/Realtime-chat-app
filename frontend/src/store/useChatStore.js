import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
// import { subscribe, unsubscribe } from ";
import { useAuthStore } from "./useAuthStore";
import { io } from "socket.io-client";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    if (!selectedUser?._id) {
      toast.error("No recipient selected");
      return;
    }
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...(messages || []), res.data] });
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send message");
      throw error;
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    // avoid duplicate handlers
    socket.off("newMessage");

    socket.on("newMessage", (newMessage) => {
      const selectedUser = get().selectedUser;
      const authUser = useAuthStore.getState().authUser;

      // if no selected conversation, do nothing (could show notification instead)
      if (!selectedUser || !authUser) return;

      const newMsgSender = String(newMessage.senderId);
      const newMsgReceiver = String(newMessage.receiverId);
      const selId = String(selectedUser._id);
      const meId = String(authUser._id);

      // Append only if the new message belongs to the currently open 1:1 chat
      const belongsToCurrentChat =
        (newMsgSender === selId && newMsgReceiver === meId) ||
        (newMsgSender === meId && newMsgReceiver === selId);

      if (belongsToCurrentChat) {
        set({ messages: [...(get().messages || []), newMessage] });
      }
    });
  },
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  //  todo : OPtimize this one later
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
