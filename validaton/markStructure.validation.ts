import { z } from "zod";

// ─── Component Schema ─────────────────────────

export const componentSchema = z.object({
  key: z.string().min(1, "Key required").max(50),

  label: z.string().min(1, "Label required").max(100),

  totalMarks: z
    .number("Marks must be number" )
    .min(0, "Must be >= 0"),

  required: z.boolean().optional().default(true),
});

// ─── Create Schema ────────────────────────────

export const createMarkStructureSchema = z
  .object({
    name: z.string().min(1).max(100),

    components: z
      .array(componentSchema)
      .min(1, "At least one component required"),
  })
  .refine(
    (data) => {
      // ✅ unique keys
      const keys = data.components.map((c) => c.key);
      return new Set(keys).size === keys.length;
    },
    {
      message: "Duplicate component keys not allowed",
      path: ["components"],
    }
  )
  .refine(
    (data) => {
      // ✅ total > 0
      const total = data.components.reduce(
        (sum: number, c) => sum + c.totalMarks,
        0
      );
      return total > 0;
    },
    {
      message: "Total marks must be greater than 0",
      path: ["components"],
    }
  );

// ─── Update Schema ────────────────────────────

export const updateMarkStructureSchema = createMarkStructureSchema.partial();

// ─── Types ────────────────────────────────────

export type CreateMarkStructureInput = z.infer<
  typeof createMarkStructureSchema
>;

export type UpdateMarkStructureInput = z.infer<
  typeof updateMarkStructureSchema
>;
