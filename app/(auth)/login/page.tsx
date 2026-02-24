"use client";

import { useLoginMutation } from "@/lib/services/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/lib/features/authSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { appConfig } from "@/lib/config/appConfig";


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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg-primary: #0B0F1A; --bg-card: #161D2E; --bg-input: #1A2236;
          --border: #243050; --border-focus: #F59E0B;
          --text-primary: #F1F5F9; --text-secondary: #94A3B8; --text-muted: #64748B;
          --accent: #F59E0B; --accent-hover: #FBBF24;
          --accent-glow: rgba(245,158,11,0.18); --accent-soft: rgba(245,158,11,0.08);
          --error: #F87171; --error-bg: rgba(248,113,113,0.08);
          --shadow-card: 0 24px 64px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.04) inset;
          --shadow-btn: 0 4px 24px rgba(245,158,11,0.35);
          --radius-sm: 8px; --transition: 0.22s cubic-bezier(0.4,0,0.2,1);
        }
        [data-theme="light"] {
          --bg-primary: #F0F4FF; --bg-card: #FFFFFF; --bg-input: #F7F9FF;
          --border: #D1DAF0; --border-focus: #D97706;
          --text-primary: #0F172A; --text-secondary: #475569; --text-muted: #94A3B8;
          --accent: #D97706; --accent-hover: #B45309;
          --accent-glow: rgba(217,119,6,0.14); --accent-soft: rgba(217,119,6,0.07);
          --error: #DC2626; --error-bg: rgba(220,38,38,0.07);
          --shadow-card: 0 20px 60px rgba(15,23,42,0.12), 0 1px 0 rgba(255,255,255,0.8) inset;
          --shadow-btn: 0 4px 20px rgba(217,119,6,0.3);
        }

        .login-root {
          font-family: 'Sora', sans-serif; min-height: 100dvh;
          display: flex; align-items: center; justify-content: center;
          background-color: var(--bg-primary);
          background-image:
            radial-gradient(ellipse 80% 60% at 20% 0%, rgba(245,158,11,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 100%, rgba(99,102,241,0.07) 0%, transparent 60%);
          padding: 24px 16px; position: relative; overflow: hidden;
        }
        .grid-bg {
          position: fixed; inset: 0; pointer-events: none;
          background-image: linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 100% 100% at 50% 50%, black 30%, transparent 80%);
        }
        [data-theme="light"] .grid-bg {
          background-image: linear-gradient(rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.04) 1px, transparent 1px);
        }
        .login-card {
          position: relative; width: 100%; max-width: 440px;
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: 20px; padding: 36px 34px 32px;
          box-shadow: var(--shadow-card);
          animation: cardIn 0.55s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        @keyframes cardIn { from{opacity:0;transform:translateY(28px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        .card-accent-bar {
          position:absolute; top:0; left:34px; right:34px; height:2px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
        }

        /* ── Brand ── */
        .brand-section { display:flex; flex-direction:column; align-items:center; gap:8px; margin-bottom:26px; }
        .brand-logo-wrap {
          width:62px; height:62px; border-radius:16px; overflow:hidden;
          border: 1.5px solid rgba(245,158,11,0.25); background: var(--accent-soft);
          display:flex; align-items:center; justify-content:center;
          box-shadow: 0 0 0 6px var(--accent-glow);
          animation: iconPulse 3s ease-in-out infinite;
        }
        @keyframes iconPulse { 0%,100%{box-shadow:0 0 0 6px var(--accent-glow)} 50%{box-shadow:0 0 0 12px var(--accent-glow)} }
        .brand-logo-wrap img { width:100%; height:100%; object-fit:contain; padding:10px; }
        .brand-logo-wrap svg { color: var(--accent); }
        .brand-name-en { font-size:15px; font-weight:700; color:var(--text-primary); letter-spacing:-0.3px; text-align:center; line-height:1.3; max-width:300px; }
        .brand-name-bn  { font-size:13px; color:var(--text-secondary); text-align:center; }
        .brand-meta     { display:flex; align-items:center; gap:7px; flex-wrap:wrap; justify-content:center; }
        .brand-meta-chip {
          font-family:'JetBrains Mono',monospace; font-size:10.5px; color:var(--text-muted);
          background:var(--accent-soft); border:1px solid rgba(245,158,11,0.12);
          border-radius:5px; padding:2px 7px;
        }

        /* ── Form ── */
        .form-header  { margin-bottom:20px; }
        .form-title   { font-size:20px; font-weight:700; color:var(--text-primary); letter-spacing:-0.4px; }
        .form-subtitle{ font-size:13px; color:var(--text-secondary); margin-top:4px; }
        .form { display:flex; flex-direction:column; gap:13px; }
        .field-group  { display:flex; flex-direction:column; gap:5px; }
        .field-label  { font-size:11.5px; font-weight:600; color:var(--text-secondary); letter-spacing:0.3px; text-transform:uppercase; }
        .input-wrap   { position:relative; display:flex; align-items:center; }
        .input-icon   { position:absolute; left:13px; color:var(--text-muted); pointer-events:none; display:flex; transition:color var(--transition); }
        .input-wrap:focus-within .input-icon { color: var(--accent); }
        .field-input  {
          width:100%; background:var(--bg-input); border:1.5px solid var(--border);
          border-radius:var(--radius-sm); padding:11px 13px 11px 40px;
          font-family:'Sora',sans-serif; font-size:14px; color:var(--text-primary);
          transition: border-color var(--transition), box-shadow var(--transition);
          outline:none; -webkit-appearance:none;
        }
        .field-input::placeholder { color:var(--text-muted); }
        .field-input:focus { border-color:var(--border-focus); box-shadow:0 0 0 3px var(--accent-glow); }
        .password-input { padding-right:44px; }
        .input-right-icon {
          position:absolute; right:12px; background:none; border:none;
          cursor:pointer; color:var(--text-muted); padding:4px; display:flex;
          transition:color var(--transition); border-radius:4px;
        }
        .input-right-icon:hover { color:var(--accent); }
        .forgot-link {
          align-self:flex-end; font-size:12px; color:var(--accent);
          text-decoration:none; font-weight:500; margin-top:-3px;
        }
        .forgot-link:hover { text-decoration:underline; }
        .error-box {
          display:flex; align-items:center; gap:8px;
          background:var(--error-bg); border:1px solid rgba(248,113,113,0.2);
          border-radius:var(--radius-sm); padding:9px 13px;
          animation: shake 0.4s ease;
        }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-5px)} 40%{transform:translateX(5px)} 60%{transform:translateX(-3px)} 80%{transform:translateX(3px)} }
        .error-text { font-size:13px; color:var(--error); }
        .login-btn {
          width:100%; background:var(--accent); color:#0B0F1A; border:none;
          border-radius:var(--radius-sm); padding:13px;
          font-family:'Sora',sans-serif; font-size:14.5px; font-weight:700;
          cursor:pointer; margin-top:3px; box-shadow:var(--shadow-btn);
          display:flex; align-items:center; justify-content:center; gap:8px;
          transition: background var(--transition), box-shadow var(--transition), transform var(--transition);
          position:relative; overflow:hidden;
        }
        .login-btn::after {
          content:''; position:absolute; inset:0;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent);
          transform:translateX(-100%); transition:transform 0.5s ease;
        }
        .login-btn:hover::after { transform:translateX(100%); }
        .login-btn:hover:not(:disabled) { background:var(--accent-hover); transform:translateY(-1px); box-shadow:0 6px 28px rgba(245,158,11,0.45); }
        .login-btn:disabled { opacity:0.7; cursor:not-allowed; }
        .spinner { width:16px; height:16px; border:2px solid rgba(0,0,0,0.2); border-top-color:#0B0F1A; border-radius:50%; animation:spin 0.7s linear infinite; }
        @keyframes spin { to{transform:rotate(360deg)} }

        .divider { display:flex; align-items:center; gap:10px; margin:5px 0; }
        .divider-line { flex:1; height:1px; background:var(--border); }
        .divider-text { font-size:11px; color:var(--text-muted); font-weight:500; white-space:nowrap; }

        .role-pills { display:flex; gap:7px; flex-wrap:wrap; }
        .role-pill { flex:1; min-width:88px; background:var(--bg-input); border:1px solid var(--border); border-radius:6px; padding:7px 9px; display:flex; align-items:center; gap:6px; transition:border-color var(--transition),background var(--transition); }
        .role-pill:hover { border-color:var(--accent); background:var(--accent-soft); }
        .role-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; }
        .role-pill-label { font-size:11px; font-weight:600; color:var(--text-secondary); white-space:nowrap; }

        .card-footer { margin-top:16px; text-align:center; font-size:11.5px; color:var(--text-muted); line-height:1.6; }
        .card-footer address { font-style:normal; }

        @media(max-width:480px) {
          .login-card { padding:28px 18px 24px; }
          .brand-name-en { font-size:13.5px; }
        }
      `}</style>

      <div className="login-root">
        <div className="grid-bg" />
        <div className="login-card">
          <div className="card-accent-bar" />

          {/* ── BRAND SECTION — driven by appConfig ── */}
          <div className="brand-section">
            <div className="brand-logo-wrap">
              {appConfig.logo !== "/logo.png" || true ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={appConfig.logo}
                  alt={appConfig.schoolNameEn}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
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
              )}
            </div>

            <div className="brand-name-en">{appConfig.schoolNameEn}</div>
            {appConfig.schoolNameBn && (
              <div className="brand-name-bn">{appConfig.schoolNameBn}</div>
            )}

            <div className="brand-meta">
              {appConfig.established && (
                <span className="brand-meta-chip">
                  Est. {appConfig.established}
                </span>
              )}
              {appConfig.phone && (
                <span className="brand-meta-chip">📞 {appConfig.phone}</span>
              )}
            </div>
          </div>

          <div className="form-header">
            <h1 className="form-title">Welcome back</h1>
            <p className="form-subtitle">
              Sign in to access your school management portal
            </p>
          </div>

          <form className="form" onSubmit={handleLogin} noValidate>
            <div className="field-group">
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

            <div className="field-group">
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
                  className="field-input password-input"
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
                  className="input-right-icon"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label="Toggle password"
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

            {error && (
              <div className="error-box" role="alert">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#F87171"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ flexShrink: 0 }}
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span className="error-text">{error}</span>
              </div>
            )}

            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="spinner" />
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

          <div className="divider" style={{ marginTop: "16px" }}>
            <div className="divider-line" />
            <span className="divider-text">Portal Access Roles</span>
            <div className="divider-line" />
          </div>

          <div className="role-pills" style={{ marginTop: "10px" }}>
            {[
              { label: "School Admin", color: "#F59E0B" },
              { label: "Teacher", color: "#60A5FA" },
              { label: "Student", color: "#34D399" },
              { label: "Parent", color: "#A78BFA" },
            ].map((r) => (
              <div key={r.label} className="role-pill">
                <div className="role-dot" style={{ background: r.color }} />
                <span className="role-pill-label">{r.label}</span>
              </div>
            ))}
          </div>

          {/* ── FOOTER — env based ── */}
          <div className="card-footer">
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
