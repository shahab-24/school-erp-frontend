// loading.tsx — reusable skeleton for student list page
export default function Loading() {
  return (
    <>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        .skel-bar {
          border-radius: 6px;
          background: var(--border, #1E2A40);
          animation: pulse 1.5s ease infinite;
        }
      `}</style>

      <div style={{ animation: "pageEnter 0.3s ease both" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <div
              className="skel-bar"
              style={{ width: 140, height: 22, marginBottom: 8 }}
            />
            <div className="skel-bar" style={{ width: 200, height: 13 }} />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div
              className="skel-bar"
              style={{ width: 90, height: 38, borderRadius: 9 }}
            />
            <div
              className="skel-bar"
              style={{ width: 120, height: 38, borderRadius: 9 }}
            />
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
            gap: 12,
            marginBottom: 20,
          }}
        >
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              style={{
                background: "var(--bg-card,#131929)",
                border: "1px solid var(--border,#1E2A40)",
                borderRadius: 9,
                padding: "14px 16px",
              }}
            >
              <div
                className="skel-bar"
                style={{ width: 60, height: 24, marginBottom: 8 }}
              />
              <div className="skel-bar" style={{ width: 100, height: 12 }} />
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
          <div
            className="skel-bar"
            style={{ flex: 1, height: 42, borderRadius: 9 }}
          />
          <div
            className="skel-bar"
            style={{ width: 130, height: 42, borderRadius: 9 }}
          />
        </div>

        {/* Table */}
        <div
          style={{
            background: "var(--bg-card,#131929)",
            border: "1px solid var(--border,#1E2A40)",
            borderRadius: 14,
            overflow: "hidden",
          }}
        >
          {/* Header row */}
          <div
            style={{
              display: "flex",
              gap: 12,
              padding: "12px 16px",
              borderBottom: "1px solid var(--border,#1E2A40)",
            }}
          >
            {[80, 200, 80, 60, 80].map((w, i) => (
              <div
                key={i}
                className="skel-bar"
                style={{ width: w, height: 12, animationDelay: `${i * 0.05}s` }}
              />
            ))}
          </div>
          {/* Data rows */}
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 12,
                padding: "13px 16px",
                borderBottom: "1px solid var(--border,#1E2A40)",
                alignItems: "center",
              }}
            >
              <div
                className="skel-bar"
                style={{
                  width: 80,
                  height: 22,
                  borderRadius: 5,
                  animationDelay: `${i * 0.05}s`,
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  className="skel-bar"
                  style={{
                    width: 160,
                    height: 14,
                    marginBottom: 5,
                    animationDelay: `${i * 0.05 + 0.05}s`,
                  }}
                />
                <div
                  className="skel-bar"
                  style={{
                    width: 100,
                    height: 11,
                    animationDelay: `${i * 0.05 + 0.1}s`,
                  }}
                />
              </div>
              <div
                className="skel-bar"
                style={{
                  width: 36,
                  height: 28,
                  borderRadius: 7,
                  animationDelay: `${i * 0.05}s`,
                }}
              />
              <div
                className="skel-bar"
                style={{
                  width: 50,
                  height: 14,
                  animationDelay: `${i * 0.05}s`,
                }}
              />
              <div
                className="skel-bar"
                style={{
                  width: 60,
                  height: 22,
                  borderRadius: 20,
                  animationDelay: `${i * 0.05}s`,
                }}
              />
              <div
                className="skel-bar"
                style={{
                  width: 50,
                  height: 30,
                  borderRadius: 7,
                  animationDelay: `${i * 0.05}s`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
