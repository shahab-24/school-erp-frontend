// src/app/(dashboard)/students/create/page.tsx
// URL: /students/create
// Backend: POST /api/students — createStudentSchema
"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { studentSchema, type StudentFormData } from "@/schemas/student.schema";
import { useCreateStudentMutation } from "@/lib/services/studentApi";
import { appConfig } from "@/lib/config/appConfig";
import { useToast } from "@/components/ui/use-toast";

// ─── Section component ────────────────────────────────────────
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="cs-card">
      <div className="erp-section-title">{title}</div>
      {children}
    </div>
  );
}

// ─── Field component ──────────────────────────────────────────
function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="cs-field">
      <label className="cs-label">
        {label}
        {required && (
          <span style={{ color: "var(--error)", marginLeft: 3 }}>*</span>
        )}
      </label>
      {children}
      {error && (
        <span className="cs-error">
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0 }}
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </span>
      )}
    </div>
  );
}

// ─── Parent fields (reused for father + mother) ───────────────
function ParentFields({
  prefix,
  register,
  errors,
}: {
  prefix: "father" | "mother";
  register: any;
  errors: any;
}) {
  const e = errors?.[prefix] ?? {};
  return (
    <div className="cs-grid-2">
      <Field label="Name (English)" required error={e?.name?.en?.message}>
        <input
          {...register(`${prefix}.name.en`)}
          className="erp-input"
          placeholder={
            prefix === "father" ? "e.g. Md. Karim Uddin" : "e.g. Fatema Begum"
          }
        />
      </Field>
      <Field label="Name (Bengali)" error={e?.name?.bn?.message}>
        <input
          {...register(`${prefix}.name.bn`)}
          className="erp-input"
          placeholder="বাংলায় নাম লিখুন"
        />
      </Field>
      <Field label="Mobile Number" required error={e?.mobile?.message}>
        <div className="cs-input-prefix">
          <span className="cs-prefix-tag">+880</span>
          <input
            {...register(`${prefix}.mobile`)}
            className="erp-input"
            style={{
              borderRadius: "0 var(--radius-sm) var(--radius-sm) 0",
              borderLeft: "none",
            }}
            placeholder="01XXXXXXXXX"
            inputMode="tel"
          />
        </div>
      </Field>
      <Field label="National ID (NID)" required error={e?.nid?.message}>
        <input
          {...register(`${prefix}.nid`)}
          className="erp-input"
          placeholder="10 or 17 digit NID"
          inputMode="numeric"
        />
      </Field>
      <Field
        label="Birth Registration No."
        required
        error={e?.birthRegistration?.message}
      >
        <input
          {...register(`${prefix}.birthRegistration`)}
          className="erp-input"
          placeholder="17-digit number"
          inputMode="numeric"
        />
      </Field>
    </div>
  );
}

// ─── Step definitions ─────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Student", short: "Student" },
  { id: 2, label: "Father", short: "Father" },
  { id: 3, label: "Mother", short: "Mother" },
  { id: 4, label: "Guardians", short: "Guardian" },
  { id: 5, label: "Class", short: "Class" },
];

// ─── Main component ───────────────────────────────────────────
export default function CreateStudentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [createStudent, { isLoading }] = useCreateStudentMutation();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

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
      languagePreference: "bn",
    },
    mode: "onTouched",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "guardians",
  });

  // Step field groups for validation
  const STEP_FIELDS: Record<number, (keyof StudentFormData)[]> = {
    1: [
      "studentUid",
      "name",
      "gender",
      "religion",
      "birthDate",
      "birthRegistration",
      "languagePreference",
    ],
    2: ["father"],
    3: ["mother"],
    4: ["guardians"],
    5: ["current"],
  };

  const goNext = async () => {
    const valid = await trigger(STEP_FIELDS[step] as any);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length));
  };
  const goPrev = () => setStep((s) => Math.max(s - 1, 1));

  const onSubmit = async (data: StudentFormData) => {
    try {
      const res = await createStudent({
        ...data,
        // Clean empty imageUrl
        imageUrl: data.imageUrl || undefined,
        // Clean empty guardian fields
        guardians: data.guardians?.filter((g) => g.name.en.trim()) ?? [],
      }).unwrap();

      setSubmitted(true);

      toast({
        title: "✓ Student Registered",
        description: `${data.name.en} (${data.studentUid}) has been added successfully.`,
      });

      setTimeout(() => router.push("/students"), 1200);
    } catch (err: any) {
      const msg =
        err?.data?.message ??
        err?.data?.error ??
        "Something went wrong. Please try again.";
      toast({
        title: "Registration Failed",
        description: msg,
        variant: "destructive",
      });
    }
  };

  const studentName = watch("name.en");

  return (
    <>
      <style>{`
        /* All CSS vars from globals.css — theme-aware automatically */
        .cs-page { max-width: 820px; margin: 0 auto; animation: pageEnter 0.3s ease both; }

        /* Back link */
        .cs-back {
          display: inline-flex; align-items: center; gap: 7px;
          font-size: 12.5px; color: var(--text-muted);
          text-decoration: none; margin-bottom: 20px;
          transition: color var(--transition);
        }
        .cs-back:hover { color: var(--accent); }

        /* Page header */
        .cs-page-title    { font-size: 21px; font-weight: 700; color: var(--text-primary); letter-spacing: -0.4px; }
        .cs-page-subtitle { font-size: 13px; color: var(--text-muted); margin-top: 3px; margin-bottom: 28px; }

        /* ── Stepper ── */
        .cs-stepper {
          display: flex; align-items: center;
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: var(--radius); padding: 14px 20px;
          margin-bottom: 20px; gap: 4px; overflow-x: auto;
          box-shadow: var(--shadow-sm);
        }
        .cs-step {
          display: flex; align-items: center; gap: 8px;
          flex-shrink: 0; position: relative;
        }
        .cs-step-dot {
          width: 28px; height: 28px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700;
          transition: all var(--transition);
          flex-shrink: 0;
        }
        .cs-step-dot.done   { background: var(--success-bg); color: var(--success); border: 1.5px solid rgba(52,211,153,0.3); }
        .cs-step-dot.active { background: var(--accent); color: #0B0F1A; border: 1.5px solid var(--accent); box-shadow: 0 0 0 4px var(--accent-glow); }
        .cs-step-dot.idle   { background: var(--bg-input); color: var(--text-muted); border: 1.5px solid var(--border); }
        .cs-step-label { font-size: 12.5px; font-weight: 600; transition: color var(--transition); }
        .cs-step-label.active { color: var(--accent); }
        .cs-step-label.done   { color: var(--success); }
        .cs-step-label.idle   { color: var(--text-muted); }
        @media(max-width: 640px){ .cs-step-label { display: none; } }
        .cs-step-sep { width: 24px; height: 1.5px; background: var(--border); flex-shrink: 0; border-radius: 2px; transition: background var(--transition); }
        .cs-step-sep.done { background: var(--success); opacity: 0.4; }
        .cs-step-sep.active { background: var(--accent); opacity: 0.4; }

        /* ── Card ── */
        .cs-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 24px 26px;
          margin-bottom: 14px;
          box-shadow: var(--shadow-card);
          position: relative;
        }
        .cs-card::before {
          content: "";
          position: absolute; top: 0; left: 24px; right: 24px; height: 2px;
          background: linear-gradient(90deg, transparent, var(--accent-soft), transparent);
        }

        /* ── Grid layouts ── */
        .cs-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .cs-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
        .cs-grid-1 { display: grid; grid-template-columns: 1fr; gap: 14px; }
        @media(max-width: 640px) {
          .cs-grid-2, .cs-grid-3 { grid-template-columns: 1fr; }
        }

        /* ── Field ── */
        .cs-field { display: flex; flex-direction: column; gap: 5px; }
        .cs-label {
          font-size: 11.5px; font-weight: 600;
          color: var(--text-secondary); letter-spacing: 0.2px; text-transform: uppercase;
          display: flex; align-items: center; gap: 2px;
        }
        .cs-error {
          font-size: 11.5px; color: var(--error);
          display: flex; align-items: center; gap: 4px; margin-top: 1px;
        }

        /* Mobile prefix input */
        .cs-input-prefix { display: flex; align-items: stretch; }
        .cs-prefix-tag {
          display: flex; align-items: center;
          background: var(--bg-input); border: 1.5px solid var(--border);
          border-right: none; border-radius: var(--radius-sm) 0 0 var(--radius-sm);
          padding: 0 11px; font-size: 12.5px; color: var(--text-muted);
          font-family: "JetBrains Mono", monospace; white-space: nowrap;
          flex-shrink: 0;
        }

        /* ── Guardian block ── */
        .cs-guardian-block {
          background: var(--bg-input); border: 1px solid var(--border);
          border-radius: var(--radius-sm); padding: 16px 18px;
          margin-bottom: 12px; transition: border-color var(--transition);
        }
        .cs-guardian-block:hover { border-color: var(--border-hover); }
        .cs-guardian-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 14px;
        }
        .cs-guardian-num {
          font-size: 11px; font-weight: 700; letter-spacing: 0.8px;
          text-transform: uppercase; color: var(--accent);
        }
        .cs-remove-btn {
          display: flex; align-items: center; gap: 5px;
          background: var(--error-bg); border: 1px solid rgba(248,113,113,0.15);
          color: var(--error); border-radius: 6px; padding: 4px 11px;
          font-size: 12px; font-weight: 600; cursor: pointer;
          font-family: "Sora", sans-serif;
          transition: background var(--transition);
        }
        .cs-remove-btn:hover { background: rgba(248,113,113,0.16); }

        /* ── Nav bar ── */
        .cs-nav {
          display: flex; justify-content: space-between; align-items: center;
          margin-top: 6px; padding-top: 20px; border-top: 1px solid var(--border);
          gap: 10px;
        }
        .cs-nav-left  { display: flex; align-items: center; gap: 10px; }
        .cs-nav-right { display: flex; align-items: center; gap: 10px; }
        .cs-step-indicator {
          font-family: "JetBrains Mono", monospace;
          font-size: 11px; color: var(--text-muted);
        }

        /* ── Success state ── */
        .cs-success {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 64px 32px; text-align: center; gap: 16px;
          animation: cardIn 0.55s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        .cs-success-icon {
          width: 64px; height: 64px; border-radius: 50%;
          background: var(--success-bg); border: 1.5px solid rgba(52,211,153,0.3);
          display: flex; align-items: center; justify-content: center;
          color: var(--success); animation: iconPulse 3s ease-in-out infinite;
        }
        .cs-success-title { font-size: 20px; font-weight: 700; color: var(--text-primary); }
        .cs-success-sub   { font-size: 13.5px; color: var(--text-muted); }

        /* ── Optional hint ── */
        .cs-optional {
          font-size: 10px; color: var(--text-muted); font-weight: 400;
          text-transform: none; letter-spacing: 0; margin-left: 4px;
        }

        /* ── Hint text ── */
        .cs-hint { font-size: 11px; color: var(--text-muted); margin-top: 3px; }
      `}</style>

      <div className="cs-page">
        {/* Back */}
        <Link href="/students" className="cs-back">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Students
        </Link>

        {/* Title */}
        <h1 className="cs-page-title">Register New Student</h1>
        <p className="cs-page-subtitle">
          {appConfig.schoolNameEn} · Complete all sections to register
        </p>

        {/* Success screen */}
        {submitted ? (
          <div className="cs-card">
            <div className="cs-success">
              <div className="cs-success-icon">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <p className="cs-success-title">Student Registered!</p>
              <p className="cs-success-sub">
                {studentName} has been added to {appConfig.schoolNameEn}.<br />
                Redirecting to students list…
              </p>
              <div className="erp-spinner" style={{ marginTop: 8 }} />
            </div>
          </div>
        ) : (
          <>
            {/* ── Stepper ── */}
            <div className="cs-stepper">
              {STEPS.map((s, i) => {
                const state =
                  s.id < step ? "done" : s.id === step ? "active" : "idle";
                return (
                  <div
                    key={s.id}
                    style={{ display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <div className="cs-step">
                      <div className={`cs-step-dot ${state}`}>
                        {state === "done" ? (
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        ) : (
                          s.id
                        )}
                      </div>
                      <span className={`cs-step-label ${state}`}>
                        {s.label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={`cs-step-sep ${state}`} />
                    )}
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {/* ══════════════ STEP 1: Student ══════════════ */}
              {step === 1 && (
                <Section title="Student Information">
                  <div className="cs-grid-2">
                    <Field
                      label="Student UID"
                      required
                      error={errors.studentUid?.message}
                    >
                      <input
                        {...register("studentUid")}
                        className="erp-input"
                        placeholder="e.g. STU-2025-001"
                        style={{
                          fontFamily: '"JetBrains Mono", monospace',
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      />
                      <span className="cs-hint">
                        Uppercase letters, numbers, hyphens only
                      </span>
                    </Field>

                    <Field
                      label="Birth Registration No."
                      required
                      error={errors.birthRegistration?.message}
                    >
                      <input
                        {...register("birthRegistration")}
                        className="erp-input"
                        placeholder="17-digit number"
                        inputMode="numeric"
                      />
                    </Field>

                    <Field
                      label="Full Name (English)"
                      required
                      error={errors.name?.en?.message}
                    >
                      <input
                        {...register("name.en")}
                        className="erp-input"
                        placeholder="e.g. Md. Rahim Uddin"
                      />
                    </Field>

                    <Field
                      label="Full Name (Bengali)"
                      error={errors.name?.bn?.message}
                    >
                      <input
                        {...register("name.bn")}
                        className="erp-input"
                        placeholder="যেমন: মোঃ রহিম উদ্দিন"
                      />
                    </Field>

                    <Field
                      label="Date of Birth"
                      required
                      error={errors.birthDate?.message}
                    >
                      <input
                        type="date"
                        {...register("birthDate")}
                        className="erp-input"
                        max={new Date().toISOString().split("T")[0]}
                      />
                    </Field>

                    <Field
                      label="Gender"
                      required
                      error={errors.gender?.message}
                    >
                      <select
                        {...register("gender")}
                        className="erp-input erp-select"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </Field>

                    <Field
                      label="Religion"
                      required
                      error={errors.religion?.message}
                    >
                      <select
                        {...register("religion")}
                        className="erp-input erp-select"
                      >
                        <option value="">Select religion</option>
                        <option value="Islam">Islam</option>
                        <option value="Hinduism">Hinduism</option>
                        <option value="Christianity">Christianity</option>
                        <option value="Buddhism">Buddhism</option>
                        <option value="Other">Other</option>
                      </select>
                    </Field>

                    <Field label="Language Preference">
                      <select
                        {...register("languagePreference")}
                        className="erp-input erp-select"
                      >
                        <option value="bn">Bengali (বাংলা)</option>
                        <option value="en">English</option>
                      </select>
                    </Field>

                    <Field
                      label={
                        <>
                          Photo URL{" "}
                          <span className="cs-optional">(optional)</span>
                        </>
                      }
                      error={errors.imageUrl?.message}
                    >
                      <input
                        {...register("imageUrl")}
                        className="erp-input"
                        placeholder="https://example.com/photo.jpg"
                        inputMode="url"
                      />
                    </Field>
                  </div>
                </Section>
              )}

              {/* ══════════════ STEP 2: Father ══════════════ */}
              {step === 2 && (
                <Section title="Father's Information">
                  <ParentFields
                    prefix="father"
                    register={register}
                    errors={errors}
                  />
                </Section>
              )}

              {/* ══════════════ STEP 3: Mother ══════════════ */}
              {step === 3 && (
                <Section title="Mother's Information">
                  <ParentFields
                    prefix="mother"
                    register={register}
                    errors={errors}
                  />
                </Section>
              )}

              {/* ══════════════ STEP 4: Guardians ══════════════ */}
              {step === 4 && (
                <Section
                  title={
                    <>
                      Additional Guardians{" "}
                      <span className="cs-optional">(optional)</span>
                    </>
                  }
                >
                  {fields.length === 0 && (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "28px 0 20px",
                        color: "var(--text-muted)",
                        fontSize: 13,
                      }}
                    >
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                          margin: "0 auto 10px",
                          display: "block",
                          opacity: 0.4,
                        }}
                      >
                        <circle cx="12" cy="8" r="4" />
                        <path d="M20 21a8 8 0 1 0-16 0" />
                      </svg>
                      No additional guardians added yet.
                    </div>
                  )}

                  {fields.map((field, i) => (
                    <div key={field.id} className="cs-guardian-block">
                      <div className="cs-guardian-header">
                        <span className="cs-guardian-num">
                          Guardian #{i + 1}
                        </span>
                        <button
                          type="button"
                          className="cs-remove-btn"
                          onClick={() => remove(i)}
                        >
                          <svg
                            width="11"
                            height="11"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 6 6 18M6 6l12 12" />
                          </svg>
                          Remove
                        </button>
                      </div>
                      <div className="cs-grid-2">
                        <Field
                          label="Relation"
                          required
                          error={errors.guardians?.[i]?.relation?.message}
                        >
                          <select
                            {...register(`guardians.${i}.relation`)}
                            className="erp-input erp-select"
                          >
                            <option value="guardian">Guardian</option>
                            <option value="other">Other</option>
                          </select>
                        </Field>

                        <Field
                          label="Mobile Number"
                          required
                          error={errors.guardians?.[i]?.mobile?.message}
                        >
                          <div className="cs-input-prefix">
                            <span className="cs-prefix-tag">+880</span>
                            <input
                              {...register(`guardians.${i}.mobile`)}
                              className="erp-input"
                              style={{
                                borderRadius:
                                  "0 var(--radius-sm) var(--radius-sm) 0",
                                borderLeft: "none",
                              }}
                              placeholder="01XXXXXXXXX"
                              inputMode="tel"
                            />
                          </div>
                        </Field>

                        <Field
                          label="Name (English)"
                          required
                          error={errors.guardians?.[i]?.name?.en?.message}
                        >
                          <input
                            {...register(`guardians.${i}.name.en`)}
                            className="erp-input"
                            placeholder="Guardian name"
                          />
                        </Field>

                        <Field label="Name (Bengali)">
                          <input
                            {...register(`guardians.${i}.name.bn`)}
                            className="erp-input"
                            placeholder="বাংলায় নাম"
                          />
                        </Field>

                        <Field label="NID">
                          <input
                            {...register(`guardians.${i}.nid`)}
                            className="erp-input"
                            placeholder="National ID (optional)"
                            inputMode="numeric"
                          />
                        </Field>

                        <Field label="Mobile Wallet Provider">
                          <select
                            {...register(`guardians.${i}.walletProvider`)}
                            className="erp-input erp-select"
                          >
                            <option value="bKash">bKash</option>
                            <option value="Nagad">Nagad</option>
                            <option value="Rocket">Rocket</option>
                            <option value="Other">Other</option>
                          </select>
                        </Field>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="erp-btn-ghost"
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      marginTop: fields.length > 0 ? 4 : 0,
                    }}
                    onClick={() =>
                      append({
                        relation: "guardian",
                        name: { en: "", bn: "" },
                        mobile: "",
                        walletProvider: "bKash",
                      })
                    }
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    Add Guardian
                  </button>
                </Section>
              )}

              {/* ══════════════ STEP 5: Class ══════════════ */}
              {step === 5 && (
                <>
                  <Section title="Class & Enrollment">
                    <div className="cs-grid-3">
                      <Field
                        label="Academic Session"
                        required
                        error={errors.current?.session?.message}
                      >
                        <input
                          {...register("current.session")}
                          className="erp-input"
                          placeholder={`e.g. ${new Date().getFullYear()}`}
                          style={{ fontFamily: '"JetBrains Mono", monospace' }}
                        />
                      </Field>

                      <select
                        {...register("current.class")}
                        className="erp-input erp-select"
                      >
                        <option value="">Select class</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((c) => (
                          <option key={c} value={c}>
                            Class {c}
                          </option>
                        ))}
                      </select>

                      {/* <input
                        type="number"
                        {...register("current.roll")}
                        className="erp-input"
                        min={1}
                      /> */}

                      <Field
                        label="Roll Number"
                        required
                        error={errors.current?.roll?.message}
                      >
                        <input
                          type="number"
                          {...register("current.roll")}
                          className="erp-input"
                          placeholder="e.g. 12"
                          min={1}
                          style={{ fontFamily: '"JetBrains Mono", monospace' }}
                        />
                      </Field>
                    </div>
                  </Section>

                  {/* Review summary before submit */}
                  <div
                    className="cs-card"
                    style={{
                      background: "var(--accent-soft)",
                      borderColor: "rgba(245,158,11,0.2)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 14,
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          background: "var(--accent)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#0B0F1A"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                          <path d="M6 12v5c3 3 9 3 12 0v-5" />
                        </svg>
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "var(--text-primary)",
                          }}
                        >
                          Review Before Submitting
                        </p>
                        <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                          Make sure all information is correct
                        </p>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "6px 20px",
                      }}
                    >
                      {[
                        ["Student UID", watch("studentUid") || "—"],
                        ["Name", watch("name.en") || "—"],
                        ["Gender", watch("gender") || "—"],
                        ["Religion", watch("religion") || "—"],
                        ["Father", watch("father.name.en") || "—"],
                        ["Mother", watch("mother.name.en") || "—"],
                        ["Guardians", `${fields.length} added`],
                        ["Session", watch("current.session") || "—"],
                      ].map(([k, v]) => (
                        <div
                          key={k}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 8,
                            borderBottom: "1px solid var(--border)",
                            paddingBottom: 5,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 11.5,
                              color: "var(--text-muted)",
                              fontWeight: 600,
                              textTransform: "uppercase",
                              letterSpacing: "0.3px",
                            }}
                          >
                            {k}
                          </span>
                          <span
                            style={{
                              fontSize: 12.5,
                              color: "var(--text-primary)",
                              fontWeight: 600,
                              textAlign: "right",
                            }}
                          >
                            {v}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* ── Navigation ── */}
              <div className="cs-nav">
                <div className="cs-nav-left">
                  {step > 1 ? (
                    <button
                      type="button"
                      className="erp-btn-ghost"
                      onClick={goPrev}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </button>
                  ) : (
                    <Link href="/students" className="erp-btn-ghost">
                      Cancel
                    </Link>
                  )}
                  <span className="cs-step-indicator">
                    {step} / {STEPS.length}
                  </span>
                </div>

                <div className="cs-nav-right">
                  {step < STEPS.length ? (
                    <button
                      type="button"
                      className="erp-btn-primary"
                      onClick={goNext}
                    >
                      Next
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="erp-btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className="erp-spinner" />
                          <span>Registering…</span>
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
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                          <span>Register Student</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </>
  );
}
