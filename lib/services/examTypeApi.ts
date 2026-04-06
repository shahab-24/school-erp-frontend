// lib/services/examTypeApi.ts
import { ExamType } from "@/types/academicSetup.types";
import { apiSlice } from "./apiSlice";

// export interface ExamType {
//   _id: string;
//   name: string;
//   code: string;
//   order: number;
//   isActive: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

export const examTypeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET - No CSRF needed
    listExamTypes: builder.query<ExamType[], void>({
      query: () => "/exam-types",
      transformResponse: (response: { success: boolean; data: ExamType[] }) => {
        console.log("📦 Exam types response:", response);
        return response?.data || [];
      },
      providesTags: ["ExamType"],
    }),

    // POST - CSRF automatically added by interceptor
    createExamType: builder.mutation<ExamType, Partial<ExamType>>({
      query: (body) => {
        console.log("📝 Creating exam type:", body);
        return {
          url: "/exam-types",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["ExamType"],
    }),

    // PATCH - CSRF automatically added
    updateExamType: builder.mutation<
      ExamType,
      { id: string; body: Partial<ExamType> }
    >({
      query: ({ id, body }) => ({
        url: `/exam-types/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "ExamType", id },
        "ExamType",
      ],
    }),

    // PATCH /toggle - CSRF automatically added
    toggleExamType: builder.mutation<ExamType, string>({
      query: (id) => ({
        url: `/exam-types/${id}/toggle`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "ExamType", id },
        "ExamType",
      ],
    }),

    // DELETE - CSRF automatically added
    deleteExamType: builder.mutation<void, string>({
      query: (id) => ({
        url: `/exam-types/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ExamType"],
    }),
  }),
});

export const {
  useListExamTypesQuery,
  useCreateExamTypeMutation,
  useUpdateExamTypeMutation,
  useToggleExamTypeMutation,
  useDeleteExamTypeMutation,
} = examTypeApi;
