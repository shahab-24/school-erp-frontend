// src/app/(dashboard)/results/config/_components/rc-styles.ts
// Shared CSS for the result config module — consumed via <style>{RC_CSS}</style>

export const RC_CSS = `
@keyframes rcPageIn  { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:none } }
@keyframes rcSlideIn { from { opacity:0; transform:translateY(6px)  } to { opacity:1; transform:none } }
@keyframes rcSpin    { to   { transform:rotate(360deg) } }
@keyframes rcPulse   { 0%,100%{opacity:1} 50%{opacity:.4} }

/* ── Layout ─────────────────────────────────────────────── */
.rc { max-width:900px; margin:0 auto; animation:rcPageIn .3s ease both; }
.rc-back { display:inline-flex; align-items:center; gap:7px; font-size:12.5px; color:var(--text-muted); text-decoration:none; margin-bottom:16px; transition:color .18s; }
.rc-back:hover { color:var(--accent); }
.rc-head { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; margin-bottom:22px; flex-wrap:wrap; }
.rc-title { font-size:20px; font-weight:700; color:var(--text-primary); letter-spacing:-.4px; margin:0; }
.rc-sub   { font-size:13px; color:var(--text-muted); margin:3px 0 0; }

/* ── Tabs ───────────────────────────────────────────────── */
.rc-tabs { display:flex; gap:4px; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-sm); padding:5px; margin-bottom:20px; width:fit-content; }
.rc-tab  { display:flex; align-items:center; gap:6px; padding:7px 16px; border-radius:8px; border:none; font-family:inherit; font-size:13px; font-weight:600; cursor:pointer; transition:all .18s; background:none; color:var(--text-muted); }
.rc-tab.active { background:var(--bg-input); color:var(--text-primary); box-shadow:0 1px 4px rgba(0,0,0,.15); }
.rc-tab:not(.active):hover { color:var(--text-secondary); }

/* ── Card ───────────────────────────────────────────────── */
.rc-card { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius); padding:22px 24px; margin-bottom:14px; position:relative; overflow:hidden; animation:rcSlideIn .25s ease both; }
.rc-card::before { content:''; position:absolute; top:0; left:20px; right:20px; height:2px; background:linear-gradient(90deg,transparent,rgba(245,158,11,.12),transparent); }
.rc-card-title { font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:.7px; margin-bottom:18px; display:flex; align-items:center; gap:8px; }
.rc-card-icon  { width:24px; height:24px; border-radius:6px; background:rgba(245,158,11,.1); border:1px solid rgba(245,158,11,.2); display:flex; align-items:center; justify-content:center; color:var(--accent); font-size:12px; flex-shrink:0; }

/* ── Grid helpers ───────────────────────────────────────── */
.rc-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
@media(max-width:640px){ .rc-grid-2 { grid-template-columns:1fr; } }

/* ── Form primitives ────────────────────────────────────── */
.rc-field  { display:flex; flex-direction:column; gap:5px; }
.rc-label  { font-size:11px; font-weight:700; color:var(--text-secondary); text-transform:uppercase; letter-spacing:.4px; }
.rc-req    { color:var(--error); margin-left:2px; }
.rc-input, .rc-select {
  width:100%; box-sizing:border-box; background:var(--bg-input);
  border:1.5px solid var(--border); border-radius:var(--radius-sm);
  padding:9px 12px; font-family:inherit; font-size:13px; color:var(--text-primary);
  outline:none; transition:border-color .18s, box-shadow .18s;
}
.rc-input::placeholder { color:var(--text-muted); }
.rc-input:focus, .rc-select:focus { border-color:rgba(245,158,11,.5); box-shadow:0 0 0 3px rgba(245,158,11,.08); }
.rc-input.err { border-color:var(--error); }
.rc-error  { font-size:11px; color:var(--error); display:flex; align-items:center; gap:4px; margin-top:1px; }
.rc-hint   { font-size:11px; color:var(--text-muted); margin-top:2px; }
.rc-cb-row { display:flex; align-items:center; gap:9px; cursor:pointer; }
.rc-cb-row input[type=checkbox] { width:15px; height:15px; accent-color:var(--accent); cursor:pointer; }
.rc-cb-lbl { font-size:13px; color:var(--text-secondary); }
.rc-col-hdr { font-size:10px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:.4px; }

/* ── Table-style rows ───────────────────────────────────── */
.rc-row {
  padding:12px; margin-bottom:8px;
  background:var(--bg-input); border:1px solid var(--border);
  border-radius:var(--radius-sm); transition:border-color .18s;
}
.rc-row:hover { border-color:rgba(245,158,11,.2); }
.rc-exam-row  { display:grid; grid-template-columns:1fr 1fr 100px 80px 36px; gap:10px; align-items:end; }
.rc-norm-row  { display:grid; grid-template-columns:1fr 100px 100px 36px;    gap:10px; align-items:end; }
.rc-grade-row { display:grid; grid-template-columns:100px 1fr 100px 36px;    gap:10px; align-items:end; }
@media(max-width:640px){
  .rc-exam-row,.rc-norm-row,.rc-grade-row { grid-template-columns:1fr 1fr; }
  .rc-exam-row>*:last-child, .rc-norm-row>*:last-child, .rc-grade-row>*:last-child { grid-column:1/-1; justify-self:end; }
}

/* ── Aggregation type cards ─────────────────────────────── */
.rc-agg-cards { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-bottom:18px; }
@media(max-width:560px){ .rc-agg-cards { grid-template-columns:1fr; } }
.rc-agg-card { padding:14px 16px; border-radius:var(--radius-sm); border:1.5px solid var(--border); background:var(--bg-input); cursor:pointer; transition:all .18s; text-align:left; font-family:inherit; }
.rc-agg-card.active { border-color:rgba(245,158,11,.5); background:rgba(245,158,11,.07); }
.rc-agg-card:not(.active):hover { border-color:rgba(245,158,11,.25); }
.rc-agg-title { font-size:13px; font-weight:700; color:var(--text-primary); }
.rc-agg-card.active .rc-agg-title { color:var(--accent); }
.rc-agg-desc  { font-size:11.5px; color:var(--text-muted); margin-top:3px; }

/* ── Grading type toggle ────────────────────────────────── */
.rc-gtype-row { display:flex; gap:10px; margin-bottom:18px; flex-wrap:wrap; }
.rc-gtype-btn { flex:1; min-width:120px; padding:12px 16px; border-radius:var(--radius-sm); border:1.5px solid var(--border); background:var(--bg-input); cursor:pointer; transition:all .18s; font-family:inherit; text-align:center; }
.rc-gtype-btn.active { border-color:rgba(245,158,11,.5); background:rgba(245,158,11,.07); }
.rc-gtype-icon { font-size:20px; margin-bottom:4px; }
.rc-gtype-lbl  { font-size:13px; font-weight:700; color:var(--text-secondary); }
.rc-gtype-btn.active .rc-gtype-lbl { color:var(--accent); }

/* ── Weighted / Average dynamic UI ─────────────────────── */
.rc-weights-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(180px,1fr)); gap:10px; }
.rc-weight-row   { display:flex; gap:8px; align-items:center; }
.rc-weight-key   { font-size:12px; color:var(--text-muted); font-weight:600; min-width:70px; }
.rc-chips        { display:flex; flex-wrap:wrap; gap:8px; }
.rc-chip {
  display:flex; align-items:center; gap:7px; padding:6px 12px; border-radius:20px;
  cursor:pointer; border:1.5px solid var(--border); background:var(--bg-input);
  transition:all .18s; font-size:12.5px; color:var(--text-secondary); font-family:inherit;
}
.rc-chip.active { border-color:rgba(245,158,11,.5); background:rgba(245,158,11,.1); color:var(--accent); }

/* ── Buttons ────────────────────────────────────────────── */
.rc-add-btn { width:100%; display:flex; align-items:center; justify-content:center; gap:7px; background:none; border:1.5px dashed var(--border); border-radius:var(--radius-sm); padding:10px; font-family:inherit; font-size:13px; font-weight:600; color:var(--text-muted); cursor:pointer; transition:all .18s; }
.rc-add-btn:hover { border-color:rgba(245,158,11,.4); color:var(--accent); background:rgba(245,158,11,.04); }
.rc-rm-btn  { display:flex; align-items:center; justify-content:center; width:36px; height:36px; border-radius:8px; background:rgba(248,113,113,.07); border:1px solid rgba(248,113,113,.15); color:var(--error); cursor:pointer; transition:background .18s; font-family:inherit; flex-shrink:0; }
.rc-rm-btn:hover { background:rgba(248,113,113,.15); }
.rc-btn-ghost { display:inline-flex; align-items:center; gap:7px; background:none; border:1.5px solid var(--border); border-radius:10px; padding:9px 16px; font-family:inherit; font-size:13px; font-weight:600; color:var(--text-muted); cursor:pointer; text-decoration:none; transition:all .18s; }
.rc-btn-ghost:hover { border-color:var(--bg-input); color:var(--text-primary); }
.rc-btn-primary { display:inline-flex; align-items:center; gap:7px; background:var(--accent); color:#0B0F1A; border:none; border-radius:10px; padding:10px 22px; font-family:inherit; font-size:13px; font-weight:700; cursor:pointer; transition:all .18s; box-shadow:0 4px 14px rgba(245,158,11,.3); }
.rc-btn-primary:hover:not(:disabled) { background:var(--accent-hover,#FBBF24); transform:translateY(-1px); box-shadow:0 6px 20px rgba(245,158,11,.4); }
.rc-btn-primary:disabled { opacity:.5; cursor:not-allowed; transform:none; }
.rc-preset-btn  { display:inline-flex; align-items:center; gap:5px; padding:5px 10px; border-radius:7px; font-size:11.5px; font-weight:600; background:rgba(245,158,11,.08); border:1px solid rgba(245,158,11,.2); color:var(--accent); cursor:pointer; transition:all .18s; font-family:inherit; }
.rc-preset-btn:hover { background:rgba(245,158,11,.15); }

/* ── Nav ────────────────────────────────────────────────── */
.rc-nav { display:flex; justify-content:flex-end; align-items:center; gap:10px; margin-top:6px; padding-top:18px; border-top:1px solid var(--border); }
.rc-spinner { width:18px; height:18px; border:2px solid rgba(245,158,11,.2); border-top-color:var(--accent); border-radius:50%; animation:rcSpin 1s linear infinite; flex-shrink:0; }

/* ── Info callout ───────────────────────────────────────── */
.rc-info { display:flex; align-items:flex-start; gap:10px; background:rgba(96,165,250,.06); border:1px solid rgba(96,165,250,.18); border-radius:var(--radius-sm); padding:12px 14px; font-size:12.5px; color:var(--text-secondary); line-height:1.5; }
.rc-info-icon { color:#60A5FA; flex-shrink:0; margin-top:1px; }

/* ── History ────────────────────────────────────────────── */
.rc-hist-filters { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:16px; }
.rc-hist-item { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-sm); padding:16px 20px; margin-bottom:10px; animation:rcSlideIn .2s ease both; transition:border-color .18s; }
.rc-hist-item:hover { border-color:rgba(245,158,11,.25); }
.rc-hist-head { display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; margin-bottom:12px; }
.rc-hist-title { font-size:14px; font-weight:700; color:var(--text-primary); }
.rc-hist-meta  { font-size:12px; color:var(--text-muted); margin-top:2px; }
.rc-hist-pills { display:flex; flex-wrap:wrap; gap:6px; }
.rc-hist-exams { display:flex; flex-wrap:wrap; gap:6px; margin-top:10px; }
.rc-badge { display:inline-flex; align-items:center; gap:5px; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:700; letter-spacing:.3px; }
.rc-badge-active   { background:rgba(52,211,153,.1); color:var(--success); border:1px solid rgba(52,211,153,.25); }
.rc-badge-inactive { background:var(--bg-input); color:var(--text-muted); border:1px solid var(--border); }
.rc-badge-v        { background:rgba(245,158,11,.1); color:var(--accent); border:1px solid rgba(245,158,11,.25); }
.rc-pill { display:inline-flex; align-items:center; gap:4px; padding:3px 9px; border-radius:6px; font-size:11.5px; font-weight:600; background:var(--bg-input); color:var(--text-secondary); border:1px solid var(--border); }
.rc-pill-accent { background:rgba(245,158,11,.08); color:var(--accent); border-color:rgba(245,158,11,.2); }
.rc-exam-tag { font-size:11.5px; font-weight:600; padding:3px 9px; border-radius:5px; background:rgba(96,165,250,.08); color:#60A5FA; border:1px solid rgba(96,165,250,.2); }

/* ── Empty / skeleton ───────────────────────────────────── */
.rc-empty { display:flex; flex-direction:column; align-items:center; padding:52px 24px; gap:12px; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius); text-align:center; }
.rc-empty-icon  { font-size:36px; opacity:.4; }
.rc-empty-title { font-size:15px; font-weight:700; color:var(--text-primary); margin:0; }
.rc-empty-sub   { font-size:13px; color:var(--text-muted); margin:0; }
.rc-skeleton { height:80px; border-radius:var(--radius-sm); background:linear-gradient(90deg,var(--bg-card) 25%,var(--bg-input) 50%,var(--bg-card) 75%); background-size:200% 100%; animation:rcPulse 1.5s ease infinite; border:1px solid var(--border); margin-bottom:10px; }
`;
