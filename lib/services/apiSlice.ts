// // lib/services/apiSlice.ts
// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// // import { csrfUtils } from "@/lib/utils/csrf";
// import type { RootState } from "../store";

// const getBaseUrl = () => {
//   // Browser environment
//   if (typeof window !== "undefined") {
//     // Production (Vercel)
//     if (window.location.hostname !== "localhost") {
//       return (
//         process.env.NEXT_PUBLIC_API_URL ||
//         "https://school-erp-backend-three.vercel.app/api/v1"
//       );
//     }
//   }

//   // Development (localhost)
//   return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
// };

// console.log("🔧 API Base URL:", getBaseUrl());

// export const apiSlice = createApi({
//   reducerPath: "api",
//   baseQuery: fetchBaseQuery({
//     baseUrl: getBaseUrl(),
//     credentials: "include",
//     prepareHeaders: async (headers, { getState }) => {
//       // Auth token
//       const state = getState() as RootState;
//       let token = state.auth?.token;

//       if (!token && typeof window !== "undefined") {
//         token = localStorage.getItem("token");
//       }

//       if (token) {
//         headers.set("Authorization", `Bearer ${token}`);
//       }

//       // // CSRF Token - শুধুমাত্র non-GET requests এর জন্য
//       // const method = headers.get("method") || "GET";
//       // const url = headers.get("url") || "";

//       // if (
//       //   method !== "GET" &&
//       //   method !== "HEAD" &&
//       //   !url.includes("/auth/login")
//       // ) {
//       //   const csrfToken = await csrfUtils.ensureToken();
//       //   if (csrfToken) {
//       //     headers.set("X-CSRF-Token", csrfToken);
//       //     console.log(`✅ CSRF token added for ${method} ${url}`);
//       //   } else {
//       //     console.warn(`⚠️ No CSRF token for ${method} ${url}`);
//       //   }
//       // }

//       return headers;
//     },
//   }),
//   tagTypes: ["Auth", "Student", "ResultConfig", "ExamType", "MarkStructure"],
//   endpoints: () => ({}),
// });
// lib/services/apiSlice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

const getBaseUrl = () => {
  if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
    return process.env.NEXT_PUBLIC_API_URL || "https://school-erp-backend-three.vercel.app/api/v1";
  }
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
};

console.log("🔧 API Base URL:", getBaseUrl());

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: getBaseUrl(),
    credentials: "include", // ✅ কুকি পাঠানোর জন্য
    prepareHeaders: async (headers, { getState }) => {
      // ✅ localStorage থেকে token নিন
      let token = null;
      
      if (typeof window !== "undefined") {
        token = localStorage.getItem("token");
      }
      
      // ✅ Redux state থেকে token (fallback)
      if (!token) {
        const state = getState() as RootState;
        token = state.auth?.token;
      }

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
        console.log("✅ Token added to headers");
      } else {
        console.log("⚠️ No token found");
      }

      return headers;
    },
  }),
  tagTypes: ["Auth", "Student", "ResultConfig", "ExamType", "MarkStructure"],
  endpoints: () => ({}),
});