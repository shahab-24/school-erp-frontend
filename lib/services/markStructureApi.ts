// src/lib/services/markStructureApi.ts
import { apiSlice } from "./apiSlice";
import type {
  MarkStructure,
  MarkStructureComponent,
} from "@/types/academicSetup.types";

// ─── Cache tag helpers ────────────────────────────────────────────

const T = (id: string) => ({ type: "MarkStructure" as const, id });
const LIST = { type: "MarkStructure" as const, id: "LIST" };

type ListRes = MarkStructure[] | { data: MarkStructure[] };
const unwrap = (res: ListRes): MarkStructure[] =>
  Array.isArray(res) ? res : res.data ?? [];

// ─── Payload types ────────────────────────────────────────────────

export interface CreateMarkStructurePayload {
  name: string;
  components: MarkStructureComponent[];
}

// ─── API Slice ────────────────────────────────────────────────────

export const markStructureApi = apiSlice.injectEndpoints({
  endpoints: (b) => ({
    // GET /mark-structures?schoolId=xxx
    listMarkStructures: b.query<MarkStructure[], void>({
      query: () => "/mark-structures",
      transformResponse: unwrap,
      providesTags: (result) =>
        result ? [...result.map((ms) => T(ms._id)), LIST] : [LIST],
    }),

    // POST /mark-structures
    createMarkStructure: b.mutation<MarkStructure, CreateMarkStructurePayload>({
      query: (body) => ({ url: "/mark-structures", method: "POST", body }),
      invalidatesTags: [LIST],
    }),

    // PATCH /mark-structures/:id
    updateMarkStructure: b.mutation<
      MarkStructure,
      { id: string; body: Partial<CreateMarkStructurePayload> }
    >({
      query: ({ id, body }) => ({
        url: `/mark-structures/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_, __, { id }) => [T(id), LIST],
    }),

    // DELETE /mark-structures/:id
    deleteMarkStructure: b.mutation<void, string>({
      query: (id) => ({ url: `/mark-structures/${id}`, method: "DELETE" }),
      invalidatesTags: (_, __, id) => [T(id), LIST],
    }),
  }),
});

export const {
  useListMarkStructuresQuery,
  useCreateMarkStructureMutation,
  useUpdateMarkStructureMutation,
  useDeleteMarkStructureMutation,
} = markStructureApi;
