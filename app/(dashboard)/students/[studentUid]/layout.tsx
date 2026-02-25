"use client";

import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  useGetStudentByUidQuery,
  useUpdateStudentStatusMutation,
} from "@/lib/services/studentApi";
import { appConfig } from "@/lib/config/appConfig";

// ─── Tab config ───────────────────────────────────────────────────────────────
const TABS = [
  {
    label: "Overview",
    slug: "",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  {
    label: "Stipend",
    slug: "stipend",
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    label: "Promote",
    slug: "promote",
    icon: "M7 11l5-5m0 0l5 5m-5-5v12",
  },
  {
    label: "Results",
    slug: "results",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  },
];

const STATUS_OPTS = [
  "active",
  "repeat",
  "passed",
  "transferred",
  "archived",
] as const;
type StudentStatus = (typeof STATUS_OPTS)[number];

const STATUS_COLORS: Record<StudentStatus, string> = {
  active: "#22C55E",
  repeat: "#F59E0B",
  passed: "#3B82F6",
  transferred: "#8B5CF6",
  archived: "#6B7280",
};

// ─── Layout ───────────────────────────────────────────────────────────────────
export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { studentUid } = useParams<{ studentUid: string }>();
  const pathname = usePathname();

  const { data: student, isLoading } = useGetStudentByUidQuery(studentUid);
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateStudentStatusMutation();
  const [statusOpen, setStatusOpen] = useState(false);

  const base = `/students/${studentUid}`;

  // Determine active tab slug from pathname
  // e.g. /dashboard/students/abc123/stipend → "stipend"
  //      /dashboard/students/abc123         → ""
  const afterBase = pathname.replace(base, "").replace(/^\//, "");
  const activeSlug =
    TABS.find((t) => t.slug && afterBase.startsWith(t.slug))?.slug ?? "";

  const statusColor =
    STATUS_COLORS[(student?.status as StudentStatus) ?? "active"] ?? "#6B7280";

  const handleStatusChange = async (status: StudentStatus) => {
    try {
      await updateStatus({ studentUid, payload: { status } }).unwrap();
      setStatusOpen(false);
    } catch {}
  };

  return (
    <>
      <style>{`
        /* ── Layout shell ── */
        .sl-shell { animation: pageEnter .3s ease both; }

        /* Back link */
        .sl-back { display:inline-flex; align-items:center; gap:7px; font-size:12.5px; color:var(--text-muted); text-decoration:none; margin-bottom:18px; transition:color var(--transition); }
        .sl-back:hover { color:var(--accent); }

        /* Hero */
        .sl-hero { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius); padding:22px; margin-bottom:16px; display:flex; align-items:flex-start; gap:18px; flex-wrap:wrap; box-shadow:var(--shadow-card); position:relative; overflow:hidden; }
        .sl-hero::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(245,158,11,.04) 0%,transparent 60%); pointer-events:none; }
        .sl-avatar { width:62px; height:62px; border-radius:16px; background:linear-gradient(135deg,var(--accent) 0%,#EA580C 100%); display:flex; align-items:center; justify-content:center; font-size:24px; font-weight:800; color:#0B0F1A; flex-shrink:0; box-shadow:0 4px 16px rgba(245,158,11,.3); }
        .sl-hero-info { flex:1; min-width:0; }
        .sl-name-en { font-size:20px; font-weight:800; color:var(--text-primary); letter-spacing:-.5px; }
        .sl-name-bn { font-size:13.5px; color:var(--text-muted); margin-top:2px; }
        .sl-chips { display:flex; align-items:center; gap:7px; margin-top:8px; flex-wrap:wrap; }
        .sl-school { font-size:11px; color:var(--text-muted); margin-top:6px; }
        .sl-hero-meta { display:flex; gap:22px; flex-wrap:wrap; margin-left:auto; align-items:flex-start; }
        @media(max-width:640px) { .sl-hero-meta { margin-left:0; width:100%; justify-content:space-between; } }
        .sl-meta-label { font-size:10.5px; color:var(--text-muted); text-transform:uppercase; letter-spacing:.5px; font-weight:600; }
        .sl-meta-val { font-size:20px; font-weight:800; color:var(--text-primary); font-family:'JetBrains Mono',monospace; margin-top:2px; line-height:1; }
        .sl-meta-sm  { font-size:14px; font-weight:700; color:var(--text-primary); margin-top:2px; }

        /* Status pill + dropdown */
        .sl-status-wrap { position:relative; }
        .sl-status-pill { display:inline-flex; align-items:center; gap:6px; padding:4px 10px; border-radius:20px; border:1px solid; cursor:pointer; font-size:11.5px; font-weight:600; background:transparent; transition:opacity var(--transition); }
        .sl-status-pill:hover:not(:disabled) { opacity:.75; }
        .sl-status-pill:disabled { cursor:default; opacity:.6; }
        .sl-status-dot { width:6px; height:6px; border-radius:50%; background:currentColor; }
        .sl-status-dd { position:absolute; top:calc(100% + 6px); left:0; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-sm); padding:4px; box-shadow:var(--shadow-card); z-index:100; min-width:155px; animation:pageEnter .15s ease both; }
        .sl-status-opt { padding:8px 10px; border-radius:6px; font-size:12.5px; font-weight:500; cursor:pointer; display:flex; align-items:center; gap:8px; transition:background var(--transition); color:var(--text-primary); }
        .sl-status-opt:hover { background:var(--bg-card-hover); }
        .sl-status-opt-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }

        /* Tabs */
        .sl-tabs { display:flex; gap:2px; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-sm); padding:4px; margin-bottom:20px; overflow-x:auto; scrollbar-width:none; }
        .sl-tabs::-webkit-scrollbar { display:none; }
        .sl-tab { display:flex; align-items:center; gap:7px; padding:9px 18px; border-radius:7px; font-size:13px; font-weight:500; color:var(--text-muted); text-decoration:none; transition:all var(--transition); white-space:nowrap; flex:1; justify-content:center; }
        .sl-tab:hover  { color:var(--text-secondary); background:var(--bg-card-hover); }
        .sl-tab.active { color:var(--accent); background:var(--accent-soft); font-weight:700; border:1px solid rgba(245,158,11,.2); }

        /* Hero skeleton */
        .sl-hero-sk { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius); padding:22px; margin-bottom:16px; }
        .sl-sk { border-radius:6px; background:var(--border); animation:pulse 1.5s ease infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>

      <div className="sl-shell">
        {/* Back */}
        <Link href="/students" className="sl-back">
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

        {/* Hero */}
        {isLoading ? (
          <div className="sl-hero-sk">
            <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
              <div
                className="sl-sk"
                style={{
                  width: 62,
                  height: 62,
                  borderRadius: 16,
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  className="sl-sk"
                  style={{ height: 20, width: 200, marginBottom: 8 }}
                />
                <div
                  className="sl-sk"
                  style={{ height: 12, width: 130, marginBottom: 8 }}
                />
                <div className="sl-sk" style={{ height: 10, width: 180 }} />
              </div>
            </div>
          </div>
        ) : student ? (
          <div className="sl-hero">
            <div className="sl-avatar">
              {student.name?.en?.charAt(0).toUpperCase()}
            </div>

            <div className="sl-hero-info">
              <div className="sl-name-en">{student.name?.en}</div>
              <div className="sl-name-bn">{student.name?.bn}</div>

              <div className="sl-chips">
                <span
                  className="erp-badge erp-badge-amber"
                  style={{ textTransform: "capitalize" }}
                >
                  {student.gender}
                </span>
                <span className="erp-badge erp-badge-blue">
                  {student.religion}
                </span>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: 11,
                    color: "var(--text-muted)",
                  }}
                >
                  UID: {student.studentUid}
                </span>

                {/* Inline status changer */}
                <div className="sl-status-wrap">
                  <button
                    className="sl-status-pill"
                    style={{
                      color: statusColor,
                      borderColor: `${statusColor}40`,
                    }}
                    onClick={() => setStatusOpen((o) => !o)}
                    disabled={isUpdating}
                  >
                    <span
                      className="sl-status-dot"
                      style={{ background: statusColor }}
                    />
                    <span style={{ textTransform: "capitalize" }}>
                      {student.status}
                    </span>
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
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>

                  {statusOpen && (
                    <div className="sl-status-dd">
                      {STATUS_OPTS.map((s) => (
                        <div
                          key={s}
                          className="sl-status-opt"
                          onClick={() => handleStatusChange(s)}
                        >
                          <span
                            className="sl-status-opt-dot"
                            style={{ background: STATUS_COLORS[s] }}
                          />
                          <span
                            style={{ textTransform: "capitalize", flex: 1 }}
                          >
                            {s}
                          </span>
                          {s === student.status && (
                            <svg
                              width="11"
                              height="11"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="sl-school">{appConfig.schoolNameEn}</div>
            </div>

            {/* Meta: class / roll / session */}
            <div className="sl-hero-meta">
              <div>
                <div className="sl-meta-label">Class</div>
                <div className="sl-meta-val">{student.current?.class}</div>
              </div>
              <div>
                <div className="sl-meta-label">Roll</div>
                <div className="sl-meta-val">{student.current?.roll}</div>
              </div>
              <div>
                <div className="sl-meta-label">Session</div>
                <div className="sl-meta-sm">{student.current?.session}</div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Tabs */}
        <div className="sl-tabs">
          {TABS.map((tab) => {
            const href = tab.slug ? `${base}/${tab.slug}` : base;
            const isActive = activeSlug === tab.slug;
            return (
              <Link
                key={tab.slug}
                href={href}
                className={`sl-tab ${isActive ? "active" : ""}`}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={tab.icon} />
                </svg>
                {tab.label}
              </Link>
            );
          })}
        </div>

        {/* Page content injected here */}
        {children}
      </div>
    </>
  );
}
