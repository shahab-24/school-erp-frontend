import { z } from "zod";

// ─── Helpers ─────────────────────────────────────────

// Mongo ObjectId
const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ID");

// ─── Exam Schema ─────────────────────────────────────

export const examSchema = z.object({
  key: z.string().min(1, "Key is required"),
  label: z.string().min(1, "Label is required"),
  totalMarks: z.coerce
    .number()
    .positive("Must be positive")
    .max(100, "Too large"),
  required: z.boolean().optional(),
});

// ─── Normalization ───────────────────────────────────

export const normalizationSchema = z
  .object({
    examKey: z.string().min(1, "Select an exam"),
    from: z.coerce.number().min(0, "Must be ≥ 0"),
    to: z.coerce.number().min(0, "Must be ≥ 0"),
  })
  .refine((data) => data.from < data.to, {
    message: "`from` must be less than `to`",
    path: ["from"],
  });

// ─── Aggregation ─────────────────────────────────────

export const aggregationSchema = z
  .object({
    type: z.enum(["sum", "average", "weighted"]),
    examKeys: z.array(z.string()).optional(),
    weights: z.record(z.string(), z.coerce.number().min(0).max(100)).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "weighted") {
      if (!data.weights || Object.keys(data.weights).length === 0) {
        ctx.addIssue({
          code: "custom",
          message: "Weights required for weighted aggregation",
        });
        return;
      }

      const totalWeight = Object.values(data.weights).reduce(
        (s, w) => s + w,
        0
      );

      if (totalWeight !== 100) {
        ctx.addIssue({
          code: "custom",
          message: "Total weight must be 100",
        });
      }
    }
  });

// ─── Pass Rules ──────────────────────────────────────

const passRulesSchema = z.object({
  passPercentage: z.coerce.number().min(0).max(100),
  failIfAnySubjectFail: z.boolean(),
});

// ─── Grading ─────────────────────────────────────────

const gradingSchema = z
  .object({
    type: z.enum(["percentage", "gpa"]),
    scale: z
      .array(
        z.object({
          min: z.coerce.number().min(0).max(100),
          label: z.string().min(1),
          point: z.coerce.number().optional(),
        })
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    // GPA scale required
    if (data.type === "gpa" && (!data.scale || data.scale.length === 0)) {
      ctx.addIssue({
        code: "custom",
        message: "GPA scale required",
      });
      return;
    }

    if (data.scale) {
      // descending order check
      for (let i = 1; i < data.scale.length; i++) {
        if (data.scale[i].min > data.scale[i - 1].min) {
          ctx.addIssue({
            code: "custom",
            message: "Scale must be sorted descending",
          });
        }
      }

      // duplicate min check
      const mins = data.scale.map((s) => s.min);
      const unique = new Set(mins);
      if (unique.size !== mins.length) {
        ctx.addIssue({
          code: "custom",
          message: "Duplicate grading ranges detected",
        });
      }
    }
  });

// ─── MAIN SCHEMA ─────────────────────────────────────

export const createResultConfigSchema = z
  .object({
    session: z.string().min(1, "Session is required"),

    class: z.coerce
      .number()
      .int("Must be integer")
      .positive("Must be positive"),

    examTypeId: objectIdSchema,
    markStructureId: objectIdSchema,

    exams: z.array(examSchema).min(1, "At least one exam is required"),

    normalization: z.array(normalizationSchema).optional(),

    aggregation: aggregationSchema,

    passRules: passRulesSchema.optional(),

    grading: gradingSchema.optional(),
  })
  .superRefine((data, ctx) => {
    const examKeys = data.exams.map((e) => e.key);

    // ── 1. Duplicate exam key check ──
    const uniqueKeys = new Set(examKeys);
    if (uniqueKeys.size !== examKeys.length) {
      ctx.addIssue({
        code: "custom",
        message: "Duplicate exam keys are not allowed",
      });
    }

    // ── 2. Normalization examKey validation ──
    if (data.normalization) {
      for (const n of data.normalization) {
        if (!examKeys.includes(n.examKey)) {
          ctx.addIssue({
            code: "custom",
            message: `Invalid examKey in normalization: ${n.examKey}`,
          });
        }
      }

      // ── 3. Normalization overlap check ──
      const ranges = data.normalization.map((n) => ({
        from: n.from,
        to: n.to,
      }));

      ranges.sort((a, b) => a.from - b.from);

      for (let i = 1; i < ranges.length; i++) {
        if (ranges[i].from < ranges[i - 1].to) {
          ctx.addIssue({
            code: "custom",
            message: "Normalization ranges overlap",
          });
        }
      }
    }

    // ── 4. Aggregation examKeys validation ──
    if (data.aggregation.examKeys) {
      for (const key of data.aggregation.examKeys) {
        if (!examKeys.includes(key)) {
          ctx.addIssue({
            code: "custom",
            message: `Invalid examKey in aggregation: ${key}`,
          });
        }
      }
    }

    // ── 5. Weighted aggregation key match ──
    if (data.aggregation.type === "weighted" && data.aggregation.weights) {
      const weightKeys = Object.keys(data.aggregation.weights);

      for (const key of weightKeys) {
        if (!examKeys.includes(key)) {
          ctx.addIssue({
            code: "custom",
            message: `Invalid weight key: ${key}`,
          });
        }
      }
    }

    // ── 6. Total marks sanity check ──
    const totalMarks = data.exams.reduce((s, e) => s + e.totalMarks, 0);

    if (totalMarks <= 0) {
      ctx.addIssue({
        code: "custom",
        message: "Total marks must be greater than 0",
      });
    }
  });

export type ResultConfigFormData = z.infer<typeof createResultConfigSchema>;
