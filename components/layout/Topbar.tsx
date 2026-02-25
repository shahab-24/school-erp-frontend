// src/components/layout/Topbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { logout } from "@/lib/features/authSlice";
import type { RootState } from "@/lib/store";
import { appConfig } from "@/lib/config/appConfig";
import ThemeToggle from "@/components/ui/ThemeToggle";

const ROUTE_LABELS: Record<string, string> = {
  "/": "Overview",
  "/students": "Students",
  "/students/create": "New Student",
  "/attendance": "Attendance",
  "/classes": "Classes",
  "/teachers": "Teachers",
  "/results": "Results",
  "/fees": "Fee Management",
  "/reports": "Reports",
  "/settings": "Settings",
};

const NOTIFICATIONS = [
  {
    id: 1,
    text: "Term 2 exam schedule published",
    time: "2 min ago",
    unread: true,
  },
  {
    id: 2,
    text: "15 students marked absent today",
    time: "1 hr ago",
    unread: true,
  },
  {
    id: 3,
    text: "Fee collection deadline: Dec 31",
    time: "Yesterday",
    unread: false,
  },
];

interface TopbarProps {
  onMenuToggle?: () => void;
}

export default function Topbar({ onMenuToggle }: TopbarProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const user = useSelector((s: RootState) => s.auth.user);
  const role = useSelector((s: RootState) => s.auth.role);

  const [notifOpen, setNotifOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const closeAll = () => {
    setNotifOpen(false);
    setDropdownOpen(false);
  };
  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  // Find best matching route label
  const pageLabel =
    Object.entries(ROUTE_LABELS)
      .filter(([path]) => pathname === path || pathname.startsWith(path + "/"))
      .sort((a, b) => b[0].length - a[0].length)[0]?.[1] ?? "Dashboard";

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;
  const initials = (user?.name ?? user?.email ?? "U").charAt(0).toUpperCase();
  const schoolShort = appConfig.schoolNameEn.split(" ").slice(0, 3).join(" ");

  return (
    <>
      <style>{`
        .topbar {
          position: fixed; top: 0; left: var(--sidebar-w); right: 0;
          height: var(--topbar-h); z-index: 30;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 22px; gap: 12px;
          background: var(--bg-topbar);
          border-bottom: 1px solid var(--border);
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          transition: left var(--transition);
        }
        @media(max-width:1024px){ .topbar{left:0;} }
        .topbar-left  { display:flex; align-items:center; gap:12px; min-width:0; }
        .topbar-right { display:flex; align-items:center; gap:6px; flex-shrink:0; }
        .topbar-menu { display:none; }
        @media(max-width:1024px){ .topbar-menu{display:flex;} }
        .topbar-bc { display:flex; align-items:center; gap:8px; }
        .topbar-bc-home { font-size:12px; color:var(--text-muted); text-decoration:none; white-space:nowrap; max-width:140px; overflow:hidden; text-overflow:ellipsis; transition:color var(--transition); }
        .topbar-bc-home:hover { color:var(--accent); }
        .topbar-bc-sep  { font-size:12px; color:var(--border-hover); }
        .topbar-bc-page { font-size:14px; font-weight:600; color:var(--text-primary); letter-spacing:-0.2px; }
        @media(max-width:480px){ .topbar-bc-home,.topbar-bc-sep{display:none;} }
        .topbar-date { font-family:"JetBrains Mono",monospace; font-size:11px; color:var(--text-muted); background:var(--bg-input); border:1px solid var(--border); border-radius:var(--radius-xs); padding:5px 10px; white-space:nowrap; margin-right:4px; }
        @media(max-width:640px){ .topbar-date{display:none;} }
        .notif-dot { position:absolute; top:7px; right:7px; width:7px; height:7px; border-radius:50%; background:var(--accent); border:1.5px solid var(--bg-topbar); animation:statusPulse 2s ease-in-out infinite; }
        .notif-hdr { display:flex; align-items:center; justify-content:space-between; padding:12px 15px 10px; border-bottom:1px solid var(--border); }
        .notif-hdr-title { font-size:13px; font-weight:600; color:var(--text-primary); }
        .notif-count { display:inline-flex; padding:1px 6px; border-radius:20px; font-size:10px; font-weight:700; background:var(--accent-soft); color:var(--accent); margin-left:6px; }
        .notif-mark { font-size:11.5px; font-weight:500; color:var(--accent); background:none; border:none; cursor:pointer; font-family:"Sora",sans-serif; }
        .notif-mark:hover { text-decoration:underline; }
        .notif-item { display:flex; align-items:flex-start; gap:10px; padding:10px 15px; border-bottom:1px solid var(--border); cursor:pointer; transition:background var(--transition); }
        .notif-item:last-child { border-bottom:none; }
        .notif-item:hover { background:var(--accent-soft); }
        .notif-dot-sm { width:6px; height:6px; border-radius:50%; flex-shrink:0; margin-top:5px; }
        .notif-text { font-size:12.5px; color:var(--text-secondary); line-height:1.5; }
        .notif-time { font-size:11px; color:var(--text-muted); margin-top:2px; }
        .user-btn { display:flex; align-items:center; gap:8px; padding:5px 10px 5px 5px; border-radius:var(--radius-sm); background:var(--accent-soft); border:1px solid var(--border); cursor:pointer; transition:border-color var(--transition); }
        .user-btn:hover { border-color:rgba(245,158,11,0.4); }
        .user-avatar { width:28px; height:28px; border-radius:7px; background:linear-gradient(135deg,var(--accent) 0%,#EA580C 100%); display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; color:#0B0F1A; flex-shrink:0; }
        .user-btn-name { font-size:13px; font-weight:600; color:var(--text-primary); max-width:90px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .user-btn-chevron { color:var(--text-muted); transition:transform var(--transition); }
        .user-btn-chevron.open { transform:rotate(180deg); }
        @media(max-width:640px){ .user-btn-name,.user-btn-chevron{display:none;} .user-btn{padding:5px;} }
        .dd-profile { display:flex; align-items:center; gap:12px; padding:14px 15px; border-bottom:1px solid var(--border); }
        .dd-avatar { width:40px; height:40px; border-radius:11px; background:linear-gradient(135deg,var(--accent) 0%,#EA580C 100%); display:flex; align-items:center; justify-content:center; font-size:16px; font-weight:700; color:#0B0F1A; }
        .dd-name { font-size:13px; font-weight:600; color:var(--text-primary); }
        .dd-role { font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:0.4px; color:var(--accent); margin-top:2px; }
        .dd-school { padding:9px 15px; border-bottom:1px solid var(--border); background:var(--accent-soft); }
        .dd-school-en { font-size:11px; font-weight:600; color:var(--text-secondary); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .dd-school-bn { font-size:10.5px; color:var(--text-muted); margin-top:1px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .dd-links { padding:5px; }
        .dd-link { display:flex; align-items:center; gap:9px; padding:8px 10px; border-radius:8px; font-size:13px; font-family:"Sora",sans-serif; font-weight:500; color:var(--text-secondary); text-decoration:none; background:none; border:none; width:100%; cursor:pointer; text-align:left; transition:color var(--transition),background var(--transition); }
        .dd-link:hover { color:var(--text-primary); background:var(--accent-soft); }
        .dd-link.danger:hover { color:var(--error); background:var(--error-bg); }
        .dd-divider { height:1px; background:var(--border); margin:4px 0; }
        .topbar-backdrop { position:fixed; inset:0; z-index:99; }
      `}</style>

      {(notifOpen || dropdownOpen) && (
        <div
          className="topbar-backdrop"
          onClick={closeAll}
          aria-hidden="true"
        />
      )}

      <header className="topbar">
        {/* LEFT */}
        <div className="topbar-left">
          <button
            className="erp-icon-btn topbar-menu"
            onClick={onMenuToggle}
            aria-label="Toggle sidebar"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <nav className="topbar-bc" aria-label="Breadcrumb">
            <Link href="/" className="topbar-bc-home">
              {schoolShort}
            </Link>
            <span className="topbar-bc-sep" aria-hidden="true">
              /
            </span>
            <span className="topbar-bc-page">{pageLabel}</span>
          </nav>
        </div>

        {/* RIGHT */}
        <div className="topbar-right">
          <span className="topbar-date">{today}</span>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <div style={{ position: "relative", zIndex: 100 }}>
            <button
              className="erp-icon-btn"
              onClick={() => {
                setNotifOpen((v) => !v);
                setDropdownOpen(false);
              }}
              aria-label="Notifications"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
              {unreadCount > 0 && <span className="notif-dot" />}
            </button>
            {notifOpen && (
              <div className="erp-dropdown" style={{ width: 300 }}>
                <div className="notif-hdr">
                  <span className="notif-hdr-title">
                    Notifications
                    <span className="notif-count">{unreadCount} new</span>
                  </span>
                  <button className="notif-mark">Mark all read</button>
                </div>
                {NOTIFICATIONS.map((n) => (
                  <div key={n.id} className="notif-item">
                    <div
                      className="notif-dot-sm"
                      style={{
                        background: n.unread
                          ? "var(--accent)"
                          : "var(--border-hover)",
                      }}
                    />
                    <div>
                      <p className="notif-text">{n.text}</p>
                      <p className="notif-time">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User dropdown */}
          <div style={{ position: "relative", zIndex: 100 }}>
            <button
              className="user-btn"
              onClick={() => {
                setDropdownOpen((v) => !v);
                setNotifOpen(false);
              }}
              aria-label="User menu"
            >
              <div className="user-avatar">{initials}</div>
              <span className="user-btn-name">
                {user?.name ?? user?.email ?? "User"}
              </span>
              <svg
                className={`user-btn-chevron ${dropdownOpen ? "open" : ""}`}
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {dropdownOpen && (
              <div className="erp-dropdown" style={{ minWidth: 230 }}>
                <div className="dd-profile">
                  <div className="dd-avatar">{initials}</div>
                  <div>
                    <div className="dd-name">
                      {user?.name ?? user?.email ?? "User"}
                    </div>
                    <div className="dd-role">
                      {role?.replace("_", " ") ?? "User"}
                    </div>
                  </div>
                </div>
                <div className="dd-school">
                  <div className="dd-school-en">{appConfig.schoolNameEn}</div>
                  {appConfig.schoolNameBn && (
                    <div className="dd-school-bn">{appConfig.schoolNameBn}</div>
                  )}
                </div>
                <div className="dd-links">
                  <Link href="/profile" className="dd-link" onClick={closeAll}>
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
                      <circle cx="12" cy="8" r="4" />
                      <path d="M20 21a8 8 0 1 0-16 0" />
                    </svg>
                    My Profile
                  </Link>
                  <Link href="/settings" className="dd-link" onClick={closeAll}>
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
                      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    Settings
                  </Link>
                  <div className="dd-divider" />
                  <button className="dd-link danger" onClick={handleLogout}>
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
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
