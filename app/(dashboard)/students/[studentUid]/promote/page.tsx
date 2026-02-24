"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { usePromoteStudentMutation } from "@/lib/services/studentApi";
import { useToast } from "@/components/ui/use-toast";

import Link from "next/link";
import { appConfig } from "@/lib/config/appConfig";

const CURRENT_YEAR = new Date().getFullYear();

export default function PromotePage() {
  const { studentUid } = useParams<{ studentUid: string }>();
  const [promote, { isLoading }] = usePromoteStudentMutation();
const { toast } = useToast();

  const [fromClass, setFromClass] = useState(5);
  const [toClass, setToClass] = useState(6);
  const [session, setSession] = useState(String(CURRENT_YEAR + 1));
  const [result, setResult] = useState<"promoted" | "held_back">("promoted");

  const handlePromote = async () => {
    if (result === "promoted" && toClass <= fromClass) {
      toast({
        title: "Invalid class selection",
        description: "Promotion class must be higher.",
        variant: "destructive",
      });
      return;
    }
    try {
      await promote({
        studentUid,
        session,
        fromClass,
        toClass,
        result,
      }).unwrap();
      toast({
        title: "✓ Student Promoted",
        description: `Moved to Class ${toClass} for session ${session}`,
      });
    } catch (err: any) {
      toast({
        title: "Promotion failed",
        description: err?.data?.message ?? "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <style>{`
        .promo-page { max-width:520px; margin:0 auto; animation:pageEnter 0.3s ease both; }
        .promo-card { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius); box-shadow:var(--shadow-card); overflow:hidden; }
        .promo-header { background:var(--accent-soft); border-bottom:1px solid var(--border); padding:18px 22px; display:flex; align-items:center; gap:14px; }
        .promo-icon { width:42px; height:42px; border-radius:11px; background:var(--accent); color:#0B0F1A; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .promo-header-title { font-size:15px; font-weight:700; color:var(--text-primary); }
        .promo-header-sub   { font-size:12px; color:var(--text-muted); margin-top:2px; }
        .promo-body  { padding:22px; display:flex; flex-direction:column; gap:16px; }
        .promo-field { display:flex; flex-direction:column; gap:5px; }
        .promo-label { font-size:11.5px; font-weight:600; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.3px; }
        .promo-classes { display:grid; grid-template-columns:1fr auto 1fr; gap:10px; align-items:end; }
        .promo-arrow { display:flex; align-items:center; justify-content:center; padding-bottom:9px; color:var(--accent); }
        .promo-result-group { display:flex; gap:8px; }
        .promo-result-opt { flex:1; padding:9px 13px; border:1.5px solid var(--border); border-radius:var(--radius-sm); display:flex; align-items:center; gap:8px; cursor:pointer; transition:all var(--transition); background:var(--bg-input); }
        .promo-result-opt.sel-promo { border-color:var(--success); background:var(--success-bg); }
        .promo-result-opt.sel-held  { border-color:var(--error);   background:var(--error-bg);   }
        .promo-dot   { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
        .promo-opt-label { font-size:13px; font-weight:600; color:var(--text-primary); }
        .promo-warning { background:rgba(251,191,36,0.08); border:1px solid rgba(251,191,36,0.2); border-radius:var(--radius-sm); padding:11px 13px; display:flex; gap:9px; align-items:flex-start; }
        .promo-warning-text { font-size:12.5px; color:var(--text-secondary); line-height:1.5; }
        .promo-school { font-size:11px; color:var(--text-muted); margin-top:2px; }
        .promo-footer { padding:14px 22px; border-top:1px solid var(--border); display:flex; justify-content:flex-end; gap:10px; }
      `}</style>

      <div className="promo-page">
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

        <div className="promo-card">
          <div className="promo-header">
            <div className="promo-icon">
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
                <path d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            </div>
            <div>
              <div className="promo-header-title">Promote Student</div>
              <div className="promo-header-sub">
                <code
                  style={{
                    color: "var(--accent)",
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: "11px",
                  }}
                >
                  {studentUid}
                </code>
              </div>
              {/* school name from appConfig */}
              <div className="promo-school">{appConfig.schoolNameEn}</div>
            </div>
          </div>

          <div className="promo-body">
            <div className="promo-field">
              <label className="promo-label">Academic Session</label>
              <input
                className="erp-input"
                value={session}
                onChange={(e) => setSession(e.target.value)}
                placeholder="e.g. 2026"
              />
            </div>

            <div>
              <div className="promo-label" style={{ marginBottom: 8 }}>
                Class Transition
              </div>
              <div className="promo-classes">
                <div className="promo-field">
                  <label className="promo-label" style={{ fontSize: 10 }}>
                    From Class
                  </label>
                  <select
                    className="erp-input erp-select"
                    value={fromClass}
                    onChange={(e) => setFromClass(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((c) => (
                      <option key={c} value={c}>
                        Class {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="promo-arrow">
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
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
                <div className="promo-field">
                  <label className="promo-label" style={{ fontSize: 10 }}>
                    To Class
                  </label>
                  <select
                    className="erp-input erp-select"
                    value={toClass}
                    onChange={(e) => setToClass(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((c) => (
                      <option key={c} value={c}>
                        Class {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <div className="promo-label" style={{ marginBottom: 8 }}>
                Result
              </div>
              <div className="promo-result-group">
                <div
                  className={`promo-result-opt ${
                    result === "promoted" ? "sel-promo" : ""
                  }`}
                  onClick={() => setResult("promoted")}
                >
                  <div
                    className="promo-dot"
                    style={{ background: "var(--success)" }}
                  />
                  <span className="promo-opt-label">Promoted</span>
                </div>
                <div
                  className={`promo-result-opt ${
                    result === "held_back" ? "sel-held" : ""
                  }`}
                  onClick={() => setResult("held_back")}
                >
                  <div
                    className="promo-dot"
                    style={{ background: "var(--error)" }}
                  />
                  <span className="promo-opt-label">Held Back</span>
                </div>
              </div>
            </div>

            <div className="promo-warning">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--warning)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ flexShrink: 0, marginTop: 1 }}
              >
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <path d="M12 9v4M12 17h.01" />
              </svg>
              <span className="promo-warning-text">
                This action updates the student's class enrollment. Previous
                history will be preserved.
              </span>
            </div>
          </div>

          <div className="promo-footer">
            <Link
              href={`/dashboard/students/${studentUid}`}
              className="erp-btn-ghost"
            >
              Cancel
            </Link>
            <button
              className="erp-btn-primary"
              onClick={handlePromote}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="erp-spinner" />
                  <span>Processing…</span>
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
                    <path d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  </svg>
                  Confirm Promotion
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
