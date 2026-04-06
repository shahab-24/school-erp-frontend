// src/app/(dashboard)/students/bulk-promote/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  useGetSessionsQuery,
  useGetClassesQuery,
  useGetClassRosterQuery,
  useBulkPromoteStudentsMutation,
} from "@/lib/services/studentApi";

const CSS = `
.bp { max-width:900px; margin:0 auto; animation:pageEnter .3s ease both; }
.bp-head { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; margin-bottom:20px; }
.bp-title { font-size:20px; font-weight:700; color:#F1F5F9; letter-spacing:-.4px; margin:0; }
.bp-sub   { font-size:13px; color:#4B5A72; margin:3px 0 0; }

/* Config card */
.bp-config { background:#131929; border:1px solid #1E2A40; border-radius:13px; padding:20px 22px; margin-bottom:16px; }
.bp-config-title { font-size:11px; font-weight:700; color:#4B5A72; text-transform:uppercase; letter-spacing:.6px; margin-bottom:16px; }
.bp-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
@media(max-width:700px){ .bp-grid { grid-template-columns:1fr 1fr; } }
@media(max-width:400px){ .bp-grid { grid-template-columns:1fr; } }
.bp-field { display:flex; flex-direction:column; gap:5px; }
.bp-label { font-size:11px; font-weight:700; color:#94A3B8; text-transform:uppercase; letter-spacing:.4px; }
.bp-select { width:100%; box-sizing:border-box; background:#1A2236; border:1.5px solid #1E2A40; border-radius:9px; padding:9px 12px; font-family:inherit; font-size:13px; color:#F1F5F9; outline:none; transition:border-color .18s; cursor:pointer; }
.bp-select:focus { border-color:rgba(245,158,11,.5); box-shadow:0 0 0 3px rgba(245,158,11,.08); }

/* Result toggle */
.bp-result-row { display:flex; gap:10px; margin-top:14px; }
.bp-result-btn { flex:1; padding:12px 10px; border-radius:10px; border:1.5px solid #1E2A40; background:#1A2236; cursor:pointer; text-align:center; transition:all .18s; font-family:inherit; }
.bp-result-btn.promoted { border-color:rgba(34,197,94,.4); background:rgba(34,197,94,.06); }
.bp-result-btn.repeat   { border-color:rgba(245,158,11,.4); background:rgba(245,158,11,.06); }
.bp-result-icon  { font-size:20px; margin-bottom:4px; }
.bp-result-label { font-size:12.5px; font-weight:700; }
.bp-promoted .bp-result-label { color:#22C55E; }
.bp-repeat   .bp-result-label { color:#F59E0B; }
.bp-result-sub { font-size:11px; color:#4B5A72; margin-top:1px; }

/* Roster */
.bp-roster { background:#131929; border:1px solid #1E2A40; border-radius:13px; overflow:hidden; }
.bp-roster-head { display:flex; align-items:center; justify-content:space-between; padding:14px 18px; border-bottom:1px solid #1E2A40; }
.bp-roster-title { font-size:13px; font-weight:700; color:#F1F5F9; }
.bp-roster-count { font-size:12px; color:#4B5A72; font-family:'JetBrains Mono',monospace; }
.bp-select-all { display:flex; align-items:center; gap:7px; font-size:12.5px; font-weight:600; color:#F59E0B; background:rgba(245,158,11,.1); border:1px solid rgba(245,158,11,.2); border-radius:8px; padding:6px 12px; cursor:pointer; transition:all .18s; font-family:inherit; }
.bp-select-all:hover { background:rgba(245,158,11,.18); }
.bp-table { width:100%; border-collapse:collapse; min-width:520px; }
.bp-th { padding:10px 16px; text-align:left; font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:.6px; color:#4B5A72; border-bottom:1px solid #1E2A40; background:#0F1622; }
.bp-tr { border-bottom:1px solid #1A2236; transition:background .15s; cursor:pointer; }
.bp-tr:last-child { border-bottom:none; }
.bp-tr:hover { background:rgba(255,255,255,.02); }
.bp-tr.selected { background:rgba(245,158,11,.05); }
.bp-td { padding:11px 16px; font-size:13px; vertical-align:middle; }
.bp-check { width:17px; height:17px; border-radius:5px; border:1.5px solid #1E2A40; background:#1A2236; cursor:pointer; appearance:none; -webkit-appearance:none; position:relative; transition:all .15s; flex-shrink:0; }
.bp-check:checked { background:#F59E0B; border-color:#F59E0B; }
.bp-check:checked::after { content:''; position:absolute; left:4px; top:1px; width:5px; height:9px; border:2px solid #0B0F1A; border-top:none; border-left:none; transform:rotate(45deg); }
.bp-name { font-weight:600; color:#E2E8F0; }
.bp-name-bn { font-size:11px; color:#4B5A72; }
.bp-roll { font-family:'JetBrains Mono',monospace; font-size:12px; color:#F59E0B; }
.bp-gender-m { font-size:11.5px; color:#60A5FA; background:rgba(96,165,250,.1); padding:2px 7px; border-radius:5px; font-weight:600; }
.bp-gender-f { font-size:11.5px; color:#F472B6; background:rgba(244,114,182,.1); padding:2px 7px; border-radius:5px; font-weight:600; }

/* Empty/loading */
.bp-empty { padding:48px 24px; text-align:center; color:#4B5A72; font-size:13px; }
.bp-skel  { background:#1A2236; border-radius:6px; animation:bpPulse 1.5s ease infinite; }
@keyframes bpPulse { 0%,100%{opacity:1} 50%{opacity:.4} }

/* Footer */
.bp-footer { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:14px 18px; border-top:1px solid #1E2A40; flex-wrap:wrap; }
.bp-footer-info { font-size:12.5px; color:#4B5A72; }
.bp-footer-info b { color:#F59E0B; }
.bp-btn { display:inline-flex; align-items:center; gap:7px; background:#F59E0B; color:#0B0F1A; border:none; border-radius:10px; padding:10px 22px; font-family:inherit; font-size:13px; font-weight:700; cursor:pointer; transition:all .18s; box-shadow:0 4px 14px rgba(245,158,11,.3); }
.bp-btn:hover:not(:disabled) { background:#FBBF24; transform:translateY(-1px); }
.bp-btn:disabled { opacity:.5; cursor:not-allowed; transform:none; }
.bp-spinner { width:14px; height:14px; border:2px solid rgba(11,15,26,.3); border-top-color:#0B0F1A; border-radius:50%; animation:bp-spin 1s linear infinite; }
@keyframes bp-spin { to { transform:rotate(360deg); } }

/* Remarks */
.bp-remarks { width:100%; box-sizing:border-box; background:#1A2236; border:1.5px solid #1E2A40; border-radius:9px; padding:9px 12px; font-family:inherit; font-size:13px; color:#F1F5F9; outline:none; resize:vertical; min-height:70px; margin-top:12px; transition:border-color .18s; }
.bp-remarks::placeholder { color:#4B5A72; }
.bp-remarks:focus { border-color:rgba(245,158,11,.5); box-shadow:0 0 0 3px rgba(245,158,11,.08); }
`;

export default function BulkPromotePage() {
  const router = useRouter();

  const { data: sessions = [] } = useGetSessionsQuery();
  const { data: classes = [] } = useGetClassesQuery();
  const [bulkPromote, { isLoading }] = useBulkPromoteStudentsMutation();

  const curYear = String(new Date().getFullYear());
  const nextYear = String(new Date().getFullYear() + 1);
  const sessionOpts =
    sessions.length > 0
      ? sessions.includes(nextYear)
        ? sessions
        : [...sessions, nextYear].sort().reverse()
      : [curYear, nextYear];
  const classOpts =
    classes.length > 0 ? classes : Array.from({ length: 10 }, (_, i) => i + 1);

  const [fromSession, setFromSession] = useState(sessionOpts[0] ?? curYear);
  const [fromClass, setFromClass] = useState<number>(classOpts[0] ?? 1);
  const [toClass, setToClass] = useState<number>(
    (classOpts[0] ?? 1) < 10 ? (classOpts[0] ?? 1) + 1 : 10
  );
  const [toSession, setToSession] = useState(nextYear);
  const [result, setResult] = useState<"promoted" | "repeat">("promoted");
  const [remarks, setRemarks] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const { data: roster = [], isLoading: rosterLoading } =
    useGetClassRosterQuery(
      { class: fromClass, session: fromSession },
      { skip: !fromClass || !fromSession }
    );

  const toggleStudent = (uid: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(uid) ? next.delete(uid) : next.add(uid);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === roster.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(roster.map((s) => s.studentUid)));
    }
  };

  const handleSubmit = async () => {
    if (selected.size === 0) {
      toast.error("Select at least one student");
      return;
    }
    if (!toSession.trim()) {
      toast.error("Target session required");
      return;
    }

    try {
      const res = await bulkPromote({
        session: toSession,
        fromClass,
        toClass: result === "repeat" ? fromClass : toClass,
        studentUids: Array.from(selected),
        result,
        remarks: remarks || undefined,
      }).unwrap();

      toast.success(
        `${res.data.promoted} students ${
          result === "promoted" ? "promoted" : "marked for repeat"
        }`,
        {
          description: `To Class ${
            result === "repeat" ? fromClass : toClass
          }, Session ${toSession}`,
        }
      );
      router.push("/students");
    } catch (e: any) {
      toast.error("Bulk promotion failed", {
        description: e?.data?.message ?? "Please try again.",
      });
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="bp">
        <div className="bp-head">
          <div>
            <h1 className="bp-title">Bulk Promotion</h1>
            <p className="bp-sub">Promote or repeat an entire class at once</p>
          </div>
          <Link
            href="/students"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              fontSize: 12.5,
              color: "#4B5A72",
              textDecoration: "none",
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Students
          </Link>
        </div>

        {/* Config */}
        <div className="bp-config">
          <div className="bp-config-title">Promotion Configuration</div>
          <div className="bp-grid">
            <div className="bp-field">
              <label className="bp-label">From Session</label>
              <select
                className="bp-select"
                value={fromSession}
                onChange={(e) => {
                  setFromSession(e.target.value);
                  setSelected(new Set());
                }}
              >
                {sessionOpts.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="bp-field">
              <label className="bp-label">From Class</label>
              <select
                className="bp-select"
                value={fromClass}
                onChange={(e) => {
                  setFromClass(Number(e.target.value));
                  setSelected(new Set());
                }}
              >
                {classOpts.map((c) => (
                  <option key={c} value={c}>
                    Class {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="bp-field">
              <label className="bp-label">To Session</label>
              <select
                className="bp-select"
                value={toSession}
                onChange={(e) => setToSession(e.target.value)}
              >
                {sessionOpts.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="bp-field">
              <label className="bp-label">To Class</label>
              <select
                className="bp-select"
                value={toClass}
                onChange={(e) => setToClass(Number(e.target.value))}
                disabled={result === "repeat"}
              >
                {classOpts
                  .filter((c) => c >= fromClass)
                  .map((c) => (
                    <option key={c} value={c}>
                      Class {c}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Result toggle */}
          <div className="bp-result-row">
            {(["promoted", "repeat"] as const).map((r) => (
              <button
                key={r}
                type="button"
                className={`bp-result-btn ${
                  result === r ? `${r} bp-${r}` : ""
                }`}
                onClick={() => setResult(r)}
              >
                <div className="bp-result-icon">
                  {r === "promoted" ? "🎓" : "🔄"}
                </div>
                <div className="bp-result-label">
                  {r === "promoted" ? "Promoted" : "Repeat"}
                </div>
                <div className="bp-result-sub">
                  {r === "promoted"
                    ? "Move all to next class"
                    : "All stay in same class"}
                </div>
              </button>
            ))}
          </div>

          <textarea
            className="bp-remarks"
            placeholder="Optional remarks for this batch promotion…"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>

        {/* Roster */}
        <div className="bp-roster">
          <div className="bp-roster-head">
            <div>
              <span className="bp-roster-title">
                Class {fromClass} Roster · {fromSession}
              </span>
              {!rosterLoading && (
                <span className="bp-roster-count" style={{ marginLeft: 10 }}>
                  ({roster.length} students)
                </span>
              )}
            </div>
            {roster.length > 0 && (
              <button
                type="button"
                className="bp-select-all"
                onClick={toggleAll}
              >
                {selected.size === roster.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
            )}
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="bp-table">
              <thead>
                <tr>
                  <th className="bp-th" style={{ width: 40 }}>
                    <input
                      type="checkbox"
                      className="bp-check"
                      checked={
                        roster.length > 0 && selected.size === roster.length
                      }
                      onChange={toggleAll}
                    />
                  </th>
                  <th className="bp-th">Student</th>
                  <th className="bp-th">UID</th>
                  <th className="bp-th">Roll</th>
                  <th className="bp-th">Gender</th>
                  <th className="bp-th">Status</th>
                </tr>
              </thead>
              <tbody>
                {rosterLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="bp-tr">
                      <td className="bp-td">
                        <div
                          className="bp-skel"
                          style={{ width: 17, height: 17, borderRadius: 5 }}
                        />
                      </td>
                      <td className="bp-td">
                        <div
                          className="bp-skel"
                          style={{ height: 12, width: 120 }}
                        />
                      </td>
                      <td className="bp-td">
                        <div
                          className="bp-skel"
                          style={{ height: 12, width: 80 }}
                        />
                      </td>
                      <td className="bp-td">
                        <div
                          className="bp-skel"
                          style={{ height: 12, width: 40 }}
                        />
                      </td>
                      <td className="bp-td">
                        <div
                          className="bp-skel"
                          style={{ height: 20, width: 50 }}
                        />
                      </td>
                      <td className="bp-td">
                        <div
                          className="bp-skel"
                          style={{ height: 20, width: 55 }}
                        />
                      </td>
                    </tr>
                  ))
                ) : roster.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="bp-empty">
                      No students found in Class {fromClass}, Session{" "}
                      {fromSession}
                    </td>
                  </tr>
                ) : (
                  roster.map((s) => {
                    const isSel = selected.has(s.studentUid);
                    return (
                      <tr
                        key={s.studentUid}
                        className={`bp-tr ${isSel ? "selected" : ""}`}
                        onClick={() => toggleStudent(s.studentUid)}
                      >
                        <td
                          className="bp-td"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            className="bp-check"
                            checked={isSel}
                            onChange={() => toggleStudent(s.studentUid)}
                          />
                        </td>
                        <td className="bp-td">
                          <div className="bp-name">{s.name.en}</div>
                          {s.name.bn && (
                            <div className="bp-name-bn">{s.name.bn}</div>
                          )}
                        </td>
                        <td
                          className="bp-td"
                          style={{
                            fontFamily: '"JetBrains Mono",monospace',
                            fontSize: 11.5,
                            color: "#F59E0B",
                          }}
                        >
                          {s.studentUid}
                        </td>
                        <td className="bp-td">
                          <span className="bp-roll">#{s.current.roll}</span>
                        </td>
                        <td className="bp-td">
                          <span
                            className={
                              s.gender === "male"
                                ? "bp-gender-m"
                                : "bp-gender-f"
                            }
                          >
                            {s.gender}
                          </span>
                        </td>
                        <td className="bp-td">
                          <span
                            style={{
                              fontSize: 11.5,
                              fontWeight: 700,
                              padding: "3px 8px",
                              borderRadius: 6,
                              border: "1px solid",
                              color:
                                s.status === "active" ? "#34D399" : "#F59E0B",
                              background:
                                s.status === "active"
                                  ? "rgba(52,211,153,.1)"
                                  : "rgba(245,158,11,.1)",
                              borderColor:
                                s.status === "active"
                                  ? "rgba(52,211,153,.2)"
                                  : "rgba(245,158,11,.2)",
                            }}
                          >
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="bp-footer">
            <p className="bp-footer-info">
              <b>{selected.size}</b> of <b>{roster.length}</b> students selected
              · Will be{" "}
              {result === "promoted" ? (
                <>
                  <b>promoted to Class {toClass}</b>, Session <b>{toSession}</b>
                </>
              ) : (
                <>
                  <b>repeated in Class {fromClass}</b>, Session{" "}
                  <b>{toSession}</b>
                </>
              )}
            </p>
            <button
              type="button"
              className="bp-btn"
              onClick={handleSubmit}
              disabled={isLoading || selected.size === 0}
            >
              {isLoading ? (
                <>
                  <div className="bp-spinner" /> Processing…
                </>
              ) : (
                <>
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  {result === "promoted"
                    ? `Promote ${selected.size} Students`
                    : `Mark ${selected.size} as Repeat`}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
