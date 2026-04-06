// src/app/(dashboard)/students/[studentUid]/stipend/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  useGetStudentQuery,
  useGetStipendQuery,
  useUpdateStipendMutation,
} from "@/lib/services/studentApi";
import type {
  StipendBeneficiary,
  WalletProvider,
  PaymentMethod,
} from "@/types/student.types";

const RELATIONS = ["father", "mother", "guardian", "other"] as const;
const PAY_METHODS = ["mobile_banking", "bank", "cash"] as const;
const WALLETS = ["bKash", "Nagad", "Rocket", "Other"] as const;

const WALLET_COLOR: Record<WalletProvider, string> = {
  bKash: "#E2136E",
  Nagad: "#F05A28",
  Rocket: "#8A00B5",
  Other: "#6B7280",
};

const CSS = `
.st-wrap { max-width:700px; margin:0 auto; animation:pageEnter .3s ease both; }

.st-back { display:inline-flex; align-items:center; gap:7px; font-size:12.5px; color:var(--text-muted); text-decoration:none; margin-bottom:16px; transition:color .18s; }
.st-back:hover { color:var(--accent); }

.st-title { font-size:16px; font-weight:700; color:var(--text-primary); margin:0; }
.st-desc  { font-size:12.5px; color:var(--text-muted); margin:4px 0 20px; }

/* Current card */
.st-current {
  background:var(--bg-card); border:1px solid var(--border);
  border-radius:var(--radius-sm); padding:18px 20px; margin-bottom:18px;
  display:flex; align-items:center; gap:14px; flex-wrap:wrap; min-height:72px;
}
.st-cur-icon {
  width:44px; height:44px; border-radius:11px;
  background:rgba(245,158,11,.1); border:1px solid rgba(245,158,11,.2);
  display:flex; align-items:center; justify-content:center; flex-shrink:0;
}
.st-cur-name { font-size:14px; font-weight:700; color:var(--text-primary); }
.st-cur-meta { font-size:12px; color:var(--text-muted); margin-top:3px; display:flex; gap:10px; flex-wrap:wrap; }
.st-provider-pill {
  display:inline-flex; align-items:center; padding:3px 9px;
  border-radius:20px; font-size:11.5px; font-weight:700; border:1px solid;
}
.st-active-label {
  font-size:11px; color:var(--success);
  background:rgba(52,211,153,.1); border:1px solid rgba(52,211,153,.2);
  padding:3px 9px; border-radius:20px; font-weight:600;
}
.st-empty { flex:1; text-align:center; font-size:13px; color:var(--text-muted); }

/* Form */
.st-form {
  background:var(--bg-card); border:1px solid var(--border);
  border-radius:var(--radius-sm); padding:22px 24px;
}
.st-form-title { font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:.6px; margin-bottom:18px; }

.st-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
@media(max-width:560px){ .st-grid-2 { grid-template-columns:1fr; } }

.st-field  { display:flex; flex-direction:column; gap:5px; }
.st-label  { font-size:11px; font-weight:700; color:var(--text-secondary); text-transform:uppercase; letter-spacing:.4px; }
.st-req    { color:var(--error); margin-left:2px; }

.st-input,.st-select {
  width:100%; box-sizing:border-box;
  background:var(--bg-input); border:1.5px solid var(--border);
  border-radius:9px; padding:9px 12px; font-family:inherit;
  font-size:13px; color:var(--text-primary); outline:none; transition:border-color .18s;
}
.st-input::placeholder { color:var(--text-muted); }
.st-input:focus,.st-select:focus { border-color:rgba(245,158,11,.5); box-shadow:0 0 0 3px rgba(245,158,11,.08); }
.st-input.err { border-color:var(--error); }
.st-err { font-size:11px; color:var(--error); }

/* Prefix row (mobile +880) */
.st-prefix-row { display:flex; }
.st-prefix {
  display:flex; align-items:center; padding:0 11px;
  background:var(--bg-input); border:1.5px solid var(--border);
  border-right:none; border-radius:9px 0 0 9px;
  font-size:12px; color:var(--text-muted); font-family:'JetBrains Mono',monospace;
  white-space:nowrap; flex-shrink:0;
}
.st-prefix + .st-input { border-radius:0 9px 9px 0; }

/* Pills */
.st-pills { display:flex; gap:7px; flex-wrap:wrap; margin-top:2px; }
.st-pill {
  padding:7px 13px; border-radius:8px;
  border:1.5px solid var(--border); background:var(--bg-input);
  font-size:12px; font-weight:600; color:var(--text-muted);
  cursor:pointer; transition:all .18s; text-transform:capitalize; font-family:inherit;
}
.st-pill.on { border-color:var(--accent); background:rgba(245,158,11,.1); color:var(--accent); }
.st-pill:hover:not(.on) { border-color:var(--text-muted); color:var(--text-primary); }

/* Footer */
.st-footer {
  display:flex; align-items:center; justify-content:space-between;
  gap:12px; margin-top:20px; padding-top:16px; border-top:1px solid var(--border); flex-wrap:wrap;
}
.st-btn {
  display:inline-flex; align-items:center; justify-content:center; gap:7px;
  background:var(--accent); color:#0B0F1A; border:none;
  border-radius:10px; padding:10px 22px; font-family:inherit;
  font-size:13px; font-weight:700; cursor:pointer; min-width:160px;
  transition:all .18s; box-shadow:0 4px 14px rgba(245,158,11,.3);
}
.st-btn:hover:not(:disabled) { filter:brightness(1.1); transform:translateY(-1px); }
.st-btn:disabled { opacity:.5; cursor:not-allowed; transform:none; }
.st-spinner {
  width:14px; height:14px; border:2px solid rgba(11,15,26,.3);
  border-top-color:#0B0F1A; border-radius:50%;
  animation:st-spin 1s linear infinite;
}
@keyframes st-spin { to { transform:rotate(360deg); } }

/* Skeleton */
.st-shimmer { background:var(--bg-input); border-radius:8px; animation:stPulse 1.5s ease infinite; }
@keyframes stPulse { 0%,100%{opacity:1} 50%{opacity:.4} }
`;

type FormState = {
  name: string;
  mobile: string;
  relation: (typeof RELATIONS)[number];
  paymentMethod: PaymentMethod;
  walletProvider: WalletProvider;
  bankName: string;
  accountNumber: string;
};

function emptyForm(): FormState {
  return {
    name: "",
    mobile: "",
    relation: "father",
    paymentMethod: "mobile_banking",
    walletProvider: "bKash",
    bankName: "",
    accountNumber: "",
  };
}

export default function StudentStipendPage() {
  const { studentUid } = useParams<{ studentUid: string }>();

  const { data: studentData, isLoading: studentLoading } =
    useGetStudentQuery(studentUid);
  const { data: stipendData, isLoading: stipendLoading } =
    useGetStipendQuery(studentUid);
  const [updateStipend, { isLoading: isSaving }] = useUpdateStipendMutation();

  const student = studentData
  const beneficiary = stipendData ?? null;

  const [form, setForm] = useState<FormState>(emptyForm());
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  // Prefill when data loads
  useEffect(() => {
    if (!beneficiary) return;

    setForm((prev) => {
      // prevent unnecessary re-render
      if (
        prev.name === beneficiary.name &&
        prev.mobile === beneficiary.mobile
      ) {
        return prev;
      }

      return {
        name: beneficiary.name ?? "",
        mobile: beneficiary.mobile ?? "",
        relation: (beneficiary.relation ?? "father") as FormState["relation"],
        paymentMethod: (beneficiary.paymentMethod ??
          "mobile_banking") as PaymentMethod,
        walletProvider: (beneficiary.walletProvider ??
          "bKash") as WalletProvider,
        bankName: beneficiary.bankName ?? "",
        accountNumber: beneficiary.accountNumber ?? "",
      };
    });
  }, [beneficiary]);

  const setField = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((e) => {
      const n = { ...e };
      delete n[k];
      return n;
    });
  };

  const validate = () => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) e.name = "Beneficiary name is required";
    if (!form.mobile.trim()) e.mobile = "Mobile number is required";
    else if (!/^01[3-9]\d{8}$/.test(form.mobile))
      e.mobile = "Invalid Bangladeshi mobile (01XXXXXXXXX)";
    if (form.paymentMethod === "bank" && !form.bankName.trim())
      e.bankName = "Bank name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      await updateStipend({
        studentUid,
        data: {
          name: form.name,
          mobile: form.mobile,
          relation: form.relation,
          paymentMethod: form.paymentMethod,
          walletProvider:
            form.paymentMethod === "mobile_banking"
              ? form.walletProvider
              : undefined,
          bankName: form.paymentMethod === "bank" ? form.bankName : undefined,
          accountNumber:
            form.paymentMethod === "bank" ? form.accountNumber : undefined,
        },
      }).unwrap();
      toast.success("Stipend beneficiary updated", {
        description: `${form.name} set as beneficiary`,
      });
    } catch (e: unknown) {
      const msg = (e as any)?.data?.message ?? "Please try again.";
      toast.error("Failed to save", { description: msg });
    }
  };

  const isLoading = studentLoading || stipendLoading;

  return (
    <>
      <style>{CSS}</style>
      <div className="st-wrap">
        <a href={`/students/${studentUid}`} className="st-back">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Student
        </a>

        <h1 className="st-title">Stipend Beneficiary</h1>
        <p className="st-desc">
          Set who receives the stipend (উপবৃত্তি) for{" "}
          <strong style={{ color: "var(--text-primary)" }}>
            {student?.name.en ?? studentUid}
          </strong>
        </p>

        {/* Current beneficiary */}
        <div className="st-current">
          {isLoading ? (
            <div
              style={{
                flex: 1,
                display: "flex",
                gap: 12,
                alignItems: "center",
              }}
            >
              <div
                className="st-shimmer"
                style={{ width: 44, height: 44, borderRadius: 11 }}
              />
              <div style={{ flex: 1 }}>
                <div
                  className="st-shimmer"
                  style={{ height: 13, width: 140, marginBottom: 8 }}
                />
                <div
                  className="st-shimmer"
                  style={{ height: 10, width: 200 }}
                />
              </div>
            </div>
          ) : beneficiary ? (
            <>
              <div className="st-cur-icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="2"
                >
                  <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="st-cur-name">{beneficiary.name}</div>
                <div className="st-cur-meta">
                  <span>{beneficiary.mobile}</span>
                  <span style={{ textTransform: "capitalize" }}>
                    {beneficiary.relation}
                  </span>
                  <span style={{ textTransform: "capitalize" }}>
                    {beneficiary.paymentMethod.replace("_", " ")}
                  </span>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 7,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                {beneficiary.walletProvider && (
                  <span
                    className="st-provider-pill"
                    style={{
                      color: WALLET_COLOR[beneficiary.walletProvider],
                      borderColor:
                        WALLET_COLOR[beneficiary.walletProvider] + "40",
                    }}
                  >
                    {beneficiary.walletProvider}
                  </span>
                )}
                {beneficiary.isActive && (
                  <span className="st-active-label">● Active</span>
                )}
              </div>
            </>
          ) : (
            <div className="st-empty">
              No beneficiary configured yet. Fill the form below to set one.
            </div>
          )}
        </div>

        {/* Form */}
        <div className="st-form">
          <div className="st-form-title">
            {beneficiary ? "Update" : "Set"} Beneficiary Details
          </div>

          <div className="st-grid-2">
            <div className="st-field">
              <label className="st-label">
                Full Name <span className="st-req">*</span>
              </label>
              <input
                className={`st-input ${errors.name ? "err" : ""}`}
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
              />
              {errors.name && <span className="st-err">{errors.name}</span>}
            </div>
            <div className="st-field">
              <label className="st-label">
                Mobile Number <span className="st-req">*</span>
              </label>
              <div className="st-prefix-row">
                <span className="st-prefix">+880</span>
                <input
                  className={`st-input ${errors.mobile ? "err" : ""}`}
                  placeholder="01XXXXXXXXX"
                  value={form.mobile}
                  onChange={(e) => setField("mobile", e.target.value)}
                  inputMode="tel"
                />
              </div>
              {errors.mobile && <span className="st-err">{errors.mobile}</span>}
            </div>
          </div>

          {/* Relation */}
          <div className="st-field" style={{ marginTop: 16 }}>
            <label className="st-label">Relation to Student</label>
            <div className="st-pills">
              {RELATIONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`st-pill ${form.relation === r ? "on" : ""}`}
                  onClick={() => setField("relation", r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Payment method */}
          <div className="st-field" style={{ marginTop: 16 }}>
            <label className="st-label">Payment Method</label>
            <div className="st-pills">
              {PAY_METHODS.map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`st-pill ${form.paymentMethod === m ? "on" : ""}`}
                  onClick={() => setField("paymentMethod", m as PaymentMethod)}
                >
                  {m.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Wallet provider */}
          {form.paymentMethod === "mobile_banking" && (
            <div className="st-field" style={{ marginTop: 14 }}>
              <label className="st-label">Wallet Provider</label>
              <div className="st-pills">
                {WALLETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    className="st-pill"
                    style={
                      form.walletProvider === p
                        ? {
                            borderColor: WALLET_COLOR[p],
                            color: WALLET_COLOR[p],
                            background: WALLET_COLOR[p] + "18",
                          }
                        : {}
                    }
                    onClick={() => setField("walletProvider", p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bank details */}
          {form.paymentMethod === "bank" && (
            <div className="st-grid-2" style={{ marginTop: 14 }}>
              <div className="st-field">
                <label className="st-label">
                  Bank Name <span className="st-req">*</span>
                </label>
                <input
                  className={`st-input ${errors.bankName ? "err" : ""}`}
                  placeholder="e.g. Sonali Bank"
                  value={form.bankName}
                  onChange={(e) => setField("bankName", e.target.value)}
                />
                {errors.bankName && (
                  <span className="st-err">{errors.bankName}</span>
                )}
              </div>
              <div className="st-field">
                <label className="st-label">Account Number</label>
                <input
                  className="st-input"
                  placeholder="Account number"
                  value={form.accountNumber}
                  onChange={(e) => setField("accountNumber", e.target.value)}
                  inputMode="numeric"
                  style={{ fontFamily: '"JetBrains Mono",monospace' }}
                />
              </div>
            </div>
          )}

          <div className="st-footer">
            <div>
              {beneficiary?.updatedAt && (
                <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                  Last updated:{" "}
                  {new Date(beneficiary.updatedAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              )}
            </div>
            <button
              type="button"
              className="st-btn"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="st-spinner" /> Saving…
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
                  </svg>
                  {beneficiary ? "Update Beneficiary" : "Save Beneficiary"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
