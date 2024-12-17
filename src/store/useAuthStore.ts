import { create } from 'zustand';
import { User } from '../types';
import { saveUserToCookie, removeUserCookie, getUserFromCookie } from '../utils/cookies';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  initializeFromCookie: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => {
    saveUserToCookie(user);
    set({ user, isAuthenticated: true });
  },
  logout: () => {
    removeUserCookie();
    set({ user: null, isAuthenticated: false });
  },
  initializeFromCookie: () => {
    const user = getUserFromCookie();
    if (user) {
      set({ user, isAuthenticated: true });
    }
  },
}));