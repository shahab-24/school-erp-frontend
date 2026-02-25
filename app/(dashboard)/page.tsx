// src/app/(dashboard)/page.tsx
// URL: /
// Layout: (dashboard)/layout.tsx — Sidebar + Topbar auto-applied
"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { appConfig } from "@/lib/config/appConfig";

// ─── Stat card data ───────────────────────────────────────────
const STATS = [
  {
    label: "Total Students",
    value: "—",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
    color: "var(--accent)",
    bg: "var(--accent-soft)",
    link: "/students",
  },
  {
    label: "Teachers",
    value: "—",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M20 21a8 8 0 1 0-16 0" />
      </svg>
    ),
    color: "var(--info)",
    bg: "rgba(96,165,250,0.08)",
    link: "/teachers",
  },
  {
    label: "Classes",
    value: "—",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
      </svg>
    ),
    color: "var(--success)",
    bg: "var(--success-bg)",
    link: "/classes",
  },
  {
    label: "Attendance Today",
    value: "—",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
        <path d="m9 16 2 2 4-4" />
      </svg>
    ),
    color: "var(--warning)",
    bg: "rgba(251,191,36,0.08)",
    link: "/attendance",
  },
];

// ─── Quick actions ────────────────────────────────────────────
const QUICK_ACTIONS = [
  { label: "Add Student", href: "/students/create", primary: true },
  { label: "Take Attendance", href: "/attendance", primary: false },
  { label: "View Results", href: "/results", primary: false },
  { label: "Fee Report", href: "/fees", primary: false },
];

// ─── Component ────────────────────────────────────────────────
export default function OverviewPage() {
  const user = useSelector((s: RootState) => s.auth.user);
  const greeting = getGreeting();

  return (
    <>
      <style>{`
        /* globals.css vars — auto theme-aware */
        .ov { animation: pageEnter 0.3s ease both; }

        /* Welcome */
        .ov-welcome {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 28px 30px;
          margin-bottom: 24px;
          position: relative; overflow: hidden;
          box-shadow: var(--shadow-card);
        }
        .ov-welcome::before {
          content: "";
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
        }
        .ov-welcome-glow {
          position: absolute; top: -40px; right: -40px;
          width: 180px; height: 180px; border-radius: 50%;
          background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%);
          pointer-events: none;
        }
        .ov-greeting { font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--accent); margin-bottom: 6px; }
        .ov-title    { font-size: 22px; font-weight: 700; color: var(--text-primary); letter-spacing: -0.4px; }
        .ov-school   { font-size: 13px; color: var(--text-secondary); margin-top: 5px; }

        /* Stats grid */
        .ov-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 14px;
          margin-bottom: 24px;
        }
        .ov-stat {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 20px;
          display: flex; align-items: center; gap: 14px;
          text-decoration: none;
          transition: border-color var(--transition), box-shadow var(--transition), transform var(--transition);
          box-shadow: var(--shadow-card);
        }
        .ov-stat:hover { border-color: var(--border-hover); box-shadow: var(--shadow-sm); transform: translateY(-1px); }
        .ov-stat-icon {
          width: 46px; height: 46px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .ov-stat-val { font-size: 26px; font-weight: 700; font-family: "JetBrains Mono", monospace; color: var(--text-primary); letter-spacing: -1px; line-height: 1; }
        .ov-stat-lbl { font-size: 12px; color: var(--text-muted); font-weight: 500; margin-top: 3px; }

        /* Bottom grid */
        .ov-bottom {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 14px;
        }
        @media(max-width: 900px) { .ov-bottom { grid-template-columns: 1fr; } }

        /* Quick actions */
        .ov-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          box-shadow: var(--shadow-card);
          overflow: hidden;
        }
        .ov-card-header {
          padding: 16px 20px 14px;
          border-bottom: 1px solid var(--border);
        }
        .ov-card-title { font-size: 13px; font-weight: 700; color: var(--text-primary); }
        .ov-card-sub   { font-size: 11.5px; color: var(--text-muted); margin-top: 2px; }
        .ov-card-body  { padding: 16px 20px; }

        .ov-qa-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .ov-qa-btn {
          display: flex; align-items: center; justify-content: center;
          padding: 13px;
          border-radius: var(--radius-sm);
          font-size: 13px; font-weight: 600;
          font-family: "Sora", sans-serif;
          text-decoration: none;
          text-align: center;
          transition: all var(--transition);
        }
        .ov-qa-btn.primary {
          background: var(--accent); color: #0B0F1A;
          box-shadow: var(--shadow-btn);
        }
        .ov-qa-btn.primary:hover { background: var(--accent-hover); transform: translateY(-1px); }
        .ov-qa-btn.ghost {
          background: var(--bg-input); color: var(--text-secondary);
          border: 1.5px solid var(--border);
        }
        .ov-qa-btn.ghost:hover { color: var(--text-primary); border-color: var(--border-hover); background: var(--bg-card-hover); }

        /* Recent activity */
        .ov-activity-item {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 11px 0;
          border-bottom: 1px solid var(--border);
        }
        .ov-activity-item:last-child { border-bottom: none; }
        .ov-activity-dot {
          width: 7px; height: 7px; border-radius: 50%;
          flex-shrink: 0; margin-top: 5px;
        }
        .ov-activity-text { font-size: 12.5px; color: var(--text-secondary); line-height: 1.5; }
        .ov-activity-time { font-size: 11px; color: var(--text-muted); margin-top: 2px; }

        @media(max-width: 640px) {
          .ov-stats { grid-template-columns: repeat(2, 1fr); }
          .ov-qa-grid { grid-template-columns: 1fr; }
          .ov-welcome { padding: 22px 20px; }
          .ov-title { font-size: 18px; }
        }
      `}</style>

      <div className="ov">
        {/* Welcome banner */}
        <div className="ov-welcome">
          <div className="ov-welcome-glow" />
          <p className="ov-greeting">{greeting}</p>
          <h1 className="ov-title">
            Welcome back, {user?.name?.split(" ")[0] ?? "Admin"} 👋
          </h1>
          <p className="ov-school">
            {appConfig.schoolNameEn}
            {appConfig.schoolNameBn && ` · ${appConfig.schoolNameBn}`}
          </p>
        </div>

        {/* Stats */}
        <div className="ov-stats">
          {STATS.map((s) => (
            <Link key={s.label} href={s.link} className="ov-stat">
              <div
                className="ov-stat-icon"
                style={{ background: s.bg, color: s.color }}
              >
                {s.icon}
              </div>
              <div>
                <div className="ov-stat-val" style={{ color: s.color }}>
                  {s.value}
                </div>
                <div className="ov-stat-lbl">{s.label}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom grid */}
        <div className="ov-bottom">
          {/* Quick Actions */}
          <div className="ov-card">
            <div className="ov-card-header">
              <p className="ov-card-title">Quick Actions</p>
              <p className="ov-card-sub">Common tasks at a glance</p>
            </div>
            <div className="ov-card-body">
              <div className="ov-qa-grid">
                {QUICK_ACTIONS.map((a) => (
                  <Link
                    key={a.label}
                    href={a.href}
                    className={`ov-qa-btn ${a.primary ? "primary" : "ghost"}`}
                  >
                    {a.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="ov-card">
            <div className="ov-card-header">
              <p className="ov-card-title">Recent Activity</p>
              <p className="ov-card-sub">Latest system events</p>
            </div>
            <div className="ov-card-body">
              {RECENT_ACTIVITY.map((a, i) => (
                <div key={i} className="ov-activity-item">
                  <div
                    className="ov-activity-dot"
                    style={{ background: a.color }}
                  />
                  <div>
                    <p className="ov-activity-text">{a.text}</p>
                    <p className="ov-activity-time">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Helpers ──────────────────────────────────────────────────
function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const RECENT_ACTIVITY = [
  {
    text: "New student STU-2025-042 enrolled in Class 5",
    time: "10 min ago",
    color: "var(--accent)",
  },
  {
    text: "Attendance marked for Class 3 — 28/30 present",
    time: "1 hr ago",
    color: "var(--success)",
  },
  {
    text: "Exam results published for Class 8",
    time: "2 hrs ago",
    color: "var(--info)",
  },
  {
    text: "Fee payment received — STU-2025-019",
    time: "Yesterday",
    color: "var(--warning)",
  },
];
