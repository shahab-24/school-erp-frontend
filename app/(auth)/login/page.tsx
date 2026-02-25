// app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import { useLoginMutation } from "@/lib/services/authApi";
import { setCredentials } from "@/lib/features/authSlice";
import { appConfig } from "@/lib/config/appConfig";

// ─── Component ────────────────────────────────────────────────

export default function LoginPage() {
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const res = await login({
        email: email.trim().toLowerCase(),
        password,
      }).unwrap();
      dispatch(
        setCredentials({ token: res.token, user: res.user, role: res.role })
      );
      router.push("/");
    } catch {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <>
      {/*
       * IMPORTANT: We do NOT re-declare :root or [data-theme] variables here.
       * All CSS variables come from globals.css.
       * This component is fully theme-aware automatically.
       */}
      <style>{`
        .login-root {
          font-family: "Sora", sans-serif;
          min-height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-body);
          background-image:
            radial-gradient(ellipse 80% 60% at 20% 0%, var(--accent-glow) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 100%, rgba(99, 102, 241, 0.07) 0%, transparent 60%);
          padding: 24px 16px;
          position: relative;
          overflow: hidden;
        }

        /* Subtle grid background */
        .login-grid {
          position: fixed;
          inset: 0;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 100% 100% at 50% 50%, black 30%, transparent 80%);
        }
        [data-theme="light"] .login-grid {
          background-image:
            linear-gradient(rgba(15,23,42,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15,23,42,0.04) 1px, transparent 1px);
        }

        /* Card */
        .login-card {
          position: relative;
          width: 100%;
          max-width: 440px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 36px 34px 32px;
          box-shadow: var(--shadow-card);
          animation: cardIn 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        .card-accent-bar {
          position: absolute;
          top: 0; left: 34px; right: 34px;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
        }

        /* Brand */
        .brand {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          margin-bottom: 26px;
        }
        .brand-logo {
          width: 62px; height: 62px;
          border-radius: 16px;
          overflow: hidden;
          background: var(--accent-soft);
          border: 1.5px solid rgba(245, 158, 11, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: iconPulse 3s ease-in-out infinite;
        }
        .brand-logo img { width: 100%; height: 100%; object-fit: contain; padding: 10px; }
        .brand-logo svg { color: var(--accent); }
        .brand-name-en {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.3px;
          text-align: center;
          line-height: 1.3;
          max-width: 300px;
        }
        .brand-name-bn { font-size: 13px; color: var(--text-secondary); text-align: center; }
        .brand-meta    { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; justify-content: center; }
        .brand-chip {
          font-family: "JetBrains Mono", monospace;
          font-size: 10.5px;
          color: var(--text-muted);
          background: var(--accent-soft);
          border: 1px solid rgba(245, 158, 11, 0.12);
          border-radius: 5px;
          padding: 2px 7px;
        }

        /* Form header */
        .form-header  { margin-bottom: 20px; }
        .form-title   { font-size: 20px; font-weight: 700; color: var(--text-primary); letter-spacing: -0.4px; }
        .form-sub     { font-size: 13px; color: var(--text-secondary); margin-top: 4px; }

        /* Form */
        .login-form { display: flex; flex-direction: column; gap: 14px; }
        .field { display: flex; flex-direction: column; gap: 5px; }
        .field-label {
          font-size: 11.5px;
          font-weight: 600;
          color: var(--text-secondary);
          letter-spacing: 0.3px;
          text-transform: uppercase;
        }
        .input-wrap { position: relative; display: flex; align-items: center; }
        .input-icon {
          position: absolute;
          left: 13px;
          color: var(--text-muted);
          pointer-events: none;
          display: flex;
          transition: color var(--transition);
        }
        .input-wrap:focus-within .input-icon { color: var(--accent); }
        .field-input {
          width: 100%;
          background: var(--bg-input);
          border: 1.5px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 11px 13px 11px 40px;
          font-family: "Sora", sans-serif;
          font-size: 14px;
          color: var(--text-primary);
          outline: none;
          -webkit-appearance: none;
          transition: border-color var(--transition), box-shadow var(--transition), background var(--transition);
        }
        .field-input::placeholder { color: var(--text-muted); }
        .field-input:focus {
          border-color: var(--border-focus);
          box-shadow: 0 0 0 3px var(--accent-glow);
        }
        .field-input.pr { padding-right: 44px; }

        .toggle-pw {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-muted);
          padding: 4px;
          display: flex;
          border-radius: 4px;
          transition: color var(--transition);
        }
        .toggle-pw:hover { color: var(--accent); }

        .forgot-link {
          align-self: flex-end;
          font-size: 12px;
          color: var(--accent);
          text-decoration: none;
          font-weight: 500;
          margin-top: -4px;
          transition: opacity var(--transition);
        }
        .forgot-link:hover { opacity: 0.75; text-decoration: underline; }

        /* Error */
        .error-box {
          display: flex;
          align-items: center;
          gap: 9px;
          background: var(--error-bg);
          border: 1px solid rgba(248, 113, 113, 0.2);
          border-radius: var(--radius-sm);
          padding: 9px 13px;
          animation: shake 0.4s ease;
        }
        .error-text { font-size: 13px; color: var(--error); line-height: 1.4; }

        /* Submit button */
        .login-btn {
          position: relative;
          overflow: hidden;
          width: 100%;
          background: var(--accent);
          color: #0B0F1A;
          border: none;
          border-radius: var(--radius-sm);
          padding: 13px;
          font-family: "Sora", sans-serif;
          font-size: 14.5px;
          font-weight: 700;
          cursor: pointer;
          margin-top: 3px;
          box-shadow: var(--shadow-btn);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background var(--transition), box-shadow var(--transition), transform var(--transition);
        }
        .login-btn::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
          transform: translateX(-100%);
          transition: transform 0.5s ease;
        }
        .login-btn:hover::after { transform: translateX(100%); }
        .login-btn:hover:not(:disabled) {
          background: var(--accent-hover);
          box-shadow: 0 6px 28px rgba(245, 158, 11, 0.45);
          transform: translateY(-1px);
        }
        .login-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        /* Spinner */
        .login-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(0, 0, 0, 0.2);
          border-top-color: #0B0F1A;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        /* Divider */
        .login-divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 6px 0;
        }
        .login-divider-line { flex: 1; height: 1px; background: var(--border); }
        .login-divider-text { font-size: 11px; color: var(--text-muted); font-weight: 500; white-space: nowrap; }

        /* Role pills */
        .role-pills { display: flex; gap: 7px; flex-wrap: wrap; margin-top: 10px; }
        .role-pill {
          flex: 1;
          min-width: 88px;
          background: var(--bg-input);
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 7px 9px;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: border-color var(--transition), background var(--transition);
        }
        .role-pill:hover {
          border-color: var(--accent);
          background: var(--accent-soft);
        }
        .role-pill-dot   { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .role-pill-label { font-size: 11px; font-weight: 600; color: var(--text-secondary); white-space: nowrap; }

        /* Footer */
        .login-footer {
          margin-top: 16px;
          text-align: center;
          font-size: 11.5px;
          color: var(--text-muted);
          line-height: 1.6;
        }
        .login-footer address { font-style: normal; }

        @media (max-width: 480px) {
          .login-card  { padding: 28px 18px 24px; }
          .brand-name-en { font-size: 13.5px; }
        }
      `}</style>

      <div className="login-root">
        <div className="login-grid" aria-hidden="true" />

        <div className="login-card">
          <div className="card-accent-bar" />

          {/* ── Brand ── */}
          <div className="brand">
            <div className="brand-logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={appConfig.logo}
                alt={appConfig.schoolNameEn}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
              <svg
                width="26"
                height="26"
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
            </div>

            <p className="brand-name-en">{appConfig.schoolNameEn}</p>
            {appConfig.schoolNameBn && (
              <p className="brand-name-bn">{appConfig.schoolNameBn}</p>
            )}

            <div className="brand-meta">
              {appConfig.established && (
                <span className="brand-chip">Est. {appConfig.established}</span>
              )}
              {appConfig.phone && (
                <span className="brand-chip">📞 {appConfig.phone}</span>
              )}
            </div>
          </div>

          {/* ── Form header ── */}
          <div className="form-header">
            <h1 className="form-title">Welcome back</h1>
            <p className="form-sub">
              Sign in to access your school management portal
            </p>
          </div>

          {/* ── Form ── */}
          <form className="login-form" onSubmit={handleLogin} noValidate>
            {/* Email */}
            <div className="field">
              <label className="field-label">Email Address</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
                <input
                  type="email"
                  className="field-input"
                  placeholder="admin@school.edu"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  autoComplete="email"
                  inputMode="email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="field">
              <label className="field-label">Password</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="field-input pr"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="toggle-pw"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <a href="#" className="forgot-link">
              Forgot password?
            </a>

            {/* Error */}
            {error && (
              <div className="error-box" role="alert">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ flexShrink: 0, color: "var(--error)" }}
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span className="error-text">{error}</span>
              </div>
            )}

            {/* Submit */}
            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="login-spinner" />
                  <span>Authenticating…</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
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
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* ── Role pills ── */}
          <div className="login-divider" style={{ marginTop: 18 }}>
            <div className="login-divider-line" />
            <span className="login-divider-text">Portal Access Roles</span>
            <div className="login-divider-line" />
          </div>

          <div className="role-pills">
            {[
              { label: "School Admin", color: "#F59E0B" },
              { label: "Teacher", color: "#60A5FA" },
              { label: "Student", color: "#34D399" },
              { label: "Parent", color: "#A78BFA" },
            ].map((r) => (
              <div key={r.label} className="role-pill">
                <div
                  className="role-pill-dot"
                  style={{ background: r.color }}
                />
                <span className="role-pill-label">{r.label}</span>
              </div>
            ))}
          </div>

          {/* ── Footer ── */}
          <div className="login-footer">
            <address>
              <strong>{appConfig.schoolNameEn}</strong>
              {appConfig.address && (
                <>
                  {" · "}
                  {appConfig.address}
                </>
              )}
            </address>
          </div>
        </div>
      </div>
    </>
  );
}
