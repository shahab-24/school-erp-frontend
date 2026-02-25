"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useGetStudentByUidQuery } from "@/lib/services/studentApi";
import type { PromotionEntry } from "@/types/student.types";

const RESULT_CFG = {
  promoted: {
    bg: "rgba(34,197,94,.08)",
    border: "rgba(34,197,94,.2)",
    text: "#22C55E",
    icon: "🎓",
  },
  repeat: {
    bg: "rgba(245,158,11,.08)",
    border: "rgba(245,158,11,.2)",
    text: "#F59E0B",
    icon: "🔄",
  },
} as const;

export default function StudentResultsPage() {
  const { studentUid } = useParams<{ studentUid: string }>();

  // useGetStudentByUidQuery → returns Student directly
  const { data: student, isLoading } = useGetStudentByUidQuery(studentUid);

  // promotions: PromotionEntry[] lives inside student object
  const promotions: PromotionEntry[] = student?.promotions ?? [];
  const sorted = [...promotions].reverse(); // latest first

  return (
    <>
      <style>{`
        .res-wrap { animation:pageEnter .3s ease both; }
        .res-header { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; margin-bottom:22px; flex-wrap:wrap; }
        .res-title  { font-size:16px; font-weight:700; color:var(--text-primary); }
        .res-desc   { font-size:12.5px; color:var(--text-muted); margin-top:3px; }
        .res-count  { font-size:12px; color:var(--text-muted); background:var(--bg-input); border:1px solid var(--border); border-radius:20px; padding:4px 12px; font-weight:600; white-space:nowrap; }

        /* Stats */
        .res-stats { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:20px; }
        .res-stat  { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-sm); padding:14px 18px; min-width:110px; }
        .res-stat-val   { font-size:26px; font-weight:800; color:var(--text-primary); font-family:'JetBrains Mono',monospace; letter-spacing:-1px; line-height:1; }
        .res-stat-label { font-size:10.5px; color:var(--text-muted); text-transform:uppercase; letter-spacing:.5px; font-weight:600; margin-top:4px; }

        /* Timeline */
        .res-timeline { position:relative; padding-left:28px; }
        .res-timeline::before { content:''; position:absolute; left:10px; top:0; bottom:0; width:2px; background:var(--border); border-radius:2px; }
        .res-item { position:relative; margin-bottom:14px; }
        .res-item:last-child { margin-bottom:0; }
        .res-dot  { position:absolute; left:-23px; top:16px; width:14px; height:14px; border-radius:50%; border:2px solid var(--bg-card); z-index:1; }
        .res-card { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-sm); padding:16px 18px; box-shadow:var(--shadow-sm); transition:border-color var(--transition); }
        .res-card:hover { border-color:rgba(245,158,11,.3); }
        .res-card-top { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; flex-wrap:wrap; }
        .res-session { font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:.5px; }
        .res-pill { display:inline-flex; align-items:center; gap:5px; padding:3px 10px; border-radius:20px; font-size:12px; font-weight:700; border:1px solid; text-transform:capitalize; }
        .res-flow { display:flex; align-items:center; gap:10px; margin-top:10px; flex-wrap:wrap; }
        .res-box  { background:var(--bg-input); border:1px solid var(--border); border-radius:8px; padding:8px 14px; text-align:center; }
        .res-box-num   { font-size:22px; font-weight:800; color:var(--text-primary); font-family:'JetBrains Mono',monospace; line-height:1; }
        .res-box-label { font-size:10px; color:var(--text-muted); font-weight:600; text-transform:uppercase; letter-spacing:.4px; margin-top:2px; }
        .res-meta-row  { display:flex; gap:16px; margin-top:12px; flex-wrap:wrap; }
        .res-meta-item { font-size:12px; color:var(--text-muted); }
        .res-meta-item strong { color:var(--text-secondary); }

        /* Empty */
        .res-empty { display:flex; flex-direction:column; align-items:center; padding:50px 20px; gap:12px; text-align:center; }
        .res-empty-icon { width:56px; height:56px; border-radius:14px; background:var(--bg-input); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; }

        /* Shimmer */
        .res-shimmer { border-radius:var(--radius-sm); background:var(--border); animation:pulse 1.5s ease infinite; }
      `}</style>

      <div className="res-wrap">
        <div className="res-header">
          <div>
            <div className="res-title">Promotion History &amp; Results</div>
            <div className="res-desc">
              Academic progression record for{" "}
              <strong style={{ color: "var(--text-primary)" }}>
                {student?.name?.en ?? studentUid}
              </strong>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span className="res-count">
              {promotions.length} record{promotions.length !== 1 ? "s" : ""}
            </span>
            <Link
              href={`/dashboard/students/${studentUid}/promote`}
              className="erp-btn"
              style={{ fontSize: 12.5 }}
            >
              + Add Promotion
            </Link>
          </div>
        </div>

        {/* Stats */}
        {!isLoading && (
          <div className="res-stats">
            {[
              { label: "Total Years", val: promotions.length },
              {
                label: "Promoted",
                val: promotions.filter((p) => p.result === "promoted").length,
              },
              {
                label: "Repeated",
                val: promotions.filter((p) => p.result === "repeat").length,
              },
              { label: "Current Class", val: student?.current?.class ?? "—" },
            ].map((s) => (
              <div key={s.label} className="res-stat">
                <div className="res-stat-val">{s.val}</div>
                <div className="res-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Timeline */}
        {isLoading ? (
          <div>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="res-shimmer"
                style={{
                  height: 130,
                  marginBottom: 14,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="res-empty">
            <div className="res-empty-icon">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--text-muted)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "var(--text-secondary)",
              }}
            >
              No Promotion Records
            </div>
            <div style={{ fontSize: 12.5, color: "var(--text-muted)" }}>
              Records will appear here after processing a promotion
            </div>
            <Link
              href={`/dashboard/students/${studentUid}/promote`}
              className="erp-btn"
              style={{ marginTop: 4 }}
            >
              Add First Promotion
            </Link>
          </div>
        ) : (
          <div className="res-timeline">
            {sorted.map((p, idx) => {
              const cfg = RESULT_CFG[p.result] ?? RESULT_CFG.promoted;
              return (
                <div key={idx} className="res-item">
                  <div className="res-dot" style={{ background: cfg.text }} />
                  <div className="res-card">
                    <div className="res-card-top">
                      <div className="res-session">Session {p.session}</div>
                      <span
                        className="res-pill"
                        style={{
                          color: cfg.text,
                          borderColor: cfg.border,
                          background: cfg.bg,
                        }}
                      >
                        {cfg.icon} {p.result}
                      </span>
                    </div>

                    <div className="res-flow">
                      <div className="res-box">
                        <div className="res-box-num">{p.fromClass}</div>
                        <div className="res-box-label">From</div>
                      </div>
                      <div style={{ color: "var(--text-muted)" }}>
                        {p.result === "promoted" ? (
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        ) : (
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#F59E0B"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M1 4v6h6M23 20v-6h-6" />
                            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
                          </svg>
                        )}
                      </div>
                      <div
                        className="res-box"
                        style={{ borderColor: cfg.border, background: cfg.bg }}
                      >
                        <div
                          className="res-box-num"
                          style={{ color: cfg.text }}
                        >
                          {p.toClass}
                        </div>
                        <div className="res-box-label">To</div>
                      </div>
                    </div>

                    <div className="res-meta-row">
                      {p.previousRoll != null && (
                        <div className="res-meta-item">
                          Previous Roll: <strong>#{p.previousRoll}</strong>
                        </div>
                      )}
                      {p.newRoll != null && (
                        <div className="res-meta-item">
                          New Roll: <strong>#{p.newRoll}</strong>
                        </div>
                      )}
                      {p.decidedAt && (
                        <div className="res-meta-item">
                          Decided:{" "}
                          <strong>
                            {new Date(p.decidedAt).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </strong>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
