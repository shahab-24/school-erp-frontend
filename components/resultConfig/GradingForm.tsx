"use client";

interface Props {
  fields: any[];
  register: any;
  append: any;
  remove: any;
}

export default function GradingForm({
  fields,
  register,
  append,
  remove,
}: Props) {
  return (
    <div className="space-y-3">
      {fields.map((field, i) => (
        <div
          key={field.id}
          className="grid grid-cols-4 gap-3 bg-gray-50 dark:bg-gray-800 p-3 rounded"
        >
          <input
            type="number"
            {...register(`grading.scale.${i}.min`, {
              valueAsNumber: true,
            })}
            placeholder="Min"
            className="input"
          />

          <input
            {...register(`grading.scale.${i}.label`)}
            placeholder="Grade"
            className="input"
          />

          <input
            type="number"
            {...register(`grading.scale.${i}.point`, {
              valueAsNumber: true,
            })}
            placeholder="GPA"
            className="input"
          />

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
            min: 0,
            label: "",
            point: 0,
          })
        }
        className="btn-secondary"
      >
        Add Grade
      </button>
    </div>
  );
}
