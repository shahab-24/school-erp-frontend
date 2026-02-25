// src/components/layout/Sidebar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { appConfig } from "@/lib/config/appConfig";

interface SidebarProps {
  onClose?: () => void;
}
interface NavLink {
  href: string;
  label: string;
  exact?: boolean;
  icon: React.ReactNode;
}
interface NavSection {
  title: string;
  roles?: string[];
  links: NavLink[];
}

const NAV: NavSection[] = [
  {
    title: "Core",
    links: [
      {
        href: "/",
        label: "Overview",
        exact: true,
        icon: (
          <svg
            width="16"
            height="16"
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
        href: "/students",
        label: "Students",
        icon: (
          <svg
            width="16"
            height="16"
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
        href: "/attendance",
        label: "Attendance",
        icon: (
          <svg
            width="16"
            height="16"
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
        href: "/classes",
        label: "Classes",
        icon: (
          <svg
            width="16"
            height="16"
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
    title: "Management",
    roles: ["SCHOOL_ADMIN"],
    links: [
      {
        href: "/teachers",
        label: "Teachers",
        icon: (
          <svg
            width="16"
            height="16"
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
        href: "/results",
        label: "Results",
        icon: (
          <svg
            width="16"
            height="16"
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
        href: "/fees",
        label: "Fee Management",
        icon: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <path d="M2 10h20" />
          </svg>
        ),
      },
      {
        href: "/reports",
        label: "Reports",
        icon: (
          <svg
            width="16"
            height="16"
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
        href: "/settings",
        label: "Settings",
        icon: (
          <svg
            width="16"
            height="16"
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
  const pathname = usePathname();
  const user = useSelector((s: RootState) => s.auth.user);
  const role = useSelector((s: RootState) => s.auth.role);
  const initials = (user?.name ?? user?.email ?? "U").charAt(0).toUpperCase();

  const isActive = (href: string, exact?: boolean) =>
    exact
      ? pathname === href
      : pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <style>{`
        /* All colors from globals.css — auto theme-aware */
        .sidebar { display:flex; flex-direction:column; width:var(--sidebar-w); height:100%; background:var(--bg-sidebar); border-right:1px solid var(--border); overflow:hidden; }
        .sb-header { display:flex; align-items:center; justify-content:space-between; padding:15px 14px 13px; border-bottom:1px solid var(--border); flex-shrink:0; }
        .sb-brand { display:flex; align-items:center; gap:10px; text-decoration:none; min-width:0; }
        .sb-logo { width:36px; height:36px; flex-shrink:0; border-radius:10px; overflow:hidden; background:var(--accent-soft); border:1.5px solid rgba(245,158,11,0.2); display:flex; align-items:center; justify-content:center; color:var(--accent); }
        .sb-brand-en { font-size:12.5px; font-weight:700; color:var(--text-primary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:160px; line-height:1.25; }
        .sb-brand-bn { font-size:10.5px; color:var(--text-muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:160px; margin-top:1px; }
        .sb-brand-tag { font-family:"JetBrains Mono",monospace; font-size:9.5px; color:var(--text-muted); letter-spacing:0.4px; margin-top:1px; }
        .sb-close { display:none; background:none; border:none; cursor:pointer; color:var(--text-muted); padding:6px; border-radius:7px; transition:color var(--transition),background var(--transition); }
        .sb-close:hover { color:var(--text-primary); background:var(--accent-soft); }
        @media(max-width:1024px){ .sb-close{display:flex;align-items:center;} }
        .sb-nav { flex:1; overflow-y:auto; padding:14px 10px; display:flex; flex-direction:column; gap:18px; }
        .sb-section-label { font-size:10px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:var(--text-muted); padding:0 8px; margin-bottom:3px; }
        .sb-links { display:flex; flex-direction:column; gap:1px; }
        .sb-link-icon { flex-shrink:0; opacity:0.65; transition:opacity var(--transition); display:flex; }
        .nav-link:hover .sb-link-icon,.nav-link.active .sb-link-icon { opacity:1; }
        .sb-footer { border-top:1px solid var(--border); padding:11px 10px; flex-shrink:0; }
        .sb-info { padding:9px 11px; margin-bottom:8px; border-radius:var(--radius-sm); background:var(--bg-input); border:1px solid var(--border); }
        .sb-info-text { font-size:10.5px; color:var(--text-muted); line-height:1.55; }
        .sb-user { display:flex; align-items:center; gap:9px; padding:9px 11px; border-radius:var(--radius-sm); background:var(--accent-soft); border:1px solid rgba(245,158,11,0.12); }
        .sb-avatar { width:32px; height:32px; border-radius:8px; flex-shrink:0; background:linear-gradient(135deg,var(--accent) 0%,#EA580C 100%); display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; color:#0B0F1A; }
        .sb-user-name { font-size:12.5px; font-weight:600; color:var(--text-primary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .sb-user-role { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.4px; color:var(--accent); }
        .sb-online { width:7px; height:7px; border-radius:50%; background:#34D399; flex-shrink:0; margin-left:auto; animation:statusPulse 2s ease-in-out infinite; }
      `}</style>

      <aside className="sidebar">
        {/* Header */}
        <div className="sb-header">
          <Link href="/" className="sb-brand">
            <div className="sb-logo">
              <Image
                src={appConfig.logo}
                alt={appConfig.schoolNameEn}
                width={36}
                height={36}
                style={{ objectFit: "contain", padding: 5 }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
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
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <div>
              <div className="sb-brand-en">
                {appConfig.schoolNameEn.split(" ").slice(0, 4).join(" ")}
              </div>
              {appConfig.schoolNameBn && (
                <div className="sb-brand-bn">
                  {appConfig.schoolNameBn.split(" ").slice(0, 3).join(" ")}
                </div>
              )}
              <div className="sb-brand-tag">School ERP</div>
            </div>
          </Link>
          <button
            className="sb-close"
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

        {/* Navigation */}
        <nav className="sb-nav" aria-label="Main navigation">
          {NAV.map((section) => {
            if (section.roles && !section.roles.includes(role ?? ""))
              return null;
            return (
              <div key={section.title}>
                <p className="sb-section-label">{section.title}</p>
                <div className="sb-links">
                  {section.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={onClose}
                      className={`nav-link ${
                        isActive(link.href, link.exact) ? "active" : ""
                      }`}
                    >
                      <span className="sb-link-icon">{link.icon}</span>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="sb-footer">
          {(appConfig.address || appConfig.phone) && (
            <div className="sb-info">
              {appConfig.address && (
                <p className="sb-info-text">📍 {appConfig.address}</p>
              )}
              {appConfig.phone && (
                <p className="sb-info-text">📞 {appConfig.phone}</p>
              )}
            </div>
          )}
          <div className="sb-user">
            <div className="sb-avatar">{initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p className="sb-user-name">
                {user?.name ?? user?.email ?? "User"}
              </p>
              <p className="sb-user-role">
                {role?.replace("_", " ") ?? "User"}
              </p>
            </div>
            <div className="sb-online" title="Online" />
          </div>
        </div>
      </aside>
    </>
  );
}
