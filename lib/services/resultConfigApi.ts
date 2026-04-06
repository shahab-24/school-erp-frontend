// src/lib/services/resultConfigApi.ts
import { apiSlice } from "./apiSlice";
import type {
  ExamType,
  MarkStructure,
  ResultConfigResponse,
  ResultConfigListResponse,
  CreateResultConfigPayload,
  GetActiveConfigParams,
  ListConfigsParams,
} from "@/types/resultConfig.types";

// ─── Cache tag helpers ────────────────────────────────────────────

const tag = (id: string) => ({ type: "ResultConfig" as const, id });
const LIST = { type: "ResultConfig" as const, id: "LIST" };

// ─── API Slice ────────────────────────────────────────────────────

export const resultConfigApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ── Academic-setup references ─────────────────────────────────

    // GET /exam-types  →  ExamType[]
    // Used to populate examTypeId dropdown in BuilderForm
    getExamTypes: builder.query<ExamType[], void>({
      query: () => "/exam-types",
      transformResponse: (res: { data: ExamType[] } | ExamType[]) =>
        Array.isArray(res) ? res : res.data ?? [],
      providesTags: [{ type: "ResultConfig" as const, id: "EXAM_TYPES" }],
    }),

    // GET /mark-structures  →  MarkStructure[]
    // Used to populate markStructureId dropdown in BuilderForm
    getMarkStructures: builder.query<MarkStructure[], void>({
      query: () => "/mark-structures",
      transformResponse: (res: { data: MarkStructure[] } | MarkStructure[]) =>
        Array.isArray(res) ? res : res.data ?? [],
      providesTags: [{ type: "ResultConfig" as const, id: "MARK_STRUCTURES" }],
    }),

    // ── ResultConfig CRUD ─────────────────────────────────────────

    // POST /result-config
    // Service auto-deactivates previous version and increments version number
    createResultConfig: builder.mutation<
      ResultConfigResponse,
      CreateResultConfigPayload
    >({
      query: (body) => ({ url: "/result-config", method: "POST", body }),
      invalidatesTags: [LIST],
    }),

    // GET /result-config/active?session=2025&class=5
    getActiveResultConfig: builder.query<
      ResultConfigResponse | null,
      GetActiveConfigParams
    >({
      query: ({ session, class: cls }) => ({
        url: "/result-config/active",
        params: { session, class: cls },
      }),
      transformErrorResponse: (res) => (res.status === 404 ? null : res),
      providesTags: (_, __, { session, class: cls }) => [
        tag(`${session}-${cls}-active`),
      ],
    }),

    // GET /result-config?session=2025&class=5
    listResultConfigs: builder.query<
      ResultConfigListResponse,
      ListConfigsParams
    >({
      query: (params = {}) => ({
        url: "/result-config",
        params: Object.fromEntries(
          Object.entries(params).filter(([, v]) => v !== undefined && v !== "")
        ),
      }),
      providesTags: (result) =>
        result ? [...result.map((c) => tag(c._id)), LIST] : [LIST],
    }),
  }),
});

export const {
  useGetExamTypesQuery,
  useGetMarkStructuresQuery,
  useCreateResultConfigMutation,
  useGetActiveResultConfigQuery,
  useListResultConfigsQuery,
} = resultConfigApi;
