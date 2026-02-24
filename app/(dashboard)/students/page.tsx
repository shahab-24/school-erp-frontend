"use client";

import { useState } from "react";
import { useGetStudentsQuery } from "@/lib/services/studentApi";
import Link from "next/link";
import { appConfig } from "@/lib/config/appConfig";
// ← env-based config

export default function StudentListPage() {
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const { data, isLoading } = useGetStudentsQuery({
    search,
    class: classFilter,
  });

  const students: any[] = data?.data ?? [];

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    if (!q) return true;
    return (
      s.studentUid?.toLowerCase().includes(q) ||
      s.name?.en?.toLowerCase().includes(q) ||
      s.name?.bn?.includes(q)
    );
  });

  return (
    <>
      <style>{`
        .sl-page { animation: pageEnter 0.3s ease both; }
        .sl-header { display:flex; align-items:flex-start; justify-content:space-between; gap:14px; margin-bottom:22px; flex-wrap:wrap; }
        .sl-title    { font-size:22px; font-weight:700; color:var(--text-primary); letter-spacing:-0.5px; }
        .sl-subtitle { font-size:12.5px; color:var(--text-muted); margin-top:3px; }
        .sl-header-actions { display:flex; gap:9px; flex-wrap:wrap; }
        .sl-stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:12px; margin-bottom:18px; }
        .sl-stat { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-sm); padding:13px 15px; transition:border-color var(--transition); }
        .sl-stat:hover { border-color:var(--border-hover); }
        .sl-stat-val   { font-size:22px; font-weight:700; color:var(--text-primary); font-family:'JetBrains Mono',monospace; letter-spacing:-1px; }
        .sl-stat-label { font-size:11.5px; color:var(--text-muted); margin-top:3px; font-weight:500; }
        .sl-stat-accent .sl-stat-val { color:var(--accent); }
        .sl-filters { display:flex; gap:10px; margin-bottom:16px; flex-wrap:wrap; }
        .sl-search-wrap { position:relative; flex:1; min-width:200px; }
        .sl-search-icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:var(--text-muted); pointer-events:none; }
        .sl-search { padding-left:38px !important; }
        .sl-table-wrap { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius); box-shadow:var(--shadow-card); overflow:hidden; }
        .sl-table { width:100%; border-collapse:collapse; font-size:13.5px; }
        .sl-table thead tr { border-bottom:1px solid var(--border); }
        .sl-table th { padding:11px 15px; text-align:left; font-size:10.5px; font-weight:700; letter-spacing:0.8px; text-transform:uppercase; color:var(--text-muted); white-space:nowrap; background:var(--bg-card); }
        .sl-table td { padding:12px 15px; color:var(--text-secondary); border-bottom:1px solid var(--border); vertical-align:middle; }
        .sl-table tr:last-child td { border-bottom:none; }
        .sl-table tbody tr { transition:background var(--transition); cursor:pointer; }
        .sl-table tbody tr:hover td { background:var(--accent-soft); }
        .sl-uid { font-family:'JetBrains Mono',monospace; font-size:11.5px; color:var(--accent); background:var(--accent-soft); border:1px solid rgba(245,158,11,0.15); border-radius:5px; padding:2px 8px; white-space:nowrap; }
        .sl-name-en { font-weight:600; color:var(--text-primary); }
        .sl-name-bn { font-size:11.5px; color:var(--text-muted); margin-top:1px; }
        .sl-class-badge { display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; background:var(--accent-soft); color:var(--accent); border-radius:7px; font-weight:700; font-size:13px; border:1px solid rgba(245,158,11,0.2); }
        .sl-roll { font-family:'JetBrains Mono',monospace; font-size:13px; }
        .sl-action-btn { padding:5px 10px; border-radius:6px; font-size:12px; font-weight:600; font-family:'Sora',sans-serif; border:1px solid var(--border); background:none; color:var(--text-muted); cursor:pointer; transition:all var(--transition); text-decoration:none; display:inline-flex; align-items:center; gap:4px; white-space:nowrap; }
        .sl-action-btn:hover { color:var(--accent); border-color:var(--accent); background:var(--accent-soft); }
        .sl-empty { text-align:center; padding:56px 20px; }
        .sl-empty-icon { color:var(--text-muted); margin:0 auto 14px; }
        .sl-empty-text { font-size:13.5px; color:var(--text-muted); }
        @media(max-width:768px){ .sl-table th:nth-child(4),.sl-table td:nth-child(4),.sl-table th:nth-child(5),.sl-table td:nth-child(5){ display:none; } }
        @media(max-width:520px){ .sl-stats{ grid-template-columns:repeat(2,1fr); } }
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
      `}</style>

      <div className="sl-page">
        {/* Header — school name from appConfig */}
        <div className="sl-header">
          <div>
            <h1 className="sl-title">Students</h1>
            <p className="sl-subtitle">{appConfig.schoolNameEn}</p>
          </div>
          <div className="sl-header-actions">
            <button className="erp-btn-ghost">
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
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export
            </button>
            <Link href="/students/create" className="erp-btn-primary">
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
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add Student
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="sl-stats">
          {[
            { val: students.length, label: "Total Students", accent: true },
            {
              val: students.filter((s: any) => s.gender === "male").length,
              label: "Male",
            },
            {
              val: students.filter((s: any) => s.gender === "female").length,
              label: "Female",
            },
            {
              val: [...new Set(students.map((s: any) => s.current?.class))]
                .length,
              label: "Active Classes",
            },
          ].map((st, i) => (
            <div
              key={i}
              className={`sl-stat ${st.accent ? "sl-stat-accent" : ""}`}
            >
              <div className="sl-stat-val">{isLoading ? "—" : st.val}</div>
              <div className="sl-stat-label">{st.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="sl-filters">
          <div className="sl-search-wrap">
            <span className="sl-search-icon">
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
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </span>
            <input
              className="erp-input sl-search"
              placeholder="Search by name, UID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="erp-input erp-select"
            style={{ minWidth: 130 }}
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
          >
            <option value="">All Classes</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((c) => (
              <option key={c} value={c}>
                Class {c}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="sl-table-wrap">
          {isLoading ? (
            <div style={{ padding: "0" }}>
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: "12px",
                    padding: "13px 15px",
                    borderBottom: "1px solid var(--border)",
                    alignItems: "center",
                  }}
                >
                  {[80, 180, 40, 50, 70, 60].map((w, j) => (
                    <div
                      key={j}
                      style={{
                        height: 16,
                        width: w,
                        borderRadius: 5,
                        background: "var(--border)",
                        animation: `pulse 1.5s ease infinite ${
                          (i + j) * 0.06
                        }s`,
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="sl-empty">
              <svg
                className="sl-empty-icon"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
              <p className="sl-empty-text">
                No students found{search ? ` for "${search}"` : ""}
              </p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="sl-table">
                <thead>
                  <tr>
                    <th>Student UID</th>
                    <th>Name</th>
                    <th>Class</th>
                    <th>Roll</th>
                    <th>Session</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((student: any) => (
                    <tr
                      key={student.studentUid}
                      onClick={() =>
                        (window.location.href = `/dashboard/students/${student.studentUid}`)
                      }
                    >
                      <td>
                        <span className="sl-uid">{student.studentUid}</span>
                      </td>
                      <td>
                        <div className="sl-name-en">{student.name?.en}</div>
                        <div className="sl-name-bn">{student.name?.bn}</div>
                      </td>
                      <td>
                        <span className="sl-class-badge">
                          {student.current?.class}
                        </span>
                      </td>
                      <td>
                        <span className="sl-roll">{student.current?.roll}</span>
                      </td>
                      <td>
                        <span className="erp-badge erp-badge-blue">
                          {student.current?.session}
                        </span>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <Link
                          href={`/dashboard/students/${student.studentUid}`}
                          className="sl-action-btn"
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
