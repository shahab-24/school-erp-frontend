// src/app/not-found.tsx
// Next.js automatically uses this for all 404 routes.
// No sidebar/topbar — standalone page.
import Link from "next/link";
import { appConfig } from "@/lib/config/appConfig";

export default function NotFound() {
  return (
    <>
      <style>{`
        .nf-root {
          min-height: 100dvh;
          display: flex; align-items: center; justify-content: center;
          background: var(--bg-body);
          font-family: "Sora", sans-serif;
          padding: 24px;
          position: relative; overflow: hidden;
        }
        .nf-bg {
          position: fixed; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 80%);
        }
        [data-theme="light"] .nf-bg {
          background-image:
            linear-gradient(rgba(15,23,42,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15,23,42,0.04) 1px, transparent 1px);
        }
        .nf-card {
          position: relative; text-align: center;
          max-width: 480px; width: 100%;
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: var(--radius); padding: 52px 40px 44px;
          box-shadow: var(--shadow-card);
          animation: cardIn 0.55s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        .nf-card-bar { position:absolute; top:0; left:40px; right:40px; height:2px; background:linear-gradient(90deg,transparent,var(--accent),transparent); }
        .nf-code {
          font-family: "JetBrains Mono", monospace;
          font-size: 88px; font-weight: 700; line-height: 1;
          color: var(--accent); letter-spacing: -4px;
          margin-bottom: 12px;
          text-shadow: 0 0 60px var(--accent-glow);
        }
        .nf-title { font-size: 20px; font-weight: 700; color: var(--text-primary); margin-bottom: 10px; letter-spacing: -0.3px; }
        .nf-desc  { font-size: 14px; color: var(--text-secondary); line-height: 1.65; margin-bottom: 32px; }
        .nf-actions { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
        .nf-school {
          margin-top: 36px; padding-top: 24px;
          border-top: 1px solid var(--border);
          display: flex; flex-direction: column; align-items: center; gap: 5px;
        }
        .nf-school-logo {
          width: 40px; height: 40px; border-radius: 10px;
          background: var(--accent-soft); border: 1px solid rgba(245,158,11,0.2);
          display: flex; align-items: center; justify-content: center;
          color: var(--accent); margin-bottom: 4px;
          animation: iconPulse 3s ease-in-out infinite;
        }
        .nf-school-en { font-size: 12.5px; font-weight: 600; color: var(--text-secondary); }
        .nf-school-bn { font-size: 11px; color: var(--text-muted); }
        @media(max-width:480px){ .nf-card{padding:40px 24px 36px;} .nf-code{font-size:72px;} }
      `}</style>

      <div className="nf-root">
        <div className="nf-bg" aria-hidden="true" />
        <div className="nf-card">
          <div className="nf-card-bar" />
          <div className="nf-code">404</div>
          <h1 className="nf-title">Page Not Found</h1>
          <p className="nf-desc">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
          <div className="nf-actions">
            <Link href="/" className="erp-btn-primary">
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
              Back to Dashboard
            </Link>
            <Link href="/students" className="erp-btn-ghost">
              View Students
            </Link>
          </div>
          <div className="nf-school">
            <div className="nf-school-logo">
              <svg
                width="18"
                height="18"
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
            <span className="nf-school-en">{appConfig.schoolNameEn}</span>
            {appConfig.schoolNameBn && (
              <span className="nf-school-bn">{appConfig.schoolNameBn}</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
