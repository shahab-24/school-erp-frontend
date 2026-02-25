// src/app/(dashboard)/students/loading.tsx
// Next.js automatically shows this while students/page.tsx loads (Suspense boundary).
// Matches the exact layout of StudentsPage to prevent layout shift.

export default function StudentsLoading() {
  return (
    <>
      <style>{`
        .sk-header { display:flex; align-items:flex-start; justify-content:space-between; gap:14px; margin-bottom:22px; flex-wrap:wrap; }
        .sk-block { border-radius:6px; background:var(--border); }
        .sk-pulse { animation:pulse 1.5s ease infinite; }
        .sk-stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:12px; margin-bottom:18px; }
        .sk-stat { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-sm); padding:14px 16px; }
        .sk-table-card { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius); overflow:hidden; }
        .sk-table-row { display:flex; gap:12px; padding:13px 16px; border-bottom:1px solid var(--border); align-items:center; }
        .sk-table-row:last-child { border-bottom:none; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>

      {/* Header skeleton */}
      <div className="sk-header">
        <div>
          <div
            className="sk-block sk-pulse"
            style={{ width: 120, height: 28, marginBottom: 8 }}
          />
          <div
            className="sk-block sk-pulse"
            style={{ width: 220, height: 14 }}
          />
        </div>
        <div style={{ display: "flex", gap: 9 }}>
          <div
            className="sk-block sk-pulse"
            style={{ width: 90, height: 40, borderRadius: 9 }}
          />
          <div
            className="sk-block sk-pulse"
            style={{
              width: 120,
              height: 40,
              borderRadius: 9,
              background: "var(--accent-soft)",
            }}
          />
        </div>
      </div>

      {/* Stats skeleton */}
      <div className="sk-stats">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="sk-stat">
            <div
              className="sk-block sk-pulse"
              style={{
                width: 48,
                height: 28,
                marginBottom: 8,
                animationDelay: `${i * 0.1}s`,
              }}
            />
            <div
              className="sk-block sk-pulse"
              style={{
                width: 90,
                height: 12,
                animationDelay: `${i * 0.1 + 0.05}s`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Filter skeleton */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <div
          className="sk-block sk-pulse"
          style={{ flex: 1, height: 44, borderRadius: 9 }}
        />
        <div
          className="sk-block sk-pulse"
          style={{ width: 130, height: 44, borderRadius: 9 }}
        />
      </div>

      {/* Table skeleton */}
      <div className="sk-table-card">
        {[80, 180, 40, 50, 70].map((_, ri) => (
          <div key={ri} className="sk-table-row">
            {[80, 180, 40, 50, 70, 60].map((w, ci) => (
              <div
                key={ci}
                className="sk-block sk-pulse"
                style={{
                  height: 14,
                  width: w,
                  animationDelay: `${(ri + ci) * 0.05}s`,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
