"use client";

import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { useGetStudentsQuery } from "@/lib/services/studentApi";
import { appConfig } from "@/lib/config/appConfig";
// ← env-based config

const TABS = [
  {
    label: "Overview",
    slug: "",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  {
    label: "Stipend",
    slug: "stipend",
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  { label: "Promote", slug: "promote", icon: "M7 11l5-5m0 0l5 5m-5-5v12" },
  {
    label: "Results",
    slug: "results",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  },
];

export default function StudentDetailsPage() {
  const { studentUid } = useParams<{ studentUid: string }>();
  const pathname = usePathname();
  const { data, isLoading } = useGetStudentsQuery(studentUid);

  if (isLoading) return <Skeleton />;
  if (!data) return <NotFound uid={studentUid} />;

  const base = `/dashboard/students/${studentUid}`;
  const activeSlug = pathname.replace(base, "").replace(/^\//, "");

  return (
    <>
      <style>{`
        .sd-page { animation:pageEnter 0.3s ease both; }
        .sd-back { display:inline-flex; align-items:center; gap:7px; font-size:12.5px; color:var(--text-muted); text-decoration:none; margin-bottom:18px; transition:color var(--transition); }
        .sd-back:hover { color:var(--accent); }
        .sd-hero { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius); padding:22px; margin-bottom:18px; display:flex; align-items:flex-start; gap:18px; flex-wrap:wrap; box-shadow:var(--shadow-card); }
        .sd-avatar { width:58px; height:58px; border-radius:14px; background:linear-gradient(135deg,var(--accent) 0%,#EA580C 100%); display:flex; align-items:center; justify-content:center; font-size:22px; font-weight:800; color:#0B0F1A; flex-shrink:0; }
        .sd-hero-info { flex:1; min-width:0; }
        .sd-name-en { font-size:19px; font-weight:700; color:var(--text-primary); letter-spacing:-0.4px; }
        .sd-name-bn { font-size:13.5px; color:var(--text-muted); margin-top:2px; }
        .sd-chips    { display:flex; align-items:center; gap:7px; margin-top:8px; flex-wrap:wrap; }
        .sd-hero-meta { display:flex; gap:22px; flex-wrap:wrap; margin-left:auto; align-items:flex-start; }
        .sd-meta-item { text-align:right; }
        @media(max-width:640px){ .sd-meta-item{ text-align:left; } }
        .sd-meta-label { font-size:10.5px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; font-weight:600; }
        .sd-meta-val   { font-size:18px; font-weight:700; color:var(--text-primary); font-family:'JetBrains Mono',monospace; margin-top:2px; }
        .sd-meta-sm    { font-size:13.5px; font-weight:600; color:var(--text-primary); margin-top:2px; }
        .sd-school-strip { font-size:11px; color:var(--text-muted); margin-top:6px; }

        .sd-tabs { display:flex; gap:2px; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-sm); padding:4px; margin-bottom:20px; overflow-x:auto; scrollbar-width:none; }
        .sd-tabs::-webkit-scrollbar{ display:none; }
        .sd-tab { display:flex; align-items:center; gap:7px; padding:8px 15px; border-radius:7px; font-size:13px; font-weight:500; color:var(--text-muted); text-decoration:none; transition:all var(--transition); white-space:nowrap; }
        .sd-tab:hover  { color:var(--text-secondary); background:var(--bg-card-hover); }
        .sd-tab.active { color:var(--accent); background:var(--accent-soft); font-weight:600; border:1px solid rgba(245,158,11,0.15); }

        .sd-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(270px,1fr)); gap:14px; }
        .sd-card { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-sm); padding:18px; box-shadow:var(--shadow-sm); }
        .sd-rows { display:flex; flex-direction:column; }
        .sd-row  { display:flex; justify-content:space-between; align-items:center; padding:9px 0; border-bottom:1px solid var(--border); }
        .sd-row:last-child  { border-bottom:none; padding-bottom:0; }
        .sd-row:first-child { padding-top:0; }
        .sd-key { font-size:12px; color:var(--text-muted); font-weight:500; }
        .sd-val { font-size:13px; color:var(--text-primary); font-weight:600; text-align:right; }
      `}</style>

      <div className="sd-page">
        <Link href="/dashboard/students" className="sd-back">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Students
        </Link>

        {/* Hero */}
        <div className="sd-hero">
          <div className="sd-avatar">
            {data.name?.en?.charAt(0).toUpperCase()}
          </div>
          <div className="sd-hero-info">
            <div className="sd-name-en">{data.name?.en}</div>
            <div className="sd-name-bn">{data.name?.bn}</div>
            <div className="sd-chips">
              <span className="erp-badge erp-badge-amber">{data.gender}</span>
              <span className="erp-badge erp-badge-blue">{data.religion}</span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: "11px",
                  color: "var(--text-muted)",
                }}
              >
                UID: {data.studentUid}
              </span>
            </div>
            {/* school name from appConfig */}
            <div className="sd-school-strip">{appConfig.schoolNameEn}</div>
          </div>
          <div className="sd-hero-meta">
            <div className="sd-meta-item">
              <div className="sd-meta-label">Class</div>
              <div className="sd-meta-val">{data.current?.class}</div>
            </div>
            <div className="sd-meta-item">
              <div className="sd-meta-label">Roll</div>
              <div className="sd-meta-val">{data.current?.roll}</div>
            </div>
            <div className="sd-meta-item">
              <div className="sd-meta-label">Session</div>
              <div className="sd-meta-sm">{data.current?.session}</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="sd-tabs">
          {TABS.map((tab) => (
            <Link
              key={tab.slug}
              href={tab.slug ? `${base}/${tab.slug}` : base}
              className={`sd-tab ${activeSlug === tab.slug ? "active" : ""}`}
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
                <path d={tab.icon} />
              </svg>
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Info grid */}
        <div className="sd-grid">
          <div className="sd-card">
            <div className="erp-section-title">Personal Info</div>
            <div className="sd-rows">
              {[
                ["Birth Date", data.birthDate],
                ["Birth Reg", data.birthRegistration],
                ["Gender", data.gender],
                ["Religion", data.religion],
                ["Language", (data.languagePreference ?? "bn").toUpperCase()],
              ].map(([k, v]) => (
                <div key={k} className="sd-row">
                  <span className="sd-key">{k}</span>
                  <span className="sd-val">{v ?? "—"}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="sd-card">
            <div className="erp-section-title">Father's Info</div>
            <div className="sd-rows">
              {[
                ["Name (EN)", data.father?.name?.en],
                ["Name (BN)", data.father?.name?.bn],
                ["Mobile", data.father?.mobile],
                ["NID", data.father?.nid],
                ["Birth Reg", data.father?.birthRegistration],
              ].map(([k, v]) => (
                <div key={k} className="sd-row">
                  <span className="sd-key">{k}</span>
                  <span className="sd-val">{v ?? "—"}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="sd-card">
            <div className="erp-section-title">Mother's Info</div>
            <div className="sd-rows">
              {[
                ["Name (EN)", data.mother?.name?.en],
                ["Name (BN)", data.mother?.name?.bn],
                ["Mobile", data.mother?.mobile],
                ["NID", data.mother?.nid],
                ["Birth Reg", data.mother?.birthRegistration],
              ].map(([k, v]) => (
                <div key={k} className="sd-row">
                  <span className="sd-key">{k}</span>
                  <span className="sd-val">{v ?? "—"}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="sd-card">
            <div className="erp-section-title">Enrollment</div>
            <div className="sd-rows">
              {[
                ["Session", data.current?.session],
                ["Class", `Class ${data.current?.class}`],
                ["Roll No", data.current?.roll],
              ].map(([k, v]) => (
                <div key={k} className="sd-row">
                  <span className="sd-key">{k}</span>
                  <span className="sd-val">{v ?? "—"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Skeleton() {
  return (
    <div style={{ animation: "pageEnter 0.3s ease both" }}>
      <div
        style={{
          height: 14,
          width: 130,
          borderRadius: 6,
          background: "var(--border)",
          marginBottom: 18,
          animation: "pulse 1.5s ease infinite",
        }}
      />
      <div className="erp-card" style={{ padding: 22, marginBottom: 18 }}>
        <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 14,
              background: "var(--border)",
              animation: "pulse 1.5s ease infinite",
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1 }}>
            {[160, 100, 80].map((w, i) => (
              <div
                key={i}
                style={{
                  height: i === 0 ? 18 : 12,
                  width: w,
                  borderRadius: 5,
                  background: "var(--border)",
                  animation: `pulse 1.5s ease infinite ${i * 0.1}s`,
                  marginBottom: 8,
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  );
}

function NotFound({ uid }: { uid: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        gap: 14,
        textAlign: "center",
        animation: "pageEnter 0.3s ease both",
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 18,
          background: "var(--error-bg)",
          border: "1px solid rgba(248,113,113,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--error)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
      </div>
      <div>
        <div
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: 6,
          }}
        >
          Student Not Found
        </div>
        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
          No record for UID:{" "}
          <code
            style={{
              color: "var(--accent)",
              background: "var(--accent-soft)",
              padding: "1px 7px",
              borderRadius: 4,
              fontFamily: "'JetBrains Mono',monospace",
            }}
          >
            {uid}
          </code>
        </div>
      </div>
      <Link
        href="/dashboard/students"
        className="erp-btn-ghost"
        style={{ marginTop: 6 }}
      >
        ← Back to Students
      </Link>
    </div>
  );
}
