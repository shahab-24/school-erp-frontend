// src/app/(dashboard)/layout.tsx
//
// ✅ CORRECT path: app/(dashboard)/layout.tsx
// ❌ WRONG path:   app/(dashboard)/dashboard/layout.tsx  ← causes /dashboard/dashboard URL
//
// The (dashboard) folder is a route group — parentheses mean NO URL segment is added.
// So (dashboard)/layout.tsx wraps routes at: /  /students  /students/create  etc.
//
// This layout renders Sidebar + Topbar EXACTLY ONCE.
// Every page.tsx inside (dashboard)/ receives {children} — never import Sidebar/Topbar in a page.

"use client";

import { type ReactNode, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <style>{`
        .dash-root {
          display: flex;
          min-height: 100dvh;
          background: var(--bg-body);
          font-family: "Sora", sans-serif;
        }
        .sidebar-overlay {
          position: fixed; inset: 0; z-index: 40;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          opacity: 0; pointer-events: none;
          transition: opacity var(--transition);
        }
        .sidebar-overlay.open { opacity: 1; pointer-events: auto; }
        .sidebar-panel {
          position: fixed; top: 0; left: 0; bottom: 0;
          width: var(--sidebar-w); z-index: 50;
          transition: transform var(--transition);
        }
        @media (min-width: 1025px) { .sidebar-panel { transform: translateX(0) !important; } }
        @media (max-width: 1024px) {
          .sidebar-panel { transform: translateX(calc(-1 * var(--sidebar-w))); }
          .sidebar-panel.open { transform: translateX(0); }
        }
        .dash-content {
          display: flex; flex-direction: column;
          flex: 1; min-width: 0;
          margin-left: var(--sidebar-w);
          transition: margin-left var(--transition);
        }
        @media (max-width: 1024px) { .dash-content { margin-left: 0; } }
        .dash-main {
          flex: 1; padding: 28px;
          padding-top: calc(var(--topbar-h) + 28px);
          background: var(--bg-main);
          min-height: 100dvh;
        }
        @media (max-width: 768px) {
          .dash-main { padding: 18px 16px; padding-top: calc(var(--topbar-h) + 18px); }
        }
      `}</style>

      <div className="dash-root">
        <div
          aria-hidden="true"
          className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`}
          onClick={() => setSidebarOpen(false)}
        />
        <div className={`sidebar-panel ${sidebarOpen ? "open" : ""}`}>
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>
        <div className="dash-content">
          <Topbar onMenuToggle={() => setSidebarOpen((v) => !v)} />
          <main className="dash-main">{children}</main>
        </div>
      </div>
    </>
  );
}
