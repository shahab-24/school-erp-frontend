"use client";

import { ReactNode, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { ToastContainer } from "@/components/ui/ToastContainer";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        :root {
          --sidebar-w: 260px;
          --topbar-h: 64px;
          --bg-body: #0B0F1A;
          --bg-sidebar: #0D1120;
          --bg-topbar: rgba(13,17,32,0.92);
          --bg-main: #0F1525;
          --bg-card: #131929;
          --border: #1E2A40;
          --text-primary: #F1F5F9;
          --text-secondary: #94A3B8;
          --text-muted: #4B5A72;
          --accent: #F59E0B;
          --accent-soft: rgba(245,158,11,0.08);
          --accent-glow: rgba(245,158,11,0.15);
          --transition: 0.2s cubic-bezier(0.4,0,0.2,1);
        }

        @media (prefers-color-scheme: light) {
          :root {
            --bg-body: #EEF2FB;
            --bg-sidebar: #FFFFFF;
            --bg-topbar: rgba(255,255,255,0.92);
            --bg-main: #F4F7FF;
            --bg-card: #FFFFFF;
            --border: #E2E8F4;
            --text-primary: #0F172A;
            --text-secondary: #475569;
            --text-muted: #94A3B8;
            --accent: #D97706;
            --accent-soft: rgba(217,119,6,0.07);
            --accent-glow: rgba(217,119,6,0.14);
          }
        }

        .dash-root {
          font-family: 'Sora', sans-serif;
          min-height: 100dvh;
          background: var(--bg-body);
          display: flex;
        }

        /* Sidebar overlay for mobile */
        .sidebar-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(2px);
          z-index: 40;
          opacity: 0;
          transition: opacity var(--transition);
        }
        .sidebar-overlay.open { display: block; opacity: 1; }

        .sidebar-wrap {
          position: fixed;
          top: 0; left: 0; bottom: 0;
          width: var(--sidebar-w);
          z-index: 50;
          transform: translateX(0);
          transition: transform var(--transition);
        }

        @media (max-width: 1024px) {
          .sidebar-wrap {
            transform: translateX(calc(-1 * var(--sidebar-w)));
          }
          .sidebar-wrap.open { transform: translateX(0); }
        }

        .dash-content {
          flex: 1;
          margin-left: var(--sidebar-w);
          min-width: 0;
          display: flex;
          flex-direction: column;
          min-height: 100dvh;
          transition: margin var(--transition);
        }

        @media (max-width: 1024px) {
          .dash-content { margin-left: 0; }
        }

        .dash-main {
          flex: 1;
          padding: 28px 28px 40px;
          margin-top: var(--topbar-h);
          background: var(--bg-main);
        }

        @media (max-width: 768px) {
          .dash-main { padding: 20px 16px 32px; }
        }
      `}</style>

      <div className="dash-root">
        {/* Mobile overlay */}
        <div
          className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />

        {/* Sidebar */}
        <div className={`sidebar-wrap ${sidebarOpen ? "open" : ""}`}>
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Main content */}
        <div className="dash-content">
          <Topbar onMenuToggle={() => setSidebarOpen((v) => !v)} />
          <main className="dash-main">{children}</main>
        </div>

        <ToastContainer />
      </div>
    </>
  );
}
