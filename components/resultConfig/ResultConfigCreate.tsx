"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  useGetSessionsQuery,
  useGetClassesQuery,
} from "@/lib/services/studentApi";
import { createResultConfigSchema } from "@/schemas/resultConfig.schema";
import { useCreateResultConfigMutation } from "@/lib/services/resultConfigApi";

import {HistoryTab} from "./HistoryTab";

export default function ResultConfigCreate() {
  const [tab, setTab] = useState<"builder" | "history">("builder");

  const [createConfig, { isLoading }] = useCreateResultConfigMutation();
const { data: sessions = [] } = useGetSessionsQuery();
const { data: classes = [] } = useGetClassesQuery();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createResultConfigSchema),
    defaultValues: {
      exams: [{ key: "written", label: "Written", totalMarks: 100 }],
      normalization: [],
      aggregation: { type: "sum" },
      passRules: { passPercentage: 33 },
    },
  });

  const exams = useFieldArray({
    control,
    name: "exams",
  });

  const normalization = useFieldArray({
    control,
    name: "normalization",
  });

  const onSubmit = async (data: any) => {
    try {
      await createConfig(data).unwrap();

      toast.success("Configuration saved");

      setTab("history");
    } catch (err: any) {
      toast.error(err?.data?.message || "Save failed");
    }
  };

  return (
    <div>
      {/* Tabs */}

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("builder")}
          className={`px-4 py-2 rounded-md text-sm
          ${
            tab === "builder"
              ? "bg-amber-500 text-black"
              : "bg-gray-200 dark:bg-gray-700"
          }
          `}
        >
          Builder
        </button>

        <button
          onClick={() => setTab("history")}
          className={`px-4 py-2 rounded-md text-sm
          ${
            tab === "history"
              ? "bg-amber-500 text-black"
              : "bg-gray-200 dark:bg-gray-700"
          }
          `}
        >
          History
        </button>
      </div>

      {tab === "history" && (
        <HistoryTab sessions={sessions} classOptions={classes} />
      )}

      {tab === "builder" && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Exams */}

          <div className="bg-white dark:bg-gray-900 border rounded-xl p-6">
            <h2 className="font-semibold mb-4">Exams</h2>

            {exams.fields.map((field, i) => (
              <div key={field.id} className="grid grid-cols-4 gap-3 mb-3">
                <input
                  {...register(`exams.${i}.key`)}
                  placeholder="key"
                  className="input"
                />

                <input
                  {...register(`exams.${i}.label`)}
                  placeholder="label"
                  className="input"
                />

                <input
                  type="number"
                  {...register(`exams.${i}.totalMarks`)}
                  className="input"
                />

                <button
                  type="button"
                  onClick={() => exams.remove(i)}
                  className="text-red-500"
                >
                  remove
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                exams.append({
                  key: "",
                  label: "",
                  totalMarks: 100,
                })
              }
              className="text-sm text-blue-500"
            >
              + Add Exam
            </button>
          </div>

          {/* Normalization */}

          <div className="bg-white dark:bg-gray-900 border rounded-xl p-6">
            <h2 className="font-semibold mb-4">Normalization</h2>

            {normalization.fields.map((field, i) => (
              <div key={field.id} className="grid grid-cols-3 gap-3 mb-3">
                <input
                  {...register(`normalization.${i}.examKey`)}
                  placeholder="exam key"
                  className="input"
                />

                <input
                  type="number"
                  {...register(`normalization.${i}.from`)}
                  className="input"
                />

                <input
                  type="number"
                  {...register(`normalization.${i}.to`)}
                  className="input"
                />
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                normalization.append({
                  examKey: "",
                  from: 100,
                  to: 70,
                })
              }
              className="text-sm text-blue-500"
            >
              + Add Rule
            </button>
          </div>

          {/* Pass Rules */}

          <div className="bg-white dark:bg-gray-900 border rounded-xl p-6">
            <h2 className="font-semibold mb-4">Pass Rules</h2>

            <input
              type="number"
              {...register("passRules.passPercentage")}
              placeholder="pass %"
              className="input w-32"
            />
          </div>

          {/* Submit */}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-amber-500 hover:bg-amber-400
              text-black font-medium
              px-6 py-2 rounded-lg"
            >
              {isLoading ? "Saving..." : "Save Config"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
