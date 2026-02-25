"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  useGetStudentByUidQuery,
  useGetStipendQuery,
  useUpdateStipendMutation,
} from "@/lib/services/studentApi";
import type { StipendBeneficiary } from "@/types/student.types";

const RELATIONS = ["father", "mother", "guardian", "other"] as const;
const PAYMENT_METHODS = ["mobile_banking", "bank", "cash"] as const;
const WALLET_PROVIDERS = ["bKash", "Nagad", "Rocket", "Other"] as const;

const PROVIDER_COLORS: Record<string, string> = {
  bKash: "#E2136E",
  Nagad: "#F05A28",
  Rocket: "#8A00B5",
  Other: "var(--text-muted)",
};

const emptyForm = (): StipendBeneficiary => ({
  name: "",
  mobile: "",
  relation: "father",
  paymentMethod: "mobile_banking",
  walletProvider: "bKash",
  isActive: true,
  updatedAt: new Date(),
});

export default function StudentStipendPage() {
  const { studentUid } = useParams<{ studentUid: string }>();

  // student name for display
  const { data: student } = useGetStudentByUidQuery(studentUid);

  // getStipend → ApiResponse<StipendBeneficiary> → .data
  const { data: res, isLoading } = useGetStipendQuery(studentUid);
  const beneficiary = res?.data ?? null;

  // updateStipend({ studentUid, payload: StipendBeneficiary })
  const [updateStipend, { isLoading: isSaving }] = useUpdateStipendMutation();

  const [form, setForm] = useState<StipendBeneficiary>(emptyForm());
  const [errors, setErrors] = useState<
    Partial<Record<keyof StipendBeneficiary, string>>
  >({});
  const [saved, setSaved] = useState(false);
  const [saveErr, setSaveErr] = useState("");

  // Prefill form when beneficiary loads
  useEffect(() => {
    if (beneficiary) setForm({ ...emptyForm(), ...beneficiary });
  }, [beneficiary]);

  const setField = <K extends keyof StipendBeneficiary>(
    k: K,
    v: StipendBeneficiary[K]
  ) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((e) => {
      const n = { ...e };
      delete n[k];
      return n;
    });
  };

  const validate = () => {
    const errs: Partial<Record<keyof StipendBeneficiary, string>> = {};
    if (!form.name.trim()) errs.name = "Required";
    if (!form.mobile.trim()) errs.mobile = "Required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaved(false);
    setSaveErr("");
    try {
      await updateStipend({ studentUid, payload: form }).unwrap();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      setSaveErr(e?.data?.message ?? "Failed to save. Please try again.");
    }
  };

  return (
    <>
      <style>{`
        .sp-wrap { animation:pageEnter .3s ease both; }
        .sp-header { margin-bottom:22px; }
        .sp-title { font-size:16px; font-weight:700; color:var(--text-primary); }
        .sp-desc  { font-size:12.5px; color:var(--text-muted); margin-top:3px; }

        /* Current card */
        .sp-current { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-sm); padding:18px; margin-bottom:20px; display:flex; align-items:center; gap:14px; flex-wrap:wrap; min-height:80px; }
        .sp-current-icon { width:46px; height:46px; border-radius:12px; background:var(--accent-soft); border:1px solid rgba(245,158,11,.2); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .sp-current-info { flex:1; min-width:0; }
        .sp-current-name { font-size:14px; font-weight:700; color:var(--text-primary); }
        .sp-current-meta { font-size:12px; color:var(--text-muted); margin-top:3px; display:flex; gap:10px; flex-wrap:wrap; }
        .sp-provider-pill { display:inline-flex; align-items:center; gap:5px; padding:3px 9px; border-radius:20px; font-size:11.5px; font-weight:700; border:1px solid; }
        .sp-active-badge  { font-size:11px; color:#22C55E; background:rgba(34,197,94,.1); border:1px solid rgba(34,197,94,.2); padding:3px 8px; border-radius:20px; font-weight:600; }
        .sp-no-ben { text-align:center; flex:1; color:var(--text-muted); font-size:13px; }

        /* Form */
        .sp-form { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-sm); padding:20px; }
        .sp-form-title { font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:.6px; margin-bottom:18px; }
        .sp-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        @media(max-width:560px){ .sp-grid { grid-template-columns:1fr; } }
        .sp-label { font-size:11.5px; font-weight:600; color:var(--text-secondary); margin-bottom:5px; display:flex; gap:4px; }
        .sp-req   { color:var(--error); }
        .sp-input,.sp-select { width:100%; padding:9px 11px; background:var(--bg-input); border:1px solid var(--border); border-radius:8px; font-size:13px; color:var(--text-primary); outline:none; transition:border-color var(--transition),box-shadow var(--transition); }
        .sp-input:focus,.sp-select:focus { border-color:var(--accent); box-shadow:0 0 0 3px rgba(245,158,11,.1); }
        .sp-input.err { border-color:var(--error); }
        .sp-error { font-size:11px; color:var(--error); margin-top:4px; }
        .sp-pills { display:flex; gap:7px; flex-wrap:wrap; }
        .sp-pill  { padding:7px 12px; border-radius:8px; border:1px solid var(--border); background:var(--bg-input); font-size:12px; font-weight:500; color:var(--text-muted); cursor:pointer; transition:all var(--transition); text-transform:capitalize; }
        .sp-pill.on { border-color:var(--accent); background:var(--accent-soft); color:var(--accent); font-weight:600; }
        .sp-provider-btn { padding:7px 13px; border-radius:8px; border:1px solid var(--border); background:var(--bg-input); font-size:12.5px; font-weight:700; color:var(--text-muted); cursor:pointer; transition:all var(--transition); }
        .sp-footer { display:flex; align-items:center; justify-content:space-between; gap:10px; margin-top:18px; padding-top:16px; border-top:1px solid var(--border); flex-wrap:wrap; }
        .sp-saved  { font-size:12.5px; color:#22C55E; display:flex; align-items:center; gap:5px; }
        .sp-save-err { font-size:12.5px; color:var(--error); }
        .sp-shimmer { border-radius:6px; background:var(--border); animation:pulse 1.5s ease infinite; }
      `}</style>

      <div className="sp-wrap">
        <div className="sp-header">
          <div className="sp-title">Stipend Beneficiary</div>
          <div className="sp-desc">
            Set who receives the stipend (উপবৃত্তি) for{" "}
            <strong style={{ color: "var(--text-primary)" }}>
              {student?.name?.en ?? studentUid}
            </strong>
            .
          </div>
        </div>

        {/* Current beneficiary */}
        <div className="sp-current">
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
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 12,
                  background: "var(--border)",
                  animation: "pulse 1.5s ease infinite",
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  className="sp-shimmer"
                  style={{ height: 14, width: 140, marginBottom: 8 }}
                />
                <div
                  className="sp-shimmer"
                  style={{ height: 10, width: 220 }}
                />
              </div>
            </div>
          ) : beneficiary ? (
            <>
              <div className="sp-current-icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="sp-current-info">
                <div className="sp-current-name">{beneficiary.name}</div>
                <div className="sp-current-meta">
                  <span>{beneficiary.mobile}</span>
                  <span style={{ textTransform: "capitalize" }}>
                    {beneficiary.relation}
                  </span>
                  <span style={{ textTransform: "capitalize" }}>
                    {(beneficiary.paymentMethod ?? "").replace("_", " ")}
                  </span>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <span
                  className="sp-provider-pill"
                  style={{
                    color:
                      PROVIDER_COLORS[beneficiary.walletProvider] ??
                      "var(--text-muted)",
                    borderColor: `${
                      PROVIDER_COLORS[beneficiary.walletProvider] ??
                      "var(--text-muted)"
                    }30`,
                  }}
                >
                  {beneficiary.walletProvider}
                </span>
                {beneficiary.isActive && (
                  <span className="sp-active-badge">● Active</span>
                )}
              </div>
            </>
          ) : (
            <div className="sp-no-ben">
              No beneficiary configured yet. Fill the form below to set one.
            </div>
          )}
        </div>

        {/* Edit form */}
        <div className="sp-form">
          <div className="sp-form-title">
            {beneficiary ? "Update" : "Set"} Beneficiary Details
          </div>

          <div className="sp-grid">
            <div>
              <label className="sp-label">
                Beneficiary Name <span className="sp-req">*</span>
              </label>
              <input
                className={`sp-input ${errors.name ? "err" : ""}`}
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
              />
              {errors.name && <div className="sp-error">{errors.name}</div>}
            </div>
            <div>
              <label className="sp-label">
                Mobile Number <span className="sp-req">*</span>
              </label>
              <input
                className={`sp-input ${errors.mobile ? "err" : ""}`}
                placeholder="01XXXXXXXXX"
                value={form.mobile}
                onChange={(e) => setField("mobile", e.target.value)}
              />
              {errors.mobile && <div className="sp-error">{errors.mobile}</div>}
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <label className="sp-label">Relation to Student</label>
            <div className="sp-pills">
              {RELATIONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`sp-pill ${form.relation === r ? "on" : ""}`}
                  onClick={() => setField("relation", r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <label className="sp-label">Payment Method</label>
            <div className="sp-pills">
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`sp-pill ${form.paymentMethod === m ? "on" : ""}`}
                  onClick={() => setField("paymentMethod", m)}
                >
                  {m.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {form.paymentMethod === "mobile_banking" && (
            <div style={{ marginTop: 14 }}>
              <label className="sp-label">Wallet Provider</label>
              <div className="sp-pills">
                {WALLET_PROVIDERS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    className="sp-provider-btn"
                    style={
                      form.walletProvider === p
                        ? {
                            borderColor: PROVIDER_COLORS[p],
                            color: PROVIDER_COLORS[p],
                            background: `${PROVIDER_COLORS[p]}14`,
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

          <div className="sp-footer">
            <div>
              {saved && (
                <div className="sp-saved">
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
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Saved successfully
                </div>
              )}
              {saveErr && <div className="sp-save-err">{saveErr}</div>}
            </div>
            <button
              type="button"
              className="erp-btn"
              onClick={handleSave}
              disabled={isSaving}
              style={{ minWidth: 130 }}
            >
              {isSaving ? (
                <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ animation: "spin 1s linear infinite" }}
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Saving…
                </span>
              ) : beneficiary ? (
                "Update Beneficiary"
              ) : (
                "Save Beneficiary"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
