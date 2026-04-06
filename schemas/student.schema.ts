// // src/schemas/student.schema.ts
// // 100% mirrors backend createStudentSchema in student.validation.ts

// import { z } from "zod";

// const bdMobile = z
//   .string()
//   .min(1, "Mobile number required")
//   .regex(/^01[3-9]\d{8}$/, "Invalid BD number (e.g. 01712345678)");

// const localizedName = z.object({
//   en: z.string().min(2, "English name required"),
//   bn: z.string().optional().default(""),
// });

// const parentSchema = z.object({
//   name: localizedName,
//   mobile: bdMobile,
//   nid: z.string().min(5, "NID required"),
//   birthRegistration: z.string().min(10, "Birth registration required"),
// });

// const guardianSchema = z.object({
//   relation: z.enum(["guardian", "other"]),
//   name: localizedName,
//   mobile: bdMobile,
//   nid: z.string().optional().default(""),
//   walletProvider: z.enum(["bKash", "Nagad", "Rocket", "Other"]),
// });

// export const studentSchema = z.object({
//   studentUid: z
//     .string()
//     .min(3, "Student UID required")
//     .regex(/^[A-Z0-9\-]+$/, "Uppercase, numbers & hyphens only"),

//   name: localizedName,

//   gender: z.enum(["male", "female", "other"], {
//     errorMap: () => ({ message: "Select a gender" }),
//   }),

//   religion: z.string().min(1, "Religion required"),

//   birthDate: z.string().min(1, "Date of birth required"),

//   birthRegistration: z.string().min(10, "Birth registration required"),

//   languagePreference: z.enum(["bn", "en"]).default("bn"),

//   father: parentSchema,
//   mother: parentSchema,

//   guardians: z.array(guardianSchema).default([]),

//   imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),

//   current: z.object({
//     session: z.string().min(4, "Session required (e.g. 2025)"),
//     class: z.coerce
//       .number({ invalid_type_error: "Select a class" })
//       .int()
//       .min(1)
//       .max(10),
//     roll: z.coerce
//       .number({ invalid_type_error: "Roll number required" })
//       .int()
//       .min(1),
//   }),
// });

// export type StudentFormData = z.infer<typeof studentSchema>;

// // ─── Promote schema ────────────────────────────────────────────
// export const promoteSchema = z
//   .object({
//     session: z.string().min(4, "Session required"),
//     fromClass: z.coerce.number().int().min(1).max(10),
//     toClass: z.coerce.number().int().min(1).max(10),
//     result: z.enum(["promoted", "repeat"]),
//     previousRoll: z.coerce.number().int().min(1).optional(),
//     newRoll: z.coerce.number().int().min(1).optional(),
//   })
//   .refine((d) => d.toClass >= d.fromClass, {
//     message: "Target class must be ≥ current class",
//     path: ["toClass"],
//   });

// export type PromoteFormData = z.infer<typeof promoteSchema>;

// // ─── Stipend schema ────────────────────────────────────────────
// export const stipendSchema = z.object({
//   name: z.string().min(2, "Name required"),
//   mobile: bdMobile,
//   relation: z.enum(["father", "mother", "guardian", "other"]),
//   paymentMethod: z.enum(["mobile_banking", "bank", "cash"]),
//   walletProvider: z.enum(["bKash", "Nagad", "Rocket", "Other"]),
// });

// export type StipendFormData = z.infer<typeof stipendSchema>;

// // ─── Status schema ─────────────────────────────────────────────
// export const statusSchema = z.object({
//   status: z.enum(["active", "repeat", "passed", "transferred", "archived"]),
// });
// src/schemas/student.schema.ts
import { z } from "zod";

// ─── Reusables ────────────────────────────────────────────────────

const bdMobile = z
  .string()
  .min(1, "Mobile is required")
  .regex(/^01[3-9]\d{8}$/, "Invalid mobile number (e.g. 01XXXXXXXXX)");

const localizedName = z.object({
  en: z.string().min(2, "English name required").max(100),
  bn: z.string().max(100).optional().or(z.literal("")),
});

const parentSchema = z.object({
  name:              localizedName,
  mobile:            bdMobile,
  nid:               z.string().regex(/^\d{10}$|^\d{17}$/, "NID must be 10 or 17 digits"),
  birthRegistration: z.string().regex(/^\d{17}$/, "Must be 17 digits"),
  occupation:        z.string().max(100).optional().or(z.literal("")),
  education:         z.string().max(100).optional().or(z.literal("")),
});

// ─── Create Student ───────────────────────────────────────────────

export const studentSchema = z.object({
  studentUid: z
    .string()
    .min(3, "UID too short")
    .max(30)
    .regex(/^[A-Z0-9\-]+$/, "Uppercase letters, numbers, hyphens only"),

  name: localizedName,
  gender: z.enum(["male", "female", "other"]).refine(Boolean, {
  message: "Select gender",
}),
  
  religion: z.string().min(1, "Religion required"),
  birthDate: z.string().min(1, "Date of birth required"),
  birthRegistration: z.string().regex(/^\d{17}$/, "Must be 17 digits"),
  languagePreference: z.enum(["bn", "en"]).optional().default("bn"),
  imageUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  bloodGroup: z
    .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "unknown"])
    .optional()
    .or(z.literal("")),
  nationality: z.string().default("Bangladeshi"),

  address: z
    .object({
      village: z.string().min(1, "Village required"),
      union: z.string().min(1, "Union required"),
      upazila: z.string().min(1, "Upazila required"),
      district: z.string().min(1, "District required"),
      postCode: z.string().optional().or(z.literal("")),
    })
    .optional(),

  father: parentSchema,
  mother: parentSchema,

  guardians: z
    .array(
      z.object({
        relation: z.enum(["guardian", "other"]),
        name: localizedName,
        mobile: bdMobile,
        nid: z
          .string()
          .regex(/^\d{10}$|^\d{17}$/)
          .optional()
          .or(z.literal("")),
        walletProvider: z
          .enum(["bKash", "Nagad", "Rocket", "Other"])
          .default("bKash"),
      })
    )
    .default([]),

  current: z.object({
    session: z.string().min(4, "Session required"),
    class: z.coerce.number().int().min(1, "Class required").max(10),

    roll: z.coerce.number().int().min(1, "Roll required"),
  }),
});

export type StudentFormData = Omit<
  z.infer<typeof studentSchema>,
  "languagePreference"
> & {
  languagePreference: "bn" | "en";
};

// ─── Promote ──────────────────────────────────────────────────────

export const promoteSchema = z
  .object({
    session:      z.string().min(4),
    fromClass:    z.coerce.number().int().min(1).max(10),
    toClass:      z.coerce.number().int().min(1).max(10),
    result:       z.enum(["promoted", "repeat"]),
    previousRoll: z.coerce.number().int().min(1).optional(),
    newRoll:      z.coerce.number().int().min(1).optional(),
    remarks:      z.string().max(500).optional().or(z.literal("")),
  })
  .refine(
    (d) => d.result === "repeat" ? true : d.toClass >= d.fromClass,
    { message: "Promotion class must be ≥ current class", path: ["toClass"] }
  );

export type PromoteFormData = z.infer<typeof promoteSchema>;

// ─── Stipend ──────────────────────────────────────────────────────

export const stipendSchema = z.object({
  name:           z.string().min(2),
  mobile:         bdMobile,
  relation:       z.enum(["father", "mother", "guardian", "other"]),
  paymentMethod:  z.enum(["mobile_banking", "bank", "cash"]),
  walletProvider: z.enum(["bKash", "Nagad", "Rocket", "Other"]).optional(),
  bankName:       z.string().max(100).optional().or(z.literal("")),
  accountNumber:  z.string().max(30).optional().or(z.literal("")),
});

export type StipendFormData = z.infer<typeof stipendSchema>;

// ─── Bulk promote ─────────────────────────────────────────────────

export const bulkPromoteSchema = z.object({
  session:     z.string().min(4),
  fromClass:   z.coerce.number().int().min(1).max(10),
  toClass:     z.coerce.number().int().min(1).max(10),
  studentUids: z.array(z.string()).min(1),
  result:      z.enum(["promoted", "repeat"]).default("promoted"),
  remarks:     z.string().max(500).optional().or(z.literal("")),
});

export type BulkPromoteFormData = z.infer<typeof bulkPromoteSchema>;