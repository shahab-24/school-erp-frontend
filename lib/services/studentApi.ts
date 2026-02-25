import { ApiResponse } from "@/types/api.types";


import { apiSlice } from "./apiSlice";
import { PromotePayload, StipendBeneficiary, Student, UpdateStatusPayload } from "@/types/student.types";

export const studentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ===============================
    // GET ALL STUDENTS
    // ===============================
    getStudents: builder.query<ApiResponse<Student[]>, void>({
      query: () => "/students",
      providesTags: ["Student"],
    }),

    // ===============================
    // GET SINGLE STUDENT
    // ===============================
    getStudent: builder.query<ApiResponse<Student>, string>({
      query: (studentUid) => `/students/${studentUid}`,
      providesTags: (result, error, studentUid) => [
        { type: "Student", id: studentUid },
      ],
    }),

    // ===============================
    // CREATE STUDENT
    // ===============================
    createStudent: builder.mutation<ApiResponse<Student>, Student>({
      query: (data) => ({
        url: "/students",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Student"],
    }),

    // ===============================
    // UPDATE STATUS
    // ===============================
    updateStudentStatus: builder.mutation<
      ApiResponse<Student>,
      { studentUid: string; payload: UpdateStatusPayload }
    >({
      query: ({ studentUid, payload }) => ({
        url: `/students/${studentUid}/status`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Student", id: arg.studentUid },
      ],
    }),

    // ===============================
    // PROMOTE STUDENT
    // ===============================
    promoteStudent: builder.mutation<
      ApiResponse<Student>,
      { studentUid: string; payload: PromotePayload }
    >({
      query: ({ studentUid, payload }) => ({
        url: `/students/${studentUid}/promote`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Student", id: arg.studentUid },
      ],
    }),

    // ===============================
    // GET STIPEND
    // ===============================
    getStipend: builder.query<ApiResponse<StipendBeneficiary>, string>({
      query: (studentUid) => `/students/${studentUid}/stipend-beneficiary`,
      providesTags: (result, error, studentUid) => [
        { type: "Student", id: studentUid },
      ],
    }),

    getStudentByUid: builder.query<Student, string>({
      query: (uid) => `/students/${uid}`,
      providesTags: (result, error, uid) => [{ type: "Student", id: uid }],
    }),

    // ===============================
    // UPDATE STIPEND
    // ===============================
    updateStipend: builder.mutation<
      ApiResponse<StipendBeneficiary>,
      { studentUid: string; payload: StipendBeneficiary }
    >({
      query: ({ studentUid, payload }) => ({
        url: `/students/${studentUid}/stipend-beneficiary`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Student", id: arg.studentUid },
      ],
    }),
  }),
});

export const {
  useGetStudentsQuery,
  useGetStudentQuery,
  useCreateStudentMutation,
  useUpdateStudentStatusMutation,
  usePromoteStudentMutation,
  useGetStipendQuery,
  useUpdateStipendMutation,
  useGetStudentByUidQuery
} = studentApi;
