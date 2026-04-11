// src/app/(dashboard)/academic-setup/grading-system/page.tsx
"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  useListGradingQuery,
  useCreateGradingMutation,
  useDeleteGradingMutation,
} from "@/lib/services/gradingSystemApi";

// ─── Types ────────────────────────────────────────────────────────

interface GradeScale {
  min: number;
  label: string;
  point?: number;
}
interface GradingSystem {
  _id: string;
  type: "percentage" | "gpa";
  scale: GradeScale[];
  createdAt?: string;
}

// ─── Schema ──────────────────────────────────────────────────────

const scaleItem = z.object({
  min: z.number("Required" ).min(0).max(100),
  label: z.string().min(1, "Label required"),
  point: z.number().optional(),
});

const schema = z.object({
  type: z.enum(["percentage", "gpa"]),
  scale: z.array(scaleItem).min(1, "Add at least one grade"),
});

type FormData = z.infer<typeof schema>;

// ─── Presets ──────────────────────────────────────────────────────

const GPA_PRESET: GradeScale[] = [
  { min: 80, label: "A+", point: 5.0 },
  { min: 70, label: "A", point: 4.0 },
  { min: 60, label: "A-", point: 3.5 },
  { min: 50, label: "B", point: 3.0 },
  { min: 40, label: "C", point: 2.0 },
  { min: 33, label: "D", point: 1.0 },
  { min: 0, label: "F", point: 0.0 },
];

const PCT_PRESET: GradeScale[] = [
  { min: 80, label: "Excellent" },
  { min: 65, label: "Very Good" },
  { min: 50, label: "Good" },
  { min: 40, label: "Average" },
  { min: 33, label: "Pass" },
  { min: 0, label: "Fail" },
];

// ─── CSS ─────────────────────────────────────────────────────────

const CSS = `
@keyframes gsPageIn  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
@keyframes gsFadeIn  { from{opacity:0;transform:translateY(5px)}  to{opacity:1;transform:none} }
@keyframes gsSpin    { to{transform:rotate(360deg)} }
@keyframes gsPulse   { 0%,100%{opacity:1} 50%{opacity:.35} }

/* ── Page ───────────────────────────────────────────────────── */
.gs-page { max-width:1100px; margin:0 auto; padding:28px 20px 48px; animation:gsPageIn .35s ease both; }

/* ── Header ─────────────────────────────────────────────────── */
.gs-head { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; margin-bottom:32px; flex-wrap:wrap; }
.gs-eyebrow { font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:1.2px; color:var(--accent); margin-bottom:5px; display:flex; align-items:center; gap:6px; }
.gs-eyebrow::before { content:''; display:block; width:18px; height:2px; background:var(--accent); border-radius:2px; }
.gs-title { font-size:24px; font-weight:800; color:var(--text-primary); letter-spacing:-.6px; margin:0 0 4px; }
.gs-sub   { font-size:13px; color:var(--text-muted); margin:0; }
.gs-count-pill { display:inline-flex; align-items:center; gap:6px; background:var(--bg-card); border:1px solid var(--border); border-radius:20px; padding:6px 14px; font-size:12px; color:var(--text-muted); font-weight:600; }
.gs-count-num  { font-size:14px; font-weight:800; color:var(--accent); font-family:"JetBrains Mono",monospace; }

/* ── Layout ─────────────────────────────────────────────────── */
.gs-layout { display:grid; grid-template-columns:420px 1fr; gap:20px; align-items:start; }
@media(max-width:960px){ .gs-layout { grid-template-columns:1fr; } }

/* ── Card ───────────────────────────────────────────────────── */
.gs-card { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius); padding:24px; position:relative; overflow:hidden; }
.gs-card::before { content:''; position:absolute; top:0; left:24px; right:24px; height:2px; background:linear-gradient(90deg,transparent,rgba(245,158,11,.15),transparent); pointer-events:none; }
.gs-card-title { font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:.7px; margin-bottom:20px; display:flex; align-items:center; gap:8px; }
.gs-card-icon  { width:26px; height:26px; border-radius:7px; background:rgba(245,158,11,.1); border:1px solid rgba(245,158,11,.18); display:flex; align-items:center; justify-content:center; color:var(--accent); font-size:13px; flex-shrink:0; }

/* ── Type toggle ────────────────────────────────────────────── */
.gs-type-row  { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:20px; }
.gs-type-btn  { padding:14px 16px; border-radius:var(--radius-sm); border:1.5px solid var(--border); background:var(--bg-input); cursor:pointer; transition:all .18s; font-family:inherit; text-align:center; }
.gs-type-btn.active { border-color:rgba(245,158,11,.55); background:rgba(245,158,11,.08); }
.gs-type-btn:not(.active):hover { border-color:rgba(245,158,11,.25); }
.gs-type-icon { font-size:22px; margin-bottom:5px; }
.gs-type-lbl  { font-size:13px; font-weight:700; color:var(--text-secondary); }
.gs-type-btn.active .gs-type-lbl { color:var(--accent); }
.gs-type-sub  { font-size:11px; color:var(--text-muted); margin-top:2px; }

/* ── Preset + action bar ─────────────────────────────────────── */
.gs-action-bar { display:flex; gap:8px; margin-bottom:16px; flex-wrap:wrap; }
.gs-preset-btn { display:inline-flex; align-items:center; gap:6px; padding:7px 13px; border-radius:8px; font-size:12px; font-weight:700; background:rgba(245,158,11,.08); border:1px solid rgba(245,158,11,.2); color:var(--accent); cursor:pointer; transition:all .18s; font-family:inherit; }
.gs-preset-btn:hover { background:rgba(245,158,11,.16); border-color:rgba(245,158,11,.4); }
.gs-clear-btn  { display:inline-flex; align-items:center; gap:5px; padding:7px 12px; border-radius:8px; font-size:12px; font-weight:600; background:none; border:1.5px solid var(--border); color:var(--text-muted); cursor:pointer; transition:all .18s; font-family:inherit; }
.gs-clear-btn:hover { border-color:var(--text-muted); color:var(--text-primary); }

/* ── Scale table header ──────────────────────────────────────── */
.gs-scale-hdrs { display:grid; gap:8px; padding:0 12px; margin-bottom:5px; }
.gs-col-hdr    { font-size:10px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:.5px; }

/* ── Scale row ───────────────────────────────────────────────── */
.gs-scale-row { display:grid; gap:8px; align-items:end; background:var(--bg-input); border:1px solid var(--border); border-radius:var(--radius-sm); padding:10px 12px; margin-bottom:7px; transition:border-color .18s; animation:gsFadeIn .2s ease both; }
.gs-scale-row:hover { border-color:rgba(245,158,11,.2); }
.gs-input { width:100%; box-sizing:border-box; background:var(--bg-card); border:1.5px solid var(--border); border-radius:7px; padding:8px 10px; font-family:inherit; font-size:13px; color:var(--text-primary); outline:none; transition:border-color .18s; }
.gs-input::placeholder { color:var(--text-muted); }
.gs-input:focus { border-color:rgba(245,158,11,.45); box-shadow:0 0 0 3px rgba(245,158,11,.06); }
.gs-input.mono { font-family:"JetBrains Mono",monospace; }
.gs-error { font-size:11px; color:var(--error); margin-top:1px; }
.gs-rm-btn { display:flex; align-items:center; justify-content:center; width:32px; height:32px; border-radius:7px; background:rgba(248,113,113,.07); border:1px solid rgba(248,113,113,.15); color:var(--error); cursor:pointer; transition:background .15s; font-family:inherit; flex-shrink:0; }
.gs-rm-btn:hover { background:rgba(248,113,113,.18); }

/* ── Add / Submit ────────────────────────────────────────────── */
.gs-add-btn { width:100%; display:flex; align-items:center; justify-content:center; gap:7px; background:none; border:1.5px dashed var(--border); border-radius:var(--radius-sm); padding:9px; font-family:inherit; font-size:13px; font-weight:600; color:var(--text-muted); cursor:pointer; transition:all .18s; margin-bottom:14px; }
.gs-add-btn:hover { border-color:rgba(245,158,11,.4); color:var(--accent); background:rgba(245,158,11,.03); }
.gs-submit-btn { width:100%; display:flex; align-items:center; justify-content:center; gap:8px; background:var(--accent); color:#0B0F1A; border:none; border-radius:10px; padding:11px 20px; font-family:inherit; font-size:13.5px; font-weight:700; cursor:pointer; transition:all .18s; box-shadow:0 4px 16px rgba(245,158,11,.25); }
.gs-submit-btn:hover:not(:disabled) { background:#FBBF24; transform:translateY(-1px); box-shadow:0 6px 22px rgba(245,158,11,.35); }
.gs-submit-btn:disabled { opacity:.5; cursor:not-allowed; transform:none; box-shadow:none; }
.gs-spinner-dark { width:16px; height:16px; border:2px solid rgba(11,15,26,.2); border-top-color:#0B0F1A; border-radius:50%; animation:gsSpin 1s linear infinite; }

/* ── Saved systems list ──────────────────────────────────────── */
.gs-list { display:flex; flex-direction:column; gap:10px; }
.gs-system-card { background:var(--bg-input); border:1px solid var(--border); border-radius:var(--radius-sm); padding:18px 20px; transition:border-color .18s; animation:gsFadeIn .22s ease both; position:relative; overflow:hidden; }
.gs-system-card:hover { border-color:rgba(245,158,11,.2); }
.gs-system-card::before { content:''; position:absolute; left:0; top:0; bottom:0; width:3px; background:rgba(245,158,11,.5); border-radius:0 2px 2px 0; }
.gs-system-head { display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:14px; }
.gs-system-name { display:flex; align-items:center; gap:8px; }
.gs-type-pill { font-size:11px; font-weight:700; padding:3px 10px; border-radius:20px; }
.gs-type-pill.gpa { background:rgba(245,158,11,.1); color:var(--accent); border:1px solid rgba(245,158,11,.25); }
.gs-type-pill.pct { background:rgba(96,165,250,.08); color:#60A5FA; border:1px solid rgba(96,165,250,.2); }
.gs-system-title { font-size:14px; font-weight:700; color:var(--text-primary); }
.gs-system-count { font-size:11.5px; color:var(--text-muted); }
.gs-btn-del { display:inline-flex; align-items:center; gap:5px; background:rgba(248,113,113,.07); border:1px solid rgba(248,113,113,.18); border-radius:7px; padding:5px 10px; font-family:inherit; font-size:12px; font-weight:600; color:var(--error); cursor:pointer; transition:all .15s; }
.gs-btn-del:hover { background:rgba(248,113,113,.16); }

/* ── Grade scale preview ─────────────────────────────────────── */
.gs-preview { display:flex; flex-wrap:wrap; gap:5px; }
.gs-grade-tag { display:inline-flex; align-items:center; gap:6px; padding:5px 11px; border-radius:8px; font-size:12px; font-weight:700; background:var(--bg-card); border:1px solid var(--border); }
.gs-grade-label { color:var(--text-primary); }
.gs-grade-min   { font-size:10.5px; color:var(--text-muted); font-family:"JetBrains Mono",monospace; }
.gs-grade-point { font-size:10.5px; font-family:"JetBrains Mono",monospace; color:var(--accent); background:rgba(245,158,11,.1); padding:1px 5px; border-radius:4px; }

/* Empty / skeleton */
.gs-empty { display:flex; flex-direction:column; align-items:center; padding:48px 24px; gap:10px; text-align:center; background:var(--bg-input); border:1px dashed var(--border); border-radius:var(--radius-sm); }
.gs-empty-icon  { font-size:32px; opacity:.3; }
.gs-empty-title { font-size:14px; font-weight:700; color:var(--text-primary); margin:0; }
.gs-empty-sub   { font-size:12.5px; color:var(--text-muted); margin:0; }
.gs-skeleton { height:88px; border-radius:var(--radius-sm); background:linear-gradient(90deg,var(--bg-card) 25%,var(--bg-input) 50%,var(--bg-card) 75%); background-size:200% 100%; animation:gsPulse 1.5s ease infinite; border:1px solid var(--border); margin-bottom:8px; }

/* Validation summary */
.gs-form-error { font-size:12px; color:var(--error); background:rgba(248,113,113,.07); border:1px solid rgba(248,113,113,.18); border-radius:8px; padding:10px 14px; margin-bottom:12px; }
`;

// ─── GradeRow (memoised form row) ─────────────────────────────────

function GradeRow({
  index,
  isGpa,
  onRemove,
  register,
  errors,
  canRemove,
}: {
  index: number;
  isGpa: boolean;
  onRemove: () => void;
  register: ReturnType<typeof useForm<FormData>>["register"];
  errors: any;
  canRemove: boolean;
}) {
  const MONO = { fontFamily: '"JetBrains Mono",monospace' } as const;
  const cols = isGpa ? "80px 1fr 90px 32px" : "80px 1fr 32px";

  return (
    <div className="gs-scale-row" style={{ gridTemplateColumns: cols }}>
      <div>
        <input
          type="number"
          {...register(`scale.${index}.min`, { valueAsNumber: true })}
          className={`gs-input gs-input mono${
            errors?.scale?.[index]?.min ? " err" : ""
          }`}
          placeholder="0"
          min={0}
          max={100}
          style={MONO}
        />
        {errors?.scale?.[index]?.min && (
          <p className="gs-error">{errors.scale[index].min.message}</p>
        )}
      </div>
      <div>
        <input
          {...register(`scale.${index}.label`)}
          className={`gs-input${errors?.scale?.[index]?.label ? " err" : ""}`}
          placeholder={isGpa ? "A+" : "Excellent"}
        />
        {errors?.scale?.[index]?.label && (
          <p className="gs-error">{errors.scale[index].label.message}</p>
        )}
      </div>
      {isGpa && (
        <div>
          <input
            type="number"
            {...register(`scale.${index}.point`, { valueAsNumber: true })}
            className="gs-input"
            placeholder="5.0"
            min={0}
            step={0.01}
            style={MONO}
          />
        </div>
      )}
      <button
        type="button"
        className="gs-rm-btn"
        onClick={onRemove}
        disabled={!canRemove}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────

export default function GradingSystemPage() {
  const {
    data: systems = [],
    isLoading,
    isError,
    refetch,
  } = useListGradingQuery();
  const [createGrading, { isLoading: isSaving }] = useCreateGradingMutation();
  const [deleteGrading] = useDeleteGradingMutation();

  const [activeType, setActiveType] = useState<"gpa" | "percentage">("gpa");
  const isGpa = activeType === "gpa";

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: "gpa", scale: GPA_PRESET },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "scale" });

  const applyPreset = () => {
    const preset = isGpa ? GPA_PRESET : PCT_PRESET;
    setValue("scale", preset, { shouldValidate: true });
  };

  const switchType = (t: "gpa" | "percentage") => {
    setActiveType(t);
    setValue("type", t);
    setValue("scale", t === "gpa" ? GPA_PRESET : PCT_PRESET, {
      shouldValidate: true,
    });
  };

  const onSubmit = async (data: FormData) => {
    try {
      await createGrading(data).unwrap();
      toast.success("Grading system saved!", {
        description: `${data.type.toUpperCase()} — ${
          data.scale.length
        } grade levels`,
      });
      reset({ type: "gpa", scale: GPA_PRESET });
      setActiveType("gpa");
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message;
      toast.error("Failed to save", { description: msg });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this grading system? This cannot be undone.")) return;
    try {
      await deleteGrading(id).unwrap();
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const cols = isGpa ? "80px 1fr 90px 32px" : "80px 1fr 32px";
  const hdrs = isGpa
    ? ["Min %", "Label", "Points", ""]
    : ["Min %", "Label", ""];

  return (
    <>
      <style>{CSS}</style>
      <div className="gs-page">
        {/* Header */}
        <div className="gs-head">
          <div>
            <div className="gs-eyebrow">Academic Setup</div>
            <h1 className="gs-title">Grading System</h1>
            <p className="gs-sub">
              Configure grade scales used across result configurations
            </p>
          </div>
          <div className="gs-count-pill">
            <span className="gs-count-num">{systems.length}</span>
            system{systems.length !== 1 ? "s" : ""} saved
          </div>
        </div>

        <div className="gs-layout">
          {/* ── Left: Form ── */}
          <div style={{ position: "sticky", top: 80 }}>
            <div className="gs-card">
              <div className="gs-card-title">
                <div className="gs-card-icon">🎓</div>
                New Grading System
              </div>

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* Type selector */}
                <div className="gs-type-row">
                  {(
                    [
                      {
                        v: "gpa" as const,
                        icon: "★",
                        label: "GPA",
                        sub: "5.0 point scale",
                      },
                      {
                        v: "percentage" as const,
                        icon: "%",
                        label: "Percentage",
                        sub: "0–100% scale",
                      },
                    ] as const
                  ).map((t) => (
                    <button
                      key={t.v}
                      type="button"
                      className={`gs-type-btn${
                        activeType === t.v ? " active" : ""
                      }`}
                      onClick={() => switchType(t.v)}
                    >
                      <div className="gs-type-icon">{t.icon}</div>
                      <div className="gs-type-lbl">{t.label}</div>
                      <div className="gs-type-sub">{t.sub}</div>
                    </button>
                  ))}
                </div>

                {/* Preset + clear */}
                <div className="gs-action-bar">
                  <button
                    type="button"
                    className="gs-preset-btn"
                    onClick={applyPreset}
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
                      className="gs-clear-btn"
                      onClick={() =>
                        setValue("scale", [], { shouldValidate: true })
                      }
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Column headers */}
                {fields.length > 0 && (
                  <div
                    className="gs-scale-hdrs"
                    style={{ gridTemplateColumns: cols }}
                  >
                    {hdrs.map((h, i) => (
                      <span key={i} className="gs-col-hdr">
                        {h}
                      </span>
                    ))}
                  </div>
                )}

                {/* Scale rows */}
                {fields.map((field, i) => (
                  <GradeRow
                    key={field.id}
                    index={i}
                    isGpa={isGpa}
                    onRemove={() => remove(i)}
                    register={register}
                    errors={errors}
                    canRemove={fields.length > 1}
                  />
                ))}

                {(errors.scale as { message?: string })?.message && (
                  <div className="gs-form-error">
                    {(errors.scale as { message?: string }).message}
                  </div>
                )}

                <button
                  type="button"
                  className="gs-add-btn"
                  onClick={() =>
                    append(
                      isGpa
                        ? { min: 0, label: "", point: 0 }
                        : ({ min: 0, label: "" } as GradeScale)
                    )
                  }
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Add Grade Level
                </button>

                <button
                  type="submit"
                  className="gs-submit-btn"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <span className="gs-spinner-dark" /> Saving…
                    </>
                  ) : (
                    <>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v14a2 2 0 0 1-2 2z" />
                        <polyline points="17 21 17 13 7 13 7 21" />
                        <polyline points="7 3 7 8 15 8" />
                      </svg>
                      Save Grading System
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* ── Right: Saved systems ── */}
          <div>
            <div className="gs-card">
              <div className="gs-card-title">
                <div className="gs-card-icon">📋</div>
                Saved Grading Systems
              </div>

              {isLoading ? (
                [1, 2].map((i) => (
                  <div
                    key={i}
                    className="gs-skeleton"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))
              ) : isError ? (
                <div className="gs-empty">
                  <div className="gs-empty-icon">⚠️</div>
                  <p className="gs-empty-title">Failed to load</p>
                  <button
                    style={{
                      marginTop: 4,
                      padding: "6px 14px",
                      background: "none",
                      border: "1.5px solid var(--border)",
                      borderRadius: 8,
                      cursor: "pointer",
                      color: "var(--text-muted)",
                      fontFamily: "inherit",
                      fontSize: 12,
                    }}
                    onClick={refetch}
                  >
                    Retry
                  </button>
                </div>
              ) : systems.length === 0 ? (
                <div className="gs-empty">
                  <div className="gs-empty-icon">🎓</div>
                  <p className="gs-empty-title">No grading systems yet</p>
                  <p className="gs-empty-sub">
                    Create your first grading system using the form.
                  </p>
                </div>
              ) : (
                <div className="gs-list">
                  {systems.map((sys: GradingSystem, idx: number) => (
                    <div
                      key={sys._id}
                      className="gs-system-card"
                      style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                      <div className="gs-system-head">
                        <div className="gs-system-name">
                          <span
                            className={`gs-type-pill ${
                              sys.type === "gpa" ? "gpa" : "pct"
                            }`}
                          >
                            {sys.type === "gpa" ? "GPA ★" : "% PCT"}
                          </span>
                          <div>
                            <div className="gs-system-title">
                              {sys.type === "gpa"
                                ? "GPA Scale"
                                : "Percentage Scale"}
                            </div>
                            <div className="gs-system-count">
                              {sys.scale.length} grade levels
                            </div>
                          </div>
                        </div>
                        <button
                          className="gs-btn-del"
                          onClick={() => handleDelete(sys._id)}
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6M14 11v6M9 6V4h6v2" />
                          </svg>
                          Delete
                        </button>
                      </div>

                      {/* Grade preview tags */}
                      <div className="gs-preview">
                        {sys.scale
                          .slice()
                          .sort((a, b) => b.min - a.min)
                          .map((g, i) => (
                            <div key={i} className="gs-grade-tag">
                              <span className="gs-grade-label">{g.label}</span>
                              <span className="gs-grade-min">≥{g.min}%</span>
                              {g.point !== undefined && (
                                <span className="gs-grade-point">
                                  {g.point.toFixed(1)}
                                </span>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
