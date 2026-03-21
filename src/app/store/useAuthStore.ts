import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthStoreInterface {
  authenticated: boolean;
  setAuthenticated: (val: boolean) => void;
  user: any;
  setUser: (user: any) => void;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  login: (token: string, user?: any) => void;
  resetAuth: () => void;
}

export const useAuthStore = create<AuthStoreInterface>()(
  persist(
    (set) => ({
      authenticated: false,
      setAuthenticated: (val) => set({ authenticated: val }),
      user: {},
      setUser: (user) => set({ user }),
      accessToken: null,
      setAccessToken: (token) => set({ accessToken: token }),
      login: (token, user = {}) =>
        set({
          authenticated: true,
          accessToken: token,
          user,
        }),
      resetAuth: () =>
        set({
          authenticated: false,
          user: {},
          accessToken: null,
        }),
    }),
    {
      name: "gitfolio-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        authenticated: state.authenticated,
        user: state.user,
        accessToken: state.accessToken,
      }),
    },
  ),
);
