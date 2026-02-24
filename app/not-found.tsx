"use client";

import { appConfig } from "@/lib/config/appConfig";
import Link from "next/link";


export default function NotFoundPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

        .nf-root {
          font-family:'Sora',sans-serif; min-height:100dvh;
          background:var(--bg-body,#0B0F1A);
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          padding:40px 20px; text-align:center; position:relative; overflow:hidden;
        }
        .nf-grid {
          position:fixed; inset:0; pointer-events:none;
          background-image: linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px);
          background-size:48px 48px;
          mask-image:radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 80%);
        }
        [data-theme="light"] .nf-grid {
          background-image: linear-gradient(rgba(15,23,42,0.04) 1px,transparent 1px), linear-gradient(90deg,rgba(15,23,42,0.04) 1px,transparent 1px);
        }
        .nf-glow { position:fixed; width:600px; height:300px; background:radial-gradient(ellipse,rgba(245,158,11,0.08) 0%,transparent 70%); top:50%; left:50%; transform:translate(-50%,-60%); pointer-events:none; }

        .nf-content { position:relative; display:flex; flex-direction:column; align-items:center; animation:pageEnter 0.5s ease both; }

        .nf-code {
          font-family:'JetBrains Mono',monospace;
          font-size:clamp(80px,20vw,160px); font-weight:700; line-height:1; letter-spacing:-4px;
          background:linear-gradient(135deg,var(--accent,#F59E0B) 0%,rgba(245,158,11,0.3) 100%);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          margin-bottom:8px; position:relative;
        }
        .nf-code::after {
          content:'404'; position:absolute; inset:0;
          font-family:'JetBrains Mono',monospace; font-size:clamp(80px,20vw,160px); font-weight:700; letter-spacing:-4px;
          -webkit-text-stroke:1px rgba(245,158,11,0.1); -webkit-text-fill-color:transparent;
          filter:blur(8px); transform:translateY(4px); z-index:-1;
        }
        .nf-icon-wrap { width:70px; height:70px; background:var(--accent-soft,rgba(245,158,11,0.08)); border:1.5px solid rgba(245,158,11,0.2); border-radius:18px; display:flex; align-items:center; justify-content:center; margin-bottom:20px; animation:iconPulse 3s ease-in-out infinite; }
        @keyframes iconPulse { 0%,100%{box-shadow:0 0 0 0 rgba(245,158,11,0.1)} 50%{box-shadow:0 0 0 14px rgba(245,158,11,0)} }

        .nf-title   { font-size:clamp(20px,4vw,26px); font-weight:700; color:var(--text-primary,#F1F5F9); letter-spacing:-0.5px; margin-bottom:10px; }
        .nf-desc    { font-size:14.5px; color:var(--text-muted,#4B5A72); max-width:360px; line-height:1.6; margin-bottom:28px; }
        .nf-actions { display:flex; gap:10px; flex-wrap:wrap; justify-content:center; margin-bottom:40px; }

        .nf-divider { display:flex; align-items:center; gap:12px; margin-bottom:14px; width:100%; max-width:360px; }
        .nf-div-line{ flex:1; height:1px; background:var(--border,#1E2A40); }
        .nf-div-text{ font-size:11px; color:var(--text-muted,#4B5A72); white-space:nowrap; }

        .nf-links { display:flex; gap:8px; flex-wrap:wrap; justify-content:center; }
        .nf-link {
          display:flex; align-items:center; gap:7px; padding:7px 13px;
          background:var(--bg-card,#131929); border:1px solid var(--border,#1E2A40);
          border-radius:8px; font-size:12.5px; font-weight:500; color:var(--text-secondary,#94A3B8);
          text-decoration:none; transition:all 0.2s;
        }
        .nf-link:hover { color:var(--accent,#F59E0B); border-color:var(--accent,#F59E0B); background:var(--accent-soft,rgba(245,158,11,0.08)); }

        /* ── School brand ── */
        .nf-brand { margin-top:44px; display:flex; flex-direction:column; align-items:center; gap:8px; opacity:0.55; }
        .nf-brand-logo { width:32px; height:32px; border-radius:8px; background:var(--accent-soft,rgba(245,158,11,0.08)); border:1px solid rgba(245,158,11,0.15); display:flex; align-items:center; justify-content:center; overflow:hidden; }
        .nf-brand-logo img { width:100%; height:100%; object-fit:contain; padding:5px; }
        .nf-brand-logo svg { color:var(--accent,#F59E0B); }
        .nf-brand-name { font-size:12px; font-weight:600; color:var(--text-muted,#4B5A72); text-align:center; max-width:220px; line-height:1.4; }
        .nf-brand-sub  { font-size:10.5px; color:var(--text-muted,#4B5A72); }

        @media(max-width:480px){ .nf-actions{ flex-direction:column; align-items:center; } .nf-actions>*{ width:100%; max-width:260px; justify-content:center; } }
      `}</style>

      <div className="nf-root">
        <div className="nf-grid" />
        <div className="nf-glow" />

        <div className="nf-content">
          <div className="nf-code">404</div>

          <div className="nf-icon-wrap">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--accent,#F59E0B)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
              <path d="M11 8v3M11 14h.01" />
            </svg>
          </div>

          <h1 className="nf-title">Page Not Found</h1>
          <p className="nf-desc">
            The page you're looking for doesn't exist or has been moved. Check
            the URL or navigate back.
          </p>

          <div className="nf-actions">
            <Link
              href="/dashboard"
              className="erp-btn-primary"
              style={{ minWidth: 150 }}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="7" height="9" x="3" y="3" rx="1" />
                <rect width="7" height="5" x="14" y="3" rx="1" />
                <rect width="7" height="9" x="14" y="12" rx="1" />
                <rect width="7" height="5" x="3" y="16" rx="1" />
              </svg>
              Go to Dashboard
            </Link>
            <button
              className="erp-btn-ghost"
              style={{ minWidth: 110 }}
              onClick={() => window.history.back()}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Go Back
            </button>
          </div>

          <div className="nf-divider">
            <div className="nf-div-line" />
            <span className="nf-div-text">Quick Navigation</span>
            <div className="nf-div-line" />
          </div>

          <div className="nf-links">
            {[
              { href: "/dashboard/students", label: "Students" },
              { href: "/dashboard/results", label: "Results" },
              { href: "/dashboard/settings", label: "Settings" },
              { href: "/login", label: "Sign Out" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="nf-link">
                {l.label}
              </Link>
            ))}
          </div>

          {/* ── School brand from appConfig ── */}
          <div className="nf-brand">
            <div className="nf-brand-logo">
              <img
                src={appConfig.logo}
                alt={appConfig.schoolNameEn}
                onError={(e) => {
                  const el = e.target as HTMLImageElement;
                  el.style.display = "none";
                  const svg = document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "svg"
                  );
                  svg.setAttribute("width", "14");
                  svg.setAttribute("height", "14");
                  svg.setAttribute("viewBox", "0 0 24 24");
                  svg.setAttribute("fill", "none");
                  svg.setAttribute("stroke", "currentColor");
                  svg.setAttribute("stroke-width", "2");
                  svg.innerHTML = `<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>`;
                  el.parentElement?.appendChild(svg);
                }}
              />
            </div>
            <div className="nf-brand-name">{appConfig.schoolNameEn}</div>
            {appConfig.schoolNameBn && (
              <div className="nf-brand-sub">{appConfig.schoolNameBn}</div>
            )}
            {appConfig.established && (
              <div className="nf-brand-sub">Est. {appConfig.established}</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
