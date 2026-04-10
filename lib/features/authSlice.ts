// lib/features/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthUser } from "@/types/auth.types";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  role: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  role: null,
  isAuthenticated: false,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // ✅ Complete credentials set (login success)
    setCredentials: (
      state,
      action: PayloadAction<{
        user: AuthUser;
        token: string;
        role: string;
      }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.isAuthenticated = true;
      state.isLoading = false;

      // ✅ Persist to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("role", action.payload.role);
      }
    },

    // ✅ Set user only (profile update)
    setUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
      state.role = action.payload.role ?? null;
      state.isAuthenticated = true;

      if (typeof window !== "undefined" && state.token) {
        localStorage.setItem("user", JSON.stringify(action.payload));
        if (action.payload.role) {
          localStorage.setItem("role", action.payload.role);
        }
      }
    },

    // ✅ Clear all auth data (logout)
    clearUser: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      state.isLoading = false;

      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
      }
    },

    // ✅ Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCredentials, setUser, clearUser, setLoading } =
  authSlice.actions;
export default authSlice.reducer;
