// src/lib/services/studentApi.ts
import { apiSlice } from "./apiSlice";

import type {
  Student,
  StudentStatus,
  StipendBeneficiary,
} from "@/types/student.types";

// ─── Request types ────────────────────────────────────────────────

export interface ListStudentsQuery {
  search?: string;
  class?: number | string;
  session?: string;
  status?: StudentStatus;
  gender?: "male" | "female" | "other";
  page?: number;
  limit?: number;
  religion?: string; // ← ADD
  ageMin?: number; // ← ADD
  ageMax?: number;
}

export interface CreateStudentPayload {
  studentUid: string;
  name: { en: string; bn?: string };
  gender: "male" | "female" | "other";
  religion: string;
  birthDate: string;
  birthRegistration: string;
  languagePreference?: "bn" | "en";
  imageUrl?: string;
  father: {
    name: { en: string; bn?: string };
    mobile: string;
    nid: string;
    birthRegistration: string;
  };
  mother: {
    name: { en: string; bn?: string };
    mobile: string;
    nid: string;
    birthRegistration: string;
  };
  guardians?: Array<{
    relation: "guardian" | "other";
    name: { en: string; bn?: string };
    mobile: string;
    nid?: string;
    walletProvider: "bKash" | "Nagad" | "Rocket" | "Other";
  }>;
  current: { session: string; class: number; roll: number };
  bloodGroup?: string;
}

export interface UpdateStatusPayload {
  studentUid: string;
  status: StudentStatus;
}

export interface PromotePayload {
  studentUid: string;
  entry: {
    session: string;
    fromClass: number;
    toClass: number;
    result: "promoted" | "repeat";
    previousRoll?: number;
    newRoll?: number;
    remarks?: string; 
  };
}

export interface StipendPayload {
  studentUid: string;
  data: {
    name: string;
    mobile: string;
    relation: "father" | "mother" | "guardian" | "other";
    paymentMethod: "mobile_banking" | "bank" | "cash";
    walletProvider?: "bKash" | "Nagad" | "Rocket" | "Other";
    bankName?: string; // ✅ ADD
    accountNumber?: string;
  };
}

// ─── API Slice ────────────────────────────────────────────────────

export const studentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ==================== GET ALL STUDENTS ====================
    getStudents: builder.query<
      { data: Student[]; meta?: any },
      ListStudentsQuery
    >({
      query: (params = {}) => {
        // Clean params
        const cleanParams = Object.fromEntries(
          Object.entries(params).filter(([, v]) => v !== undefined && v !== "")
        );

        return {
          url: "/students",
          params: cleanParams,
        };
      },
      transformResponse: (response: any) => {
        console.log("📦 getStudents response:", response);

        // Handle different response formats
        if (response?.success && Array.isArray(response.data)) {
          return {
            data: response.data,
            meta: response.meta || {
              total: response.data.length,
              page: 1,
              limit: response.data.length,
              totalPages: 1,
            },
          };
        }

        // If response is array directly
        if (Array.isArray(response)) {
          return {
            data: response,
            meta: {
              total: response.length,
              page: 1,
              limit: response.length,
              totalPages: 1,
            },
          };
        }

        return {
          data: [],
          meta: { total: 0, page: 1, limit: 10, totalPages: 1 },
        };
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ studentUid }) => ({
                type: "Student" as const,
                id: studentUid,
              })),
              { type: "Student", id: "LIST" },
            ]
          : [{ type: "Student", id: "LIST" }],
    }),

    // ==================== GET SESSIONS ====================
    getSessions: builder.query<string[], void>({
      query: () => "/students/sessions",
      transformResponse: (response: any) => {
        console.log("📦 getSessions response:", response);

        if (response?.success && Array.isArray(response.data)) {
          return response.data;
        }

        // Fallback - extract from students if needed
        return ["2024", "2025", "2026"];
      },
      providesTags: [{ type: "Student", id: "SESSIONS" }],
    }),

    // ==================== GET CLASSES ====================
    getClasses: builder.query<number[], void>({
      query: () => "/students/classes",
      transformResponse: (response: any) => {
        console.log("📦 getClasses response:", response);

        if (response?.success && Array.isArray(response.data)) {
          return response.data;
        }

        // Fallback
        return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      },
      providesTags: [{ type: "Student", id: "CLASSES" }],
    }),

    // ==================== GET SINGLE STUDENT ====================
    getStudent: builder.query<Student, string>({
      query: (uid) => `/students/${uid}`,
      transformResponse: (response: any) => {
        console.log("📦 getStudent response:", response);

        if (response?.success && response.data) {
          return response.data;
        }

        return response;
      },
      providesTags: (_, __, uid) => [{ type: "Student", id: uid }],
    }),

    // ==================== CREATE STUDENT ====================
    createStudent: builder.mutation<Student, CreateStudentPayload>({
      query: (body) => ({
        url: "/students",
        method: "POST",
        body,
      }),
      transformResponse: (response: any) => {
        console.log("📦 createStudent response:", response);

        if (response?.success && response.data) {
          return response.data;
        }

        return response;
      },
      invalidatesTags: [
        { type: "Student", id: "LIST" },
        { type: "Student", id: "SESSIONS" },
        { type: "Student", id: "CLASSES" },
      ],
    }),

    // ==================== UPDATE STATUS ====================
    updateStudentStatus: builder.mutation<Student, UpdateStatusPayload>({
      query: ({ studentUid, status }) => ({
        url: `/students/${studentUid}/status`,
        method: "PATCH",
        body: { status },
      }),
      transformResponse: (response: any) => {
        console.log("📦 updateStatus response:", response);

        if (response?.success && response.data) {
          return response.data;
        }

        return response;
      },
      invalidatesTags: (_, __, { studentUid }) => [
        { type: "Student", id: studentUid },
        { type: "Student", id: "LIST" },
      ],
    }),

    // ==================== PROMOTE STUDENT ====================
    promoteStudent: builder.mutation<Student, PromotePayload>({
      query: ({ studentUid, entry }) => ({
        url: `/students/${studentUid}/promote`,
        method: "POST",
        body: entry,
      }),
      transformResponse: (response: any) => {
        console.log("📦 promoteStudent response:", response);

        if (response?.success && response.data) {
          return response.data;
        }

        return response;
      },
      invalidatesTags: (_, __, { studentUid }) => [
        { type: "Student", id: studentUid },
        { type: "Student", id: "LIST" },
      ],
    }),

    // ==================== UPDATE STIPEND ====================
    updateStipend: builder.mutation<StipendBeneficiary, StipendPayload>({
      query: ({ studentUid, data }) => ({
        url: `/students/${studentUid}/stipend-beneficiary`,
        method: "PATCH",
        body: data,
      }),
      transformResponse: (response: any) => {
        console.log("📦 updateStipend response:", response);

        if (response?.success && response.data) {
          return response.data;
        }

        return response;
      },
      invalidatesTags: (_, __, { studentUid }) => [
        { type: "Student", id: studentUid },
      ],
    }),

    // ==================== GET STIPEND ====================
    getStipend: builder.query<StipendBeneficiary | null, string>({
      query: (uid) => `/students/${uid}/stipend-beneficiary`,
      transformResponse: (response: any) => {
        console.log("📦 getStipend response:", response);

        if (response?.success && response.data) {
          return response.data;
        }

        return null;
      },
      providesTags: (_, __, uid) => [{ type: "Student", id: uid }],
    }),

    // ==================== GET CLASS ROSTER ====================
    getClassRoster: builder.query<
      Student[],
      { class: number; session: string }
    >({
      query: ({ class: cls, session }) => ({
        url: "/students",
        params: { class: cls, session },
      }),
      transformResponse: (response: any) => {
        if (response?.success && Array.isArray(response.data)) {
          return response.data;
        }
        return [];
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map((s) => ({
                type: "Student" as const,
                id: s.studentUid,
              })),
              { type: "Student", id: "LIST" },
            ]
          : [{ type: "Student", id: "LIST" }],
    }),

    // ==================== BULK PROMOTE ====================
    bulkPromoteStudents: builder.mutation<
      { success: boolean; data: { promoted: number } },
      {
        session: string;
        fromClass: number;
        toClass: number;
        studentUids: string[];
        result: "promoted" | "repeat";
        remarks?: string;
      }
    >({
      query: (body) => ({
        url: "/students/bulk-promote",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Student", id: "LIST" }],
    }),
  }),
});

export const {
  useGetStudentsQuery,
  useGetSessionsQuery,
  useGetClassesQuery,
  useGetStudentQuery,
  useCreateStudentMutation,
  useUpdateStudentStatusMutation,
  usePromoteStudentMutation,
   useGetClassRosterQuery,
  useBulkPromoteStudentsMutation,
  useGetStipendQuery,
  useUpdateStipendMutation,
} = studentApi;
