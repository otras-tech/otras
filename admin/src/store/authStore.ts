import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminUser {
  id: string | number;
  email: string;
  role: string;
}

interface AuthState {
  admin: AdminUser | null;
  token: string | null;
  refreshToken: string | null;
  setAuth: (admin: AdminUser, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      admin: null,
      token: localStorage.getItem('adminToken'),
      refreshToken: localStorage.getItem('adminRefreshToken'),
      setAuth: (admin, accessToken, refreshToken) => {
        localStorage.setItem('adminToken', accessToken);
        localStorage.setItem('adminRefreshToken', refreshToken);
        set({ admin, token: accessToken, refreshToken });
      },
      logout: () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminRefreshToken');
        set({ admin: null, token: null, refreshToken: null });
      },
      isAuthenticated: () => !!get().token
    }),
    {
      name: 'admin-auth-storage',
    }
  )
);
