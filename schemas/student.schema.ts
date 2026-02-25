import { z } from "zod";

const localized = z.object({
  en: z.string().min(1),
  bn: z.string().min(1),
});

const parentSchema = z.object({
  name: localized,
  mobile: z.string().min(6),
  nid: z.string().min(5),
  birthRegistration: z.string().min(10),
});

const guardianSchema = z.object({
  relation: z.enum(["guardian", "other"]),
  name: localized,
  mobile: z.string().min(6),
  nid: z.string().optional(),
  walletProvider: z.enum(["bKash", "Nagad", "Rocket", "Other"]),
});

export const studentSchema = z.object({
  studentUid: z.string().min(3),
  name: localized,
  gender: z.enum(["male", "female", "other"]),
  religion: z.string(),
  birthDate: z.string(),
  birthRegistration: z.string(),
  father: parentSchema,
  mother: parentSchema,
  guardians: z.array(guardianSchema).optional(),

  current: z.object({
    session: z.string(),

    class: z.preprocess((val) => Number(val), z.number().int().positive()),

    roll: z.preprocess((val) => Number(val), z.number().int().positive()),
  }),
});

export type StudentFormData = z.infer<typeof studentSchema>;
