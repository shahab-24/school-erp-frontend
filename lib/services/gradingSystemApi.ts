import { apiSlice } from "./apiSlice";

export interface GradeScale {
  min: number;
  label: string;
  point?: number;
}

export interface GradingSystem {
  _id: string;
  type: "percentage" | "gpa";
  scale: GradeScale[];
}
export const gradingSystemApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listGrading: builder.query<GradingSystem[], void>({
      query: () => "/grading-system",
      transformResponse: (res: any) => res.data,
      providesTags: ["Grading"],
    }),

    createGrading: builder.mutation<GradingSystem, Partial<GradingSystem>>({
      query: (body) => ({
        url: "/grading-system",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Grading"],
    }),

    // ✅ ADD THIS
    updateGrading: builder.mutation<
      GradingSystem,
      { id: string; body: Partial<GradingSystem> }
    >({
      query: ({ id, body }) => ({
        url: `/grading-system/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Grading"],
    }),

    // ✅ ADD THIS
    deleteGrading: builder.mutation<void, string>({
      query: (id) => ({
        url: `/grading-system/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Grading"],
    }),
  }),
});

export const {
  useListGradingQuery,
  useCreateGradingMutation,
  useUpdateGradingMutation,
  useDeleteGradingMutation,
} = gradingSystemApi;