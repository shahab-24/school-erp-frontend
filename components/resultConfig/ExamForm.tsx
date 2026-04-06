"use client";

import { UseFieldArrayReturn, UseFormRegister } from "react-hook-form";

interface Props {
  fields: any[];
  register: UseFormRegister<any>;
  remove: (index: number) => void;
  append: (data: any) => void;
}

export default function ExamForm({ fields, register, remove, append }: Props) {
  return (
    <div className="space-y-3">
      {fields.map((field, i) => (
        <div
          key={field.id}
          className="grid grid-cols-5 gap-3 bg-gray-50 dark:bg-gray-800 p-3 rounded"
        >
          <input
            {...register(`exams.${i}.key`)}
            placeholder="key"
            className="input"
          />

          <input
            {...register(`exams.${i}.label`)}
            placeholder="Label"
            className="input"
          />

          <input
            type="number"
            {...register(`exams.${i}.totalMarks`, {
              valueAsNumber: true,
            })}
            className="input"
          />

          <input type="checkbox" {...register(`exams.${i}.required`)} />

          <button
            type="button"
            onClick={() => remove(i)}
            className="text-red-500"
          >
            ✕
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          append({
            key: "",
            label: "",
            totalMarks: 100,
            required: true,
          })
        }
        className="btn-secondary"
      >
        Add Exam
      </button>
    </div>
  );
}
