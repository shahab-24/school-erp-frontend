"use client";

import { useState } from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { studentSchema, StudentFormData } from "@/schemas/student.schema";
import { useCreateStudentMutation } from "@/lib/services/studentApi";
import { useToast } from "@/components/ui/use-toast";

/* ───────────────────────────────────────────── */

const STEPS = [
  { id: 1, label: "Student" },
  { id: 2, label: "Father" },
  { id: 3, label: "Mother" },
  { id: 4, label: "Guardians" },
  { id: 5, label: "Class" },
];

/* ───────────────────────────────────────────── */

export default function StudentCreateForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [createStudent, { isLoading }] = useCreateStudentMutation();

  const [step, setStep] = useState<number>(1);

  const {
    register,
    control,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      guardians: [],
    },
    mode: "onTouched",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "guardians",
  });

  /* ───────── STEP VALIDATION ───────── */

  const STEP_FIELDS: Record<number, (keyof StudentFormData)[]> = {
    1: [
      "studentUid",
      "name",
      "gender",
      "religion",
      "birthDate",
      "birthRegistration",
    ],
    2: ["father"],
    3: ["mother"],
    4: ["guardians"],
    5: ["current"],
  };

  const nextStep = async () => {
    const valid = await trigger(STEP_FIELDS[step] as any);
    if (valid) setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  /* ───────── SUBMIT ───────── */

  const onSubmit: SubmitHandler<StudentFormData> = async (data) => {
    try {
      await createStudent({
        ...data,
        guardians: data.guardians?.filter((g) => g.name.en.trim() !== "") ?? [],
      }).unwrap();

      toast({
        title: "Student Registered",
        description: `${data.name.en} added successfully`,
      });

      router.push("/students");
    } catch (err: any) {
      toast({
        title: "Registration Failed",
        description: err?.data?.message ?? "Something went wrong",
        variant: "destructive",
      });
    }
  };

  /* ───────────────────────────────────────────── */

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* ───── STEP 1 ───── */}
      {step === 1 && (
        <div className="grid grid-cols-2 gap-4">
          <input
            {...register("studentUid")}
            placeholder="Student UID"
            className="erp-input"
          />

          <input
            {...register("birthRegistration")}
            placeholder="Birth Registration"
            className="erp-input"
          />

          <input
            {...register("name.en")}
            placeholder="Name (EN)"
            className="erp-input"
          />

          <input
            {...register("name.bn")}
            placeholder="Name (BN)"
            className="erp-input"
          />

          <input type="date" {...register("birthDate")} className="erp-input" />

          <select {...register("gender")} className="erp-input">
            <option value="">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <input
            {...register("religion")}
            placeholder="Religion"
            className="erp-input"
          />
        </div>
      )}

      {/* ───── STEP 2 & 3 ───── */}
      {(step === 2 || step === 3) && (
        <div className="grid grid-cols-2 gap-4">
          <input
            {...register(`${step === 2 ? "father" : "mother"}.name.en`)}
            placeholder="Name (EN)"
            className="erp-input"
          />

          <input
            {...register(`${step === 2 ? "father" : "mother"}.name.bn`)}
            placeholder="Name (BN)"
            className="erp-input"
          />

          <input
            {...register(`${step === 2 ? "father" : "mother"}.mobile`)}
            placeholder="Mobile"
            className="erp-input"
          />

          <input
            {...register(`${step === 2 ? "father" : "mother"}.nid`)}
            placeholder="NID"
            className="erp-input"
          />

          <input
            {...register(
              `${step === 2 ? "father" : "mother"}.birthRegistration`
            )}
            placeholder="Birth Registration"
            className="erp-input"
          />
        </div>
      )}

      {/* ───── STEP 4: GUARDIANS ───── */}
      {step === 4 && (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="border p-4 rounded-lg space-y-3">
              <select
                {...register(`guardians.${index}.relation`)}
                className="erp-input"
              >
                <option value="guardian">Guardian</option>
                <option value="other">Other</option>
              </select>

              <input
                {...register(`guardians.${index}.name.en`)}
                placeholder="Name EN"
                className="erp-input"
              />

              <input
                {...register(`guardians.${index}.name.bn`)}
                placeholder="Name BN"
                className="erp-input"
              />

              <input
                {...register(`guardians.${index}.mobile`)}
                placeholder="Mobile"
                className="erp-input"
              />

              <select
                {...register(`guardians.${index}.walletProvider`)}
                className="erp-input"
              >
                <option value="bKash">bKash</option>
                <option value="Nagad">Nagad</option>
                <option value="Rocket">Rocket</option>
                <option value="Other">Other</option>
              </select>

              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-500 text-sm"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              append({
                relation: "guardian",
                name: { en: "", bn: "" },
                mobile: "",
                walletProvider: "bKash",
              })
            }
            className="erp-btn-ghost"
          >
            Add Guardian
          </button>
        </div>
      )}

      {/* ───── STEP 5: CLASS ───── */}
      {step === 5 && (
        <div className="grid grid-cols-3 gap-4">
          <input
            {...register("current.session")}
            placeholder="Session"
            className="erp-input"
          />

          {/* FIXED NUMBER ISSUE */}
          <select {...register("current.class")} className="erp-input">
            <option value="">Class</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <input
            type="number"
            {...register("current.roll")}
            placeholder="Roll"
            min={1}
            className="erp-input"
          />
        </div>
      )}

      {/* ───── NAVIGATION ───── */}
      <div className="flex justify-between pt-6 border-t">
        {step > 1 ? (
          <button type="button" onClick={prevStep} className="erp-btn-ghost">
            Previous
          </button>
        ) : (
          <div />
        )}

        {step < STEPS.length ? (
          <button type="button" onClick={nextStep} className="erp-btn-primary">
            Next
          </button>
        ) : (
          <button
            type="submit"
            disabled={isLoading}
            className="erp-btn-primary"
          >
            {isLoading ? "Registering..." : "Register Student"}
          </button>
        )}
      </div>
    </form>
  );
}
