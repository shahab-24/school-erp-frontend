// // src/app/(dashboard)/students/[studentUid]/promote/page.tsx
// "use client";

// import { useParams, useRouter } from "next/navigation";
// import { useState } from "react";
// import { toast } from "sonner";
// import {
//   useGetStudentQuery,
//   usePromoteStudentMutation,
//   useGetSessionsQuery,
//   useGetClassesQuery,
// } from "@/lib/services/studentApi";

// const CSS = `
// .pr { max-width:700px; margin:0 auto; animation:pageEnter .3s ease both; }

// .pr-back { display:inline-flex; align-items:center; gap:7px; font-size:12.5px; color:var(--text-muted); text-decoration:none; margin-bottom:16px; transition:color .18s; }
// .pr-back:hover { color:var(--accent); }

// .pr-title { font-size:16px; font-weight:700; color:var(--text-primary); margin:0; }
// .pr-desc  { font-size:12.5px; color:var(--text-muted); margin:4px 0 20px; }

// /* Strip */
// .pr-strip {
//   background:var(--bg-card); border:1px solid var(--border);
//   border-radius:var(--radius-sm); padding:16px 20px; margin-bottom:18px;
//   display:flex; gap:20px; align-items:center; flex-wrap:wrap;
// }
// .pr-strip-lbl { font-size:10px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:.6px; }
// .pr-strip-val { font-size:24px; font-weight:800; color:var(--text-primary); font-family:'JetBrains Mono',monospace; letter-spacing:-1px; margin-top:2px; }
// .pr-strip-arrow { color:var(--border); margin:0 4px; }
// .pr-strip-promoted { color:var(--success); }
// .pr-strip-repeat   { color:var(--accent); }

// /* Card */
// .pr-card {
//   background:var(--bg-card); border:1px solid var(--border);
//   border-radius:var(--radius-sm); padding:22px 24px;
// }
// .pr-card-title { font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:.6px; margin-bottom:18px; }

// /* Result toggle */
// .pr-result-row { display:flex; gap:10px; margin-bottom:20px; }
// .pr-result-btn {
//   flex:1; padding:16px 10px; border-radius:11px;
//   border:1.5px solid var(--border); background:var(--bg-input);
//   cursor:pointer; text-align:center; transition:all .18s; font-family:inherit;
// }
// .pr-result-btn-promoted { border-color:rgba(52,211,153,.4); background:rgba(52,211,153,.07); }
// .pr-result-btn-repeat   { border-color:rgba(245,158,11,.4); background:rgba(245,158,11,.07); }
// .pr-result-icon  { font-size:24px; margin-bottom:6px; }
// .pr-result-label { font-size:13px; font-weight:700; color:var(--text-secondary); }
// .pr-result-sub   { font-size:11px; color:var(--text-muted); margin-top:2px; }
// .pr-result-btn-promoted .pr-result-label { color:var(--success); }
// .pr-result-btn-repeat   .pr-result-label { color:var(--accent); }

// /* Grid */
// .pr-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
// .pr-grid-3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; }
// @media(max-width:560px){ .pr-grid-2,.pr-grid-3 { grid-template-columns:1fr; } }

// /* Field */
// .pr-field  { display:flex; flex-direction:column; gap:5px; }
// .pr-label  { font-size:11px; font-weight:700; color:var(--text-secondary); text-transform:uppercase; letter-spacing:.4px; }
// .pr-input,.pr-select {
//   width:100%; box-sizing:border-box;
//   background:var(--bg-input); border:1.5px solid var(--border);
//   border-radius:9px; padding:9px 12px; font-family:inherit;
//   font-size:13px; color:var(--text-primary); outline:none; transition:border-color .18s;
// }
// .pr-input::placeholder { color:var(--text-muted); }
// .pr-input:focus,.pr-select:focus {
//   border-color:rgba(245,158,11,.5);
//   box-shadow:0 0 0 3px rgba(245,158,11,.08);
// }
// .pr-input.err,.pr-select.err { border-color:var(--error); }
// .pr-field-err { font-size:11px; color:var(--error); }

// /* Warning */
// .pr-warn {
//   background:rgba(245,158,11,.07); border:1px solid rgba(245,158,11,.2);
//   border-radius:9px; padding:12px 14px; margin-top:14px;
//   font-size:12.5px; color:var(--text-secondary); display:flex; gap:8px; align-items:flex-start;
// }

// /* Validation alert */
// .pr-alert {
//   background:rgba(248,113,113,.07); border:1px solid rgba(248,113,113,.2);
//   border-radius:9px; padding:12px 14px; margin-top:14px;
//   font-size:12.5px; color:var(--error); display:flex; gap:8px; align-items:flex-start;
// }

// /* Preview */
// .pr-preview {
//   background:rgba(245,158,11,.06); border:1px solid rgba(245,158,11,.15);
//   border-radius:10px; padding:14px 16px; margin-top:14px;
//   font-size:13px; color:var(--text-secondary); line-height:1.7;
// }
// .pr-preview b { color:var(--accent); }

// /* Footer */
// .pr-footer {
//   display:flex; align-items:center; justify-content:space-between;
//   gap:12px; margin-top:20px; padding-top:18px; border-top:1px solid var(--border); flex-wrap:wrap;
// }
// .pr-btn {
//   display:inline-flex; align-items:center; gap:7px;
//   background:var(--accent); color:#0B0F1A; border:none;
//   border-radius:10px; padding:10px 22px; font-family:inherit;
//   font-size:13px; font-weight:700; cursor:pointer;
//   transition:all .18s; box-shadow:0 4px 14px rgba(245,158,11,.3);
// }
// .pr-btn:hover:not(:disabled) { filter:brightness(1.1); transform:translateY(-1px); }
// .pr-btn:disabled { opacity:.5; cursor:not-allowed; transform:none; }
// .pr-btn-cancel {
//   display:inline-flex; align-items:center; gap:7px;
//   background:none; border:1.5px solid var(--border); border-radius:10px;
//   padding:10px 16px; font-family:inherit; font-size:13px; font-weight:600;
//   color:var(--text-muted); cursor:pointer; text-decoration:none; transition:all .18s;
// }
// .pr-btn-cancel:hover { border-color:var(--text-muted); color:var(--text-primary); }
// .pr-spinner {
//   width:14px; height:14px; border:2px solid rgba(11,15,26,.3);
//   border-top-color:#0B0F1A; border-radius:50%;
//   animation:pr-spin 1s linear infinite;
// }
// @keyframes pr-spin { to { transform:rotate(360deg); } }

// /* Skeleton */
// .pr-skel { background:var(--bg-input); border-radius:8px; animation:prPulse 1.5s ease infinite; }
// @keyframes prPulse { 0%,100%{opacity:1} 50%{opacity:.4} }
// `;

// export default function StudentPromotePage() {
//   const { studentUid } = useParams<{ studentUid: string }>();
//   const router = useRouter();

//   const { data: studentData, isLoading: studentLoading } =
//     useGetStudentQuery(studentUid);
//   const { data: sessionsRaw = [] } = useGetSessionsQuery();
//   const { data: classesRaw = [] } = useGetClassesQuery();
//   const [promote, { isLoading }] = usePromoteStudentMutation();

//   const student = studentData?.data;
//   const fromClass = student?.current?.class ?? 1;
//   const fromRoll = student?.current?.roll ?? 1;
//   const curSession = student?.current?.session ?? "";

//   // ── Session options ──────────────────────────────────────────
//   // Include next year if not already present; sort desc
//   const thisYear = new Date().getFullYear();
//   const nextYear = String(thisYear + 1);
//   const allSessions = sessionsRaw.includes(nextYear)
//     ? [...sessionsRaw]
//     : [...sessionsRaw, nextYear];
//   // Future-only sessions (strictly after current session)
//   const futureSessionOpts = allSessions
//     .filter((s) => s > curSession)
//     .sort()
//     .reverse();
//   // For repeat — same or future sessions (can stay in same session)
//   const repeatSessionOpts = allSessions
//     .filter((s) => s >= curSession)
//     .sort()
//     .reverse();

//   // ── Class options ─────────────────────────────────────────────
//   // Ensure 1-12 range; merge with DB values
//   const allClasses = Array.from(
//     new Set([...classesRaw, ...Array.from({ length: 12 }, (_, i) => i + 1)])
//   ).sort((a, b) => a - b);

//   const defaultSession = futureSessionOpts[0] ?? nextYear;
//   const defaultToClass = allClasses.find((c) => c > fromClass) ?? fromClass;

//   const [form, setForm] = useState({
//     session: defaultSession,
//     toClass: defaultToClass,
//     result: "promoted" as "promoted" | "repeat",
//     newRoll: 1,
//     remarks: "",
//   });
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => {
//     setForm((p) => ({ ...p, [k]: v }));
//     setErrors((e) => {
//       const n = { ...e };
//       delete n[k];
//       return n;
//     });
//   };

//   const isRepeat = form.result === "repeat";
//   const sessionOpts = isRepeat ? repeatSessionOpts : futureSessionOpts;

//   // When switching result type, reset session to first valid option
//   const switchResult = (r: "promoted" | "repeat") => {
//     const opts = r === "repeat" ? repeatSessionOpts : futureSessionOpts;
//     setForm((p) => ({
//       ...p,
//       result: r,
//       session: opts[0] ?? nextYear,
//       toClass:
//         r === "repeat"
//           ? fromClass
//           : allClasses.find((c) => c > fromClass) ?? fromClass,
//     }));
//     setErrors({});
//   };

//   // ── Validation ────────────────────────────────────────────────
//   const validate = () => {
//     const e: Record<string, string> = {};

//     if (!form.session) {
//       e.session = "Session is required";
//     } else if (!isRepeat && form.session <= curSession) {
//       // Promotion must be to a FUTURE session (strictly greater)
//       e.session = `Promotion session must be after current session (${curSession})`;
//     }

//     if (!isRepeat && form.toClass <= fromClass) {
//       e.toClass = `Promoted class must be higher than current Class ${fromClass}`;
//     }

//     if (!form.newRoll || form.newRoll < 1) {
//       e.newRoll = "Roll number must be ≥ 1";
//     }

//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const handleSubmit = async () => {
//     if (!validate()) return;
//     try {
//       await promote({
//         studentUid,
//         entry: {
//           session: form.session,
//           fromClass,
//           toClass: isRepeat ? fromClass : Number(form.toClass),
//           result: form.result,
//           previousRoll: fromRoll,
//           newRoll: Number(form.newRoll),
//           remarks: form.remarks || undefined,
//         },
//       }).unwrap();

//       toast.success("Promotion recorded", {
//         description: isRepeat
//           ? `${student?.name.en} will repeat Class ${fromClass} in ${form.session}`
//           : `${student?.name.en} promoted to Class ${form.toClass} in ${form.session}`,
//       });
//       router.push(`/students/${studentUid}`);
//     } catch (e: any) {
//       const msg = e?.data?.message ?? "Promotion failed. Please try again.";
//       toast.error("Failed", { description: msg });
//       setErrors({ _global: msg });
//     }
//   };

//   return (
//     <>
//       <style>{CSS}</style>
//       <div className="pr">
//         <a href={`/students/${studentUid}`} className="pr-back">
//           <svg
//             width="13"
//             height="13"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2.5"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           >
//             <path d="M19 12H5M12 19l-7-7 7-7" />
//           </svg>
//           Back to Student
//         </a>

//         <h1 className="pr-title">Promote Student</h1>
//         <p className="pr-desc">
//           Process promotion or repeat for{" "}
//           <strong style={{ color: "var(--text-primary)" }}>
//             {studentLoading ? "…" : student?.name.en ?? studentUid}
//           </strong>
//         </p>

//         {/* Current enrollment strip */}
//         {studentLoading ? (
//           <div
//             className="pr-skel"
//             style={{
//               height: 72,
//               marginBottom: 18,
//               borderRadius: "var(--radius-sm)",
//             }}
//           />
//         ) : student ? (
//           <div className="pr-strip">
//             <div>
//               <div className="pr-strip-lbl">Current Class</div>
//               <div className="pr-strip-val">{fromClass}</div>
//             </div>
//             <div className="pr-strip-arrow">
//               <svg
//                 width="18"
//                 height="18"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <path d="M5 12h14M12 5l7 7-7 7" />
//               </svg>
//             </div>
//             <div>
//               <div className="pr-strip-lbl">
//                 {isRepeat ? "Stays At" : "Promoted To"}
//               </div>
//               <div
//                 className={`pr-strip-val ${
//                   isRepeat ? "pr-strip-repeat" : "pr-strip-promoted"
//                 }`}
//               >
//                 {isRepeat ? fromClass : form.toClass}
//               </div>
//             </div>
//             <div style={{ marginLeft: "auto", textAlign: "right" }}>
//               <div className="pr-strip-lbl">Current Roll</div>
//               <div className="pr-strip-val" style={{ fontSize: 18 }}>
//                 #{fromRoll}
//               </div>
//             </div>
//             <div style={{ textAlign: "right" }}>
//               <div className="pr-strip-lbl">Session</div>
//               <div
//                 className="pr-strip-val"
//                 style={{ fontSize: 16, color: "var(--accent)" }}
//               >
//                 {curSession}
//               </div>
//             </div>
//           </div>
//         ) : null}

//         <div className="pr-card">
//           <div className="pr-card-title">Promotion Details</div>

//           {/* Result toggle */}
//           <div className="pr-result-row">
//             {(["promoted", "repeat"] as const).map((r) => (
//               <button
//                 key={r}
//                 type="button"
//                 className={`pr-result-btn ${
//                   form.result === r ? `pr-result-btn-${r}` : ""
//                 }`}
//                 onClick={() => switchResult(r)}
//               >
//                 <div className="pr-result-icon">
//                   {r === "promoted" ? "🎓" : "🔄"}
//                 </div>
//                 <div className="pr-result-label">
//                   {r === "promoted" ? "Promoted" : "Repeat"}
//                 </div>
//                 <div className="pr-result-sub">
//                   {r === "promoted"
//                     ? "Move to next class"
//                     : "Stay in same class"}
//                 </div>
//               </button>
//             ))}
//           </div>

//           <div className={isRepeat ? "pr-grid-2" : "pr-grid-3"}>
//             {/* Session */}
//             <div className="pr-field">
//               <label className="pr-label">Academic Session</label>
//               <select
//                 className={`pr-select ${errors.session ? "err" : ""}`}
//                 value={form.session}
//                 onChange={(e) => set("session", e.target.value)}
//               >
//                 {sessionOpts.map((s) => (
//                   <option key={s} value={s}>
//                     {s}
//                   </option>
//                 ))}
//               </select>
//               {errors.session && (
//                 <span className="pr-field-err">{errors.session}</span>
//               )}
//               {!isRepeat && (
//                 <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
//                   Only sessions after {curSession} allowed
//                 </span>
//               )}
//             </div>

//             {/* To Class — shown only for promotion, 1-12, must be > fromClass */}
//             {!isRepeat && (
//               <div className="pr-field">
//                 <label className="pr-label">Promote To Class</label>
//                 <select
//                   className={`pr-select ${errors.toClass ? "err" : ""}`}
//                   value={form.toClass}
//                   onChange={(e) => set("toClass", Number(e.target.value))}
//                 >
//                   {allClasses
//                     .filter((c) => c > fromClass)
//                     .map((c) => (
//                       <option key={c} value={c}>
//                         Class {c}
//                       </option>
//                     ))}
//                 </select>
//                 {errors.toClass && (
//                   <span className="pr-field-err">{errors.toClass}</span>
//                 )}
//                 {allClasses.filter((c) => c > fromClass).length === 0 && (
//                   <span className="pr-field-err">
//                     Student is already in the highest class
//                   </span>
//                 )}
//               </div>
//             )}

//             {/* New Roll */}
//             <div className="pr-field">
//               <label className="pr-label">New Roll No.</label>
//               <input
//                 type="number"
//                 min={1}
//                 className={`pr-input ${errors.newRoll ? "err" : ""}`}
//                 value={form.newRoll}
//                 onChange={(e) => set("newRoll", Number(e.target.value))}
//                 style={{ fontFamily: '"JetBrains Mono",monospace' }}
//               />
//               {errors.newRoll && (
//                 <span className="pr-field-err">{errors.newRoll}</span>
//               )}
//             </div>
//           </div>

//           {/* Remarks */}
//           <div className="pr-field" style={{ marginTop: 14 }}>
//             <label className="pr-label">
//               Remarks{" "}
//               <span
//                 style={{
//                   color: "var(--text-muted)",
//                   fontWeight: 400,
//                   textTransform: "none",
//                   fontSize: 10,
//                 }}
//               >
//                 (optional)
//               </span>
//             </label>
//             <input
//               className="pr-input"
//               placeholder="e.g. Excellent academic performance"
//               value={form.remarks}
//               onChange={(e) => set("remarks", e.target.value)}
//             />
//           </div>

//           {/* Repeat warning */}
//           {isRepeat && (
//             <div className="pr-warn">
//               <svg
//                 width="14"
//                 height="14"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="var(--accent)"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 style={{ flexShrink: 0, marginTop: 1 }}
//               >
//                 <circle cx="12" cy="12" r="10" />
//                 <path d="M12 8v4M12 16h.01" />
//               </svg>
//               <span>
//                 Student will remain in{" "}
//                 <strong style={{ color: "var(--accent)" }}>
//                   Class {fromClass}
//                 </strong>{" "}
//                 for session{" "}
//                 <strong style={{ color: "var(--accent)" }}>
//                   {form.session}
//                 </strong>{" "}
//                 with roll{" "}
//                 <strong style={{ color: "var(--accent)" }}>
//                   #{form.newRoll}
//                 </strong>
//                 .
//               </span>
//             </div>
//           )}

//           {/* Global error */}
//           {errors._global && (
//             <div className="pr-alert">
//               <svg
//                 width="14"
//                 height="14"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="var(--error)"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 style={{ flexShrink: 0, marginTop: 1 }}
//               >
//                 <circle cx="12" cy="12" r="10" />
//                 <path d="M12 8v4M12 16h.01" />
//               </svg>
//               {errors._global}
//             </div>
//           )}

//           {/* Preview */}
//           <div className="pr-preview">
//             <b>{student?.name.en ?? "Student"}</b> will be{" "}
//             {isRepeat ? (
//               <>
//                 <b>kept in Class {fromClass}</b> (repeat)
//               </>
//             ) : (
//               <>
//                 <b>
//                   promoted from Class {fromClass} → Class {form.toClass}
//                 </b>
//               </>
//             )}{" "}
//             · Session <b>{form.session}</b> · Roll <b>#{form.newRoll}</b>
//             {form.remarks && (
//               <>
//                 {" "}
//                 ·{" "}
//                 <em style={{ color: "var(--text-muted)" }}>"{form.remarks}"</em>
//               </>
//             )}
//           </div>

//           <div className="pr-footer">
//             <div />
//             <div style={{ display: "flex", gap: 10 }}>
//               <a href={`/students/${studentUid}`} className="pr-btn-cancel">
//                 Cancel
//               </a>
//               <button
//                 type="button"
//                 className="pr-btn"
//                 onClick={handleSubmit}
//                 disabled={
//                   isLoading ||
//                   studentLoading ||
//                   (!isRepeat &&
//                     allClasses.filter((c) => c > fromClass).length === 0)
//                 }
//               >
//                 {isLoading ? (
//                   <>
//                     <div className="pr-spinner" /> Processing…
//                   </>
//                 ) : (
//                   <>
//                     <svg
//                       width="13"
//                       height="13"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2.5"
//                     >
//                       <path d="M20 6 9 17l-5-5" />
//                     </svg>
//                     Confirm {isRepeat ? "Repeat" : "Promotion"}
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
// src/app/(dashboard)/students/[studentUid]/promote/page.tsx
// "use client";

// import { useParams, useRouter } from "next/navigation";
// import { useState } from "react";
// import { toast } from "sonner";
// import {
//   useGetStudentQuery,
//   usePromoteStudentMutation,
//   useGetSessionsQuery,
//   useGetClassesQuery,
// } from "@/lib/services/studentApi";

// const CSS = `
// .pr { max-width:700px; margin:0 auto; animation:pageEnter .3s ease both; }

// .pr-back { display:inline-flex; align-items:center; gap:7px; font-size:12.5px; color:var(--text-muted); text-decoration:none; margin-bottom:16px; transition:color .18s; }
// .pr-back:hover { color:var(--accent); }

// .pr-title { font-size:16px; font-weight:700; color:var(--text-primary); margin:0; }
// .pr-desc  { font-size:12.5px; color:var(--text-muted); margin:4px 0 20px; }

// /* Strip */
// .pr-strip {
//   background:var(--bg-card); border:1px solid var(--border);
//   border-radius:var(--radius-sm); padding:16px 20px; margin-bottom:18px;
//   display:flex; gap:20px; align-items:center; flex-wrap:wrap;
// }
// .pr-strip-lbl { font-size:10px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:.6px; }
// .pr-strip-val { font-size:24px; font-weight:800; color:var(--text-primary); font-family:'JetBrains Mono',monospace; letter-spacing:-1px; margin-top:2px; }
// .pr-strip-arrow { color:var(--border); margin:0 4px; }
// .pr-strip-promoted { color:var(--success); }
// .pr-strip-repeat   { color:var(--accent); }

// /* Card */
// .pr-card {
//   background:var(--bg-card); border:1px solid var(--border);
//   border-radius:var(--radius-sm); padding:22px 24px;
// }
// .pr-card-title { font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:.6px; margin-bottom:18px; }

// /* Result toggle */
// .pr-result-row { display:flex; gap:10px; margin-bottom:20px; }
// .pr-result-btn {
//   flex:1; padding:16px 10px; border-radius:11px;
//   border:1.5px solid var(--border); background:var(--bg-input);
//   cursor:pointer; text-align:center; transition:all .18s; font-family:inherit;
// }
// .pr-result-btn-promoted { border-color:rgba(52,211,153,.4); background:rgba(52,211,153,.07); }
// .pr-result-btn-repeat   { border-color:rgba(245,158,11,.4); background:rgba(245,158,11,.07); }
// .pr-result-icon  { font-size:24px; margin-bottom:6px; }
// .pr-result-label { font-size:13px; font-weight:700; color:var(--text-secondary); }
// .pr-result-sub   { font-size:11px; color:var(--text-muted); margin-top:2px; }
// .pr-result-btn-promoted .pr-result-label { color:var(--success); }
// .pr-result-btn-repeat   .pr-result-label { color:var(--accent); }

// /* Grid */
// .pr-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
// .pr-grid-3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; }
// @media(max-width:560px){ .pr-grid-2,.pr-grid-3 { grid-template-columns:1fr; } }

// /* Field */
// .pr-field  { display:flex; flex-direction:column; gap:5px; }
// .pr-label  { font-size:11px; font-weight:700; color:var(--text-secondary); text-transform:uppercase; letter-spacing:.4px; }
// .pr-input,.pr-select {
//   width:100%; box-sizing:border-box;
//   background:var(--bg-input); border:1.5px solid var(--border);
//   border-radius:9px; padding:9px 12px; font-family:inherit;
//   font-size:13px; color:var(--text-primary); outline:none; transition:border-color .18s;
// }
// .pr-input::placeholder { color:var(--text-muted); }
// .pr-input:focus,.pr-select:focus {
//   border-color:rgba(245,158,11,.5);
//   box-shadow:0 0 0 3px rgba(245,158,11,.08);
// }
// .pr-input.err,.pr-select.err { border-color:var(--error); }
// .pr-field-err { font-size:11px; color:var(--error); }

// /* Warning */
// .pr-warn {
//   background:rgba(245,158,11,.07); border:1px solid rgba(245,158,11,.2);
//   border-radius:9px; padding:12px 14px; margin-top:14px;
//   font-size:12.5px; color:var(--text-secondary); display:flex; gap:8px; align-items:flex-start;
// }

// /* Validation alert */
// .pr-alert {
//   background:rgba(248,113,113,.07); border:1px solid rgba(248,113,113,.2);
//   border-radius:9px; padding:12px 14px; margin-top:14px;
//   font-size:12.5px; color:var(--error); display:flex; gap:8px; align-items:flex-start;
// }

// /* Preview */
// .pr-preview {
//   background:rgba(245,158,11,.06); border:1px solid rgba(245,158,11,.15);
//   border-radius:10px; padding:14px 16px; margin-top:14px;
//   font-size:13px; color:var(--text-secondary); line-height:1.7;
// }
// .pr-preview b { color:var(--accent); }

// /* Footer */
// .pr-footer {
//   display:flex; align-items:center; justify-content:space-between;
//   gap:12px; margin-top:20px; padding-top:18px; border-top:1px solid var(--border); flex-wrap:wrap;
// }
// .pr-btn {
//   display:inline-flex; align-items:center; gap:7px;
//   background:var(--accent); color:#0B0F1A; border:none;
//   border-radius:10px; padding:10px 22px; font-family:inherit;
//   font-size:13px; font-weight:700; cursor:pointer;
//   transition:all .18s; box-shadow:0 4px 14px rgba(245,158,11,.3);
// }
// .pr-btn:hover:not(:disabled) { filter:brightness(1.1); transform:translateY(-1px); }
// .pr-btn:disabled { opacity:.5; cursor:not-allowed; transform:none; }
// .pr-btn-cancel {
//   display:inline-flex; align-items:center; gap:7px;
//   background:none; border:1.5px solid var(--border); border-radius:10px;
//   padding:10px 16px; font-family:inherit; font-size:13px; font-weight:600;
//   color:var(--text-muted); cursor:pointer; text-decoration:none; transition:all .18s;
// }
// .pr-btn-cancel:hover { border-color:var(--text-muted); color:var(--text-primary); }
// .pr-spinner {
//   width:14px; height:14px; border:2px solid rgba(11,15,26,.3);
//   border-top-color:#0B0F1A; border-radius:50%;
//   animation:pr-spin 1s linear infinite;
// }
// @keyframes pr-spin { to { transform:rotate(360deg); } }

// /* Skeleton */
// .pr-skel { background:var(--bg-input); border-radius:8px; animation:prPulse 1.5s ease infinite; }
// @keyframes prPulse { 0%,100%{opacity:1} 50%{opacity:.4} }
// `;

// export default function StudentPromotePage() {
//   const { studentUid } = useParams<{ studentUid: string }>();
//   const router = useRouter();

//   const { data: studentData, isLoading: studentLoading } =
//     useGetStudentQuery(studentUid);
//   const { data: sessionsRaw = [] } = useGetSessionsQuery();
//   const { data: classesRaw = [] } = useGetClassesQuery();
//   const [promote, { isLoading }] = usePromoteStudentMutation();

//   const student = studentData?.data;
//   const fromClass = student?.current?.class ?? 1;
//   const fromRoll = student?.current?.roll ?? 1;
//   const curSession = student?.current?.session ?? "";

//   // ── Session options ──────────────────────────────────────────
//   // Include next year if not already present; sort desc
//   const thisYear = new Date().getFullYear();
//   const nextYear = String(thisYear + 1);
//   const allSessions = sessionsRaw.includes(nextYear)
//     ? [...sessionsRaw]
//     : [...sessionsRaw, nextYear];
//   // Future-only sessions (strictly after current session)
//   const futureSessionOpts = allSessions
//     .filter((s) => s > curSession)
//     .sort()
//     .reverse();
//   // For repeat — same or future sessions (can stay in same session)
//   const repeatSessionOpts = allSessions
//     .filter((s) => s >= curSession)
//     .sort()
//     .reverse();

//   // ── Class options ─────────────────────────────────────────────
//   // Ensure 1-12 range; merge with DB values
//   const allClasses = Array.from(
//     new Set([...classesRaw, ...Array.from({ length: 12 }, (_, i) => i + 1)])
//   ).sort((a, b) => a - b);

//   const defaultSession = futureSessionOpts[0] ?? nextYear;
//   const defaultToClass = allClasses.find((c) => c > fromClass) ?? fromClass;

//   const [form, setForm] = useState({
//     session: defaultSession,
//     toClass: defaultToClass,
//     result: "promoted" as "promoted" | "repeat",
//     newRoll: 1,
//     remarks: "",
//   });
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => {
//     setForm((p) => ({ ...p, [k]: v }));
//     setErrors((e) => {
//       const n = { ...e };
//       delete n[k];
//       return n;
//     });
//   };

//   const isRepeat = form.result === "repeat";
//   const sessionOpts = isRepeat ? repeatSessionOpts : futureSessionOpts;

//   // When switching result type, reset session to first valid option
//   const switchResult = (r: "promoted" | "repeat") => {
//     const opts = r === "repeat" ? repeatSessionOpts : futureSessionOpts;
//     setForm((p) => ({
//       ...p,
//       result: r,
//       session: opts[0] ?? nextYear,
//       toClass:
//         r === "repeat"
//           ? fromClass
//           : allClasses.find((c) => c > fromClass) ?? fromClass,
//     }));
//     setErrors({});
//   };

//   // ── Validation ────────────────────────────────────────────────
//   const validate = () => {
//     const e: Record<string, string> = {};

//     if (!form.session) {
//       e.session = "Session is required";
//     } else if (!isRepeat && form.session <= curSession) {
//       // Promotion must be to a FUTURE session (strictly greater)
//       e.session = `Promotion session must be after current session (${curSession})`;
//     }

//     if (!isRepeat && form.toClass <= fromClass) {
//       e.toClass = `Promoted class must be higher than current Class ${fromClass}`;
//     }

//     if (!form.newRoll || form.newRoll < 1) {
//       e.newRoll = "Roll number must be ≥ 1";
//     }

//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const handleSubmit = async () => {
//     if (!validate()) return;
//     try {
//       await promote({
//         studentUid,
//         entry: {
//           session: form.session,
//           fromClass,
//           toClass: isRepeat ? fromClass : Number(form.toClass),
//           result: form.result,
//           previousRoll: fromRoll,
//           newRoll: Number(form.newRoll),
//           remarks: form.remarks || undefined,
//         },
//       }).unwrap();

//       toast.success("Promotion recorded", {
//         description: isRepeat
//           ? `${student?.name.en} will repeat Class ${fromClass} in ${form.session}`
//           : `${student?.name.en} promoted to Class ${form.toClass} in ${form.session}`,
//       });
//       router.push(`/students/${studentUid}`);
//     } catch (e: any) {
//       const msg = e?.data?.message ?? "Promotion failed. Please try again.";
//       toast.error("Failed", { description: msg });
//       setErrors({ _global: msg });
//     }
//   };

//   return (
//     <>
//       <style>{CSS}</style>
//       <div className="pr">
//         <a href={`/students/${studentUid}`} className="pr-back">
//           <svg
//             width="13"
//             height="13"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2.5"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           >
//             <path d="M19 12H5M12 19l-7-7 7-7" />
//           </svg>
//           Back to Student
//         </a>

//         <h1 className="pr-title">Promote Student</h1>
//         <p className="pr-desc">
//           Process promotion or repeat for{" "}
//           <strong style={{ color: "var(--text-primary)" }}>
//             {studentLoading ? "…" : student?.name.en ?? studentUid}
//           </strong>
//         </p>

//         {/* Current enrollment strip */}
//         {studentLoading ? (
//           <div
//             className="pr-skel"
//             style={{
//               height: 72,
//               marginBottom: 18,
//               borderRadius: "var(--radius-sm)",
//             }}
//           />
//         ) : student ? (
//           <div className="pr-strip">
//             <div>
//               <div className="pr-strip-lbl">Current Class</div>
//               <div className="pr-strip-val">{fromClass}</div>
//             </div>
//             <div className="pr-strip-arrow">
//               <svg
//                 width="18"
//                 height="18"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <path d="M5 12h14M12 5l7 7-7 7" />
//               </svg>
//             </div>
//             <div>
//               <div className="pr-strip-lbl">
//                 {isRepeat ? "Stays At" : "Promoted To"}
//               </div>
//               <div
//                 className={`pr-strip-val ${
//                   isRepeat ? "pr-strip-repeat" : "pr-strip-promoted"
//                 }`}
//               >
//                 {isRepeat ? fromClass : form.toClass}
//               </div>
//             </div>
//             <div style={{ marginLeft: "auto", textAlign: "right" }}>
//               <div className="pr-strip-lbl">Current Roll</div>
//               <div className="pr-strip-val" style={{ fontSize: 18 }}>
//                 #{fromRoll}
//               </div>
//             </div>
//             <div style={{ textAlign: "right" }}>
//               <div className="pr-strip-lbl">Session</div>
//               <div
//                 className="pr-strip-val"
//                 style={{ fontSize: 16, color: "var(--accent)" }}
//               >
//                 {curSession}
//               </div>
//             </div>
//           </div>
//         ) : null}

//         <div className="pr-card">
//           <div className="pr-card-title">Promotion Details</div>

//           {/* Result toggle */}
//           <div className="pr-result-row">
//             {(["promoted", "repeat"] as const).map((r) => (
//               <button
//                 key={r}
//                 type="button"
//                 className={`pr-result-btn ${
//                   form.result === r ? `pr-result-btn-${r}` : ""
//                 }`}
//                 onClick={() => switchResult(r)}
//               >
//                 <div className="pr-result-icon">
//                   {r === "promoted" ? "🎓" : "🔄"}
//                 </div>
//                 <div className="pr-result-label">
//                   {r === "promoted" ? "Promoted" : "Repeat"}
//                 </div>
//                 <div className="pr-result-sub">
//                   {r === "promoted"
//                     ? "Move to next class"
//                     : "Stay in same class"}
//                 </div>
//               </button>
//             ))}
//           </div>

//           <div className={isRepeat ? "pr-grid-2" : "pr-grid-3"}>
//             {/* Session */}
//             <div className="pr-field">
//               <label className="pr-label">Academic Session</label>
//               <select
//                 className={`pr-select ${errors.session ? "err" : ""}`}
//                 value={form.session}
//                 onChange={(e) => set("session", e.target.value)}
//               >
//                 {sessionOpts.map((s) => (
//                   <option key={s} value={s}>
//                     {s}
//                   </option>
//                 ))}
//               </select>
//               {errors.session && (
//                 <span className="pr-field-err">{errors.session}</span>
//               )}
//               {!isRepeat && (
//                 <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
//                   Only sessions after {curSession} allowed
//                 </span>
//               )}
//             </div>

//             {/* To Class — shown only for promotion, 1-12, must be > fromClass */}
//             {!isRepeat && (
//               <div className="pr-field">
//                 <label className="pr-label">Promote To Class</label>
//                 <select
//                   className={`pr-select ${errors.toClass ? "err" : ""}`}
//                   value={form.toClass}
//                   onChange={(e) => set("toClass", Number(e.target.value))}
//                 >
//                   {allClasses
//                     .filter((c) => c > fromClass)
//                     .map((c) => (
//                       <option key={c} value={c}>
//                         Class {c}
//                       </option>
//                     ))}
//                 </select>
//                 {errors.toClass && (
//                   <span className="pr-field-err">{errors.toClass}</span>
//                 )}
//                 {allClasses.filter((c) => c > fromClass).length === 0 && (
//                   <span className="pr-field-err">
//                     Student is already in the highest class
//                   </span>
//                 )}
//               </div>
//             )}

//             {/* New Roll */}
//             <div className="pr-field">
//               <label className="pr-label">New Roll No.</label>
//               <input
//                 type="number"
//                 min={1}
//                 className={`pr-input ${errors.newRoll ? "err" : ""}`}
//                 value={form.newRoll}
//                 onChange={(e) => set("newRoll", Number(e.target.value))}
//                 style={{ fontFamily: '"JetBrains Mono",monospace' }}
//               />
//               {errors.newRoll && (
//                 <span className="pr-field-err">{errors.newRoll}</span>
//               )}
//             </div>
//           </div>

//           {/* Remarks */}
//           <div className="pr-field" style={{ marginTop: 14 }}>
//             <label className="pr-label">
//               Remarks{" "}
//               <span
//                 style={{
//                   color: "var(--text-muted)",
//                   fontWeight: 400,
//                   textTransform: "none",
//                   fontSize: 10,
//                 }}
//               >
//                 (optional)
//               </span>
//             </label>
//             <input
//               className="pr-input"
//               placeholder="e.g. Excellent academic performance"
//               value={form.remarks}
//               onChange={(e) => set("remarks", e.target.value)}
//             />
//           </div>

//           {/* Repeat warning */}
//           {isRepeat && (
//             <div className="pr-warn">
//               <svg
//                 width="14"
//                 height="14"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="var(--accent)"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 style={{ flexShrink: 0, marginTop: 1 }}
//               >
//                 <circle cx="12" cy="12" r="10" />
//                 <path d="M12 8v4M12 16h.01" />
//               </svg>
//               <span>
//                 Student will remain in{" "}
//                 <strong style={{ color: "var(--accent)" }}>
//                   Class {fromClass}
//                 </strong>{" "}
//                 for session{" "}
//                 <strong style={{ color: "var(--accent)" }}>
//                   {form.session}
//                 </strong>{" "}
//                 with roll{" "}
//                 <strong style={{ color: "var(--accent)" }}>
//                   #{form.newRoll}
//                 </strong>
//                 .
//               </span>
//             </div>
//           )}

//           {/* Global error */}
//           {errors._global && (
//             <div className="pr-alert">
//               <svg
//                 width="14"
//                 height="14"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="var(--error)"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 style={{ flexShrink: 0, marginTop: 1 }}
//               >
//                 <circle cx="12" cy="12" r="10" />
//                 <path d="M12 8v4M12 16h.01" />
//               </svg>
//               {errors._global}
//             </div>
//           )}

//           {/* Preview */}
//           <div className="pr-preview">
//             <b>{student?.name.en ?? "Student"}</b> will be{" "}
//             {isRepeat ? (
//               <>
//                 <b>kept in Class {fromClass}</b> (repeat)
//               </>
//             ) : (
//               <>
//                 <b>
//                   promoted from Class {fromClass} → Class {form.toClass}
//                 </b>
//               </>
//             )}{" "}
//             · Session <b>{form.session}</b> · Roll <b>#{form.newRoll}</b>
//             {form.remarks && (
//               <>
//                 {" "}
//                 ·{" "}
//                 <em style={{ color: "var(--text-muted)" }}>"{form.remarks}"</em>
//               </>
//             )}
//           </div>

//           <div className="pr-footer">
//             <div />
//             <div style={{ display: "flex", gap: 10 }}>
//               <a href={`/students/${studentUid}`} className="pr-btn-cancel">
//                 Cancel
//               </a>
//               <button
//                 type="button"
//                 className="pr-btn"
//                 onClick={handleSubmit}
//                 disabled={
//                   isLoading ||
//                   studentLoading ||
//                   (!isRepeat &&
//                     allClasses.filter((c) => c > fromClass).length === 0)
//                 }
//               >
//                 {isLoading ? (
//                   <>
//                     <div className="pr-spinner" /> Processing…
//                   </>
//                 ) : (
//                   <>
//                     <svg
//                       width="13"
//                       height="13"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2.5"
//                     >
//                       <path d="M20 6 9 17l-5-5" />
//                     </svg>
//                     Confirm {isRepeat ? "Repeat" : "Promotion"}
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
// src/app/(dashboard)/students/[studentUid]/promote/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  useGetStudentQuery,
  usePromoteStudentMutation,
  useGetSessionsQuery,
  useGetClassesQuery,
} from "@/lib/services/studentApi";

const CSS = `
.pr { max-width:700px; margin:0 auto; animation:pageEnter .3s ease both; }

.pr-back { display:inline-flex; align-items:center; gap:7px; font-size:12.5px; color:var(--text-muted); text-decoration:none; margin-bottom:16px; transition:color .18s; }
.pr-back:hover { color:var(--accent); }

.pr-title { font-size:16px; font-weight:700; color:var(--text-primary); margin:0; }
.pr-desc  { font-size:12.5px; color:var(--text-muted); margin:4px 0 20px; }

/* Strip */
.pr-strip {
  background:var(--bg-card); border:1px solid var(--border);
  border-radius:var(--radius-sm); padding:16px 20px; margin-bottom:18px;
  display:flex; gap:20px; align-items:center; flex-wrap:wrap;
}
.pr-strip-lbl { font-size:10px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:.6px; }
.pr-strip-val { font-size:24px; font-weight:800; color:var(--text-primary); font-family:'JetBrains Mono',monospace; letter-spacing:-1px; margin-top:2px; }
.pr-strip-arrow { color:var(--border); margin:0 4px; }
.pr-strip-promoted { color:var(--success); }
.pr-strip-repeat   { color:var(--accent); }

/* Card */
.pr-card {
  background:var(--bg-card); border:1px solid var(--border);
  border-radius:var(--radius-sm); padding:22px 24px;
}
.pr-card-title { font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:.6px; margin-bottom:18px; }

/* Result toggle */
.pr-result-row { display:flex; gap:10px; margin-bottom:20px; }
.pr-result-btn {
  flex:1; padding:16px 10px; border-radius:11px;
  border:1.5px solid var(--border); background:var(--bg-input);
  cursor:pointer; text-align:center; transition:all .18s; font-family:inherit;
}
.pr-result-btn-promoted { border-color:rgba(52,211,153,.4); background:rgba(52,211,153,.07); }
.pr-result-btn-repeat   { border-color:rgba(245,158,11,.4); background:rgba(245,158,11,.07); }
.pr-result-icon  { font-size:24px; margin-bottom:6px; }
.pr-result-label { font-size:13px; font-weight:700; color:var(--text-secondary); }
.pr-result-sub   { font-size:11px; color:var(--text-muted); margin-top:2px; }
.pr-result-btn-promoted .pr-result-label { color:var(--success); }
.pr-result-btn-repeat   .pr-result-label { color:var(--accent); }

/* Grid */
.pr-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.pr-grid-3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; }
@media(max-width:560px){ .pr-grid-2,.pr-grid-3 { grid-template-columns:1fr; } }

/* Field */
.pr-field  { display:flex; flex-direction:column; gap:5px; }
.pr-label  { font-size:11px; font-weight:700; color:var(--text-secondary); text-transform:uppercase; letter-spacing:.4px; }
.pr-input,.pr-select {
  width:100%; box-sizing:border-box;
  background:var(--bg-input); border:1.5px solid var(--border);
  border-radius:9px; padding:9px 12px; font-family:inherit;
  font-size:13px; color:var(--text-primary); outline:none; transition:border-color .18s;
}
.pr-input::placeholder { color:var(--text-muted); }
.pr-input:focus,.pr-select:focus {
  border-color:rgba(245,158,11,.5);
  box-shadow:0 0 0 3px rgba(245,158,11,.08);
}
.pr-input.err,.pr-select.err { border-color:var(--error); }
.pr-field-err { font-size:11px; color:var(--error); }

/* Warning */
.pr-warn {
  background:rgba(245,158,11,.07); border:1px solid rgba(245,158,11,.2);
  border-radius:9px; padding:12px 14px; margin-top:14px;
  font-size:12.5px; color:var(--text-secondary); display:flex; gap:8px; align-items:flex-start;
}

/* Validation alert */
.pr-alert {
  background:rgba(248,113,113,.07); border:1px solid rgba(248,113,113,.2);
  border-radius:9px; padding:12px 14px; margin-top:14px;
  font-size:12.5px; color:var(--error); display:flex; gap:8px; align-items:flex-start;
}

/* Preview */
.pr-preview {
  background:rgba(245,158,11,.06); border:1px solid rgba(245,158,11,.15);
  border-radius:10px; padding:14px 16px; margin-top:14px;
  font-size:13px; color:var(--text-secondary); line-height:1.7;
}
.pr-preview b { color:var(--accent); }

/* Footer */
.pr-footer {
  display:flex; align-items:center; justify-content:space-between;
  gap:12px; margin-top:20px; padding-top:18px; border-top:1px solid var(--border); flex-wrap:wrap;
}
.pr-btn {
  display:inline-flex; align-items:center; gap:7px;
  background:var(--accent); color:#0B0F1A; border:none;
  border-radius:10px; padding:10px 22px; font-family:inherit;
  font-size:13px; font-weight:700; cursor:pointer;
  transition:all .18s; box-shadow:0 4px 14px rgba(245,158,11,.3);
}
.pr-btn:hover:not(:disabled) { filter:brightness(1.1); transform:translateY(-1px); }
.pr-btn:disabled { opacity:.5; cursor:not-allowed; transform:none; }
.pr-btn-cancel {
  display:inline-flex; align-items:center; gap:7px;
  background:none; border:1.5px solid var(--border); border-radius:10px;
  padding:10px 16px; font-family:inherit; font-size:13px; font-weight:600;
  color:var(--text-muted); cursor:pointer; text-decoration:none; transition:all .18s;
}
.pr-btn-cancel:hover { border-color:var(--text-muted); color:var(--text-primary); }
.pr-spinner {
  width:14px; height:14px; border:2px solid rgba(11,15,26,.3);
  border-top-color:#0B0F1A; border-radius:50%;
  animation:pr-spin 1s linear infinite;
}
@keyframes pr-spin { to { transform:rotate(360deg); } }

/* Skeleton */
.pr-skel { background:var(--bg-input); border-radius:8px; animation:prPulse 1.5s ease infinite; }
@keyframes prPulse { 0%,100%{opacity:1} 50%{opacity:.4} }
`;

export default function StudentPromotePage() {
  const { studentUid } = useParams<{ studentUid: string }>();
  const router = useRouter();

  const { data: studentData, isLoading: studentLoading } =
    useGetStudentQuery(studentUid);
  const { data: sessionsRaw = [] } = useGetSessionsQuery();
  const { data: classesRaw = [] } = useGetClassesQuery();
  const [promote, { isLoading }] = usePromoteStudentMutation();

  const student = studentData;
  const fromClass = student?.current?.class ?? 1;
  const fromRoll = student?.current?.roll ?? 1;
  const curSession = student?.current?.session ?? "";

  // ── Session options ──────────────────────────────────────────
  // Include next year if not already present; sort desc
  const thisYear = new Date().getFullYear();
  const nextYear = String(thisYear + 1);
  const allSessions = sessionsRaw.includes(nextYear)
    ? [...sessionsRaw]
    : [...sessionsRaw, nextYear];
  // Future-only sessions (strictly after current session)
  const futureSessionOpts = allSessions
    .filter((s) => s > curSession)
    .sort()
    .reverse();
  // For repeat — same or future sessions (can stay in same session)
  const repeatSessionOpts = allSessions
    .filter((s) => s >= curSession)
    .sort()
    .reverse();

  // ── Class options ─────────────────────────────────────────────
  // Ensure 1-12 range; merge with DB values
  const allClasses = Array.from(
    new Set([...classesRaw, ...Array.from({ length: 12 }, (_, i) => i + 1)])
  ).sort((a, b) => a - b);

  const defaultSession = futureSessionOpts[0] ?? nextYear;
  const defaultToClass = allClasses.find((c) => c > fromClass) ?? fromClass;

  const [form, setForm] = useState({
    session: defaultSession,
    toClass: defaultToClass,
    result: "promoted" as "promoted" | "repeat",
    newRoll: 1,
    remarks: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((e) => {
      const n = { ...e };
      delete n[k];
      return n;
    });
  };

  const isRepeat = form.result === "repeat";
  const sessionOpts = isRepeat ? repeatSessionOpts : futureSessionOpts;

  // When switching result type, reset session to first valid option
  const switchResult = (r: "promoted" | "repeat") => {
    const opts = r === "repeat" ? repeatSessionOpts : futureSessionOpts;
    setForm((p) => ({
      ...p,
      result: r,
      session: opts[0] ?? nextYear,
      toClass:
        r === "repeat"
          ? fromClass
          : allClasses.find((c) => c > fromClass) ?? fromClass,
    }));
    setErrors({});
  };

  // ── Validation ────────────────────────────────────────────────
  const validate = () => {
    const e: Record<string, string> = {};

    if (!form.session) {
      e.session = "Session is required";
    } else if (!isRepeat && form.session <= curSession) {
      // Promotion must be to a FUTURE session (strictly greater)
      e.session = `Promotion session must be after current session (${curSession})`;
    }

    if (!isRepeat && form.toClass <= fromClass) {
      e.toClass = `Promoted class must be higher than current Class ${fromClass}`;
    }

    if (!form.newRoll || form.newRoll < 1) {
      e.newRoll = "Roll number must be ≥ 1";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await promote({
        studentUid,
        entry: {
          session: form.session,
          fromClass,
          toClass: isRepeat ? fromClass : Number(form.toClass),
          result: form.result,
          previousRoll: fromRoll,
          newRoll: Number(form.newRoll),
          remarks: form.remarks || undefined,
        },
      }).unwrap();

      toast.success("Promotion recorded", {
        description: isRepeat
          ? `${student?.name.en} will repeat Class ${fromClass} in ${form.session}`
          : `${student?.name.en} promoted to Class ${form.toClass} in ${form.session}`,
      });
      router.push(`/students/${studentUid}`);
    } catch (e: any) {
      const msg = e?.data?.message ?? "Promotion failed. Please try again.";
      toast.error("Failed", { description: msg });
      setErrors({ _global: msg });
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="pr">
        <a href={`/students/${studentUid}`} className="pr-back">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Student
        </a>

        <h1 className="pr-title">Promote Student</h1>
        <p className="pr-desc">
          Process promotion or repeat for{" "}
          <strong style={{ color: "var(--text-primary)" }}>
            {studentLoading ? "…" : student?.name.en ?? studentUid}
          </strong>
        </p>

        {/* Current enrollment strip */}
        {studentLoading ? (
          <div
            className="pr-skel"
            style={{
              height: 72,
              marginBottom: 18,
              borderRadius: "var(--radius-sm)",
            }}
          />
        ) : student ? (
          <div className="pr-strip">
            <div>
              <div className="pr-strip-lbl">Current Class</div>
              <div className="pr-strip-val">{fromClass}</div>
            </div>
            <div className="pr-strip-arrow">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
            <div>
              <div className="pr-strip-lbl">
                {isRepeat ? "Stays At" : "Promoted To"}
              </div>
              <div
                className={`pr-strip-val ${
                  isRepeat ? "pr-strip-repeat" : "pr-strip-promoted"
                }`}
              >
                {isRepeat ? fromClass : form.toClass}
              </div>
            </div>
            <div style={{ marginLeft: "auto", textAlign: "right" }}>
              <div className="pr-strip-lbl">Current Roll</div>
              <div className="pr-strip-val" style={{ fontSize: 18 }}>
                #{fromRoll}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="pr-strip-lbl">Session</div>
              <div
                className="pr-strip-val"
                style={{ fontSize: 16, color: "var(--accent)" }}
              >
                {curSession}
              </div>
            </div>
          </div>
        ) : null}

        <div className="pr-card">
          <div className="pr-card-title">Promotion Details</div>

          {/* Result toggle */}
          <div className="pr-result-row">
            {(["promoted", "repeat"] as const).map((r) => (
              <button
                key={r}
                type="button"
                className={`pr-result-btn ${
                  form.result === r ? `pr-result-btn-${r}` : ""
                }`}
                onClick={() => switchResult(r)}
              >
                <div className="pr-result-icon">
                  {r === "promoted" ? "🎓" : "🔄"}
                </div>
                <div className="pr-result-label">
                  {r === "promoted" ? "Promoted" : "Repeat"}
                </div>
                <div className="pr-result-sub">
                  {r === "promoted"
                    ? "Move to next class"
                    : "Stay in same class"}
                </div>
              </button>
            ))}
          </div>

          <div className={isRepeat ? "pr-grid-2" : "pr-grid-3"}>
            {/* Session */}
            <div className="pr-field">
              <label className="pr-label">Academic Session</label>
              <select
                className={`pr-select ${errors.session ? "err" : ""}`}
                value={form.session}
                onChange={(e) => set("session", e.target.value)}
              >
                {sessionOpts.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {errors.session && (
                <span className="pr-field-err">{errors.session}</span>
              )}
              {!isRepeat && (
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  Only sessions after {curSession} allowed
                </span>
              )}
            </div>

            {/* To Class — shown only for promotion, 1-12, must be > fromClass */}
            {!isRepeat && (
              <div className="pr-field">
                <label className="pr-label">Promote To Class</label>
                <select
                  className={`pr-select ${errors.toClass ? "err" : ""}`}
                  value={form.toClass}
                  onChange={(e) => set("toClass", Number(e.target.value))}
                >
                  {allClasses
                    .filter((c) => c > fromClass)
                    .map((c) => (
                      <option key={c} value={c}>
                        Class {c}
                      </option>
                    ))}
                </select>
                {errors.toClass && (
                  <span className="pr-field-err">{errors.toClass}</span>
                )}
                {allClasses.filter((c) => c > fromClass).length === 0 && (
                  <span className="pr-field-err">
                    Student is already in the highest class
                  </span>
                )}
              </div>
            )}

            {/* New Roll */}
            <div className="pr-field">
              <label className="pr-label">New Roll No.</label>
              <input
                type="number"
                min={1}
                className={`pr-input ${errors.newRoll ? "err" : ""}`}
                value={form.newRoll}
                onChange={(e) => set("newRoll", Number(e.target.value))}
                style={{ fontFamily: '"JetBrains Mono",monospace' }}
              />
              {errors.newRoll && (
                <span className="pr-field-err">{errors.newRoll}</span>
              )}
            </div>
          </div>

          {/* Remarks */}
          <div className="pr-field" style={{ marginTop: 14 }}>
            <label className="pr-label">
              Remarks{" "}
              <span
                style={{
                  color: "var(--text-muted)",
                  fontWeight: 400,
                  textTransform: "none",
                  fontSize: 10,
                }}
              >
                (optional)
              </span>
            </label>
            <input
              className="pr-input"
              placeholder="e.g. Excellent academic performance"
              value={form.remarks}
              onChange={(e) => set("remarks", e.target.value)}
            />
          </div>

          {/* Repeat warning */}
          {isRepeat && (
            <div className="pr-warn">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ flexShrink: 0, marginTop: 1 }}
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              <span>
                Student will remain in{" "}
                <strong style={{ color: "var(--accent)" }}>
                  Class {fromClass}
                </strong>{" "}
                for session{" "}
                <strong style={{ color: "var(--accent)" }}>
                  {form.session}
                </strong>{" "}
                with roll{" "}
                <strong style={{ color: "var(--accent)" }}>
                  #{form.newRoll}
                </strong>
                .
              </span>
            </div>
          )}

          {/* Global error */}
          {errors._global && (
            <div className="pr-alert">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--error)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ flexShrink: 0, marginTop: 1 }}
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              {errors._global}
            </div>
          )}

          {/* Preview */}
          <div className="pr-preview">
            <b>{student?.name.en ?? "Student"}</b> will be{" "}
            {isRepeat ? (
              <>
                <b>kept in Class {fromClass}</b> (repeat)
              </>
            ) : (
              <>
                <b>
                  promoted from Class {fromClass} → Class {form.toClass}
                </b>
              </>
            )}{" "}
            · Session <b>{form.session}</b> · Roll <b>#{form.newRoll}</b>
            {form.remarks && (
              <>
                {" "}
                ·{" "}
                <em style={{ color: "var(--text-muted)" }}>"{form.remarks}"</em>
              </>
            )}
          </div>

          <div className="pr-footer">
            <div />
            <div style={{ display: "flex", gap: 10 }}>
              <a href={`/students/${studentUid}`} className="pr-btn-cancel">
                Cancel
              </a>
              <button
                type="button"
                className="pr-btn"
                onClick={handleSubmit}
                disabled={
                  isLoading ||
                  studentLoading ||
                  (!isRepeat &&
                    allClasses.filter((c) => c > fromClass).length === 0)
                }
              >
                {isLoading ? (
                  <>
                    <div className="pr-spinner" /> Processing…
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
                    Confirm {isRepeat ? "Repeat" : "Promotion"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
