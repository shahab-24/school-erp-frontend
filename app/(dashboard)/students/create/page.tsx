"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { StudentFormData, studentSchema } from "@/schemas/student.schema";
import { useCreateStudentMutation } from "@/lib/services/studentApi";
import { appConfig } from "@/lib/config/appConfig"; // ← env-based config
import Link from "next/link";

export default function CreateStudentPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [createStudent, { isLoading }] = useCreateStudentMutation();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: { guardians: [], languagePreference: "bn" },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "guardians",
  });

  const onSubmit = async (data: StudentFormData) => {
    try {
      await createStudent(data).unwrap();
      toast({
        title: "✓ Student Created",
        description: `${data.name.en} has been registered successfully.`,
      });
      router.push("/dashboard/students");
    } catch (err: any) {
      toast({
        title: "Failed to create student",
        description: err?.data?.message ?? "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <style>{`
        .cs-page { max-width:860px; margin:0 auto; animation:pageEnter 0.3s ease both; }
        .cs-back { display:inline-flex; align-items:center; gap:7px; font-size:12.5px; color:var(--text-muted); text-decoration:none; margin-bottom:20px; transition:color var(--transition); }
        .cs-back:hover { color:var(--accent); }
        .cs-page-title    { font-size:21px; font-weight:700; color:var(--text-primary); letter-spacing:-0.4px; }
        .cs-page-subtitle { font-size:13px; color:var(--text-muted); margin-top:3px; margin-bottom:26px; }
        .cs-card  { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius); padding:24px; margin-bottom:14px; box-shadow:var(--shadow-card); }
        .cs-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:13px; }
        .cs-grid-3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:13px; }
        @media(max-width:640px){ .cs-grid-2,.cs-grid-3{ grid-template-columns:1fr; } }
        .cs-field { display:flex; flex-direction:column; gap:5px; }
        .cs-label { font-size:11.5px; font-weight:600; color:var(--text-secondary); letter-spacing:0.2px; text-transform:uppercase; }
        .cs-error { font-size:11.5px; color:var(--error); margin-top:1px; }
        .cs-guardian { background:var(--bg-input); border:1px solid var(--border); border-radius:var(--radius-sm); padding:15px; margin-bottom:10px; }
        .cs-guardian-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
        .cs-guardian-title  { font-size:11.5px; font-weight:700; color:var(--accent); text-transform:uppercase; letter-spacing:0.5px; }
        .cs-remove-btn { display:flex; align-items:center; gap:5px; background:var(--error-bg); border:1px solid rgba(248,113,113,0.15); color:var(--error); border-radius:6px; padding:4px 10px; font-size:12px; font-weight:600; cursor:pointer; font-family:'Sora',sans-serif; transition:all var(--transition); }
        .cs-remove-btn:hover { background:rgba(248,113,113,0.14); }
        .cs-submit-bar { display:flex; justify-content:flex-end; gap:10px; margin-top:18px; padding-top:18px; border-top:1px solid var(--border); }
      `}</style>

      <div className="cs-page">
        <Link href="/dashboard/students" className="cs-back">
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

        {/* Title — school name from appConfig */}
        <h1 className="cs-page-title">Register New Student</h1>
        <p className="cs-page-subtitle">
          {appConfig.schoolNameEn} · Fill in all required fields
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* ── Personal ── */}
          <div className="cs-card">
            <div className="erp-section-title">Personal Information</div>
            <div className="cs-grid-2">
              <div className="cs-field">
                <label className="cs-label">Student UID *</label>
                <input
                  {...register("studentUid")}
                  className="erp-input"
                  placeholder="e.g. STU-2024-001"
                />
                {errors.studentUid && (
                  <span className="cs-error">
                    ⚠ {errors.studentUid.message}
                  </span>
                )}
              </div>
              <div className="cs-field">
                <label className="cs-label">Birth Registration No *</label>
                <input
                  {...register("birthRegistration")}
                  className="erp-input"
                  placeholder="17-digit number"
                />
                {errors.birthRegistration && (
                  <span className="cs-error">
                    ⚠ {errors.birthRegistration.message}
                  </span>
                )}
              </div>
              <div className="cs-field">
                <label className="cs-label">Full Name (English) *</label>
                <input
                  {...register("name.en")}
                  className="erp-input"
                  placeholder="e.g. Md. Rahim Uddin"
                />
                {errors.name?.en && (
                  <span className="cs-error">⚠ {errors.name.en.message}</span>
                )}
              </div>
              <div className="cs-field">
                <label className="cs-label">Full Name (Bengali) *</label>
                <input
                  {...register("name.bn")}
                  className="erp-input"
                  placeholder="যেমন: মোঃ রহিম উদ্দিন"
                />
              </div>
              <div className="cs-field">
                <label className="cs-label">Date of Birth *</label>
                <input
                  type="date"
                  {...register("birthDate")}
                  className="erp-input"
                />
                {errors.birthDate && (
                  <span className="cs-error">⚠ {errors.birthDate.message}</span>
                )}
              </div>
              <div className="cs-field">
                <label className="cs-label">Gender *</label>
                <select
                  {...register("gender")}
                  className="erp-input erp-select"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                {errors.gender && (
                  <span className="cs-error">⚠ {errors.gender.message}</span>
                )}
              </div>
              <div className="cs-field">
                <label className="cs-label">Religion *</label>
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
                {errors.religion && (
                  <span className="cs-error">⚠ {errors.religion.message}</span>
                )}
              </div>
              <div className="cs-field">
                <label className="cs-label">Language Preference</label>
                <select
                  {...register("languagePreference")}
                  className="erp-input erp-select"
                >
                  <option value="bn">Bengali (বাংলা)</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── Father ── */}
          <div className="cs-card">
            <div className="erp-section-title">Father's Information</div>
            <div className="cs-grid-2">
              <div className="cs-field">
                <label className="cs-label">Name (EN) *</label>
                <input
                  {...register("father.name.en")}
                  className="erp-input"
                  placeholder="Father's name"
                />
                {errors.father?.name?.en && (
                  <span className="cs-error">
                    ⚠ {errors.father.name.en.message}
                  </span>
                )}
              </div>
              <div className="cs-field">
                <label className="cs-label">Name (BN) *</label>
                <input
                  {...register("father.name.bn")}
                  className="erp-input"
                  placeholder="বাংলায় নাম"
                />
              </div>
              <div className="cs-field">
                <label className="cs-label">Mobile *</label>
                <input
                  {...register("father.mobile")}
                  className="erp-input"
                  placeholder="01XXXXXXXXX"
                />
                {errors.father?.mobile && (
                  <span className="cs-error">
                    ⚠ {errors.father.mobile.message}
                  </span>
                )}
              </div>
              <div className="cs-field">
                <label className="cs-label">NID</label>
                <input
                  {...register("father.nid")}
                  className="erp-input"
                  placeholder="National ID"
                />
              </div>
              <div className="cs-field">
                <label className="cs-label">Birth Reg</label>
                <input
                  {...register("father.birthRegistration")}
                  className="erp-input"
                  placeholder="Birth registration"
                />
              </div>
            </div>
          </div>

          {/* ── Mother ── */}
          <div className="cs-card">
            <div className="erp-section-title">Mother's Information</div>
            <div className="cs-grid-2">
              <div className="cs-field">
                <label className="cs-label">Name (EN) *</label>
                <input
                  {...register("mother.name.en")}
                  className="erp-input"
                  placeholder="Mother's name"
                />
                {errors.mother?.name?.en && (
                  <span className="cs-error">
                    ⚠ {errors.mother.name.en.message}
                  </span>
                )}
              </div>
              <div className="cs-field">
                <label className="cs-label">Name (BN) *</label>
                <input
                  {...register("mother.name.bn")}
                  className="erp-input"
                  placeholder="বাংলায় নাম"
                />
              </div>
              <div className="cs-field">
                <label className="cs-label">Mobile *</label>
                <input
                  {...register("mother.mobile")}
                  className="erp-input"
                  placeholder="01XXXXXXXXX"
                />
                {errors.mother?.mobile && (
                  <span className="cs-error">
                    ⚠ {errors.mother.mobile.message}
                  </span>
                )}
              </div>
              <div className="cs-field">
                <label className="cs-label">NID</label>
                <input
                  {...register("mother.nid")}
                  className="erp-input"
                  placeholder="National ID"
                />
              </div>
              <div className="cs-field">
                <label className="cs-label">Birth Reg</label>
                <input
                  {...register("mother.birthRegistration")}
                  className="erp-input"
                  placeholder="Birth registration"
                />
              </div>
            </div>
          </div>

          {/* ── Guardians ── */}
          <div className="cs-card">
            <div className="erp-section-title">
              Additional Guardians{" "}
              <span
                style={{
                  fontSize: "10px",
                  color: "var(--text-muted)",
                  fontWeight: 400,
                  letterSpacing: 0,
                }}
              >
                (optional)
              </span>
            </div>
            {fields.map((field, i) => (
              <div key={field.id} className="cs-guardian">
                <div className="cs-guardian-header">
                  <span className="cs-guardian-title">Guardian #{i + 1}</span>
                  <button
                    type="button"
                    className="cs-remove-btn"
                    onClick={() => remove(i)}
                  >
                    <svg
                      width="12"
                      height="12"
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
                  <div className="cs-field">
                    <label className="cs-label">Relation</label>
                    <select
                      {...register(`guardians.${i}.relation`)}
                      className="erp-input erp-select"
                    >
                      <option value="guardian">Guardian</option>
                      <option value="uncle">Uncle</option>
                      <option value="aunt">Aunt</option>
                      <option value="grandparent">Grandparent</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="cs-field">
                    <label className="cs-label">Mobile</label>
                    <input
                      {...register(`guardians.${i}.mobile`)}
                      className="erp-input"
                      placeholder="01XXXXXXXXX"
                    />
                  </div>
                  <div className="cs-field">
                    <label className="cs-label">Name (EN)</label>
                    <input
                      {...register(`guardians.${i}.name.en`)}
                      className="erp-input"
                      placeholder="Guardian name"
                    />
                  </div>
                  <div className="cs-field">
                    <label className="cs-label">Name (BN)</label>
                    <input
                      {...register(`guardians.${i}.name.bn`)}
                      className="erp-input"
                      placeholder="বাংলায় নাম"
                    />
                  </div>
                  <div className="cs-field">
                    <label className="cs-label">Mobile Wallet</label>
                    <select
                      {...register(`guardians.${i}.walletProvider`)}
                      className="erp-input erp-select"
                    >
                      <option value="bKash">bKash</option>
                      <option value="Nagad">Nagad</option>
                      <option value="Rocket">Rocket</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="erp-btn-ghost"
              style={{
                width: "100%",
                justifyContent: "center",
                marginTop: fields.length > 0 ? 6 : 0,
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
          </div>

          {/* ── Class ── */}
          <div className="cs-card">
            <div className="erp-section-title">Class & Enrollment</div>
            <div className="cs-grid-3">
              <div className="cs-field">
                <label className="cs-label">Academic Session *</label>
                <input
                  {...register("current.session")}
                  className="erp-input"
                  placeholder="e.g. 2025"
                />
                {errors.current?.session && (
                  <span className="cs-error">
                    ⚠ {errors.current.session.message}
                  </span>
                )}
              </div>
              <div className="cs-field">
                <label className="cs-label">Class *</label>
                <select
                  {...register("current.class", { valueAsNumber: true })}
                  className="erp-input erp-select"
                >
                  <option value="">Select class</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((c) => (
                    <option key={c} value={c}>
                      Class {c}
                    </option>
                  ))}
                </select>
                {errors.current?.class && (
                  <span className="cs-error">
                    ⚠ {errors.current.class.message}
                  </span>
                )}
              </div>
              <div className="cs-field">
                <label className="cs-label">Roll Number *</label>
                <input
                  type="number"
                  {...register("current.roll", { valueAsNumber: true })}
                  className="erp-input"
                  placeholder="e.g. 12"
                  min={1}
                />
                {errors.current?.roll && (
                  <span className="cs-error">
                    ⚠ {errors.current.roll.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="cs-submit-bar">
            <Link href="/dashboard/students" className="erp-btn-ghost">
              Cancel
            </Link>
            <button
              type="submit"
              className="erp-btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="erp-spinner" />
                  <span>Creating…</span>
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
                  <span>Create Student</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
