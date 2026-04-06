// src/types/resultConfig.types.ts
// Mirrors: src/modules/result-config/resultConfig.model.ts

// ─── Reference document types (from academic-setup) ───────────────

/** Mirrors ExamType model — GET /exam-types */
export interface ExamType {
  _id: string;
  name: string; // e.g. "Half Yearly", "Annual"
  code: string; // e.g. "HY", "ANN"
  order: number;
  isActive: boolean;
}

/** Mirrors MarkStructure model — GET /mark-structures */
export interface MarkStructureComponent {
  key: string;
  label: string;
  totalMarks: number;
  required: boolean;
}

export interface MarkStructure {
  _id: string;
  name: string;
  components: MarkStructureComponent[];
}

// ─── ResultConfig sub-types ───────────────────────────────────────

export interface Exam {
  key: string;
  label: string;
  totalMarks: number;
  required?: boolean;
}

export interface Normalization {
  examKey: string;
  from: number;
  to: number;
}

export type AggregationType = "sum" | "average" | "weighted";

export interface Aggregation {
  type: AggregationType;
  examKeys?: string[];
  weights?: Record<string, number>;
}

export interface PassRules {
  passPercentage: number;
  failIfAnySubjectFail: boolean;
}

export type GradingType = "percentage" | "gpa";

export interface GradeScale {
  min: number;
  label: string;
  point?: number;
}

export interface Grading {
  type: GradingType;
  scale?: GradeScale[];
}

// ─── Main document ────────────────────────────────────────────────

export interface ResultConfig {
  _id: string;
  session: string;
  class: number;
  examTypeId: string; // ref → ExamType._id  (required)
  markStructureId: string; // ref → MarkStructure._id  (required)
  version: number;
  isActive: boolean;
  exams: Exam[];
  normalization: Normalization[];
  aggregation: Aggregation;
  passRules?: PassRules;
  grading?: Grading;
  createdAt: string;
  updatedAt: string;
}

// ─── API payloads ─────────────────────────────────────────────────

/** POST /result-config */
export interface CreateResultConfigPayload {
  session: string;
  class: number;
  examTypeId: string; // required — ObjectId string
  markStructureId: string; // required — ObjectId string
  exams: Exam[];
  normalization: Normalization[];
  aggregation: Aggregation;
  passRules?: PassRules;
  grading?: Grading;
}

/** GET /result-config/active */
export interface GetActiveConfigParams {
  session: string;
  class: number;
}

/** GET /result-config */
export interface ListConfigsParams {
  session?: string;
  class?: number;
}

// ─── API response wrappers ────────────────────────────────────────

export type ResultConfigResponse = ResultConfig;
export type ResultConfigListResponse = ResultConfig[];
