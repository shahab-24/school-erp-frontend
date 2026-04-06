// lib/services/apiSlice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { csrfUtils } from "@/lib/utils/csrf";
import type { RootState } from "../store";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: "include",
    prepareHeaders: async (headers, { getState }) => {
      // Auth token
      const state = getState() as RootState;
      let token = state.auth?.token;

      if (!token && typeof window !== "undefined") {
        token = localStorage.getItem("token");
      }

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      // // CSRF Token - শুধুমাত্র non-GET requests এর জন্য
      // const method = headers.get("method") || "GET";
      // const url = headers.get("url") || "";

      // if (
      //   method !== "GET" &&
      //   method !== "HEAD" &&
      //   !url.includes("/auth/login")
      // ) {
      //   const csrfToken = await csrfUtils.ensureToken();
      //   if (csrfToken) {
      //     headers.set("X-CSRF-Token", csrfToken);
      //     console.log(`✅ CSRF token added for ${method} ${url}`);
      //   } else {
      //     console.warn(`⚠️ No CSRF token for ${method} ${url}`);
      //   }
      // }

      return headers;
    },
  }),
  tagTypes: ["Auth", "Student", "ResultConfig", "ExamType", "MarkStructure"],
  endpoints: () => ({}),
});
