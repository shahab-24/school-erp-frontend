
import { ApiResponse } from "@/types/api.types";
import { apiSlice } from "./apiSlice";
import { Student } from "@/types/student.types";

export const studentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query<ApiResponse<Student[]>, void>({
      query: () => "/students",
      providesTags: ["Student"],
    }),

    createStudent: builder.mutation<ApiResponse<Student>, Student>({
      query: (data) => ({
        url: "/students",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Student"],
    }),
  }),
});

export const { useGetStudentsQuery, useCreateStudentMutation } = studentApi;
