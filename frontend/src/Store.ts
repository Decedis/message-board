import { create } from "zustand";
import { User } from "./utls/types";

// Define the store's state type
type Store = {
  user: User | null; // null when logged out
  token: string | null; // JWT is a string
  isAuthenticated: boolean; // derived state

  // Actions
  login: (user: User, token: string) => void;
  logout: () => void;
  getToken: () => string | null;
};

export const useStore = create<Store>((set, get) => ({
  user: null,
  token: sessionStorage.getItem("token"),
  isAuthenticated: false,
  login: (user: User, token: string) =>
    set({
      user,
      token,
      isAuthenticated: true,
    }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
  getToken: () => get().token,
}));
