"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  useGetStipendQuery,
  useUpdateStipendMutation,
} from "@/lib/services/studentApi";
import { useToast } from "@/components/ui/use-toast"; 
import Link from "next/link";
import { appConfig } from "@/lib/config/appConfig";

const WALLET_COLORS: Record<string, string> = {
  bKash: "#E2136E",
  Nagad: "#F6821F",
  Rocket: "#8B2FC9",
  Other: "#64748B",
};

export default function StipendPage() {
  const { studentUid } = useParams<{ studentUid: string }>();
  const { data, isLoading } = useGetStipendQuery(studentUid);
  const [updateStipend, { isLoading: isSaving }] = useUpdateStipendMutation();
const { toast } = useToast();

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    walletProvider: "bKash",
    relation: "father",
    accountNumber: "",
  });

  useEffect(() => {
    if (data)
      setForm({
        name: data.name ?? "",
        mobile: data.mobile ?? "",
        walletProvider: data.walletProvider ?? "bKash",
        relation: data.relation ?? "father",
        accountNumber: data.accountNumber ?? "",
      });
  }, [data]);

  const handleSave = async () => {
    try {
      await updateStipend({ studentUid, ...form }).unwrap();
      toast({ title: "✓ Stipend info updated" });
    } catch (err: any) {
      toast({
        title: "Update failed",
        description: err?.data?.message ?? "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <style>{`
        .st-page { max-width:560px; margin:0 auto; animation:pageEnter 0.3s ease both; }
        .st-card { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius); box-shadow:var(--shadow-card); overflow:hidden; }
        .st-header { display:flex; align-items:center; gap:13px; padding:18px 22px; border-bottom:1px solid var(--border); background:var(--accent-soft); }
        .st-icon { width:42px; height:42px; border-radius:11px; background:var(--accent); color:#0B0F1A; display:flex; align-items:center; justify-content:center; }
        .st-header-title { font-size:15px; font-weight:700; color:var(--text-primary); }
        .st-header-sub   { font-size:12px; color:var(--text-muted); margin-top:2px; }
        .st-header-school{ font-size:11px; color:var(--text-muted); margin-top:1px; }
        .st-current { margin:0 22px; padding:14px 0; border-bottom:1px solid var(--border); }
        .st-current-label { font-size:10.5px; font-weight:700; letter-spacing:0.8px; text-transform:uppercase; color:var(--text-muted); margin-bottom:10px; }
        .st-row  { display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid var(--border); }
        .st-row:last-child { border-bottom:none; }
        .st-key  { font-size:12.5px; color:var(--text-muted); font-weight:500; }
        .st-val  { font-size:13px; font-weight:600; color:var(--text-primary); }
        .wallet-chip { display:inline-flex; align-items:center; gap:5px; padding:3px 10px; border-radius:20px; font-size:12px; font-weight:700; color:white; }
        .st-form { padding:22px; display:flex; flex-direction:column; gap:14px; }
        .st-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:13px; }
        @media(max-width:480px){ .st-grid-2{ grid-template-columns:1fr; } }
        .st-field { display:flex; flex-direction:column; gap:5px; }
        .st-label { font-size:11.5px; font-weight:600; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.3px; }
        .st-footer { padding:14px 22px; border-top:1px solid var(--border); display:flex; justify-content:flex-end; gap:10px; }
        .st-skel { padding:22px; display:flex; flex-direction:column; gap:12px; }
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
      `}</style>

      <div className="st-page">
        <Link
          href={`/dashboard/students/${studentUid}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            fontSize: 12.5,
            color: "var(--text-muted)",
            textDecoration: "none",
            marginBottom: 18,
          }}
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
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Student
        </Link>

        <div className="st-card">
          <div className="st-header">
            <div className="st-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </div>
            <div>
              <div className="st-header-title">Stipend Beneficiary</div>
              <div className="st-header-sub">Mobile financial service info</div>
              {/* school name from appConfig */}
              <div className="st-header-school">{appConfig.schoolNameEn}</div>
            </div>
          </div>

          {isLoading ? (
            <div className="st-skel">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    height: 38,
                    borderRadius: 8,
                    background: "var(--border)",
                    animation: `pulse 1.5s ease infinite ${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          ) : (
            <>
              {data && (
                <div className="st-current">
                  <div className="st-current-label">Current Record</div>
                  {[
                    { k: "Name", v: data.name ?? "—" },
                    { k: "Mobile", v: data.mobile ?? "—" },
                    { k: "Relation", v: data.relation ?? "—" },
                    {
                      k: "Wallet",
                      v: (
                        <span
                          className="wallet-chip"
                          style={{
                            background:
                              WALLET_COLORS[data.walletProvider ?? "Other"],
                          }}
                        >
                          {data.walletProvider}
                        </span>
                      ),
                    },
                  ].map((r) => (
                    <div key={r.k} className="st-row">
                      <span className="st-key">{r.k}</span>
                      <span className="st-val">{r.v}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="st-form">
                <div className="erp-section-title">Update Information</div>
                <div className="st-grid-2">
                  <div className="st-field">
                    <label className="st-label">Beneficiary Name</label>
                    <input
                      className="erp-input"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="Full name"
                    />
                  </div>
                  <div className="st-field">
                    <label className="st-label">Relation</label>
                    <select
                      className="erp-input erp-select"
                      value={form.relation}
                      onChange={(e) =>
                        setForm({ ...form, relation: e.target.value })
                      }
                    >
                      <option value="father">Father</option>
                      <option value="mother">Mother</option>
                      <option value="guardian">Guardian</option>
                      <option value="self">Self</option>
                    </select>
                  </div>
                  <div className="st-field">
                    <label className="st-label">Mobile Number</label>
                    <input
                      className="erp-input"
                      value={form.mobile}
                      onChange={(e) =>
                        setForm({ ...form, mobile: e.target.value })
                      }
                      placeholder="01XXXXXXXXX"
                    />
                  </div>
                  <div className="st-field">
                    <label className="st-label">Wallet Provider</label>
                    <select
                      className="erp-input erp-select"
                      value={form.walletProvider}
                      onChange={(e) =>
                        setForm({ ...form, walletProvider: e.target.value })
                      }
                    >
                      <option value="bKash">bKash</option>
                      <option value="Nagad">Nagad</option>
                      <option value="Rocket">Rocket</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="st-field" style={{ gridColumn: "1/-1" }}>
                    <label className="st-label">Wallet Account Number</label>
                    <input
                      className="erp-input"
                      value={form.accountNumber}
                      onChange={(e) =>
                        setForm({ ...form, accountNumber: e.target.value })
                      }
                      placeholder="Wallet-registered number"
                    />
                  </div>
                </div>
              </div>

              <div className="st-footer">
                <Link
                  href={`/dashboard/students/${studentUid}`}
                  className="erp-btn-ghost"
                >
                  Cancel
                </Link>
                <button
                  className="erp-btn-primary"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <div className="erp-spinner" />
                      <span>Saving…</span>
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
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                        <polyline points="17 21 17 13 7 13 7 21" />
                        <polyline points="7 3 7 8 15 8" />
                      </svg>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
