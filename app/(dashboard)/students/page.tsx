// src/app/(dashboard)/students/page.tsx
"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ListStudentsQuery,
  useGetClassesQuery,
  useGetSessionsQuery,
  useGetStudentsQuery,
} from "@/lib/services/studentApi";
import type { Student, StudentStatus } from "@/types/student.types";

// ─── Constants ────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  Student["status"],
  { label: string; color: string }
> = {
  active: { label: "Active", color: "#22C55E" },
  repeat: { label: "Repeat", color: "#F59E0B" },
  passed: { label: "Passed", color: "#3B82F6" },
  transferred: { label: "Transferred", color: "#8B5CF6" },
  archived: { label: "Archived", color: "#6B7280" },
};

const GENDERS = ["male", "female", "other"] as const;
const STATUSES = [
  "active",
  "repeat",
  "passed",
  "transferred",
  "archived",
] as const;

const RELIGIONS = ["Islam", "Hindu", "Christian", "Buddhist", "Other"] as const;

const AGE_RANGES = [
  { label: "All Ages", min: undefined, max: undefined },
  { label: "Under 6", min: undefined, max: 5 },
  { label: "6 – 10", min: 6, max: 10 },
  { label: "11 – 14", min: 11, max: 14 },
  { label: "15 – 18", min: 15, max: 18 },
  { label: "Over 18", min: 18, max: undefined },
];

// ─── CSS ─────────────────────────────────────────────────────────

const CSS = `
@keyframes pageEnter { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
@keyframes spin  { to{transform:rotate(360deg)} }
@keyframes slideDown { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:none} }

.sl-page { animation:pageEnter .3s ease both; color:var(--text-primary); background:transparent; }

/* Header */
.sl-header   { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; margin-bottom:20px; }
.sl-title    { font-size:20px; font-weight:800; color:var(--text-primary); letter-spacing:-.5px; }
.sl-subtitle { font-size:12.5px; color:var(--text-muted); margin-top:2px; }

/* Stats */
.sl-stats    { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:18px; }
.sl-stat     { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-sm); padding:10px 16px; min-width:90px; flex:1; }
.sl-stat-val { font-size:22px; font-weight:800; color:var(--text-primary); font-family:'JetBrains Mono',monospace; letter-spacing:-1px; line-height:1; }
.sl-stat-label { font-size:10px; color:var(--text-muted); text-transform:uppercase; letter-spacing:.6px; font-weight:600; margin-top:3px; }

/* Toolbar */
.sl-toolbar     { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-sm); padding:12px 14px; margin-bottom:10px; display:flex; flex-direction:column; gap:10px; }
.sl-toolbar-row { display:flex; gap:8px; align-items:center; flex-wrap:wrap; }

/* Search */
.sl-search-wrap  { flex:1; min-width:240px; position:relative; }
.sl-search-icon  { position:absolute; left:11px; top:50%; transform:translateY(-50%); color:var(--text-muted); pointer-events:none; display:flex; }
.sl-search-clear { position:absolute; right:10px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:var(--text-muted); display:flex; padding:2px; border-radius:4px; }
.sl-search-clear:hover { color:var(--text-primary); }
.sl-search { width:100%; padding:8px 32px 8px 36px; background:var(--bg-input); border:1.5px solid var(--border); border-radius:9px; font-size:13px; color:var(--text-primary); outline:none; transition:border-color .18s,box-shadow .18s; box-sizing:border-box; }
.sl-search::placeholder { color:var(--text-muted); }
.sl-search:focus { border-color:rgba(245,158,11,.5); box-shadow:0 0 0 3px rgba(245,158,11,.08); }

/* Search hint */
.sl-search-hint { font-size:11px; color:var(--text-muted); padding:2px 4px; }
.sl-search-hint span { color:var(--accent); font-weight:600; }

/* Filters row */
.sl-filters { display:flex; gap:7px; flex-wrap:wrap; align-items:center; }
.sl-select  { padding:7px 10px; background:var(--bg-input); border:1.5px solid var(--border); border-radius:8px; font-size:12.5px; color:var(--text-primary); outline:none; cursor:pointer; transition:border-color .18s; font-family:inherit; }
.sl-select:focus { border-color:rgba(245,158,11,.4); }
.sl-select.has-value { border-color:rgba(245,158,11,.45); background:rgba(245,158,11,.05); color:var(--accent); }

/* Filter chips (active) */
.sl-chip-row { display:flex; gap:6px; flex-wrap:wrap; padding-top:2px; }
.sl-chip     { display:inline-flex; align-items:center; gap:5px; padding:3px 10px; border-radius:20px; font-size:11.5px; font-weight:600; background:rgba(245,158,11,.1); color:var(--accent); border:1px solid rgba(245,158,11,.3); }
.sl-chip-x   { background:none; border:none; cursor:pointer; color:var(--accent); padding:0; display:flex; opacity:.7; }
.sl-chip-x:hover { opacity:1; }

/* Buttons */
.sl-view-btns  { display:flex; gap:2px; background:var(--bg-input); border:1px solid var(--border); border-radius:8px; padding:3px; flex-shrink:0; }
.sl-view-btn   { padding:5px 9px; border-radius:5px; border:none; background:transparent; cursor:pointer; color:var(--text-muted); transition:all .18s; display:flex; align-items:center; }
.sl-view-btn.active { background:var(--accent); color:#0B0F1A; }
.sl-reset-btn  { display:inline-flex; align-items:center; gap:5px; padding:7px 12px; background:rgba(248,113,113,.08); border:1px solid rgba(248,113,113,.2); border-radius:8px; font-family:inherit; font-size:12px; font-weight:600; color:var(--error); cursor:pointer; transition:all .18s; white-space:nowrap; }
.sl-reset-btn:hover { background:rgba(248,113,113,.15); }
.erp-btn { display:inline-flex; align-items:center; gap:7px; background:var(--accent); color:#0B0F1A; border:none; border-radius:10px; padding:9px 18px; font-family:inherit; font-size:13px; font-weight:700; cursor:pointer; text-decoration:none; transition:all .18s; }
.erp-btn:hover { background:#FBBF24; transform:translateY(-1px); }
.erp-btn:disabled { opacity:.5; cursor:not-allowed; transform:none; }

/* Result bar */
.sl-result-bar   { display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; min-height:26px; }
.sl-result-count { font-size:12px; color:var(--text-muted); display:flex; align-items:center; gap:8px; }
.sl-result-count span { color:var(--accent); font-weight:700; }
.sl-fetching-tag { font-size:11px; color:var(--accent); display:flex; align-items:center; gap:5px; }
.sl-spinner-sm   { width:10px; height:10px; border:1.5px solid rgba(245,158,11,.3); border-top-color:var(--accent); border-radius:50%; animation:spin 1s linear infinite; }

/* Error banner */
.sl-error-msg { background:rgba(248,113,113,.07); border:1px solid rgba(248,113,113,.2); border-radius:var(--radius-sm); padding:12px 16px; margin-bottom:16px; color:var(--error); display:flex; align-items:center; gap:10px; font-size:13px; }

/* Table */
.sl-table-wrap { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius); overflow:hidden; }
.sl-table      { width:100%; border-collapse:collapse; }
.sl-table thead th { padding:11px 14px; font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:.5px; text-align:left; background:var(--bg-card); border-bottom:1px solid var(--border); white-space:nowrap; }
.sl-table tbody tr { border-bottom:1px solid var(--border); transition:background .15s; cursor:pointer; }
.sl-table tbody tr:last-child { border-bottom:none; }
.sl-table tbody tr:hover { background:rgba(245,158,11,.03); }
.sl-table td   { padding:11px 14px; font-size:13px; color:var(--text-primary); vertical-align:middle; }

/* Cells */
.sl-name-cell { display:flex; align-items:center; gap:10px; }
.sl-avatar-sm { width:34px; height:34px; border-radius:9px; background:linear-gradient(135deg,var(--accent) 0%,#EA580C 100%); display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:800; color:#0B0F1A; flex-shrink:0; }
.sl-name-en   { font-weight:600; font-size:13px; color:var(--text-primary); }
.sl-name-bn   { font-size:11px; color:var(--text-muted); margin-top:1px; }
.sl-uid       { font-size:11px; color:var(--text-muted); font-family:'JetBrains Mono',monospace; }
.sl-mobile    { font-size:12px; color:var(--text-secondary); font-family:'JetBrains Mono',monospace; }
.sl-class-badge { display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; border-radius:7px; background:var(--accent-soft); color:var(--accent); font-size:13px; font-weight:800; font-family:'JetBrains Mono',monospace; }
.sl-roll      { font-family:'JetBrains Mono',monospace; font-size:12.5px; color:var(--text-secondary); }
.sl-status-dot { display:inline-flex; align-items:center; gap:5px; font-size:12px; font-weight:600; }
.sl-status-dot::before { content:''; width:6px; height:6px; border-radius:50%; background:currentColor; display:inline-block; }
.sl-action-btn { padding:5px 7px; border-radius:6px; border:1px solid var(--border); background:var(--bg-input); color:var(--text-muted); cursor:pointer; transition:all .18s; display:flex; align-items:center; text-decoration:none; }
.sl-action-btn:hover { color:var(--accent); border-color:var(--accent); background:var(--accent-soft); }

/* Skeleton / empty */
.sl-shimmer { border-radius:5px; background:var(--border); animation:pulse 1.5s ease infinite; }
.sl-empty   { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:60px 20px; gap:12px; color:var(--text-muted); }
.sl-empty-icon { width:56px; height:56px; border-radius:14px; background:var(--bg-input); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; }

/* No-results message */
.sl-no-results { display:flex; flex-direction:column; align-items:center; padding:52px 24px; gap:8px; text-align:center; }
.sl-no-results-icon { font-size:36px; opacity:.35; margin-bottom:4px; }
.sl-no-results-title { font-size:15px; font-weight:700; color:var(--text-primary); }
.sl-no-results-sub   { font-size:13px; color:var(--text-muted); max-width:320px; }

/* Grid */
.sl-grid      { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:12px; }
.sl-grid-card { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-sm); padding:16px; transition:all .18s; text-decoration:none; display:block; }
.sl-grid-card:hover { border-color:var(--accent); transform:translateY(-1px); }
.sl-grid-card-top { display:flex; align-items:flex-start; gap:12px; margin-bottom:12px; }
.sl-grid-avatar { width:44px; height:44px; border-radius:11px; background:linear-gradient(135deg,var(--accent) 0%,#EA580C 100%); display:flex; align-items:center; justify-content:center; font-size:17px; font-weight:800; color:#0B0F1A; flex-shrink:0; }
.sl-grid-info  { flex:1; min-width:0; }
.sl-grid-name  { font-size:14px; font-weight:700; color:var(--text-primary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.sl-grid-sub   { font-size:11.5px; color:var(--text-muted); margin-top:2px; }
.sl-grid-meta  { display:flex; justify-content:space-between; align-items:center; padding-top:10px; border-top:1px solid var(--border); }
.sl-grid-meta-val { font-size:15px; font-weight:700; color:var(--text-primary); font-family:'JetBrains Mono',monospace; }
.sl-grid-meta-key { font-size:9.5px; color:var(--text-muted); text-transform:uppercase; letter-spacing:.4px; font-weight:600; }

/* Pagination */
.sl-pagination { display:flex; justify-content:center; align-items:center; gap:10px; margin-top:20px; }
.sl-page-btn   { display:inline-flex; align-items:center; gap:5px; padding:8px 16px; background:var(--bg-card); border:1px solid var(--border); border-radius:9px; font-family:inherit; font-size:13px; font-weight:600; color:var(--text-secondary); cursor:pointer; transition:all .18s; }
.sl-page-btn:hover:not(:disabled) { border-color:var(--accent); color:var(--accent); }
.sl-page-btn:disabled { opacity:.4; cursor:not-allowed; }
.sl-page-info  { font-size:13px; color:var(--text-muted); white-space:nowrap; }
.sl-page-info span { color:var(--text-primary); font-weight:700; }

@media(max-width:768px){
  .sl-table th:nth-child(4),.sl-table td:nth-child(4),
  .sl-table th:nth-child(5),.sl-table td:nth-child(5){ display:none; }
}
@media(max-width:520px){
  .sl-table th:nth-child(3),.sl-table td:nth-child(3){ display:none; }
  .sl-stat { min-width:70px; }
}
`;

// ─── Helpers ──────────────────────────────────────────────────────
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const update = useCallback(
    (v: T) => {
      if (timer.current) {
        clearTimeout(timer.current);
      }

      timer.current = setTimeout(() => {
        setDebounced(v);
      }, delay);
    },
    [delay]
  );

  useEffect(() => {
    update(value);
  }, [value, update]);

  return debounced;
}

// ─── Active filter chips ──────────────────────────────────────────

interface FilterState {
  search: string;
  cls: string;
  session: string;
  gender: string;
  status: string;
  religion: string;
  ageRange: string; // "min-max" or ""
}

const EMPTY_FILTERS: FilterState = {
  search: "",
  cls: "",
  session: "",
  gender: "",
  status: "",
  religion: "",
  ageRange: "",
};

function getChips(f: FilterState) {
  const chips: { key: keyof FilterState; label: string }[] = [];
  if (f.search) chips.push({ key: "search", label: `"${f.search}"` });
  if (f.cls) chips.push({ key: "cls", label: `Class ${f.cls}` });
  if (f.session) chips.push({ key: "session", label: f.session });
  if (f.gender)
    chips.push({
      key: "gender",
      label: f.gender.charAt(0).toUpperCase() + f.gender.slice(1),
    });
  if (f.status)
    chips.push({
      key: "status",
      label: STATUS_CONFIG[f.status as Student["status"]]?.label ?? f.status,
    });
  if (f.religion) chips.push({ key: "religion", label: f.religion });
  if (f.ageRange) {
    const found = AGE_RANGES.find(
      (r) => `${r.min ?? ""}-${r.max ?? ""}` === f.ageRange
    );
    if (found) chips.push({ key: "ageRange", label: found.label });
  }
  return chips;
}

// ─── Page ────────────────────────────────────────────────────────

export default function StudentsPage() {
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [page, setPage] = useState(1);
  const limit = 10;

  const debouncedSearch = useDebounce(filters.search, 380);

  // Parse age range
  const parseAgeRange = (range: string) => {
    if (!range) return {};
    const [min, max] = range.split("-");
    return {
      ...(min ? { ageMin: Number(min) } : {}),
      ...(max ? { ageMax: Number(max) } : {}),
    };
  };
const queryParams: ListStudentsQuery = {
  page,
  limit,
  ...(debouncedSearch && { search: debouncedSearch }),
  ...(filters.cls && { class: filters.cls }),
  ...(filters.session && { session: filters.session }),
  ...(filters.gender && {
    gender: filters.gender as "male" | "female" | "other",
  }),
  ...(filters.status && { status: filters.status as StudentStatus }), // ← cast
  ...(filters.religion && { religion: filters.religion }),
  ...parseAgeRange(filters.ageRange),
};

  const {
    data,
    isLoading,
    isFetching,
    error: studentsError,
  } = useGetStudentsQuery(queryParams);
  const { data: sessions = [], error: sessionsError } = useGetSessionsQuery();
  const { data: classes = [], error: classesError } = useGetClassesQuery();

  const students = data?.data ?? [];
  const meta = data?.meta;

  const stats = {
    total: meta?.total ?? students.length,
    active: students.filter((s) => s.status === "active").length,
    repeat: students.filter((s) => s.status === "repeat").length,
    transferred: students.filter((s) => s.status === "transferred").length,
  };

  const setFilter = (key: keyof FilterState, value: string) => {
    setFilters((f) => ({ ...f, [key]: value }));
    setPage(1);
  };

  const clearFilter = (key: keyof FilterState) => setFilter(key, "");
  const resetAll = () => {
    setFilters(EMPTY_FILTERS);
    setPage(1);
  };

  const chips = getChips({ ...filters, search: debouncedSearch });
  const hasFilter = chips.length > 0;

  // ── Render ──────────────────────────────────────────────────────

  return (
    <>
      <style>{CSS}</style>
      <div className="sl-page">
        {/* Header */}
        <div className="sl-header">
          <div>
            <div className="sl-title">Students</div>
            <div className="sl-subtitle">
              Manage, enroll &amp; track all students
            </div>
          </div>
          <Link href="/students/create" className="erp-btn">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add Student
          </Link>
        </div>

        {/* Errors */}
        {(studentsError || sessionsError || classesError) && (
          <div className="sl-error-msg">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Some data couldn't be loaded. Showing available data.
          </div>
        )}

        {/* Stats */}
        <div className="sl-stats">
          {[
            { label: "Total", val: stats.total },
            { label: "Active", val: stats.active },
            { label: "Repeat", val: stats.repeat },
            { label: "Transferred", val: stats.transferred },
          ].map((st) => (
            <div key={st.label} className="sl-stat">
              <div className="sl-stat-val">{st.val}</div>
              <div className="sl-stat-label">{st.label}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="sl-toolbar">
          {/* Row 1: Search + view toggle */}
          <div className="sl-toolbar-row">
            <div className="sl-search-wrap">
              <span className="sl-search-icon">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </span>
              <input
                className="sl-search"
                placeholder="Search by name (EN/BN), UID, phone, NID, birth reg, parent name…"
                value={filters.search}
                onChange={(e) => setFilter("search", e.target.value)}
              />
              {filters.search && (
                <button
                  className="sl-search-clear"
                  onClick={() => setFilter("search", "")}
                  title="Clear"
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <div className="sl-view-btns">
              <button
                className={`sl-view-btn${
                  viewMode === "table" ? " active" : ""
                }`}
                onClick={() => setViewMode("table")}
                title="Table view"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              </button>
              <button
                className={`sl-view-btn${viewMode === "grid" ? " active" : ""}`}
                onClick={() => setViewMode("grid")}
                title="Grid view"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Row 2: Filters */}
          <div className="sl-filters">
            <select
              className={`sl-select${filters.cls ? " has-value" : ""}`}
              value={filters.cls}
              onChange={(e) => setFilter("cls", e.target.value)}
            >
              <option value="">All Classes</option>
              {classes.map((c) => (
                <option key={c} value={c}>
                  Class {c}
                </option>
              ))}
            </select>

            <select
              className={`sl-select${filters.session ? " has-value" : ""}`}
              value={filters.session}
              onChange={(e) => setFilter("session", e.target.value)}
            >
              <option value="">All Sessions</option>
              {sessions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              className={`sl-select${filters.gender ? " has-value" : ""}`}
              value={filters.gender}
              onChange={(e) => setFilter("gender", e.target.value)}
            >
              <option value="">All Genders</option>
              {GENDERS.map((g) => (
                <option
                  key={g}
                  value={g}
                  style={{ textTransform: "capitalize" }}
                >
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </option>
              ))}
            </select>

            <select
              className={`sl-select${filters.status ? " has-value" : ""}`}
              value={filters.status}
              onChange={(e) => setFilter("status", e.target.value)}
            >
              <option value="">All Status</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_CONFIG[s].label}
                </option>
              ))}
            </select>

            <select
              className={`sl-select${filters.religion ? " has-value" : ""}`}
              value={filters.religion}
              onChange={(e) => setFilter("religion", e.target.value)}
            >
              <option value="">All Religions</option>
              {RELIGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            <select
              className={`sl-select${filters.ageRange ? " has-value" : ""}`}
              value={filters.ageRange}
              onChange={(e) => setFilter("ageRange", e.target.value)}
            >
              {AGE_RANGES.map((r) => (
                <option
                  key={`${r.min ?? ""}-${r.max ?? ""}`}
                  value={`${r.min ?? ""}-${r.max ?? ""}`}
                >
                  {r.label}
                </option>
              ))}
            </select>

            {hasFilter && (
              <button className="sl-reset-btn" onClick={resetAll}>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
                Reset
              </button>
            )}
          </div>

          {/* Active filter chips */}
          {hasFilter && (
            <div className="sl-chip-row">
              {chips.map((c) => (
                <span key={c.key} className="sl-chip">
                  {c.label}
                  <button
                    className="sl-chip-x"
                    onClick={() => clearFilter(c.key)}
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Result bar */}
        <div className="sl-result-bar">
          <div className="sl-result-count">
            {isLoading ? (
              "Loading…"
            ) : (
              <>
                Showing <span>{students.length}</span> of{" "}
                <span>{meta?.total ?? 0}</span> students
              </>
            )}
            {isFetching && !isLoading && (
              <span className="sl-fetching-tag">
                <span className="sl-spinner-sm" /> Refreshing
              </span>
            )}
          </div>
          {hasFilter && !isLoading && (
            <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
              {meta?.total === 0
                ? "No match"
                : `${meta?.total} result${
                    (meta?.total ?? 0) !== 1 ? "s" : ""
                  } found`}
            </span>
          )}
        </div>

        {/* ── Table View ── */}
        {viewMode === "table" && (
          <div className="sl-table-wrap">
            <table className="sl-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Class</th>
                  <th>Roll</th>
                  <th>Session</th>
                  <th>Father Mobile</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}>
                      {[160, 40, 40, 60, 100, 70, 50].map((w, j) => (
                        <td key={j}>
                          <div
                            className="sl-shimmer"
                            style={{
                              height: 13,
                              width: w,
                              animationDelay: `${i * 0.05}s`,
                            }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div className="sl-no-results">
                        <div className="sl-no-results-icon">🔍</div>
                        <div className="sl-no-results-title">
                          No students found
                        </div>
                        <div className="sl-no-results-sub">
                          {hasFilter
                            ? "No students match your current filters. Try adjusting or resetting them."
                            : "No students registered yet. Add your first student to get started."}
                        </div>
                        {hasFilter && (
                          <button
                            className="sl-reset-btn"
                            style={{ marginTop: 8 }}
                            onClick={resetAll}
                          >
                            Clear all filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  students.map((s) => {
                    const cfg = STATUS_CONFIG[s.status] ?? {
                      label: s.status,
                      color: "var(--text-muted)",
                    };
                    return (
                      <tr
                        key={s.studentUid}
                        onClick={() =>
                          (window.location.href = `/students/${s.studentUid}`)
                        }
                      >
                        <td>
                          <div className="sl-name-cell">
                            <div className="sl-avatar-sm">
                              {s.name?.en?.charAt(0).toUpperCase() || "?"}
                            </div>
                            <div>
                              <div className="sl-name-en">
                                {s.name?.en || "N/A"}
                              </div>
                              {s.name?.bn && (
                                <div className="sl-name-bn">{s.name.bn}</div>
                              )}
                              <div className="sl-uid">{s.studentUid}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="sl-class-badge">
                            {s.current?.class ?? "—"}
                          </div>
                        </td>
                        <td>
                          <span className="sl-roll">
                            {s.current?.roll ?? "—"}
                          </span>
                        </td>
                        <td>
                          <span
                            style={{ fontSize: 12, color: "var(--text-muted)" }}
                          >
                            {s.current?.session || "—"}
                          </span>
                        </td>
                        <td>
                          <span className="sl-mobile">
                            {s.father?.mobile ??
                              s.guardians?.[0]?.mobile ??
                              "—"}
                          </span>
                        </td>
                        <td>
                          <span
                            className="sl-status-dot"
                            style={{ color: cfg.color }}
                          >
                            {cfg.label}
                          </span>
                        </td>
                        <td>
                          <div
                            style={{ display: "flex", gap: 6 }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Link
                              href={`/students/${s.studentUid}`}
                              className="sl-action-btn"
                              title="View"
                            >
                              <svg
                                width="13"
                                height="13"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Grid View ── */}
        {viewMode === "grid" && (
          <div className="sl-grid">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="sl-grid-card"
                  style={{ cursor: "default" }}
                >
                  <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 11,
                        background: "var(--border)",
                        animation: `pulse 1.5s ease infinite ${i * 0.07}s`,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div
                        className="sl-shimmer"
                        style={{ height: 14, width: 120, marginBottom: 7 }}
                      />
                      <div
                        className="sl-shimmer"
                        style={{ height: 10, width: 80 }}
                      />
                    </div>
                  </div>
                  <div className="sl-shimmer" style={{ height: 10 }} />
                </div>
              ))
            ) : students.length === 0 ? (
              <div style={{ gridColumn: "1/-1" }}>
                <div className="sl-no-results">
                  <div className="sl-no-results-icon">🔍</div>
                  <div className="sl-no-results-title">No students found</div>
                  <div className="sl-no-results-sub">
                    {hasFilter
                      ? "Try adjusting your filters."
                      : "No students registered yet."}
                  </div>
                  {hasFilter && (
                    <button
                      className="sl-reset-btn"
                      style={{ marginTop: 8 }}
                      onClick={resetAll}
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              </div>
            ) : (
              students.map((s) => {
                const cfg = STATUS_CONFIG[s.status] ?? {
                  label: s.status,
                  color: "var(--text-muted)",
                };
                return (
                  <Link
                    key={s.studentUid}
                    href={`/students/${s.studentUid}`}
                    className="sl-grid-card"
                  >
                    <div className="sl-grid-card-top">
                      <div className="sl-grid-avatar">
                        {s.name?.en?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div className="sl-grid-info">
                        <div className="sl-grid-name">
                          {s.name?.en || "N/A"}
                        </div>
                        <div className="sl-grid-sub">{s.name?.bn || ""}</div>
                        <div style={{ marginTop: 4 }}>
                          <span
                            className="sl-status-dot"
                            style={{ color: cfg.color, fontSize: 11 }}
                          >
                            {cfg.label}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="sl-grid-meta">
                      {(
                        [
                          ["Class", s.current?.class],
                          ["Roll", s.current?.roll],
                          ["Session", s.current?.session],
                        ] as [string, string | number | undefined][]
                      ).map(([k, v]) => (
                        <div key={k} style={{ textAlign: "center" }}>
                          <div
                            className="sl-grid-meta-val"
                            style={{
                              fontSize: k === "Session" ? 12 : undefined,
                            }}
                          >
                            {v ?? "—"}
                          </div>
                          <div className="sl-grid-meta-key">{k}</div>
                        </div>
                      ))}
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        )}

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="sl-pagination">
            <button
              className="sl-page-btn"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Prev
            </button>
            <span className="sl-page-info">
              Page <span>{meta.page}</span> of <span>{meta.totalPages}</span>
            </span>
            <button
              className="sl-page-btn"
              disabled={page === meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
