"use client";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/lib/features/authSlice";
import { RootState } from "@/lib/store";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

import { appConfig } from "@/lib/config/appConfig"; // ← env-based config
import { useTheme } from "@/context/ThemeProvider";

interface TopbarProps {
  onMenuToggle?: () => void;
}

const routeLabels: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/students": "Students",
  "/dashboard/students/create": "New Student",
  "/dashboard/attendance": "Attendance",
  "/dashboard/classes": "Classes",
  "/dashboard/teachers": "Teachers",
  "/dashboard/results": "Results",
  "/dashboard/fees": "Fee Management",
  "/dashboard/reports": "Reports",
  "/dashboard/settings": "Settings",
};

const NOTIFICATIONS = [
  {
    text: "Term 2 exam schedule has been published",
    time: "2 min ago",
    unread: true,
  },
  { text: "15 students marked absent today", time: "1 hr ago", unread: true },
  { text: "Fee collection deadline: Dec 31", time: "Yesterday", unread: false },
];

export default function Topbar({ onMenuToggle }: TopbarProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.auth.user);
  const role = useSelector((state: RootState) => state.auth.role);
  const { theme, toggleTheme } = useTheme();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };
  const closeAll = () => {
    setDropdownOpen(false);
    setNotifOpen(false);
  };

  const pageTitle = routeLabels[pathname] ?? "Dashboard";
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;
  const initials = (user?.name ?? user?.email ?? "U").charAt(0).toUpperCase();

  return (
    <>
      <style>{`
        .topbar {
          position:fixed; top:0; left:var(--sidebar-w); right:0; height:var(--topbar-h);
          background:var(--bg-topbar); backdrop-filter:blur(18px); -webkit-backdrop-filter:blur(18px);
          border-bottom:1px solid var(--border);
          display:flex; align-items:center; justify-content:space-between;
          padding:0 22px; z-index:30; gap:12px; transition:left var(--transition);
        }
        @media(max-width:1024px){ .topbar{ left:0; } }
        @media(max-width:640px) { .topbar{ padding:0 14px; } }

        .tb-left  { display:flex; align-items:center; gap:12px; min-width:0; }
        .tb-right { display:flex; align-items:center; gap:6px; flex-shrink:0; }

        .menu-btn { display:none; background:none; border:1px solid var(--border); border-radius:8px; padding:7px; color:var(--text-secondary); cursor:pointer; transition:all var(--transition); align-items:center; justify-content:center; }
        .menu-btn:hover { color:var(--text-primary); background:var(--accent-soft); border-color:var(--accent); }
        @media(max-width:1024px){ .menu-btn{ display:flex; } }

        .tb-breadcrumb { display:flex; align-items:center; gap:7px; }
        .tb-bc-home { font-size:12px; color:var(--text-muted); text-decoration:none; transition:color var(--transition); white-space:nowrap; }
        .tb-bc-home:hover { color:var(--accent); }
        .tb-bc-sep  { color:var(--text-muted); font-size:13px; }
        .tb-bc-page { font-size:14px; font-weight:600; color:var(--text-primary); letter-spacing:-0.2px; white-space:nowrap; }
        @media(max-width:480px){ .tb-bc-home,.tb-bc-sep{ display:none; } }

        .tb-date { font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--text-muted); background:var(--accent-soft); border:1px solid var(--border); border-radius:6px; padding:5px 9px; white-space:nowrap; }
        @media(max-width:640px){ .tb-date{ display:none; } }

        /* ── Theme toggle ── */
        .theme-toggle {
          width:36px; height:36px;
          background:var(--bg-input); border:1px solid var(--border);
          border-radius:9px; display:flex; align-items:center; justify-content:center;
          cursor:pointer; color:var(--text-secondary);
          transition:color var(--transition),background var(--transition),border-color var(--transition),transform var(--transition);
          position:relative; overflow:hidden;
        }
        .theme-toggle:hover { color:var(--accent); background:var(--accent-soft); border-color:var(--accent); transform:rotate(12deg); }
        .theme-icon { position:absolute; transition:opacity 0.25s ease,transform 0.35s cubic-bezier(0.34,1.56,0.64,1); }
        .theme-icon-sun  { opacity:0; transform:scale(0.5) rotate(-90deg); }
        .theme-icon-moon { opacity:1; transform:scale(1)   rotate(0deg);   }
        [data-theme="light"] .theme-icon-sun  { opacity:1; transform:scale(1)   rotate(0deg);  }
        [data-theme="light"] .theme-icon-moon { opacity:0; transform:scale(0.5) rotate(90deg); }

        /* ── Icon btn ── */
        .icon-btn { position:relative; width:36px; height:36px; background:var(--bg-input); border:1px solid var(--border); border-radius:9px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--text-secondary); transition:all var(--transition); }
        .icon-btn:hover { color:var(--text-primary); background:var(--accent-soft); border-color:var(--accent); }
        .notif-badge { position:absolute; top:6px; right:6px; width:7px; height:7px; background:var(--accent); border-radius:50%; border:1.5px solid var(--bg-body); animation:pulseBadge 2s ease infinite; }
        @keyframes pulseBadge { 0%,100%{box-shadow:0 0 0 0 var(--accent-glow)} 50%{box-shadow:0 0 0 4px transparent} }

        /* ── Dropdown ── */
        .dropdown { position:absolute; top:calc(100% + 10px); right:0; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius); box-shadow:0 20px 60px rgba(0,0,0,0.3); z-index:200; overflow:hidden; animation:dropIn 0.18s cubic-bezier(0.34,1.56,0.64,1) both; }
        @keyframes dropIn { from{opacity:0;transform:scale(0.95) translateY(-6px)} to{opacity:1;transform:scale(1) translateY(0)} }
        .notif-head { display:flex; align-items:center; justify-content:space-between; padding:12px 15px 9px; border-bottom:1px solid var(--border); }
        .notif-head-title { font-size:13px; font-weight:600; color:var(--text-primary); }
        .notif-mark-btn { font-size:11.5px; color:var(--accent); background:none; border:none; cursor:pointer; font-weight:500; font-family:'Sora',sans-serif; }
        .notif-item { display:flex; align-items:flex-start; gap:10px; padding:10px 15px; border-bottom:1px solid var(--border); cursor:pointer; transition:background var(--transition); }
        .notif-item:last-child { border-bottom:none; }
        .notif-item:hover { background:var(--accent-soft); }
        .notif-dot { width:6px; height:6px; border-radius:50%; background:var(--accent); flex-shrink:0; margin-top:5px; }
        .notif-dot.read { background:var(--text-muted); }
        .notif-text { font-size:12.5px; color:var(--text-secondary); line-height:1.5; }
        .notif-time { font-size:11px; color:var(--text-muted); margin-top:2px; }

        /* ── User btn ── */
        .user-btn { display:flex; align-items:center; gap:8px; background:var(--accent-soft); border:1px solid var(--border); border-radius:10px; padding:5px 10px 5px 5px; cursor:pointer; transition:border-color var(--transition); position:relative; }
        .user-btn:hover { border-color:var(--accent); }
        .ub-avatar { width:28px; height:28px; border-radius:7px; background:linear-gradient(135deg,var(--accent) 0%,#EA580C 100%); display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; color:#0B0F1A; flex-shrink:0; }
        .ub-name { font-size:12.5px; font-weight:600; color:var(--text-primary); max-width:100px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .ub-chevron { color:var(--text-muted); transition:transform var(--transition); }
        .user-btn.open .ub-chevron { transform:rotate(180deg); }
        @media(max-width:640px){ .ub-name,.ub-chevron{ display:none; } .user-btn{ padding:5px; border-radius:9px; } }

        .user-dd-profile { display:flex; align-items:center; gap:12px; padding:14px 15px; border-bottom:1px solid var(--border); }
        .user-dd-avatar  { width:38px; height:38px; border-radius:10px; background:linear-gradient(135deg,var(--accent) 0%,#EA580C 100%); display:flex; align-items:center; justify-content:center; font-size:16px; font-weight:700; color:#0B0F1A; }
        .user-dd-name { font-size:13px; font-weight:600; color:var(--text-primary); }
        .user-dd-role { font-size:10.5px; color:var(--accent); font-weight:600; text-transform:uppercase; letter-spacing:0.3px; }

        /* School info strip in dropdown */
        .user-dd-school { padding:9px 15px; border-bottom:1px solid var(--border); background:var(--accent-soft); }
        .user-dd-school-name { font-size:11px; font-weight:600; color:var(--text-secondary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .user-dd-school-sub  { font-size:10px; color:var(--text-muted); margin-top:1px; }

        .user-dd-links { padding:5px; }
        .user-dd-link { display:flex; align-items:center; gap:9px; padding:8px 10px; border-radius:7px; font-size:13px; color:var(--text-secondary); text-decoration:none; background:none; border:none; width:100%; cursor:pointer; text-align:left; transition:all var(--transition); font-family:'Sora',sans-serif; font-weight:500; }
        .user-dd-link:hover { color:var(--text-primary); background:var(--accent-soft); }
        .user-dd-link.danger:hover { color:var(--error); background:var(--error-bg); }
        .user-dd-divider { height:1px; background:var(--border); margin:4px 0; }

        .dd-backdrop { position:fixed; inset:0; z-index:199; }
      `}</style>

      {(dropdownOpen || notifOpen) && (
        <div className="dd-backdrop" onClick={closeAll} />
      )}

      <header className="topbar">
        {/* LEFT */}
        <div className="tb-left">
          <button
            className="menu-btn"
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

          <div className="tb-breadcrumb">
            <a href="/dashboard" className="tb-bc-home">
              {appConfig.schoolNameEn.split(" ").slice(0, 2).join(" ")}
            </a>
            <span className="tb-bc-sep">/</span>
            <span className="tb-bc-page">{pageTitle}</span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="tb-right">
          <span className="tb-date">{today}</span>

          {/* ── DARK/LIGHT TOGGLE ── */}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <span className="theme-icon theme-icon-sun">
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
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            </span>
            <span className="theme-icon theme-icon-moon">
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
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </span>
          </button>

          {/* Notifications */}
          <div style={{ position: "relative" }}>
            <button
              className="icon-btn"
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
              {unreadCount > 0 && <span className="notif-badge" />}
            </button>
            {notifOpen && (
              <div className="dropdown" style={{ width: "300px" }}>
                <div className="notif-head">
                  <span className="notif-head-title">
                    Notifications ({unreadCount} new)
                  </span>
                  <button className="notif-mark-btn">Mark all read</button>
                </div>
                {NOTIFICATIONS.map((n, i) => (
                  <div key={i} className="notif-item">
                    <div className={`notif-dot ${n.unread ? "" : "read"}`} />
                    <div>
                      <div className="notif-text">{n.text}</div>
                      <div className="notif-time">{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User dropdown */}
          <div style={{ position: "relative" }}>
            <button
              className={`user-btn ${dropdownOpen ? "open" : ""}`}
              onClick={() => {
                setDropdownOpen((v) => !v);
                setNotifOpen(false);
              }}
              aria-label="User menu"
            >
              <div className="ub-avatar">{initials}</div>
              <span className="ub-name">
                {user?.name ?? user?.email ?? "User"}
              </span>
              <svg
                className="ub-chevron"
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
              <div className="dropdown" style={{ minWidth: "230px" }}>
                <div className="user-dd-profile">
                  <div className="user-dd-avatar">{initials}</div>
                  <div>
                    <div className="user-dd-name">
                      {user?.name ?? user?.email ?? "User"}
                    </div>
                    <div className="user-dd-role">
                      {role?.replace("_", " ")}
                    </div>
                  </div>
                </div>

                {/* ── School info from appConfig ── */}
                <div className="user-dd-school">
                  <div className="user-dd-school-name">
                    {appConfig.schoolNameEn}
                  </div>
                  {appConfig.schoolNameBn && (
                    <div className="user-dd-school-sub">
                      {appConfig.schoolNameBn}
                    </div>
                  )}
                </div>

                <div className="user-dd-links">
                  <a href="/profile" className="user-dd-link">
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
                  </a>
                  <a href="/settings" className="user-dd-link">
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
                  </a>
                  <div className="user-dd-divider" />
                  <button
                    onClick={handleLogout}
                    className="user-dd-link danger"
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
