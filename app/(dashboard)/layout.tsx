// src/app/(dashboard)/layout.tsx
"use client";

import { type ReactNode, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import AuthGuard from "@/components/Guard/AuthGuard";

/**
 * DashboardLayout:
 * - Wraps all routes inside (dashboard)/ group
 * - Renders Sidebar + Topbar exactly ONCE
 * - Protected by AuthGuard
 *
 * Route group (dashboard) adds NO URL segment:
 *   (dashboard)/page.tsx          → /
 *   (dashboard)/students/page.tsx → /students
 */
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

        /* Mobile overlay */
        .sidebar-overlay {
          position: fixed; inset: 0; z-index: 40;
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          opacity: 0; pointer-events: none;
          transition: opacity var(--transition);
        }
        .sidebar-overlay.open { opacity: 1; pointer-events: auto; }

        /* Sidebar panel */
        .sidebar-panel {
          position: fixed; top: 0; left: 0; bottom: 0;
          width: var(--sidebar-w); z-index: 50;
          transition: transform var(--transition);
        }

        /* Desktop: always visible */
        @media (min-width: 1025px) {
          .sidebar-panel { transform: translateX(0) !important; }
        }

        /* Mobile: slide in/out */
        @media (max-width: 1024px) {
          .sidebar-panel { transform: translateX(calc(-1 * var(--sidebar-w))); }
          .sidebar-panel.open { transform: translateX(0); }
        }

        /* Main content area */
        .dash-content {
          display: flex; flex-direction: column;
          flex: 1; min-width: 0;
          margin-left: var(--sidebar-w);
          transition: margin-left var(--transition);
        }
        @media (max-width: 1024px) { .dash-content { margin-left: 0; } }

        /* Page area */
        .dash-main {
          flex: 1;
          padding: 28px;
          padding-top: calc(var(--topbar-h) + 28px);
          background: var(--bg-main);
          min-height: 100dvh;
        }
        @media (max-width: 768px) {
          .dash-main {
            padding: 18px 16px;
            padding-top: calc(var(--topbar-h) + 18px);
          }
        }
      `}</style>

      <AuthGuard>
        <div className="dash-root">
          {/* Mobile backdrop */}
          <div
            aria-hidden="true"
            className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`}
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar — renders ONCE */}
          <div className={`sidebar-panel ${sidebarOpen ? "open" : ""}`}>
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>

          {/* Content */}
          <div className="dash-content">
            {/* Topbar — renders ONCE */}
            <Topbar onMenuToggle={() => setSidebarOpen((v) => !v)} />

            {/* Page.tsx content injected here */}
            <main className="dash-main">{children}</main>
          </div>
        </div>
      </AuthGuard>
    </>
  );
}
