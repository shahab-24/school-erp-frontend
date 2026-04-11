import { apiSlice } from "./apiSlice";

export interface Subject {
  _id: string;
  name: string;
  code: string;
  classes: number[];
  isOptional: boolean;
}
export const subjectApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    listSubjects: builder.query<Subject[], void>({
      query: () => "/subjects",
      transformResponse: (res: any) => res.data,
      providesTags: ["Subject"],
    }),

    createSubject: builder.mutation<Subject, Partial<Subject>>({
      query: (body) => ({
        url: "/subjects",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Subject"],
    }),

    // ✅ ADD THIS
    updateSubject: builder.mutation<
      Subject,
      { id: string; body: Partial<Subject> }
    >({
      query: ({ id, body }) => ({
        url: `/subjects/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Subject"],
    }),

    // ✅ ADD THIS
    deleteSubject: builder.mutation<void, string>({
      query: (id) => ({
        url: `/subjects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subject"],
    }),
  }),
});

export const {
  useListSubjectsQuery,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
} = subjectApi;