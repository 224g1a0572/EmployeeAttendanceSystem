import { create } from "zustand";
import api from "../api";

export const useAuthStore = create((set, get) => ({
  user: null,
  isLoading: false,
  error: null,

  setUserFromStorage: () => {
    const userJson = localStorage.getItem("attendance_user");
    if (userJson) {
      set({ user: JSON.parse(userJson) });
    }
  },

  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const res = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("attendance_token", res.data.token);
      localStorage.setItem("attendance_user", JSON.stringify(res.data));
      set({ user: res.data, isLoading: false });
      return res.data;
    } catch (error) {
      console.error(error);
      set({
        error: error.response?.data?.message || "Login failed",
        isLoading: false
      });
      throw error;
    }
  },

  register: async (payload) => {
    try {
      set({ isLoading: true, error: null });
      const res = await api.post("/api/auth/register", payload);
      localStorage.setItem("attendance_token", res.data.token);
      localStorage.setItem("attendance_user", JSON.stringify(res.data));
      set({ user: res.data, isLoading: false });
      return res.data;
    } catch (error) {
      console.error(error);
      set({
        error: error.response?.data?.message || "Registration failed",
        isLoading: false
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("attendance_token");
    localStorage.removeItem("attendance_user");
    set({ user: null });
  }
}));
