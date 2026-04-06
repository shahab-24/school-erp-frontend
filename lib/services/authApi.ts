import { apiSlice } from "./apiSlice";
import { AuthUser, LoginPayload } from "@/types/auth.types";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<{ success: boolean; user: AuthUser }, LoginPayload>(
      {
        query: (data) => ({
          url: "/auth/login",
          method: "POST",
          body: data,
        }),
      }
    ),

    getMe: builder.query<{ success: boolean; user: AuthUser }, void>({
      query: () => "/auth/me",
    }),

    logout: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const { useLoginMutation, useGetMeQuery, useLogoutMutation } = authApi;
