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
    setUser(
      state,
      action: PayloadAction<{
        user: AuthUser;
        token?: string;
      }>
    ) {
      const { user, token } = action.payload;

      if (user) {
        state.user = user;
        state.role = user.role ?? null;
        state.isAuthenticated = true;
      }

      if (token !== undefined) {
        state.token = token;
      }
    },

    clearUser(state) {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;

export default authSlice.reducer;
