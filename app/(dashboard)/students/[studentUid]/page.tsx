"use client";

import { useParams } from "next/navigation";
import { useGetStudentByUidQuery } from "@/lib/services/studentApi";

const STATUS_COLORS: Record<string, string> = {
  active: "#22C55E",
  repeat: "#F59E0B",
  passed: "#3B82F6",
  transferred: "#8B5CF6",
  archived: "#6B7280",
};

export default function StudentOverviewPage() {
  const { studentUid } = useParams<{ studentUid: string }>();
  const { data: student, isLoading } = useGetStudentByUidQuery(studentUid);

  if (isLoading) return <OverviewSkeleton />;
  if (!student) return null;

  return (
    <>
      <style>{`
        .ov-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(270px,1fr)); gap:14px; animation:pageEnter .3s ease both; }
        .ov-card { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-sm); padding:18px; box-shadow:var(--shadow-sm); }
        .ov-row { display:flex; justify-content:space-between; align-items:center; padding:9px 0; border-bottom:1px solid var(--border); }
        .ov-row:last-child  { border-bottom:none; padding-bottom:0; }
        .ov-row:first-child { padding-top:0; }
        .ov-key { font-size:12px; color:var(--text-muted); font-weight:500; }
        .ov-val { font-size:13px; color:var(--text-primary); font-weight:600; text-align:right; }
      `}</style>

      <div className="ov-grid">
        <div className="ov-card">
          <div className="erp-section-title">Personal Info</div>
          {(
            [
              [
                "Birth Date",
                student.birthDate
                  ? new Date(student.birthDate).toLocaleDateString("en-GB")
                  : undefined,
              ],
              ["Birth Reg.", student.birthRegistration],
              ["Gender", student.gender],
              ["Religion", student.religion],
              ["Language", (student.languagePreference ?? "bn").toUpperCase()],
            ] as [string, any][]
          ).map(([k, v]) => (
            <div key={k} className="ov-row">
              <span className="ov-key">{k}</span>
              <span
                className="ov-val"
                style={{
                  textTransform: k === "Gender" ? "capitalize" : undefined,
                }}
              >
                {v ?? "—"}
              </span>
            </div>
          ))}
        </div>

        <div className="ov-card">
          <div className="erp-section-title">Father's Info</div>
          {(
            [
              ["Name (EN)", student.father?.name?.en],
              ["Name (BN)", student.father?.name?.bn],
              ["Mobile", student.father?.mobile],
              ["NID", student.father?.nid],
              ["Birth Reg.", student.father?.birthRegistration],
            ] as [string, any][]
          ).map(([k, v]) => (
            <div key={k} className="ov-row">
              <span className="ov-key">{k}</span>
              <span className="ov-val">{v ?? "—"}</span>
            </div>
          ))}
        </div>

        <div className="ov-card">
          <div className="erp-section-title">Mother's Info</div>
          {(
            [
              ["Name (EN)", student.mother?.name?.en],
              ["Name (BN)", student.mother?.name?.bn],
              ["Mobile", student.mother?.mobile],
              ["NID", student.mother?.nid],
              ["Birth Reg.", student.mother?.birthRegistration],
            ] as [string, any][]
          ).map(([k, v]) => (
            <div key={k} className="ov-row">
              <span className="ov-key">{k}</span>
              <span className="ov-val">{v ?? "—"}</span>
            </div>
          ))}
        </div>

        <div className="ov-card">
          <div className="erp-section-title">Enrollment</div>
          {(
            [
              ["Session", student.current?.session],
              ["Class", `Class ${student.current?.class}`],
              ["Roll No.", student.current?.roll],
              ["Status", student.status],
            ] as [string, any][]
          ).map(([k, v]) => (
            <div key={k} className="ov-row">
              <span className="ov-key">{k}</span>
              <span
                className="ov-val"
                style={
                  k === "Status"
                    ? {
                        color: STATUS_COLORS[v] ?? "var(--text-primary)",
                        textTransform: "capitalize",
                      }
                    : {}
                }
              >
                {v ?? "—"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function OverviewSkeleton() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))",
        gap: 14,
      }}
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            padding: 18,
          }}
        >
          <div
            style={{
              height: 12,
              width: 100,
              borderRadius: 5,
              background: "var(--border)",
              animation: `pulse 1.5s ease infinite ${i * 0.08}s`,
              marginBottom: 14,
            }}
          />
          {Array.from({ length: 5 }).map((_, j) => (
            <div
              key={j}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "9px 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  height: 11,
                  width: 70,
                  borderRadius: 4,
                  background: "var(--border)",
                  animation: `pulse 1.5s ease infinite ${j * 0.05}s`,
                }}
              />
              <div
                style={{
                  height: 11,
                  width: 90,
                  borderRadius: 4,
                  background: "var(--border)",
                  animation: `pulse 1.5s ease infinite ${j * 0.05}s`,
                }}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
