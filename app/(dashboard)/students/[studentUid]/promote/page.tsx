"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  useGetStudentByUidQuery,
  usePromoteStudentMutation,
} from "@/lib/services/studentApi";
import type { PromotePayload } from "@/types/student.types";

const CLASSES = Array.from({ length: 10 }, (_, i) => i + 1);
const SESSIONS = ["2024", "2025", "2026"];

export default function StudentPromotePage() {
  const { studentUid } = useParams<{ studentUid: string }>();
  const router = useRouter();

  // useGetStudentByUidQuery returns Student directly
  const { data: student } = useGetStudentByUidQuery(studentUid);

  // promoteStudent({ studentUid, payload: PromotePayload })
  const [promoteStudent, { isLoading }] = usePromoteStudentMutation();

  const fromClass = student?.current?.class ?? 1;
  const fromRoll = student?.current?.roll ?? 1;

  const [form, setForm] = useState<{
    session: string;
    toClass: number;
    result: "promoted" | "repeat";
    newRoll: number;
  }>({
    session: SESSIONS[1],
    toClass: fromClass + 1 > 10 ? 10 : fromClass + 1,
    result: "promoted",
    newRoll: 1,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    setError("");
    const payload: PromotePayload = {
      session: form.session,
      fromClass,
      toClass: form.result === "repeat" ? fromClass : Number(form.toClass),
      result: form.result,
      previousRoll: fromRoll,
      newRoll: Number(form.newRoll),
    };
    try {
      await promoteStudent({ studentUid, payload }).unwrap();
      setSuccess(true);
      setTimeout(
        () => router.push(`/dashboard/students/${studentUid}/results`),
        1400
      );
    } catch (e: any) {
      setError(e?.data?.message ?? "Promotion failed. Please try again.");
    }
  };

  const isRepeat = form.result === "repeat";

  return (
    <>
      <style>{`
        .pr-wrap { animation:pageEnter .3s ease both; }
        .pr-header { margin-bottom:22px; }
        .pr-title { font-size:16px; font-weight:700; color:var(--text-primary); }
        .pr-desc  { font-size:12.5px; color:var(--text-muted); margin-top:3px; }

        /* Current strip */
        .pr-strip { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-sm); padding:16px 20px; margin-bottom:20px; display:flex; gap:24px; align-items:center; flex-wrap:wrap; }
        .pr-strip-item {}
        .pr-strip-label { font-size:10.5px; color:var(--text-muted); text-transform:uppercase; letter-spacing:.5px; font-weight:600; }
        .pr-strip-val { font-size:22px; font-weight:800; color:var(--text-primary); font-family:'JetBrains Mono',monospace; margin-top:2px; }
        .pr-strip-arrow { color:var(--text-muted); }

        /* Form card */
        .pr-card { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-sm); padding:20px; }
        .pr-card-title { font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:.6px; margin-bottom:18px; }

        /* Result toggle */
        .pr-result-group { display:flex; gap:10px; margin-bottom:18px; }
        .pr-result-btn { flex:1; padding:14px 10px; border-radius:10px; border:1.5px solid var(--border); background:var(--bg-input); cursor:pointer; transition:all var(--transition); text-align:center; }
        .pr-result-btn.promoted { border-color:#22C55E; background:rgba(34,197,94,.07); }
        .pr-result-btn.repeat   { border-color:#F59E0B; background:rgba(245,158,11,.07); }
        .pr-result-icon  { font-size:22px; margin-bottom:5px; }
        .pr-result-label { font-size:13px; font-weight:700; }
        .pr-result-sub   { font-size:11px; color:var(--text-muted); margin-top:2px; }
        .pr-result-btn.promoted .pr-result-label { color:#22C55E; }
        .pr-result-btn.repeat   .pr-result-label { color:#F59E0B; }

        .pr-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        .pr-grid-3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; }
        @media(max-width:560px){ .pr-grid,.pr-grid-3 { grid-template-columns:1fr; } }
        .pr-label  { font-size:11.5px; font-weight:600; color:var(--text-secondary); margin-bottom:5px; }
        .pr-input,.pr-select { width:100%; padding:9px 11px; background:var(--bg-input); border:1px solid var(--border); border-radius:8px; font-size:13px; color:var(--text-primary); outline:none; transition:border-color var(--transition); }
        .pr-input:focus,.pr-select:focus { border-color:var(--accent); box-shadow:0 0 0 3px rgba(245,158,11,.1); }

        /* Preview */
        .pr-preview { margin-top:16px; padding:14px 16px; border-radius:10px; background:var(--accent-soft); border:1px solid rgba(245,158,11,.2); font-size:13px; color:var(--text-secondary); line-height:1.6; }
        .pr-preview strong { color:var(--accent); }

        /* Repeat warning */
        .pr-warn { background:rgba(245,158,11,.07); border:1px solid rgba(245,158,11,.2); border-radius:8px; padding:12px 14px; margin-top:14px; font-size:12.5px; color:var(--text-secondary); display:flex; gap:8px; }

        /* Footer */
        .pr-footer { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-top:18px; padding-top:16px; border-top:1px solid var(--border); flex-wrap:wrap; }
        .pr-error   { font-size:12.5px; color:var(--error); }
        .pr-success { font-size:12.5px; color:#22C55E; display:flex; align-items:center; gap:6px; }
      `}</style>

      <div className="pr-wrap">
        <div className="pr-header">
          <div className="pr-title">Promote Student</div>
          <div className="pr-desc">
            Promote or repeat{" "}
            <strong style={{ color: "var(--text-primary)" }}>
              {student?.name?.en ?? studentUid}
            </strong>{" "}
            for the next academic year.
          </div>
        </div>

        {/* Current enrollment strip */}
        {student && (
          <div className="pr-strip">
            <div className="pr-strip-item">
              <div className="pr-strip-label">Current Class</div>
              <div className="pr-strip-val">{fromClass}</div>
            </div>
            <div className="pr-strip-arrow">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
            <div className="pr-strip-item">
              <div className="pr-strip-label">
                {isRepeat ? "Stays At" : "Will Be"}
              </div>
              <div
                className="pr-strip-val"
                style={{ color: isRepeat ? "#F59E0B" : "#22C55E" }}
              >
                {isRepeat ? fromClass : form.toClass}
              </div>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <div className="pr-strip-label">Current Roll</div>
              <div className="pr-strip-val" style={{ fontSize: 16 }}>
                #{fromRoll}
              </div>
            </div>
          </div>
        )}

        <div className="pr-card">
          <div className="pr-card-title">Promotion Details</div>

          {/* Result toggle */}
          <div className="pr-result-group">
            {(["promoted", "repeat"] as const).map((r) => (
              <button
                key={r}
                type="button"
                className={`pr-result-btn ${form.result === r ? r : ""}`}
                onClick={() => set("result", r)}
              >
                <div className="pr-result-icon">
                  {r === "promoted" ? "🎓" : "🔄"}
                </div>
                <div className="pr-result-label">
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </div>
                <div className="pr-result-sub">
                  {r === "promoted"
                    ? "Move to next class"
                    : "Stay in same class"}
                </div>
              </button>
            ))}
          </div>

          <div className={isRepeat ? "pr-grid" : "pr-grid-3"}>
            <div>
              <div className="pr-label">Session</div>
              <select
                className="pr-select"
                value={form.session}
                onChange={(e) => set("session", e.target.value)}
              >
                {SESSIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {!isRepeat && (
              <div>
                <div className="pr-label">To Class</div>
                <select
                  className="pr-select"
                  value={form.toClass}
                  onChange={(e) => set("toClass", Number(e.target.value))}
                >
                  {CLASSES.filter((c) => c > fromClass).map((c) => (
                    <option key={c} value={c}>
                      Class {c}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <div className="pr-label">New Roll No.</div>
              <input
                type="number"
                className="pr-input"
                min={1}
                value={form.newRoll}
                onChange={(e) => set("newRoll", Number(e.target.value))}
              />
            </div>
          </div>

          {isRepeat && (
            <div className="pr-warn">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ flexShrink: 0, marginTop: 1 }}
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              <span>
                Student will remain in <strong>Class {fromClass}</strong> for
                session <strong>{form.session}</strong> with a new roll number.
              </span>
            </div>
          )}

          {/* Preview */}
          <div className="pr-preview">
            <strong>{student?.name?.en ?? "Student"}</strong> will be{" "}
            {isRepeat ? (
              <>
                kept in <strong>Class {fromClass}</strong> (repeat)
              </>
            ) : (
              <>
                promoted from <strong>Class {fromClass}</strong> →{" "}
                <strong>Class {form.toClass}</strong>
              </>
            )}{" "}
            · Session <strong>{form.session}</strong> · Roll{" "}
            <strong>#{form.newRoll}</strong>
          </div>

          <div className="pr-footer">
            <div>
              {error && <div className="pr-error">{error}</div>}
              {success && (
                <div className="pr-success">
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
                  Saved! Redirecting…
                </div>
              )}
            </div>
            <button
              type="button"
              className="erp-btn"
              onClick={handleSubmit}
              disabled={isLoading || success}
              style={{ minWidth: 160 }}
            >
              {isLoading ? (
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
                  Processing…
                </span>
              ) : (
                `Confirm ${isRepeat ? "Repeat" : "Promotion"}`
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
