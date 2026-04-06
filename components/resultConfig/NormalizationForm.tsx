"use client";

interface Props {
  exams: any[];
  fields: any[];
  register: any;
  append: any;
  remove: any;
}

export default function NormalizationForm({
  exams,
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
          <select {...register(`normalization.${i}.examKey`)} className="input">
            <option value="">Select exam</option>
            {exams.map((e) => (
              <option key={e.key} value={e.key}>
                {e.key}
              </option>
            ))}
          </select>

          <input
            type="number"
            {...register(`normalization.${i}.from`, {
              valueAsNumber: true,
            })}
            className="input"
          />

          <input
            type="number"
            {...register(`normalization.${i}.to`, {
              valueAsNumber: true,
            })}
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
            examKey: "",
            from: 100,
            to: 70,
          })
        }
        className="btn-secondary"
      >
        Add Rule
      </button>
    </div>
  );
}
