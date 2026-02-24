"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { appConfig } from "@/lib/config/appConfig";


interface SidebarProps {
  onClose?: () => void;
}

const navItems = [
  {
    section: "Core",
    links: [
      {
        href: "/dashboard",
        label: "Overview",
        exact: true,
        icon: (
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="7" height="9" x="3" y="3" rx="1" />
            <rect width="7" height="5" x="14" y="3" rx="1" />
            <rect width="7" height="9" x="14" y="12" rx="1" />
            <rect width="7" height="5" x="3" y="16" rx="1" />
          </svg>
        ),
      },
      {
        href: "/dashboard/students",
        label: "Students",
        icon: (
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
        ),
      },
      {
        href: "/dashboard/attendance",
        label: "Attendance",
        icon: (
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
            <path d="m9 16 2 2 4-4" />
          </svg>
        ),
      },
      {
        href: "/dashboard/classes",
        label: "Classes",
        icon: (
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
          </svg>
        ),
      },
    ],
  },
  {
    section: "Management",
    roles: ["SCHOOL_ADMIN"],
    links: [
      {
        href: "/dashboard/teachers",
        label: "Teachers",
        icon: (
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M20 21a8 8 0 1 0-16 0" />
          </svg>
        ),
      },
      {
        href: "/dashboard/results",
        label: "Results",
        icon: (
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        ),
      },
      {
        href: "/dashboard/fees",
        label: "Fee Management",
        icon: (
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <path d="M2 10h20" />
            <circle cx="12" cy="14" r="1" />
          </svg>
        ),
      },
      {
        href: "/dashboard/reports",
        label: "Reports",
        icon: (
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        ),
      },
      {
        href: "/dashboard/settings",
        label: "Settings",
        icon: (
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        ),
      },
    ],
  },
];

export default function Sidebar({ onClose }: SidebarProps) {
  const role = useSelector((state: RootState) => state.auth.role);
  const user = useSelector((state: RootState) => state.auth.user);
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <>
      <style>{`
        .sidebar { width:260px; height:100dvh; background:var(--bg-sidebar); border-right:1px solid var(--border); display:flex; flex-direction:column; overflow:hidden; }
        .sidebar-header { padding:18px 18px 14px; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; flex-shrink:0; }
        .sidebar-brand  { display:flex; align-items:center; gap:10px; text-decoration:none; }
        .sidebar-logo-wrap { width:36px; height:36px; border-radius:9px; overflow:hidden; background:var(--accent-soft); border:1.5px solid rgba(245,158,11,0.25); display:flex; align-items:center; justify-content:center; flex-shrink:0; color:var(--accent); }
        .sidebar-logo-wrap img { width:100%; height:100%; object-fit:contain; padding:5px; }
        .sidebar-brand-text { display:flex; flex-direction:column; min-width:0; }
        .sidebar-brand-name { font-size:13px; font-weight:700; color:var(--text-primary); letter-spacing:-0.3px; line-height:1.25; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:160px; }
        .sidebar-brand-bn   { font-size:11px; color:var(--text-muted); line-height:1.3; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:160px; }
        .sidebar-brand-tag  { font-family:'JetBrains Mono',monospace; font-size:9.5px; color:var(--text-muted); letter-spacing:0.4px; }
        .sidebar-close { display:none; background:none; border:none; cursor:pointer; color:var(--text-muted); padding:6px; border-radius:6px; transition:color var(--transition),background var(--transition); }
        .sidebar-close:hover { color:var(--text-primary); background:var(--accent-soft); }
        @media(max-width:1024px){ .sidebar-close{ display:flex; align-items:center; } }
        .sidebar-nav { flex:1; overflow-y:auto; padding:14px 10px; display:flex; flex-direction:column; gap:18px; scrollbar-width:thin; scrollbar-color:var(--border) transparent; }
        .nav-section-label { font-size:10px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:var(--text-muted); padding:0 8px; margin-bottom:4px; }
        .nav-links { display:flex; flex-direction:column; gap:1px; }
        .nav-link { display:flex; align-items:center; gap:10px; padding:9px 10px; border-radius:8px; text-decoration:none; color:var(--text-secondary); font-size:13.5px; font-weight:500; transition:color var(--transition),background var(--transition); position:relative; }
        .nav-link:hover { color:var(--text-primary); background:var(--accent-soft); }
        .nav-link.active { color:var(--accent); background:var(--accent-soft); font-weight:600; }
        .nav-link.active::before { content:''; position:absolute; left:0; top:20%; bottom:20%; width:3px; background:var(--accent); border-radius:0 3px 3px 0; }
        .nav-link-icon { flex-shrink:0; display:flex; opacity:0.7; transition:opacity var(--transition); }
        .nav-link:hover .nav-link-icon, .nav-link.active .nav-link-icon { opacity:1; }
        .sidebar-footer { padding:12px 10px; border-top:1px solid var(--border); flex-shrink:0; }
        .sidebar-school-info { padding:10px 10px 12px; border-bottom:1px solid var(--border); margin-bottom:10px; }
        .sidebar-school-info-name { font-size:11px; font-weight:600; color:var(--text-secondary); line-height:1.4; }
        .sidebar-school-info-addr { font-size:10px; color:var(--text-muted); margin-top:2px; line-height:1.4; }
        .user-card { display:flex; align-items:center; gap:9px; padding:9px 10px; border-radius:9px; background:var(--accent-soft); border:1px solid var(--border); }
        .user-avatar { width:32px; height:32px; border-radius:8px; background:linear-gradient(135deg,var(--accent) 0%,#EA580C 100%); display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; color:#0B0F1A; flex-shrink:0; }
        .user-info { flex:1; min-width:0; }
        .user-name { font-size:12.5px; font-weight:600; color:var(--text-primary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .user-role { font-size:10.5px; color:var(--accent); font-weight:500; text-transform:uppercase; letter-spacing:0.3px; }
        .user-status { width:7px; height:7px; border-radius:50%; background:#34D399; flex-shrink:0; animation:statusPulse 2s ease infinite; }
        @keyframes statusPulse { 0%,100%{box-shadow:0 0 0 2px rgba(52,211,153,0.2)} 50%{box-shadow:0 0 0 5px rgba(52,211,153,0.06)} }
      `}</style>

      <aside className="sidebar">
        {/* ── HEADER — school name + logo from appConfig ── */}
        <div className="sidebar-header">
          <Link href="/dashboard" className="sidebar-brand">
            <div className="sidebar-logo-wrap">
              <img
                src={appConfig.logo}
                alt={appConfig.schoolNameEn}
                onError={(e) => {
                  const parent = (e.target as HTMLImageElement).parentElement!;
                  (e.target as HTMLImageElement).remove();
                  parent.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`;
                }}
              />
            </div>
            <div className="sidebar-brand-text">
              {/* Short form: first word of school name */}
              <span className="sidebar-brand-name">
                {appConfig.schoolNameEn.split(" ").slice(0, 4).join(" ")}
              </span>
              {appConfig.schoolNameBn && (
                <span className="sidebar-brand-bn">
                  {appConfig.schoolNameBn.split(" ").slice(0, 3).join(" ")}
                </span>
              )}
              <span className="sidebar-brand-tag">School ERP</span>
            </div>
          </Link>

          <button
            className="sidebar-close"
            onClick={onClose}
            aria-label="Close sidebar"
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
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── NAVIGATION ── */}
        <nav className="sidebar-nav">
          {navItems.map((section) => {
            if (section.roles && !section.roles.includes(role ?? ""))
              return null;
            return (
              <div key={section.section}>
                <div className="nav-section-label">{section.section}</div>
                <div className="nav-links">
                  {section.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`nav-link ${
                        isActive(link.href, (link as any).exact) ? "active" : ""
                      }`}
                      onClick={onClose}
                    >
                      <span className="nav-link-icon">{link.icon}</span>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        {/* ── FOOTER ── */}
        <div className="sidebar-footer">
          {/* School address — from appConfig */}
          {appConfig.address && (
            <div className="sidebar-school-info">
              <div className="sidebar-school-info-name">
                {appConfig.schoolNameEn}
              </div>
              <div className="sidebar-school-info-addr">
                {appConfig.address}
              </div>
              {appConfig.phone && (
                <div className="sidebar-school-info-addr">
                  📞 {appConfig.phone}
                </div>
              )}
            </div>
          )}

          {/* Logged-in user */}
          <div className="user-card">
            <div className="user-avatar">
              {(user?.name ?? user?.email ?? "U").charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <div className="user-name">
                {user?.name ?? user?.email ?? "User"}
              </div>
              <div className="user-role">
                {role?.replace("_", " ") ?? "User"}
              </div>
            </div>
            <div className="user-status" title="Online" />
          </div>
        </div>
      </aside>
    </>
  );
}
