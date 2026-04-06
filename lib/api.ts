// lib/api/axios.ts
import axios from "axios";
// import { csrfUtils } from "@/lib/utils/csrf"; // ✅ import করুন

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(async (config) => {
  // Auth token
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // ✅ CSRF token - শুধুমাত্র mutation requests এর জন্য
  // if (
  //   config.method &&
  //   ["post", "put", "patch", "delete"].includes(config.method)
  // ) {
  //   const csrf = await csrfUtils.ensureToken();
  //   if (csrf) {
  //     config.headers["X-CSRF-Token"] = csrf;
  //   }
  // }

  return config;
});

// Response interceptor (optional - for handling 403 CSRF errors)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response?.status === 403 &&
      error.response?.data?.code === "EBADCSRFTOKEN"
    ) 
    // {
    //   // CSRF token invalid - fetch new token and retry
    //   const newToken = await csrfUtils.fetchToken();
    //   if (newToken && error.config) {
    //     error.config.headers["X-CSRF-Token"] = newToken;
    //     return api(error.config);
    //   }
    // }
    return Promise.reject(error);
  }
);
