// lib/services/authApi.ts
import { apiSlice } from "./apiSlice";
import { AuthUser, LoginPayload } from "@/types/auth.types";

// ✅ সঠিক Response Type
interface LoginResponse {
  success: boolean;
  token: string;
  user: AuthUser;
  role: string;
  timestamp?: string;
}

interface MeResponse {
  success: boolean;
  user: AuthUser;
}

interface LogoutResponse {
  success: boolean;
  message?: string;
}

interface ForgotPasswordPayload {
  email: string;
}

interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginPayload>({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),

    getMe: builder.query<MeResponse, void>({
      query: () => "/auth/me",
    }),

    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),

    // ✅ Forgot Password
    forgotPassword: builder.mutation<
      { success: boolean; message: string },
      ForgotPasswordPayload
    >({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    // ✅ Reset Password
    resetPassword: builder.mutation<
      { success: boolean; message: string },
      ResetPasswordPayload
    >({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useGetMeQuery,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
