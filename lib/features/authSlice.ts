import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthUser } from "@/types/auth.types";

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  role: string | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
  role: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{
        token: string;
        user: AuthUser;
        role: string;
      }>
    ) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.role = action.payload.role;
    },

    logout(state) {
      state.token = null;
      state.user = null;
      state.role = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
