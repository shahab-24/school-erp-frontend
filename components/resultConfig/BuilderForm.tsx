// src/app/(dashboard)/results/config/_components/BuilderForm.tsx
"use client";

import { useCallback, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "sonner";

import { createResultConfigSchema } from "@/schemas/resultConfig.schema";
import type {
  CreateResultConfigPayload,
  MarkStructure,
} from "@/types/resultConfig.types";
import {
  useCreateResultConfigMutation,
  useGetExamTypesQuery,
  useGetMarkStructuresQuery,
} from "@/lib/services/resultConfigApi";
import {
  Field,
  AddBtn,
  RemoveBtn,
  Card,
  InfoCallout,
  Spinner,
} from "./RcPrimitive";

// ─── Constants ───────────────────────────────────────────────────

const AGG_TYPES = [
  { value: "sum" as const, label: "Sum", desc: "Add all exam marks directly" },
  {
    value: "average" as const,
    label: "Average",
    desc: "Average of selected exams",
  },
  {
    value: "weighted" as const,
    label: "Weighted",
    desc: "Weighted sum with custom weights",
  },
] as const;

const GRADING_TYPES = [
  { value: "percentage" as const, label: "Percentage", icon: "%" },
  { value: "gpa" as const, label: "GPA", icon: "★" },
] as const;

const GPA_PRESET = [
  { min: 80, label: "A+", point: 5.0 },
  { min: 70, label: "A", point: 4.0 },
  { min: 60, label: "A-", point: 3.5 },
  { min: 50, label: "B", point: 3.0 },
  { min: 40, label: "C", point: 2.0 },
  { min: 33, label: "D", point: 1.0 },
  { min: 0, label: "F", point: 0.0 },
];

const PCT_PRESET = [
  { min: 80, label: "Excellent" },
  { min: 60, label: "Good" },
  { min: 45, label: "Average" },
  { min: 33, label: "Pass" },
  { min: 0, label: "Fail" },
];

// ─── Types ───────────────────────────────────────────────────────

type FormData = CreateResultConfigPayload;

interface BuilderFormProps {
  sessionOptions: string[];
  classOptions: number[];
  onSuccess: () => void;
}

// ─── Section: Session, Class, ExamType, MarkStructure ────────────

function ConfigSection({
  form,
  sessionOptions,
  classOptions,
}: {
  form: ReturnType<typeof useForm<FormData>>;
  sessionOptions: string[];
  classOptions: number[];
}) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const { data: examTypes = [], isLoading: loadingET } = useGetExamTypesQuery();
  const { data: markStructures = [], isLoading: loadingMS } =
    useGetMarkStructuresQuery();

  const watchedMarkStructureId = watch("markStructureId");

  // When a MarkStructure is selected, auto-populate the Exams list from its components
  useEffect(() => {
    if (!watchedMarkStructureId) return;
    const ms = markStructures.find((m) => m._id === watchedMarkStructureId);
    if (!ms || !ms.components.length) return;

    // Map components → exam rows (only if exams list is still the default)
    const currentExams = form.getValues("exams");
    const isDefault =
      currentExams.length === 1 && currentExams[0].key === "written";

    if (isDefault) {
      setValue(
        "exams",
        ms.components.map((c) => ({
          key: c.key,
          label: c.label,
          totalMarks: c.totalMarks,
          required: c.required,
        })),
        { shouldValidate: true }
      );
      // Auto-populate normalization to match
      setValue(
        "normalization",
        ms.components.map((c) => ({
          examKey: c.key,
          from: c.totalMarks,
          to: c.totalMarks,
        })),
        { shouldValidate: true }
      );
      toast.info(`Exams pre-filled from "${ms.name}"`, {
        description: "You can still edit them below.",
      });
    }
  }, [watchedMarkStructureId, markStructures, form, setValue]);

  return (
    <Card icon="🏫" title="Session, Class & Exam Type">
      {/* Row 1: Session + Class */}
      <div className="rc-grid-2" style={{ marginBottom: 14 }}>
        <Field
          label="Academic Session"
          required
          error={errors.session?.message}
        >
          <select {...register("session")} className="rc-select">
            <option value="">Select session</option>
            {sessionOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Class" required error={errors.class?.message}>
          <select
            className="rc-select"
            {...register("class", { valueAsNumber: true })}
          >
            <option value="">Select class</option>
            {classOptions.map((c) => (
              <option key={c} value={c}>
                Class {c}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {/* Row 2: ExamType + MarkStructure */}
      <div className="rc-grid-2">
        <Field
          label="Exam Type"
          required
          error={errors.examTypeId?.message}
          hint="e.g. Half Yearly, Annual"
        >
          <select
            {...register("examTypeId")}
            className="rc-select"
            disabled={loadingET}
          >
            <option value="">
              {loadingET ? "Loading…" : "Select exam type"}
            </option>
            {examTypes
              .filter((et) => et.isActive)
              .sort((a, b) => a.order - b.order)
              .map((et) => (
                <option key={et._id} value={et._id}>
                  {et.name}
                  {et.code ? ` (${et.code})` : ""}
                </option>
              ))}
          </select>
        </Field>

        <Field
          label="Mark Structure"
          required
          error={errors.markStructureId?.message}
          hint="Selecting auto-fills exams below"
        >
          <select
            {...register("markStructureId")}
            className="rc-select"
            disabled={loadingMS}
          >
            <option value="">
              {loadingMS ? "Loading…" : "Select mark structure"}
            </option>
            {markStructures.map((ms) => (
              <option key={ms._id} value={ms._id}>
                {ms.name}
                {ms.components.length
                  ? ` — ${ms.components.length} components`
                  : ""}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div style={{ marginTop: 14 }}>
        <InfoCallout>
          Saving a new config for an existing{" "}
          <strong>session + class + exam type</strong> will deactivate the
          previous version and auto-increment the version number.
        </InfoCallout>
      </div>
    </Card>
  );
}

// ─── Section: Exams ──────────────────────────────────────────────

function ExamsSection({
  form,
}: {
  form: ReturnType<typeof useForm<FormData>>;
}) {
  const {
    register,
    formState: { errors },
  } = form;
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "exams",
  });
  const MONO = { fontFamily: '"JetBrains Mono",monospace' } as const;

  return (
    <Card
      icon="📝"
      title="Exams"
      badge={`${fields.length} exam${fields.length !== 1 ? "s" : ""}`}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 100px 80px 36px",
          gap: 10,
          padding: "0 12px",
          marginBottom: 4,
        }}
      >
        {["Key", "Label", "Total Marks", "Required", ""].map((h, i) => (
          <span key={i} className="rc-col-hdr">
            {h}
          </span>
        ))}
      </div>

      {fields.map((field, i) => (
        <div key={field.id} className="rc-row rc-exam-row">
          <Field error={errors.exams?.[i]?.key?.message}>
            <input
              {...register(`exams.${i}.key`)}
              className={`rc-input${errors.exams?.[i]?.key ? " err" : ""}`}
              placeholder="e.g. written"
              style={{ ...MONO, fontSize: 12 }}
            />
          </Field>
          <Field error={errors.exams?.[i]?.label?.message}>
            <input
              {...register(`exams.${i}.label`)}
              className={`rc-input${errors.exams?.[i]?.label ? " err" : ""}`}
              placeholder="e.g. Written Exam"
            />
          </Field>
          <Field error={errors.exams?.[i]?.totalMarks?.message}>
            <input
              type="number"
              {...register(`exams.${i}.totalMarks`, { valueAsNumber: true })}
              className={`rc-input${
                errors.exams?.[i]?.totalMarks ? " err" : ""
              }`}
              placeholder="100"
              min={1}
              style={MONO}
            />
          </Field>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: 38,
              paddingLeft: 6,
            }}
          >
            <label className="rc-cb-row">
              <input
                type="checkbox"
                {...register(`exams.${i}.required`)}
                defaultChecked
              />
              <span className="rc-cb-lbl" style={{ fontSize: 12 }}>
                Yes
              </span>
            </label>
          </div>
          <RemoveBtn onClick={() => remove(i)} />
        </div>
      ))}

      {(errors.exams as { message?: string })?.message && (
        <p className="rc-error" style={{ marginBottom: 8 }}>
          {(errors.exams as { message?: string }).message}
        </p>
      )}

      <AddBtn
        label="Add Exam"
        onClick={() =>
          append({ key: "", label: "", totalMarks: 100, required: true })
        }
      />
    </Card>
  );
}

// ─── Section: Normalization ───────────────────────────────────────

function NormSection({ form }: { form: ReturnType<typeof useForm<FormData>> }) {
  const {
    register,
    watch,
    formState: { errors },
  } = form;
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "normalization",
  });
  const activeExams = watch("exams").filter((e) => e.key);
  const MONO = { fontFamily: '"JetBrains Mono",monospace' } as const;

  return (
    <Card icon="⚖️" title="Normalization" badge="Scale marks to a target range">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 100px 100px 36px",
          gap: 10,
          padding: "0 12px",
          marginBottom: 4,
        }}
      >
        {["Exam Key", "From", "To", ""].map((h, i) => (
          <span key={i} className="rc-col-hdr">
            {h}
          </span>
        ))}
      </div>

      {fields.map((field, i) => (
        <div key={field.id} className="rc-row rc-norm-row">
          <Field error={errors.normalization?.[i]?.examKey?.message}>
            <select
              {...register(`normalization.${i}.examKey`)}
              className="rc-select"
            >
              <option value="">Select exam</option>
              {activeExams.map((e) => (
                <option key={e.key} value={e.key}>
                  {e.key}
                </option>
              ))}
            </select>
          </Field>
          <Field
            error={errors.normalization?.[i]?.from?.message}
            hint="Original"
          >
            <input
              type="number"
              {...register(`normalization.${i}.from`, { valueAsNumber: true })}
              className="rc-input"
              placeholder="100"
              min={1}
              style={MONO}
            />
          </Field>
          <Field error={errors.normalization?.[i]?.to?.message} hint="Target">
            <input
              type="number"
              {...register(`normalization.${i}.to`, { valueAsNumber: true })}
              className="rc-input"
              placeholder="70"
              min={1}
              style={MONO}
            />
          </Field>
          <RemoveBtn onClick={() => remove(i)} />
        </div>
      ))}

      {(errors.normalization as { message?: string })?.message && (
        <p className="rc-error" style={{ marginBottom: 8 }}>
          {(errors.normalization as { message?: string }).message}
        </p>
      )}

      <AddBtn
        label="Add Normalization Rule"
        onClick={() => append({ examKey: "", from: 100, to: 70 })}
      />
    </Card>
  );
}

// ─── Section: Aggregation ─────────────────────────────────────────

function AggSection({ form }: { form: ReturnType<typeof useForm<FormData>> }) {
  const { watch, setValue, getValues } = form;
  const watchedExams = watch("exams");
  const watchedAggType = watch("aggregation.type");
  const watchedKeys = watch("aggregation.examKeys") ?? [];
  const watchedWeights = watch("aggregation.weights") ?? {};
  const activeExams = watchedExams.filter((e) => e.key);
  const MONO = { fontFamily: '"JetBrains Mono",monospace' } as const;

  const toggleKey = useCallback(
    (key: string) => {
      const current = getValues("aggregation.examKeys") ?? [];
      setValue(
        "aggregation.examKeys",
        current.includes(key)
          ? current.filter((k) => k !== key)
          : [...current, key],
        { shouldValidate: true }
      );
    },
    [getValues, setValue]
  );

  return (
    <Card icon="∑" title="Aggregation">
      <div className="rc-agg-cards">
        {AGG_TYPES.map((t) => (
          <button
            key={t.value}
            type="button"
            className={`rc-agg-card${
              watchedAggType === t.value ? " active" : ""
            }`}
            onClick={() =>
              setValue("aggregation.type", t.value, { shouldValidate: true })
            }
          >
            <div className="rc-agg-title">{t.label}</div>
            <div className="rc-agg-desc">{t.desc}</div>
          </button>
        ))}
      </div>

      {watchedAggType === "average" && (
        <div>
          <span
            className="rc-label"
            style={{ display: "block", marginBottom: 8 }}
          >
            Select Exams to Average
          </span>
          {activeExams.length === 0 ? (
            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
              Add exams first
            </p>
          ) : (
            <div className="rc-chips">
              {activeExams.map((e) => (
                <button
                  key={e.key}
                  type="button"
                  className={`rc-chip${
                    watchedKeys.includes(e.key) ? " active" : ""
                  }`}
                  onClick={() => toggleKey(e.key)}
                >
                  {watchedKeys.includes(e.key) && (
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  )}
                  {e.label || e.key}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {watchedAggType === "weighted" && (
        <div>
          <span
            className="rc-label"
            style={{ display: "block", marginBottom: 8 }}
          >
            Set Weight per Exam
          </span>
          {activeExams.length === 0 ? (
            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
              Add exams first
            </p>
          ) : (
            <div className="rc-weights-grid">
              {activeExams.map((e) => (
                <div key={e.key} className="rc-weight-row">
                  <span className="rc-weight-key">{e.label || e.key}</span>
                  <input
                    type="number"
                    className="rc-input"
                    style={MONO}
                    value={watchedWeights[e.key] ?? ""}
                    onChange={(ev) => {
                      const val =
                        ev.target.value === ""
                          ? undefined
                          : Number(ev.target.value);
                      setValue(`aggregation.weights.${e.key}`, val, {
                        shouldValidate: true,
                      });
                    }}
                    placeholder="1"
                    min={0}
                    step={0.1}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

// ─── Section: Pass Rules ──────────────────────────────────────────

function PassRulesSection({
  form,
}: {
  form: ReturnType<typeof useForm<FormData>>;
}) {
  const {
    register,
    formState: { errors },
  } = form;
  const MONO = { fontFamily: '"JetBrains Mono",monospace' } as const;

  return (
    <Card icon="✓" title="Pass Rules" badge="optional">
      <div className="rc-grid-2">
        <Field
          label="Pass Percentage"
          required
          error={errors.passRules?.passPercentage?.message}
          hint="Minimum % to pass overall"
        >
          <input
            type="number"
            {...register("passRules.passPercentage", { valueAsNumber: true })}
            className="rc-input"
            placeholder="33"
            min={0}
            max={100}
            style={MONO}
          />
        </Field>
        <div
          className="rc-field"
          style={{ justifyContent: "flex-end", paddingBottom: 2 }}
        >
          <label className="rc-cb-row">
            <input
              type="checkbox"
              {...register("passRules.failIfAnySubjectFail")}
            />
            <span className="rc-cb-lbl">Fail if any single subject fails</span>
          </label>
        </div>
      </div>
    </Card>
  );
}

// ─── Section: Grading ─────────────────────────────────────────────

function GradingSection({
  form,
}: {
  form: ReturnType<typeof useForm<FormData>>;
}) {
  const { register, watch, setValue } = form;
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "grading.scale" as "grading.scale",
  });
  const watchedGradeType = watch("grading.type") ?? "percentage";
  const isGpa = watchedGradeType === "gpa";
  const MONO = { fontFamily: '"JetBrains Mono",monospace' } as const;

  return (
    <Card icon="🎓" title="Grading" badge="optional">
      <div className="rc-gtype-row">
        {GRADING_TYPES.map((t) => (
          <button
            key={t.value}
            type="button"
            className={`rc-gtype-btn${
              watchedGradeType === t.value ? " active" : ""
            }`}
            onClick={() =>
              setValue("grading.type", t.value, { shouldValidate: true })
            }
          >
            <div className="rc-gtype-icon">{t.icon}</div>
            <div className="rc-gtype-lbl">{t.label}</div>
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button
          type="button"
          className="rc-preset-btn"
          onClick={() =>
            setValue(
              "grading.scale",
              (isGpa ? GPA_PRESET : PCT_PRESET) as never[],
              { shouldValidate: true }
            )
          }
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
            <polyline points="13 2 13 9 20 9" />
          </svg>
          Apply {isGpa ? "GPA" : "Percentage"} Preset
        </button>
        {fields.length > 0 && (
          <button
            type="button"
            className="rc-btn-ghost"
            style={{ padding: "4px 10px", fontSize: 12 }}
            onClick={() =>
              setValue("grading.scale", [], { shouldValidate: true })
            }
          >
            Clear Scale
          </button>
        )}
      </div>

      {fields.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isGpa
              ? "100px 1fr 100px 36px"
              : "100px 1fr 36px",
            gap: 10,
            padding: "0 12px",
            marginBottom: 4,
          }}
        >
          {(isGpa
            ? ["Min %", "Label", "GPA Point", ""]
            : ["Min %", "Label", ""]
          ).map((h, i) => (
            <span key={i} className="rc-col-hdr">
              {h}
            </span>
          ))}
        </div>
      )}

      {fields.map((field, i) => (
        <div key={field.id} className="rc-row rc-grade-row">
          <Field>
            <input
              type="number"
              {...register(`grading.scale.${i}.min`, { valueAsNumber: true })}
              className="rc-input"
              placeholder="0"
              min={0}
              max={100}
              style={MONO}
            />
          </Field>
          <Field>
            <input
              {...register(`grading.scale.${i}.label`)}
              className="rc-input"
              placeholder={isGpa ? "A+" : "Excellent"}
            />
          </Field>
          {isGpa && (
            <Field>
              <input
                type="number"
                {...register(`grading.scale.${i}.point`, {
                  valueAsNumber: true,
                })}
                className="rc-input"
                placeholder="5.0"
                min={0}
                step={0.01}
                style={MONO}
              />
            </Field>
          )}
          <RemoveBtn onClick={() => remove(i)} />
        </div>
      ))}

      <AddBtn
        label="Add Grade"
        onClick={() =>
          append(
            (isGpa
              ? { min: 0, label: "", point: 0 }
              : { min: 0, label: "" }) as never
          )
        }
      />
    </Card>
  );
}

// ─── BuilderForm (main export) ────────────────────────────────────

export function BuilderForm({
  sessionOptions,
  classOptions,
  onSuccess,
}: BuilderFormProps) {
  const [createResultConfig, { isLoading }] = useCreateResultConfigMutation();

  const form = useForm<FormData>({
    resolver: zodResolver(createResultConfigSchema)as any,
    defaultValues: {
      session: "",
      class: undefined as unknown as number,
      examTypeId: "",
      markStructureId: "",
      exams: [
        { key: "written", label: "Written", totalMarks: 100, required: true },
      ],
      normalization: [{ examKey: "written", from: 100, to: 70 }],
      aggregation: { type: "sum" },
      passRules: { passPercentage: 33, failIfAnySubjectFail: true },
      grading: { type: "percentage", scale: [] },
    },
    mode: "onTouched",
  });

  const { handleSubmit } = form;

  const onSubmit = async (data: FormData) => {
    try {
      const payload: FormData = {
        ...data,
        aggregation: {
          type: data.aggregation.type,
          ...(data.aggregation.type === "average" && {
            examKeys: data.aggregation.examKeys,
          }),
          ...(data.aggregation.type === "weighted" && {
            weights: data.aggregation.weights,
          }),
        },
        grading: data.grading?.scale?.length
          ? data.grading
          : { type: data.grading?.type ?? "percentage" },
      };

      await createResultConfig(payload).unwrap();
      toast.success("Configuration saved!", {
        description: `Session ${data.session} · Class ${data.class} — version auto-incremented`,
      });
      onSuccess();
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message;
      toast.error("Failed to save configuration", {
        description: msg ?? "Please check all fields and try again.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <ConfigSection
        form={form}
        sessionOptions={sessionOptions}
        classOptions={classOptions}
      />
      <ExamsSection form={form} />
      <NormSection form={form} />
      <AggSection form={form} />
      <PassRulesSection form={form} />
      <GradingSection form={form} />

      <div className="rc-nav">
        <Link href="/results" className="rc-btn-ghost">
          Cancel
        </Link>
        <button type="submit" className="rc-btn-primary" disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner /> Saving…
            </>
          ) : (
            <>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v14a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              Save Configuration
            </>
          )}
        </button>
      </div>
    </form>
  );
}
