import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null,
  setAuth: (isAuthenticated, user) => set({ isAuthenticated, user }),
}));