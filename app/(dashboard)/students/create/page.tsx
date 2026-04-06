// src/app/(dashboard)/students/create/page.tsx
"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import { z } from "zod";
import { StudentFormData, studentSchema } from "@/schemas/student.schema";
import { CreateStudentPayload, useCreateStudentMutation, useGetClassesQuery, useGetSessionsQuery } from "@/lib/services/studentApi";


// ─── Cloudinary upload helper ──────────────────────────────────────
async function uploadToCloudinary(
  file: File
): Promise<{ url: string; publicId: string }> {
  const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  const PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", PRESET);
  fd.append("folder", "erp/students");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`,
    {
      method: "POST",
      body: fd,
    }
  );
  if (!res.ok) throw new Error("Image upload failed");
  const data = await res.json();
  return { url: data.secure_url, publicId: data.public_id };
}

type FormData = z.infer<typeof studentSchema>;

// ─── BD Districts (common) ─────────────────────────────────────────
const BD_DISTRICTS = [
  "Barisal",
  "Bhola",
  "Borguna",
  "Jhalokathi",
  "Patuakhali",
  "Pirojpur",
  "Bandarban",
  "Brahmanbaria",
  "Chandpur",
  "Chittagong",
  "Comilla",
  "Cox's Bazar",
  "Feni",
  "Khagrachhari",
  "Lakshmipur",
  "Noakhali",
  "Rangamati",
  "Dhaka",
  "Faridpur",
  "Gazipur",
  "Gopalganj",
  "Kishoreganj",
  "Madaripur",
  "Manikganj",
  "Munshiganj",
  "Narayanganj",
  "Narsingdi",
  "Rajbari",
  "Shariatpur",
  "Tangail",
  "Bagerhat",
  "Chuadanga",
  "Jessore",
  "Jhenaidah",
  "Khulna",
  "Kushtia",
  "Magura",
  "Meherpur",
  "Narail",
  "Satkhira",
  "Jamalpur",
  "Mymensingh",
  "Netrokona",
  "Sherpur",
  "Bogra",
  "Chapainawabganj",
  "Joypurhat",
  "Naogaon",
  "Natore",
  "Pabna",
  "Rajshahi",
  "Sirajganj",
  "Dinajpur",
  "Gaibandha",
  "Kurigram",
  "Lalmonirhat",
  "Nilphamari",
  "Panchagarh",
  "Rangpur",
  "Thakurgaon",
  "Habiganj",
  "Moulvibazar",
  "Sunamganj",
  "Sylhet",
].sort();

// ─── Steps ────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Student Info", icon: "👤" },
  { id: 2, label: "Address", icon: "🏠" },
  { id: 3, label: "Father", icon: "👨" },
  { id: 4, label: "Mother", icon: "👩" },
  { id: 5, label: "Guardians", icon: "👥" },
  { id: 6, label: "Enrollment", icon: "🏫" },
];

const STEP_FIELDS: Record<number, (keyof FormData)[]> = {
  1: [
    "studentUid",
    "name",
    "gender",
    "religion",
    "birthDate",
    "birthRegistration",
    "languagePreference",
    "bloodGroup",
  ],
  2: ["address"],
  3: ["father"],
  4: ["mother"],
  5: ["guardians"],
  6: ["current"],
};

// ─── CSS ──────────────────────────────────────────────────────────
const CSS = `
.cr-page { max-width:860px; margin:0 auto; }
.cr-back { display:inline-flex; align-items:center; gap:7px; font-size:12.5px; color:var(--text-muted); text-decoration:none; margin-bottom:18px; transition:color .18s; }
.cr-back:hover { color:var(--accent); }
.cr-title { font-size:20px; font-weight:700; color:var(--text-primary); letter-spacing:-.4px; margin:0; }
.cr-subtitle { font-size:13px; color:var(--text-muted); margin:3px 0 22px; }

/* Stepper */
.cr-stepper { display:flex; align-items:center; background:var(--bg-card); border:1px solid var(--border); border-radius:13px; padding:14px 18px; margin-bottom:18px; gap:4px; overflow-x:auto; }
.cr-step-wrap { display:flex; align-items:center; gap:4px; flex-shrink:0; }
.cr-step-dot { width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; flex-shrink:0; transition:all .2s; cursor:default; }
.cr-dot-done   { background:rgba(52,211,153,.15); color:var(--success); border:1.5px solid rgba(52,211,153,.3); }
.cr-dot-active { background:var(--accent); color:#0B0F1A; border:1.5px solid var(--accent); box-shadow:0 0 0 4px rgba(245,158,11,.12); }
.cr-dot-idle   { background:var(--bg-input); color:var(--text-muted); border:1.5px solid var(--border); }
.cr-step-lbl { font-size:12px; font-weight:600; }
.cr-lbl-done   { color:var(--success); }
.cr-lbl-active { color:var(--accent); }
.cr-lbl-idle   { color:var(--text-muted); }
@media(max-width:680px){ .cr-step-lbl { display:none; } }
.cr-sep { width:20px; height:1.5px; background:var(--border); border-radius:2px; flex-shrink:0; transition:background .2s; }
.cr-sep-done { background:rgba(52,211,153,.3); }

/* Card */
.cr-card { background:var(--bg-card); border:1px solid var(--border); border-radius:13px; padding:22px 24px; margin-bottom:14px; position:relative; overflow:hidden; }
.cr-card::before { content:''; position:absolute; top:0; left:20px; right:20px; height:2px; background:linear-gradient(90deg,transparent,rgba(245,158,11,.15),transparent); }
.cr-card-title { font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:.7px; margin-bottom:18px; display:flex; align-items:center; gap:7px; }

/* Grid */
.cr-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.cr-grid-3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; }
.cr-grid-1 { display:grid; grid-template-columns:1fr; gap:14px; }
@media(max-width:640px){ .cr-grid-2,.cr-grid-3 { grid-template-columns:1fr; } }

/* Field */
.cr-field { display:flex; flex-direction:column; gap:5px; }
.cr-label { font-size:11px; font-weight:700; color:var(--text-secondary); text-transform:uppercase; letter-spacing:.4px; }
.cr-req   { color:var(--error); margin-left:2px; }
.cr-input,.cr-select {
  width:100%; box-sizing:border-box;
  background:var(--bg-input); border:1.5px solid var(--border);
  border-radius:9px; padding:9px 12px;
  font-family:inherit; font-size:13px; color:var(--text-primary);
  outline:none; transition:border-color .18s, box-shadow .18s;
}
.cr-input::placeholder { color:var(--text-muted); }
.cr-input:focus,.cr-select:focus { border-color:rgba(245,158,11,.5); box-shadow:0 0 0 3px rgba(245,158,11,.08); }
.cr-input.err { border-color:var(--error); }
.cr-error { font-size:11px; color:var(--error); display:flex; align-items:center; gap:4px; margin-top:1px; }
.cr-hint  { font-size:11px; color:var(--text-muted); margin-top:2px; }
.cr-prefix-row { display:flex; }
.cr-prefix { display:flex; align-items:center; background:var(--bg-input); border:1.5px solid var(--border); border-right:none; border-radius:9px 0 0 9px; padding:0 11px; font-size:12.5px; color:var(--text-muted); font-family:'JetBrains Mono',monospace; white-space:nowrap; flex-shrink:0; }
.cr-prefix + .cr-input { border-radius:0 9px 9px 0; }

/* Image upload */
.cr-img-zone { border:2px dashed var(--border); border-radius:11px; padding:20px; cursor:pointer; transition:border-color .18s, background .18s; text-align:center; position:relative; }
.cr-img-zone:hover,.cr-img-zone.drag { border-color:rgba(245,158,11,.4); background:rgba(245,158,11,.04); }
.cr-img-preview { width:80px; height:80px; border-radius:10px; object-fit:cover; margin:0 auto 8px; display:block; border:2px solid rgba(245,158,11,.2); }
.cr-img-label { font-size:12px; color:var(--text-muted); }
.cr-img-uploading { font-size:12px; color:var(--accent); display:flex; align-items:center; gap:6px; justify-content:center; }

/* Guardian block */
.cr-guardian { background:var(--bg-input); border:1px solid var(--border); border-radius:10px; padding:16px; margin-bottom:12px; }
.cr-guardian-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; }
.cr-guardian-num  { font-size:11px; font-weight:700; color:var(--accent); letter-spacing:.6px; text-transform:uppercase; }
.cr-rm-btn { display:flex; align-items:center; gap:5px; background:rgba(248,113,113,.08); border:1px solid rgba(248,113,113,.15); color:var(--error); border-radius:7px; padding:4px 11px; font-size:12px; font-weight:600; cursor:pointer; transition:background .18s; font-family:inherit; }
.cr-rm-btn:hover { background:rgba(248,113,113,.15); }
.cr-add-btn { width:100%; display:flex; align-items:center; justify-content:center; gap:7px; background:none; border:1.5px dashed var(--border); border-radius:9px; padding:11px; font-family:inherit; font-size:13px; font-weight:600; color:var(--text-muted); cursor:pointer; transition:all .18s; }
.cr-add-btn:hover { border-color:rgba(245,158,11,.4); color:var(--accent); background:rgba(245,158,11,.04); }

/* Review card */
.cr-review { background:rgba(245,158,11,.05); border:1px solid rgba(245,158,11,.15); border-radius:13px; padding:18px; }
.cr-review-grid { display:grid; grid-template-columns:1fr 1fr; gap:6px 20px; margin-top:14px; }
@media(max-width:640px){ .cr-review-grid { grid-template-columns:1fr; } }
.cr-review-row { display:flex; justify-content:space-between; gap:8px; border-bottom:1px solid var(--border); padding-bottom:5px; }
.cr-review-key { font-size:11px; color:var(--text-muted); font-weight:700; text-transform:uppercase; letter-spacing:.3px; }
.cr-review-val { font-size:12.5px; color:var(--text-primary); font-weight:600; text-align:right; }

/* Nav */
.cr-nav { display:flex; justify-content:space-between; align-items:center; margin-top:6px; padding-top:18px; border-top:1px solid var(--border); }
.cr-nav-info { font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--text-muted); }
.cr-btn-ghost {
  display:inline-flex; align-items:center; gap:7px;
  background:none; border:1.5px solid var(--border); border-radius:10px;
  padding:9px 16px; font-family:inherit; font-size:13px; font-weight:600;
  color:var(--text-muted); cursor:pointer; text-decoration:none;
  transition:all .18s;
}
.cr-btn-ghost:hover { border-color:var(--bg-input); color:var(--text-primary); }
.cr-btn-primary {
  display:inline-flex; align-items:center; gap:7px;
  background:var(--accent); color:#0B0F1A; border:none; border-radius:10px;
  padding:9px 20px; font-family:inherit; font-size:13px; font-weight:700;
  cursor:pointer; transition:all .18s; box-shadow:0 4px 14px rgba(245,158,11,.3);
}
.cr-btn-primary:hover:not(:disabled) { background:var(--accent-hover,#FBBF24); transform:translateY(-1px); }
.cr-btn-primary:disabled { opacity:.5; cursor:not-allowed; transform:none; }

/* Success */
.cr-success { display:flex; flex-direction:column; align-items:center; padding:60px 30px; gap:14px; text-align:center; }
.cr-success-icon { width:64px; height:64px; border-radius:50%; background:rgba(52,211,153,.1); border:1.5px solid rgba(52,211,153,.3); display:flex; align-items:center; justify-content:center; color:var(--success); }
.cr-success-title { font-size:20px; font-weight:700; color:var(--text-primary); margin:0; }
.cr-success-sub   { font-size:13px; color:var(--text-muted); margin:0; }
.cr-spinner { width:20px; height:20px; border:2px solid rgba(245,158,11,.2); border-top-color:var(--accent); border-radius:50%; animation:cr-spin 1s linear infinite; }
@keyframes cr-spin { to { transform:rotate(360deg); } }
`;

// ─── Sub-components ────────────────────────────────────────────────

function Field({
  label,
  required,
  error,
  hint,
  children,
}: {
  label: React.ReactNode;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="cr-field">
      <label className="cr-label">
        {label}
        {required && <span className="cr-req">*</span>}
      </label>
      {children}
      {hint && !error && <span className="cr-hint">{hint}</span>}
      {error && (
        <span className="cr-error">
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
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
  const label = prefix === "father" ? "Father" : "Mother";
  return (
    <div className="cr-grid-2">
      <Field
        label={`${label}'s Name (English)`}
        required
        error={e?.name?.en?.message}
      >
        <input
          {...register(`${prefix}.name.en`)}
          className="cr-input"
          placeholder={
            prefix === "father" ? "e.g. Md. Karim Uddin" : "e.g. Fatema Begum"
          }
        />
      </Field>
      <Field label={`${label}'s Name (Bengali)`} error={e?.name?.bn?.message}>
        <input
          {...register(`${prefix}.name.bn`)}
          className="cr-input"
          placeholder="বাংলায় নাম"
        />
      </Field>
      <Field label="Mobile Number" required error={e?.mobile?.message}>
        <div className="cr-prefix-row">
          <span className="cr-prefix">+880</span>
          <input
            {...register(`${prefix}.mobile`)}
            className="cr-input"
            placeholder="01XXXXXXXXX"
            inputMode="tel"
          />
        </div>
      </Field>
      <Field label="National ID (NID)" required error={e?.nid?.message}>
        <input
          {...register(`${prefix}.nid`)}
          className="cr-input"
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
          className="cr-input"
          placeholder="17-digit number"
          inputMode="numeric"
        />
      </Field>
      <Field label="Occupation">
        <input
          {...register(`${prefix}.occupation`)}
          className="cr-input"
          placeholder="e.g. Farmer, Teacher"
        />
      </Field>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────

export default function CreateStudentPage() {
  const router = useRouter();
  const [createStudent, { isLoading }] = useCreateStudentMutation();
  const { data: sessions = [] } = useGetSessionsQuery();
  const { data: classes = [] } = useGetClassesQuery();

  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageDrag, setImageDrag] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const {
    register,
    control,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema) as any, // ← এটুকু cast
    defaultValues: {
      guardians: [],
      languagePreference: "bn",
      nationality: "Bangladeshi",
    },
    mode: "onTouched",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "guardians",
  });

  const goNext = async () => {
    const valid = await trigger(STEP_FIELDS[step] as any);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length));
  };
  const goPrev = () => setStep((s) => Math.max(s - 1, 1));

  // Image upload handler
  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setImageUploading(true);
    try {
      const { url, publicId } = await uploadToCloudinary(file);
      setValue("imageUrl", url);
      setImagePreview(url);
      // Store publicId in a hidden field if needed
      toast.success("Photo uploaded successfully");
    } catch {
      toast.error("Failed to upload photo");
    } finally {
      setImageUploading(false);
    }
  };

  const onSubmit= async (data: StudentFormData) => {
    try {
       await createStudent(
        data as unknown as CreateStudentPayload
      ).unwrap();
      setSubmitted(true);
      toast.success(`${data.name.en} registered successfully`, {
        description: `UID: ${data.studentUid}`,
      });
      setTimeout(() => router.push("/students"), 1400);
    } catch (err: any) {
      toast.error("Registration failed", {
        description: err?.data?.message ?? "Please try again.",
      });
    }
  };

  const w = watch();

  // Available sessions: from backend + current year if empty
  const sessionOptions =
    sessions.length > 0
      ? sessions
      : [
          String(new Date().getFullYear()),
          String(new Date().getFullYear() + 1),
        ];

  // Available classes: from backend + 1-10 fallback
  // Always include 1-12; merge with any extra classes from DB
  const classOptions = Array.from(
    new Set([...Array.from({ length: 12 }, (_, i) => i + 1), ...classes])
  ).sort((a, b) => a - b);

  return (
    <>
      <style>{CSS}</style>
      <div className="cr-page">
        <Link href="/students" className="cr-back">
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

        <h1 className="cr-title">Register New Student</h1>
        <p className="cr-subtitle">
          Complete all sections to register a student
        </p>

        {submitted ? (
          <div className="cr-card">
            <div className="cr-success">
              <div className="cr-success-icon">
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
              <p className="cr-success-title">Student Registered!</p>
              <p className="cr-success-sub">
                {w.name?.en} · {w.studentUid}
                <br />
                Redirecting…
              </p>
              <div className="cr-spinner" />
            </div>
          </div>
        ) : (
          <>
            {/* Stepper */}
            <div className="cr-stepper">
              {STEPS.map((s, i) => {
                const state =
                  s.id < step ? "done" : s.id === step ? "active" : "idle";
                return (
                  <div key={s.id} className="cr-step-wrap">
                    <div className={`cr-step-dot cr-dot-${state}`}>
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
                        s.icon
                      )}
                    </div>
                    <span className={`cr-step-lbl cr-lbl-${state}`}>
                      {s.label}
                    </span>
                    {i < STEPS.length - 1 && (
                      <div
                        className={`cr-sep ${
                          state === "done" ? "cr-sep-done" : ""
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {/* ══ STEP 1: Student Info ══ */}
              {step === 1 && (
                <div className="cr-card">
                  <div className="cr-card-title">👤 Student Information</div>
                  <div className="cr-grid-2">
                    <Field
                      label="Student UID"
                      required
                      error={errors.studentUid?.message}
                      hint="Uppercase, numbers, hyphens e.g. STU-2025-001"
                    >
                      <input
                        {...register("studentUid")}
                        className="cr-input"
                        placeholder="STU-2025-001"
                        style={{
                          fontFamily: '"JetBrains Mono",monospace',
                          textTransform: "uppercase",
                        }}
                        onChange={(e) => {
                          e.target.value = e.target.value.toUpperCase();
                          register("studentUid").onChange(e);
                        }}
                      />
                    </Field>
                    <Field
                      label="Birth Registration No."
                      required
                      error={errors.birthRegistration?.message}
                    >
                      <input
                        {...register("birthRegistration")}
                        className="cr-input"
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
                        className="cr-input"
                        placeholder="e.g. Md. Rahim Uddin"
                      />
                    </Field>
                    <Field
                      label="Full Name (Bengali)"
                      error={errors.name?.bn?.message}
                    >
                      <input
                        {...register("name.bn")}
                        className="cr-input"
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
                        className="cr-input"
                        max={new Date().toISOString().split("T")[0]}
                      />
                    </Field>
                    <Field
                      label="Gender"
                      required
                      error={errors.gender?.message}
                    >
                      <select {...register("gender")} className="cr-select">
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
                      <select {...register("religion")} className="cr-select">
                        <option value="">Select religion</option>
                        <option value="Islam">Islam</option>
                        <option value="Hinduism">Hinduism</option>
                        <option value="Christianity">Christianity</option>
                        <option value="Buddhism">Buddhism</option>
                        <option value="Other">Other</option>
                      </select>
                    </Field>
                    <Field label="Blood Group">
                      <select {...register("bloodGroup")} className="cr-select">
                        <option value="">Unknown</option>
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                          (b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          )
                        )}
                      </select>
                    </Field>
                    <Field label="Language Preference">
                      <select
                        {...register("languagePreference")}
                        className="cr-select"
                      >
                        <option value="bn">Bengali (বাংলা)</option>
                        <option value="en">English</option>
                      </select>
                    </Field>
                    <Field label="Nationality">
                      <input
                        {...register("nationality")}
                        className="cr-input"
                        placeholder="Bangladeshi"
                      />
                    </Field>
                  </div>

                  {/* Photo upload */}
                  <div style={{ marginTop: 16 }}>
                    <div className="cr-label" style={{ marginBottom: 6 }}>
                      Student Photo
                    </div>
                    <div
                      className={`cr-img-zone ${imageDrag ? "drag" : ""}`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setImageDrag(true);
                      }}
                      onDragLeave={() => setImageDrag(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setImageDrag(false);
                        const file = e.dataTransfer.files[0];
                        if (file) handleImageUpload(file);
                      }}
                      onClick={() =>
                        document.getElementById("photo-input")?.click()
                      }
                    >
                      <input
                        id="photo-input"
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleImageUpload(f);
                        }}
                      />
                      {imageUploading ? (
                        <div className="cr-img-uploading">
                          <div className="cr-spinner" /> Uploading…
                        </div>
                      ) : imagePreview ? (
                        <>
                          <img
                            src={imagePreview}
                            className="cr-img-preview"
                            alt="preview"
                          />
                          <p className="cr-img-label">Click to change photo</p>
                        </>
                      ) : (
                        <>
                          <svg
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="var(--text-muted)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ margin: "0 auto 8px", display: "block" }}
                          >
                            <rect
                              width="18"
                              height="18"
                              x="3"
                              y="3"
                              rx="2"
                              ry="2"
                            />
                            <circle cx="9" cy="9" r="2" />
                            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                          </svg>
                          <p className="cr-img-label">
                            Click or drag to upload photo (max 5MB)
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ══ STEP 2: Address ══ */}
              {step === 2 && (
                <div className="cr-card">
                  <div className="cr-card-title">
                    🏠 Address Information{" "}
                    <span
                      style={{
                        color: "var(--text-muted)",
                        fontWeight: 400,
                        textTransform: "none",
                        fontSize: 11,
                      }}
                    >
                      (optional but recommended)
                    </span>
                  </div>
                  <div className="cr-grid-2">
                    <Field
                      label="Village / Para"
                      error={(errors.address as any)?.village?.message}
                    >
                      <input
                        {...register("address.village")}
                        className="cr-input"
                        placeholder="Village name"
                      />
                    </Field>
                    <Field
                      label="Union / Ward"
                      error={(errors.address as any)?.union?.message}
                    >
                      <input
                        {...register("address.union")}
                        className="cr-input"
                        placeholder="Union name"
                      />
                    </Field>
                    <Field
                      label="Upazila / Thana"
                      error={(errors.address as any)?.upazila?.message}
                    >
                      <input
                        {...register("address.upazila")}
                        className="cr-input"
                        placeholder="Upazila name"
                      />
                    </Field>
                    <Field
                      label="District"
                      error={(errors.address as any)?.district?.message}
                    >
                      <select
                        {...register("address.district")}
                        className="cr-select"
                      >
                        <option value="">Select district</option>
                        {BD_DISTRICTS.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Post Code">
                      <input
                        {...register("address.postCode")}
                        className="cr-input"
                        placeholder="e.g. 3500"
                        inputMode="numeric"
                      />
                    </Field>
                  </div>
                </div>
              )}

              {/* ══ STEP 3: Father ══ */}
              {step === 3 && (
                <div className="cr-card">
                  <div className="cr-card-title">👨 Father's Information</div>
                  <ParentFields
                    prefix="father"
                    register={register}
                    errors={errors}
                  />
                </div>
              )}

              {/* ══ STEP 4: Mother ══ */}
              {step === 4 && (
                <div className="cr-card">
                  <div className="cr-card-title">👩 Mother's Information</div>
                  <ParentFields
                    prefix="mother"
                    register={register}
                    errors={errors}
                  />
                </div>
              )}

              {/* ══ STEP 5: Guardians ══ */}
              {step === 5 && (
                <div className="cr-card">
                  <div className="cr-card-title">
                    👥 Additional Guardians{" "}
                    <span
                      style={{
                        color: "var(--text-muted)",
                        fontWeight: 400,
                        textTransform: "none",
                      }}
                    >
                      (optional)
                    </span>
                  </div>
                  {fields.length === 0 && (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "28px 0 16px",
                        color: "var(--text-muted)",
                        fontSize: 13,
                      }}
                    >
                      No guardians added. Click below to add one.
                    </div>
                  )}
                  {fields.map((field, i) => (
                    <div key={field.id} className="cr-guardian">
                      <div className="cr-guardian-head">
                        <span className="cr-guardian-num">
                          Guardian #{i + 1}
                        </span>
                        <button
                          type="button"
                          className="cr-rm-btn"
                          onClick={() => remove(i)}
                        >
                          <svg
                            width="11"
                            height="11"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path d="M18 6 6 18M6 6l12 12" />
                          </svg>
                          Remove
                        </button>
                      </div>
                      <div className="cr-grid-2">
                        <Field
                          label="Relation"
                          error={errors.guardians?.[i]?.relation?.message}
                        >
                          <select
                            {...register(`guardians.${i}.relation`)}
                            className="cr-select"
                          >
                            <option value="guardian">Guardian</option>
                            <option value="other">Other</option>
                          </select>
                        </Field>
                        <Field
                          label="Mobile"
                          required
                          error={errors.guardians?.[i]?.mobile?.message}
                        >
                          <div className="cr-prefix-row">
                            <span className="cr-prefix">+880</span>
                            <input
                              {...register(`guardians.${i}.mobile`)}
                              className="cr-input"
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
                            className="cr-input"
                            placeholder="Guardian name"
                          />
                        </Field>
                        <Field label="Name (Bengali)">
                          <input
                            {...register(`guardians.${i}.name.bn`)}
                            className="cr-input"
                            placeholder="বাংলায় নাম"
                          />
                        </Field>
                        <Field label="NID">
                          <input
                            {...register(`guardians.${i}.nid`)}
                            className="cr-input"
                            placeholder="NID (optional)"
                            inputMode="numeric"
                          />
                        </Field>
                        <Field label="Wallet Provider">
                          <select
                            {...register(`guardians.${i}.walletProvider`)}
                            className="cr-select"
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
                    className="cr-add-btn"
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
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    Add Guardian
                  </button>
                </div>
              )}

              {/* ══ STEP 6: Enrollment ══ */}
              {step === 6 && (
                <>
                  <div className="cr-card">
                    <div className="cr-card-title">🏫 Class & Enrollment</div>
                    <div className="cr-grid-3">
                      <Field
                        label="Academic Session"
                        required
                        error={errors.current?.session?.message}
                      >
                        <select
                          {...register("current.session")}
                          className="cr-select"
                        >
                          <option value="">Select session</option>
                          {sessionOptions.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field
                        label="Class"
                        required
                        error={errors.current?.class?.message}
                      >
                        <select
                          {...register("current.class")}
                          className="cr-select"
                        >
                          <option value="">Select class</option>
                          {classOptions.map((c) => (
                            <option key={c} value={c}>
                              Class {c}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field
                        label="Roll Number"
                        required
                        error={errors.current?.roll?.message}
                      >
                        <input
                          type="number"
                          {...register("current.roll")}
                          className="cr-input"
                          placeholder="e.g. 12"
                          min={1}
                          style={{ fontFamily: '"JetBrains Mono",monospace' }}
                        />
                      </Field>
                    </div>
                  </div>

                  {/* Review summary */}
                  <div className="cr-review">
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
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
                            margin: 0,
                          }}
                        >
                          Review Before Submitting
                        </p>
                        <p
                          style={{
                            fontSize: 12,
                            color: "var(--text-muted)",
                            margin: 0,
                          }}
                        >
                          Verify all information is correct
                        </p>
                      </div>
                    </div>
                    <div className="cr-review-grid">
                      {[
                        ["UID", w.studentUid || "—"],
                        ["Name", w.name?.en || "—"],
                        ["Gender", w.gender || "—"],
                        ["Religion", w.religion || "—"],
                        ["Father", w.father?.name?.en || "—"],
                        ["Mother", w.mother?.name?.en || "—"],
                        ["Guardians", `${fields.length} added`],
                        ["District", w.address?.district || "—"],
                        ["Session", w.current?.session || "—"],
                        [
                          "Class",
                          w.current?.class ? `Class ${w.current.class}` : "—",
                        ],
                        ["Roll", w.current?.roll ? `#${w.current.roll}` : "—"],
                        ["Blood", (w as any).bloodGroup || "Not set"],
                      ].map(([k, v]) => (
                        <div key={k} className="cr-review-row">
                          <span className="cr-review-key">{k}</span>
                          <span className="cr-review-val">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Navigation */}
              <div className="cr-nav">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {step > 1 ? (
                    <button
                      type="button"
                      className="cr-btn-ghost"
                      onClick={goPrev}
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                      >
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </button>
                  ) : (
                    <Link href="/students" className="cr-btn-ghost">
                      Cancel
                    </Link>
                  )}
                  <span className="cr-nav-info">
                    {step} / {STEPS.length}
                  </span>
                </div>
                <div>
                  {step < STEPS.length ? (
                    <button
                      type="button"
                      className="cr-btn-primary"
                      onClick={goNext}
                    >
                      Next
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="cr-btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className="cr-spinner" /> Registering…
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
                            <path d="M20 6 9 17l-5-5" />
                          </svg>{" "}
                          Register Student
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
