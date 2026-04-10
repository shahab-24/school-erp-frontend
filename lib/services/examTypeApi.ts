import { ExamType } from "@/types/academicSetup.types";
import { apiSlice } from "./apiSlice";

export const examTypeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET
    listExamTypes: builder.query<ExamType[], void>({
      query: () => "/exam-types",
      transformResponse: (response: { success: boolean; data: ExamType[] }) =>
        response?.data || [],
      providesTags: ["ExamType"],
    }),

    // ✅ CREATE
    createExamType: builder.mutation<ExamType, Partial<ExamType>>({
      query: (body) => ({
        url: "/exam-types",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ExamType"],
    }),

    // ✅ UPDATE
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

    // ✅ TOGGLE
    toggleExamType: builder.mutation<ExamType, string>({
      query: (id) => ({
        url: `/exam-types/${id}/toggle`,
        method: "PATCH",
      }),

      // 🔥 OPTIMISTIC UPDATE (FAST UI)
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          examTypeApi.util.updateQueryData(
            "listExamTypes",
            undefined,
            (draft) => {
              const item = draft.find((d) => d._id === id);
              if (item) item.isActive = !item.isActive;
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },

      invalidatesTags: ["ExamType"],
    }),

    // ✅ DELETE
    deleteExamType: builder.mutation<void, string>({
      query: (id) => ({
        url: `/exam-types/${id}`,
        method: "DELETE",
      }),

      // 🔥 optimistic remove
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          examTypeApi.util.updateQueryData(
            "listExamTypes",
            undefined,
            (draft) => {
              return draft.filter((d) => d._id !== id);
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },

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
