"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useGetStudentsQuery } from "@/lib/services/studentApi";
import type { Student } from "@/types/student.types";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  active:      { label: "Active",      color: "#22C55E" },
  repeat:      { label: "Repeat",      color: "#F59E0B" },
  passed:      { label: "Passed",      color: "#3B82F6" },
  transferred: { label: "Transferred", color: "#8B5CF6" },
  archived:    { label: "Archived",    color: "#6B7280" },
};

const CLASSES  = Array.from({ length: 10 }, (_, i) => i + 1);
const SESSIONS = ["2024", "2025", "2026"];
const GENDERS  = ["male", "female", "other"];
const STATUSES = ["active", "repeat", "passed", "transferred", "archived"];

export default function StudentsPage() {
  const [search,        setSearch]        = useState("");
  const [classFilter,   setClassFilter]   = useState("");
  const [sessionFilter, setSessionFilter] = useState("");
  const [genderFilter,  setGenderFilter]  = useState("");
  const [statusFilter,  setStatusFilter]  = useState("active");
  const [viewMode,      setViewMode]      = useState<"table" | "grid">("table");

  // useGetStudentsQuery() → ApiResponse<Student[]> → .data is Student[]
  const { data: res, isLoading, isFetching } = useGetStudentsQuery();
  const allStudents: Student[] = res?.data ?? [];

  const students = useMemo(() => {
    let list = allStudents;
    if (classFilter)   list = list.filter((s) => String(s.current?.class)   === classFilter);
    if (sessionFilter) list = list.filter((s) => s.current?.session          === sessionFilter);
    if (genderFilter)  list = list.filter((s) => s.gender                    === genderFilter);
    if (statusFilter)  list = list.filter((s) => s.status                    === statusFilter);
    if (search.trim()) {
      const t = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name?.en?.toLowerCase().includes(t)  ||
          s.name?.bn?.includes(t)                 ||
          s.studentUid?.toLowerCase().includes(t) ||
          s.father?.mobile?.includes(t)
      );
    }
    return list;
  }, [allStudents, search, classFilter, sessionFilter, genderFilter, statusFilter]);

  return (
    <>
      <style>{`
        .sl-page { animation:pageEnter .3s ease both; }
        .sl-header { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; margin-bottom:20px; }
        .sl-title  { font-size:20px; font-weight:800; color:var(--text-primary); letter-spacing:-.5px; }
        .sl-subtitle { font-size:12.5px; color:var(--text-muted); margin-top:2px; }
        .sl-stats { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:18px; }
        .sl-stat  { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-sm); padding:10px 16px; min-width:90px; }
        .sl-stat-val   { font-size:22px; font-weight:800; color:var(--text-primary); font-family:'JetBrains Mono',monospace; letter-spacing:-1px; line-height:1; }
        .sl-stat-label { font-size:10px; color:var(--text-muted); text-transform:uppercase; letter-spacing:.6px; font-weight:600; margin-top:3px; }
        .sl-toolbar { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-sm); padding:12px 14px; margin-bottom:14px; display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
        .sl-search-wrap { flex:1; min-width:200px; position:relative; }
        .sl-search-icon { position:absolute; left:10px; top:50%; transform:translateY(-50%); color:var(--text-muted); pointer-events:none; }
        .sl-search  { width:100%; padding:8px 10px 8px 34px; background:var(--bg-input); border:1px solid var(--border); border-radius:8px; font-size:13px; color:var(--text-primary); outline:none; transition:border-color var(--transition); }
        .sl-search::placeholder { color:var(--text-muted); }
        .sl-search:focus { border-color:var(--accent); }
        .sl-select { padding:8px 10px; background:var(--bg-input); border:1px solid var(--border); border-radius:8px; font-size:12.5px; color:var(--text-primary); outline:none; cursor:pointer; }
        .sl-select:focus { border-color:var(--accent); }
        .sl-view-btns { display:flex; gap:2px; background:var(--bg-input); border:1px solid var(--border); border-radius:8px; padding:3px; }
        .sl-view-btn { padding:5px 9px; border-radius:5px; border:none; background:transparent; cursor:pointer; color:var(--text-muted); transition:all var(--transition); display:flex; align-items:center; }
        .sl-view-btn.active { background:var(--accent); color:#0B0F1A; }
        .sl-table-wrap { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius); overflow:hidden; box-shadow:var(--shadow-card); }
        .sl-table { width:100%; border-collapse:collapse; }
        .sl-table thead th { padding:11px 14px; font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:.5px; text-align:left; background:var(--bg-table-head); border-bottom:1px solid var(--border); white-space:nowrap; }
        .sl-table tbody tr { border-bottom:1px solid var(--border); transition:background var(--transition); cursor:pointer; }
        .sl-table tbody tr:last-child { border-bottom:none; }
        .sl-table tbody tr:hover { background:var(--bg-row-hover); }
        .sl-table td { padding:11px 14px; font-size:13px; color:var(--text-primary); vertical-align:middle; }
        .sl-avatar-sm { width:34px; height:34px; border-radius:9px; background:linear-gradient(135deg,var(--accent) 0%,#EA580C 100%); display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:800; color:#0B0F1A; flex-shrink:0; }
        .sl-name-cell { display:flex; align-items:center; gap:10px; }
        .sl-name-en { font-weight:600; font-size:13px; }
        .sl-uid { font-size:11.5px; color:var(--text-muted); font-family:'JetBrains Mono',monospace; }
        .sl-mobile { font-size:12px; color:var(--text-secondary); font-family:'JetBrains Mono',monospace; }
        .sl-class-badge { display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; border-radius:7px; background:var(--accent-soft); color:var(--accent); font-size:13px; font-weight:800; font-family:'JetBrains Mono',monospace; }
        .sl-roll { font-family:'JetBrains Mono',monospace; font-size:12.5px; color:var(--text-secondary); }
        .sl-status-dot { display:inline-flex; align-items:center; gap:5px; font-size:12px; font-weight:600; }
        .sl-status-dot::before { content:''; width:6px; height:6px; border-radius:50%; background:currentColor; display:inline-block; }
        .sl-action-btn { padding:5px 7px; border-radius:6px; border:1px solid var(--border); background:var(--bg-input); color:var(--text-muted); cursor:pointer; transition:all var(--transition); display:flex; align-items:center; text-decoration:none; }
        .sl-action-btn:hover { color:var(--accent); border-color:var(--accent); background:var(--accent-soft); }
        .sl-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:12px; }
        .sl-grid-card { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-sm); padding:16px; box-shadow:var(--shadow-sm); transition:all var(--transition); text-decoration:none; display:block; }
        .sl-grid-card:hover { border-color:var(--accent); transform:translateY(-1px); box-shadow:var(--shadow-card); }
        .sl-grid-card-top { display:flex; align-items:flex-start; gap:12px; margin-bottom:12px; }
        .sl-grid-avatar { width:44px; height:44px; border-radius:11px; background:linear-gradient(135deg,var(--accent) 0%,#EA580C 100%); display:flex; align-items:center; justify-content:center; font-size:17px; font-weight:800; color:#0B0F1A; flex-shrink:0; }
        .sl-grid-info { flex:1; min-width:0; }
        .sl-grid-name { font-size:14px; font-weight:700; color:var(--text-primary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .sl-grid-sub  { font-size:11.5px; color:var(--text-muted); margin-top:2px; }
        .sl-grid-meta { display:flex; justify-content:space-between; align-items:center; padding-top:10px; border-top:1px solid var(--border); }
        .sl-grid-meta-val { font-size:15px; font-weight:700; color:var(--text-primary); font-family:'JetBrains Mono',monospace; }
        .sl-grid-meta-key { font-size:9.5px; color:var(--text-muted); text-transform:uppercase; letter-spacing:.4px; font-weight:600; }
        .sl-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:60px 20px; gap:12px; color:var(--text-muted); }
        .sl-empty-icon { width:56px; height:56px; border-radius:14px; background:var(--bg-input); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; }
        .sl-shimmer { border-radius:5px; background:var(--border); animation:pulse 1.5s ease infinite; }
        .sl-result-bar { display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
        .sl-result-count { font-size:12px; color:var(--text-muted); }
        .sl-result-count span { color:var(--accent); font-weight:700; }
        @media(max-width:768px){
          .sl-table th:nth-child(4),.sl-table td:nth-child(4),
          .sl-table th:nth-child(5),.sl-table td:nth-child(5){ display:none; }
        }
        @media(max-width:520px){
          .sl-table th:nth-child(3),.sl-table td:nth-child(3){ display:none; }
        }
      `}</style>

      <div className="sl-page">
        <div className="sl-header">
          <div>
            <div className="sl-title">Students</div>
            <div className="sl-subtitle">Manage, enroll &amp; track all students</div>
          </div>
          <Link href="/students/create" className="erp-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            Add Student
          </Link>
        </div>

        {/* Stats */}
        <div className="sl-stats">
          {([
            { label: "Total",       val: allStudents.length },
            { label: "Active",      val: allStudents.filter((s) => s.status === "active").length },
            { label: "Repeat",      val: allStudents.filter((s) => s.status === "repeat").length },
            { label: "Transferred", val: allStudents.filter((s) => s.status === "transferred").length },
          ] as const).map((st) => (
            <div key={st.label} className="sl-stat">
              <div className="sl-stat-val">{st.val}</div>
              <div className="sl-stat-label">{st.label}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="sl-toolbar">
          <div className="sl-search-wrap">
            <svg className="sl-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input className="sl-search" placeholder="Search name, UID, mobile…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="sl-select" value={classFilter}   onChange={(e) => setClassFilter(e.target.value)}>
            <option value="">All Classes</option>
            {CLASSES.map((c) => <option key={c} value={c}>Class {c}</option>)}
          </select>
          <select className="sl-select" value={sessionFilter} onChange={(e) => setSessionFilter(e.target.value)}>
            <option value="">All Sessions</option>
            {SESSIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="sl-select" value={genderFilter}  onChange={(e) => setGenderFilter(e.target.value)}>
            <option value="">All Genders</option>
            {GENDERS.map((g) => <option key={g} value={g} style={{ textTransform: "capitalize" }}>{g}</option>)}
          </select>
          <select className="sl-select" value={statusFilter}  onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            {STATUSES.map((s) => <option key={s} value={s} style={{ textTransform: "capitalize" }}>{s}</option>)}
          </select>
          <div className="sl-view-btns">
            <button className={`sl-view-btn ${viewMode === "table" ? "active" : ""}`} onClick={() => setViewMode("table")} title="Table view">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            </button>
            <button className={`sl-view-btn ${viewMode === "grid" ? "active" : ""}`} onClick={() => setViewMode("grid")} title="Grid view">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            </button>
          </div>
        </div>

        <div className="sl-result-bar">
          <div className="sl-result-count">
            Showing <span>{students.length}</span> of {allStudents.length} students
            {isFetching && !isLoading && <span style={{ marginLeft: 8, color: "var(--accent)", fontSize: 11 }}>Refreshing…</span>}
          </div>
        </div>

        {/* Table */}
        {viewMode === "table" && (
          <div className="sl-table-wrap">
            <table className="sl-table">
              <thead>
                <tr>
                  <th>Student</th><th>Class</th><th>Roll</th>
                  <th>Session</th><th>Father Mobile</th><th>Status</th><th></th>
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i}>
                        {[160,40,40,60,100,70,50].map((w, j) => (
                          <td key={j}><div className="sl-shimmer" style={{ height:13, width:w, animationDelay:`${i*0.05}s` }}/></td>
                        ))}
                      </tr>
                    ))
                  : students.length === 0
                  ? (
                    <tr><td colSpan={7}>
                      <div className="sl-empty">
                        <div className="sl-empty-icon">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        </div>
                        <div style={{ fontSize:15, fontWeight:600, color:"var(--text-secondary)" }}>No students found</div>
                        <div style={{ fontSize:12.5 }}>Try adjusting filters or add a new student</div>
                      </div>
                    </td></tr>
                  )
                  : students.map((s) => {
                    const cfg = STATUS_CONFIG[s.status ?? ""] ?? { label: s.status, color: "var(--text-muted)" };
                    return (
                      <tr key={s.studentUid} onClick={() => window.location.href=`/dashboard/students/${s.studentUid}`}>
                        <td>
                          <div className="sl-name-cell">
                            <div className="sl-avatar-sm">{s.name?.en?.charAt(0).toUpperCase()}</div>
                            <div>
                              <div className="sl-name-en">{s.name?.en}</div>
                              <div className="sl-uid">UID: {s.studentUid}</div>
                            </div>
                          </div>
                        </td>
                        <td><div className="sl-class-badge">{s.current?.class}</div></td>
                        <td><span className="sl-roll">{s.current?.roll}</span></td>
                        <td><span style={{ fontSize:12, color:"var(--text-muted)" }}>{s.current?.session}</span></td>
                        <td><span className="sl-mobile">{s.father?.mobile ?? "—"}</span></td>
                        <td><span className="sl-status-dot" style={{ color: cfg.color }}>{cfg.label}</span></td>
                        <td>
                          <div style={{ display:"flex", gap:6 }} onClick={(e) => e.stopPropagation()}>
                            <Link href={`/students/${s.studentUid}`} className="sl-action-btn" title="View">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}

        {/* Grid */}
        {viewMode === "grid" && (
          <div className="sl-grid">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="sl-grid-card" style={{ cursor:"default" }}>
                    <div style={{ display:"flex", gap:10, marginBottom:12 }}>
                      <div style={{ width:44, height:44, borderRadius:11, background:"var(--border)", animation:`pulse 1.5s ease infinite ${i*0.07}s` }}/>
                      <div style={{ flex:1 }}>
                        <div className="sl-shimmer" style={{ height:14, width:120, marginBottom:7 }}/>
                        <div className="sl-shimmer" style={{ height:10, width:80 }}/>
                      </div>
                    </div>
                    <div className="sl-shimmer" style={{ height:10 }}/>
                  </div>
                ))
              : students.map((s) => {
                const cfg = STATUS_CONFIG[s.status ?? ""] ?? { label: s.status, color:"var(--text-muted)" };
                return (
                  <Link key={s.studentUid} href={`/dashboard/students/${s.studentUid}`} className="sl-grid-card">
                    <div className="sl-grid-card-top">
                      <div className="sl-grid-avatar">{s.name?.en?.charAt(0).toUpperCase()}</div>
                      <div className="sl-grid-info">
                        <div className="sl-grid-name">{s.name?.en}</div>
                        <div className="sl-grid-sub">{s.name?.bn}</div>
                        <div style={{ marginTop:4 }}>
                          <span className="sl-status-dot" style={{ color:cfg.color, fontSize:11 }}>{cfg.label}</span>
                        </div>
                      </div>
                    </div>
                    <div className="sl-grid-meta">
                      {[["Class", s.current?.class],["Roll", s.current?.roll],["Session", s.current?.session]].map(([k,v]) => (
                        <div key={String(k)} style={{ textAlign:"center" }}>
                          <div className="sl-grid-meta-val" style={{ fontSize: k === "Session" ? 12 : undefined }}>{v}</div>
                          <div className="sl-grid-meta-key">{k}</div>
                        </div>
                      ))}
                    </div>
                  </Link>
                );
              })}
          </div>
        )}
      </div>
    </>
  );
}