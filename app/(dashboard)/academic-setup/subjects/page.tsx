// src/app/(dashboard)/academic-setup/subjects/page.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  useListSubjectsQuery,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
} from "@/lib/services/subjectApi";

// ─── Types ────────────────────────────────────────────────────────

interface Subject {
  _id: string;
  name: string;
  code: string;
  classes: number[];
  isOptional: boolean;
}

// ─── Schema ──────────────────────────────────────────────────────

const schema = z.object({
  name: z.string().min(1, "Name required"),
  code: z.string().min(1, "Code required").max(10),
  classes: z.string().optional(),
  isOptional: z.boolean().optional(),
});
type FormData = z.infer<typeof schema>;

// ─── CSS ─────────────────────────────────────────────────────────

const CSS = `
@keyframes sbPageIn  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
@keyframes sbFadeIn  { from{opacity:0;transform:translateY(5px)}  to{opacity:1;transform:none} }
@keyframes sbSpin    { to{transform:rotate(360deg)} }
@keyframes sbPulse   { 0%,100%{opacity:1} 50%{opacity:.35} }
@keyframes sbShake   { 0%,100%{transform:none} 20%,60%{transform:translateX(-3px)} 40%,80%{transform:translateX(3px)} }

/* ── Page shell ─────────────────────────────────────────────── */
.sb-page { max-width:1100px; margin:0 auto; padding:28px 20px 48px; animation:sbPageIn .35s ease both; }

/* ── Header ─────────────────────────────────────────────────── */
.sb-head { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; margin-bottom:32px; flex-wrap:wrap; }
.sb-head-left {}
.sb-eyebrow { font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:1.2px; color:var(--accent); margin-bottom:5px; display:flex; align-items:center; gap:6px; }
.sb-eyebrow::before { content:''; display:block; width:18px; height:2px; background:var(--accent); border-radius:2px; }
.sb-title   { font-size:24px; font-weight:800; color:var(--text-primary); letter-spacing:-.6px; margin:0 0 4px; }
.sb-sub     { font-size:13px; color:var(--text-muted); margin:0; }
.sb-count-pill { display:inline-flex; align-items:center; gap:6px; background:var(--bg-card); border:1px solid var(--border); border-radius:20px; padding:6px 14px; font-size:12px; color:var(--text-muted); font-weight:600; }
.sb-count-num { font-size:14px; font-weight:800; color:var(--accent); font-family:"JetBrains Mono",monospace; }

/* ── Layout: 2-col on wide, stack on mobile ─────────────────── */
.sb-layout { display:grid; grid-template-columns:360px 1fr; gap:20px; align-items:start; }
@media(max-width:900px){ .sb-layout { grid-template-columns:1fr; } }

/* ── Card ───────────────────────────────────────────────────── */
.sb-card { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius); padding:24px; position:relative; overflow:hidden; }
.sb-card::before { content:''; position:absolute; top:0; left:24px; right:24px; height:2px; background:linear-gradient(90deg,transparent,rgba(245,158,11,.15),transparent); pointer-events:none; }
.sb-card-title { font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:.7px; margin-bottom:20px; display:flex; align-items:center; gap:8px; }
.sb-card-icon  { width:26px; height:26px; border-radius:7px; background:rgba(245,158,11,.1); border:1px solid rgba(245,158,11,.18); display:flex; align-items:center; justify-content:center; color:var(--accent); font-size:13px; flex-shrink:0; }

/* ── Form elements ──────────────────────────────────────────── */
.sb-field  { display:flex; flex-direction:column; gap:5px; margin-bottom:14px; }
.sb-label  { font-size:10.5px; font-weight:700; color:var(--text-secondary); text-transform:uppercase; letter-spacing:.5px; display:flex; align-items:center; gap:4px; }
.sb-req    { color:var(--error); }
.sb-hint   { font-size:11px; color:var(--text-muted); margin-top:2px; }
.sb-error  { font-size:11px; color:var(--error); margin-top:2px; display:flex; align-items:center; gap:4px; }
.sb-input, .sb-select {
  width:100%; box-sizing:border-box;
  background:var(--bg-input); border:1.5px solid var(--border);
  border-radius:var(--radius-sm); padding:9px 12px;
  font-family:inherit; font-size:13px; color:var(--text-primary);
  outline:none; transition:border-color .18s,box-shadow .18s;
}
.sb-input::placeholder { color:var(--text-muted); }
.sb-input:focus,.sb-select:focus { border-color:rgba(245,158,11,.5); box-shadow:0 0 0 3px rgba(245,158,11,.07); }
.sb-input.err { border-color:var(--error); animation:sbShake .3s ease; }
.sb-input.mono { font-family:"JetBrains Mono",monospace; text-transform:uppercase; letter-spacing:.5px; }

/* Checkbox toggle */
.sb-toggle-row { display:flex; align-items:center; justify-content:space-between; background:var(--bg-input); border:1.5px solid var(--border); border-radius:var(--radius-sm); padding:10px 14px; cursor:pointer; transition:border-color .18s; margin-bottom:14px; }
.sb-toggle-row:hover { border-color:rgba(245,158,11,.3); }
.sb-toggle-row.on { border-color:rgba(245,158,11,.4); background:rgba(245,158,11,.04); }
.sb-toggle-label { font-size:13px; color:var(--text-secondary); font-weight:500; display:flex; align-items:center; gap:8px; }
.sb-toggle-label-sub { font-size:11px; color:var(--text-muted); display:block; margin-top:1px; }
.sb-toggle { position:relative; width:38px; height:22px; flex-shrink:0; }
.sb-toggle input { opacity:0; width:0; height:0; }
.sb-toggle-track { position:absolute; inset:0; background:var(--border); border-radius:20px; transition:.22s; }
.sb-toggle-track::before { content:''; position:absolute; height:16px; width:16px; left:3px; top:3px; background:var(--text-muted); border-radius:50%; transition:.22s; }
.sb-toggle input:checked ~ .sb-toggle-track { background:rgba(245,158,11,.25); border:1px solid rgba(245,158,11,.4); }
.sb-toggle input:checked ~ .sb-toggle-track::before { background:var(--accent); transform:translateX(15px); }

/* Class chips selector */
.sb-classes-wrap { display:flex; flex-wrap:wrap; gap:6px; padding:10px; background:var(--bg-input); border:1.5px solid var(--border); border-radius:var(--radius-sm); min-height:44px; transition:border-color .18s; }
.sb-classes-wrap:focus-within { border-color:rgba(245,158,11,.4); box-shadow:0 0 0 3px rgba(245,158,11,.06); }
.sb-class-chip { display:inline-flex; align-items:center; justify-content:center; width:34px; height:28px; border-radius:7px; border:1.5px solid var(--border); background:var(--bg-card); font-size:12.5px; font-weight:700; color:var(--text-muted); cursor:pointer; transition:all .15s; font-family:"JetBrains Mono",monospace; user-select:none; }
.sb-class-chip:hover { border-color:rgba(245,158,11,.4); color:var(--accent); }
.sb-class-chip.selected { border-color:rgba(245,158,11,.55); background:rgba(245,158,11,.12); color:var(--accent); }
.sb-class-hint { font-size:11px; color:var(--text-muted); margin-top:4px; }

/* Submit button */
.sb-btn-primary { width:100%; display:flex; align-items:center; justify-content:center; gap:8px; background:var(--accent); color:#0B0F1A; border:none; border-radius:10px; padding:11px 20px; font-family:inherit; font-size:13.5px; font-weight:700; cursor:pointer; transition:all .18s; box-shadow:0 4px 16px rgba(245,158,11,.25); margin-top:4px; }
.sb-btn-primary:hover:not(:disabled) { background:#FBBF24; transform:translateY(-1px); box-shadow:0 6px 22px rgba(245,158,11,.35); }
.sb-btn-primary:active:not(:disabled) { transform:translateY(0); }
.sb-btn-primary:disabled { opacity:.5; cursor:not-allowed; transform:none; box-shadow:none; }
.sb-spinner { width:16px; height:16px; border:2px solid rgba(11,15,26,.3); border-top-color:#0B0F1A; border-radius:50%; animation:sbSpin 1s linear infinite; }

/* Ghost / danger buttons */
.sb-btn-ghost  { display:inline-flex; align-items:center; gap:5px; background:none; border:1.5px solid var(--border); border-radius:8px; padding:6px 12px; font-family:inherit; font-size:12px; font-weight:600; color:var(--text-muted); cursor:pointer; transition:all .15s; }
.sb-btn-ghost:hover { border-color:var(--text-muted); color:var(--text-primary); }
.sb-btn-danger { display:inline-flex; align-items:center; gap:5px; background:rgba(248,113,113,.07); border:1px solid rgba(248,113,113,.18); border-radius:7px; padding:5px 10px; font-family:inherit; font-size:12px; font-weight:600; color:var(--error); cursor:pointer; transition:all .15s; }
.sb-btn-danger:hover { background:rgba(248,113,113,.16); border-color:rgba(248,113,113,.35); }

/* ── Toolbar ─────────────────────────────────────────────────── */
.sb-toolbar { display:flex; align-items:center; gap:8px; margin-bottom:14px; flex-wrap:wrap; }
.sb-search-wrap { flex:1; min-width:180px; position:relative; }
.sb-search-icon { position:absolute; left:10px; top:50%; transform:translateY(-50%); color:var(--text-muted); pointer-events:none; display:flex; }
.sb-search { width:100%; box-sizing:border-box; padding:8px 10px 8px 34px; background:var(--bg-input); border:1.5px solid var(--border); border-radius:9px; font-family:inherit; font-size:13px; color:var(--text-primary); outline:none; transition:border-color .18s; }
.sb-search::placeholder { color:var(--text-muted); }
.sb-search:focus { border-color:rgba(245,158,11,.4); }
.sb-filter-select { padding:7px 10px; background:var(--bg-input); border:1.5px solid var(--border); border-radius:8px; font-size:12.5px; color:var(--text-primary); outline:none; cursor:pointer; font-family:inherit; transition:border-color .18s; }
.sb-filter-select:focus,.sb-filter-select.has-val { border-color:rgba(245,158,11,.4); }

/* ── Subject list ────────────────────────────────────────────── */
.sb-list { display:flex; flex-direction:column; gap:8px; }
.sb-item { display:grid; grid-template-columns:auto 1fr auto; gap:12px; align-items:center; background:var(--bg-input); border:1px solid var(--border); border-radius:var(--radius-sm); padding:14px 16px; transition:border-color .18s,background .18s; animation:sbFadeIn .22s ease both; position:relative; overflow:hidden; }
.sb-item::before { content:''; position:absolute; left:0; top:0; bottom:0; width:3px; background:transparent; transition:background .18s; border-radius:0 2px 2px 0; }
.sb-item:hover { border-color:rgba(245,158,11,.25); background:rgba(245,158,11,.02); }
.sb-item:hover::before { background:rgba(245,158,11,.5); }
.sb-item.optional { border-left:3px solid rgba(96,165,250,.3); }
.sb-item.optional::before { display:none; }

/* Item parts */
.sb-item-code { font-family:"JetBrains Mono",monospace; font-size:12px; font-weight:700; color:var(--accent); background:rgba(245,158,11,.1); border:1px solid rgba(245,158,11,.2); padding:4px 9px; border-radius:6px; white-space:nowrap; }
.sb-item-body {}
.sb-item-name { font-size:13.5px; font-weight:700; color:var(--text-primary); margin-bottom:4px; }
.sb-item-meta { display:flex; flex-wrap:wrap; gap:5px; align-items:center; }
.sb-item-class { font-size:11px; font-weight:700; font-family:"JetBrains Mono",monospace; padding:2px 7px; border-radius:5px; background:var(--bg-card); color:var(--text-secondary); border:1px solid var(--border); }
.sb-optional-badge { font-size:10.5px; font-weight:700; padding:2px 8px; border-radius:5px; background:rgba(96,165,250,.08); color:#60A5FA; border:1px solid rgba(96,165,250,.2); }
.sb-item-actions { display:flex; gap:6px; flex-shrink:0; }

/* Inline edit */
.sb-inline-input { background:var(--bg-card); border:1.5px solid rgba(245,158,11,.4); border-radius:6px; padding:5px 9px; font-family:inherit; font-size:13px; color:var(--text-primary); outline:none; }
.sb-inline-actions { display:flex; gap:6px; flex-wrap:wrap; }

/* Empty state */
.sb-empty { display:flex; flex-direction:column; align-items:center; padding:52px 24px; gap:10px; text-align:center; background:var(--bg-input); border:1px dashed var(--border); border-radius:var(--radius-sm); }
.sb-empty-icon  { font-size:36px; opacity:.3; }
.sb-empty-title { font-size:14px; font-weight:700; color:var(--text-primary); margin:0; }
.sb-empty-sub   { font-size:12.5px; color:var(--text-muted); margin:0; max-width:280px; }

/* Skeleton */
.sb-skeleton { height:64px; border-radius:var(--radius-sm); background:linear-gradient(90deg,var(--bg-card) 25%,var(--bg-input) 50%,var(--bg-card) 75%); background-size:200% 100%; animation:sbPulse 1.5s ease infinite; border:1px solid var(--border); }

/* Stats strip */
.sb-stats { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:16px; }
.sb-stat  { flex:1; min-width:80px; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-sm); padding:10px 14px; }
.sb-stat-val   { font-size:20px; font-weight:800; color:var(--text-primary); font-family:"JetBrains Mono",monospace; letter-spacing:-1px; line-height:1; }
.sb-stat-label { font-size:10px; color:var(--text-muted); text-transform:uppercase; letter-spacing:.6px; font-weight:600; margin-top:3px; }

@media(max-width:540px){
  .sb-item { grid-template-columns:auto 1fr; }
  .sb-item-actions { grid-column:1/-1; justify-content:flex-end; }
}
`;

// ─── Class chip selector ──────────────────────────────────────────

const ALL_CLASSES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

function ClassSelector({
  value,
  onChange,
}: {
  value: number[];
  onChange: (v: number[]) => void;
}) {
  const toggle = (c: number) =>
    onChange(
      value.includes(c)
        ? value.filter((x) => x !== c)
        : [...value, c].sort((a, b) => a - b)
    );

  return (
    <div>
      <div className="sb-classes-wrap">
        {ALL_CLASSES.map((c) => (
          <button
            key={c}
            type="button"
            className={`sb-class-chip${value.includes(c) ? " selected" : ""}`}
            onClick={() => toggle(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <p className="sb-class-hint">
        {value.length === 0
          ? "No class selected — applies to all"
          : `Selected: Class ${value.join(", ")}`}
      </p>
    </div>
  );
}

// ─── Inline edit row ──────────────────────────────────────────────

function SubjectEditRow({
  item,
  onSave,
  onCancel,
  isSaving,
}: {
  item: Subject;
  onSave: (v: {
    name: string;
    code: string;
    classes: number[];
    isOptional: boolean;
  }) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [name, setName] = useState(item.name);
  const [code, setCode] = useState(item.code);
  const [classes, setClasses] = useState(item.classes);
  const [isOptional, setIsOptional] = useState(item.isOptional);

  return (
    <div
      className="sb-item"
      style={{ flexDirection: "column", gap: 12, gridTemplateColumns: "1fr" }}
    >
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: 8 }}
      >
        <input
          className="sb-inline-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Subject name"
        />
        <input
          className="sb-inline-input mono"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="CODE"
          style={{
            fontFamily: '"JetBrains Mono",monospace',
            textTransform: "uppercase",
          }}
        />
      </div>
      <ClassSelector value={classes} onChange={setClasses} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
            fontSize: 13,
            color: "var(--text-secondary)",
          }}
        >
          <input
            type="checkbox"
            checked={isOptional}
            onChange={(e) => setIsOptional(e.target.checked)}
            style={{ accentColor: "var(--accent)" }}
          />
          Optional subject
        </label>
        <div className="sb-inline-actions">
          <button className="sb-btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="sb-btn-primary"
            style={{ width: "auto", padding: "7px 16px", marginTop: 0 }}
            disabled={isSaving}
            onClick={() => onSave({ name, code, classes, isOptional })}
          >
            {isSaving ? (
              <span
                className="sb-spinner"
                style={{ borderTopColor: "#0B0F1A" }}
              />
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────

export default function SubjectPage() {
  const {
    data: subjects = [],
    isLoading,
    isError,
    refetch,
  } = useListSubjectsQuery();
  const [createSubject, { isLoading: isCreating }] = useCreateSubjectMutation();
  const [updateSubject, { isLoading: isUpdating }] =
    useUpdateSubjectMutation?.() ?? [async () => {}, {}];
  const [deleteSubject] = useDeleteSubjectMutation?.() ?? [async () => {}];

  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>(""); // "optional" | "core" | ""
  const [selectedClasses, setSelectedClasses] = useState<number[]>([]);
  const [isOptional, setIsOptional] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  // ── Filtered list ──────────────────────────────────────────────
  const filtered = subjects.filter((s) => {
    const term = search.toLowerCase();
    if (
      term &&
      !s.name.toLowerCase().includes(term) &&
      !s.code.toLowerCase().includes(term)
    )
      return false;
    if (classFilter && !s.classes.includes(Number(classFilter))) return false;
    if (typeFilter === "optional" && !s.isOptional) return false;
    if (typeFilter === "core" && s.isOptional) return false;
    return true;
  });

  const stats = {
    total: subjects.length,
    core: subjects.filter((s) => !s.isOptional).length,
    optional: subjects.filter((s) => s.isOptional).length,
  };

  const hasFilter = !!(search || classFilter || typeFilter);

  // ── Handlers ───────────────────────────────────────────────────

  const onSubmit = async (data: FormData) => {
    try {
      await createSubject({
        name: data.name.trim(),
        code: data.code.toUpperCase().trim(),
        classes: selectedClasses,
        isOptional: isOptional,
      }).unwrap();
      toast.success("Subject created!", {
        description: `${data.name} (${data.code.toUpperCase()}) added`,
      });
      reset();
      setSelectedClasses([]);
      setIsOptional(false);
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message;
      toast.error("Failed to create", { description: msg });
    }
  };

  const handleUpdate = async (
    id: string,
    payload: {
      name: string;
      code: string;
      classes: number[];
      isOptional: boolean;
    }
  ) => {
    try {
      await updateSubject({ id, body: payload }).unwrap();
      toast.success("Updated!");
      setEditingId(null);
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteSubject(id).unwrap();
      toast.success(`"${name}" deleted`);
    } catch {
      toast.error("Failed to delete");
    }
  };

  // ── Render ─────────────────────────────────────────────────────

  return (
    <>
      <style>{CSS}</style>
      <div className="sb-page">
        {/* Header */}
        <div className="sb-head">
          <div className="sb-head-left">
            <div className="sb-eyebrow">Academic Setup</div>
            <h1 className="sb-title">Subjects</h1>
            <p className="sb-sub">
              Define and manage curriculum subjects across classes
            </p>
          </div>
          <div className="sb-count-pill">
            <span className="sb-count-num">{subjects.length}</span>
            subject{subjects.length !== 1 ? "s" : ""} total
          </div>
        </div>

        {/* Stats strip */}
        <div className="sb-stats">
          {[
            { label: "Total", val: stats.total },
            { label: "Core", val: stats.core },
            { label: "Optional", val: stats.optional },
          ].map((s) => (
            <div key={s.label} className="sb-stat">
              <div className="sb-stat-val">{s.val}</div>
              <div className="sb-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="sb-layout">
          {/* ── Left: Create form ── */}
          <div style={{ position: "sticky", top: 80 }}>
            <div className="sb-card">
              <div className="sb-card-title">
                <div className="sb-card-icon">+</div>
                Add New Subject
              </div>

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="sb-field">
                  <label className="sb-label">
                    Subject Name <span className="sb-req">*</span>
                  </label>
                  <input
                    {...register("name")}
                    className={`sb-input${errors.name ? " err" : ""}`}
                    placeholder="e.g. Mathematics"
                  />
                  {errors.name && (
                    <p className="sb-error">{errors.name.message}</p>
                  )}
                </div>

                <div className="sb-field">
                  <label className="sb-label">
                    Subject Code <span className="sb-req">*</span>
                  </label>
                  <input
                    {...register("code")}
                    className={`sb-input mono${errors.code ? " err" : ""}`}
                    placeholder="e.g. MATH"
                    onChange={(e) =>
                      (e.target.value = e.target.value.toUpperCase())
                    }
                  />
                  {errors.code ? (
                    <p className="sb-error">{errors.code.message}</p>
                  ) : (
                    <p className="sb-hint">
                      Short unique code — will be uppercased
                    </p>
                  )}
                </div>

                <div className="sb-field">
                  <label className="sb-label">Classes</label>
                  <ClassSelector
                    value={selectedClasses}
                    onChange={setSelectedClasses}
                  />
                </div>

                <label
                  className={`sb-toggle-row${isOptional ? " on" : ""}`}
                  onClick={() => setIsOptional((v) => !v)}
                >
                  <div>
                    <span className="sb-toggle-label">
                      {isOptional ? "Optional Subject" : "Core Subject"}
                    </span>
                    <span className="sb-toggle-label-sub">
                      {isOptional
                        ? "Students may choose to take this"
                        : "Required for all students"}
                    </span>
                  </div>
                  <label
                    className="sb-toggle"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={isOptional}
                      onChange={() => setIsOptional((v) => !v)}
                    />
                    <span className="sb-toggle-track" />
                  </label>
                </label>

                <button
                  type="submit"
                  className="sb-btn-primary"
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <>
                      <span className="sb-spinner" /> Creating…
                    </>
                  ) : (
                    <>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v14a2 2 0 0 1-2 2z" />
                        <polyline points="17 21 17 13 7 13 7 21" />
                        <polyline points="7 3 7 8 15 8" />
                      </svg>
                      Save Subject
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* ── Right: Subject list ── */}
          <div>
            {/* Toolbar */}
            <div className="sb-toolbar">
              <div className="sb-search-wrap">
                <span className="sb-search-icon">
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
                  className="sb-search"
                  placeholder="Search by name or code…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                className={`sb-filter-select${classFilter ? " has-val" : ""}`}
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
              >
                <option value="">All Classes</option>
                {ALL_CLASSES.map((c) => (
                  <option key={c} value={c}>
                    Class {c}
                  </option>
                ))}
              </select>

              <select
                className={`sb-filter-select${typeFilter ? " has-val" : ""}`}
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="core">Core</option>
                <option value="optional">Optional</option>
              </select>

              {hasFilter && (
                <button
                  className="sb-btn-ghost"
                  onClick={() => {
                    setSearch("");
                    setClassFilter("");
                    setTypeFilter("");
                  }}
                >
                  <svg
                    width="11"
                    height="11"
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

            {/* Result count */}
            <div
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                marginBottom: 10,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>
                {isLoading ? (
                  "Loading…"
                ) : hasFilter ? (
                  <>
                    {filtered.length} of {subjects.length} subjects
                  </>
                ) : (
                  <>
                    {subjects.length} subject{subjects.length !== 1 ? "s" : ""}
                  </>
                )}
              </span>
              {hasFilter && !isLoading && filtered.length === 0 && (
                <span style={{ color: "var(--error)", fontSize: 11.5 }}>
                  No match
                </span>
              )}
            </div>

            {/* List */}
            <div className="sb-list">
              {isLoading ? (
                [1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="sb-skeleton"
                    style={{ animationDelay: `${i * 0.08}s` }}
                  />
                ))
              ) : isError ? (
                <div className="sb-empty">
                  <div className="sb-empty-icon">⚠️</div>
                  <p className="sb-empty-title">Failed to load subjects</p>
                  <button className="sb-btn-ghost" onClick={refetch}>
                    Retry
                  </button>
                </div>
              ) : filtered.length === 0 ? (
                <div className="sb-empty">
                  <div className="sb-empty-icon">{hasFilter ? "🔍" : "📚"}</div>
                  <p className="sb-empty-title">
                    {hasFilter ? "No subjects match" : "No subjects yet"}
                  </p>
                  <p className="sb-empty-sub">
                    {hasFilter
                      ? "Try adjusting filters or reset."
                      : "Add your first subject using the form."}
                  </p>
                </div>
              ) : (
                filtered.map((s, idx) =>
                  editingId === s._id ? (
                    <SubjectEditRow
                      key={s._id}
                      item={s}
                      onSave={(v) => handleUpdate(s._id, v)}
                      onCancel={() => setEditingId(null)}
                      isSaving={isUpdating}
                    />
                  ) : (
                    <div
                      key={s._id}
                      className={`sb-item${s.isOptional ? " optional" : ""}`}
                      style={{ animationDelay: `${idx * 0.04}s` }}
                    >
                      <span className="sb-item-code">{s.code}</span>
                      <div className="sb-item-body">
                        <div className="sb-item-name">{s.name}</div>
                        <div className="sb-item-meta">
                          {s.classes.length > 0 ? (
                            s.classes.map((c) => (
                              <span key={c} className="sb-item-class">
                                {c}
                              </span>
                            ))
                          ) : (
                            <span
                              style={{
                                fontSize: 11,
                                color: "var(--text-muted)",
                              }}
                            >
                              All classes
                            </span>
                          )}
                          {s.isOptional && (
                            <span className="sb-optional-badge">Optional</span>
                          )}
                        </div>
                      </div>
                      <div className="sb-item-actions">
                        <button
                          className="sb-btn-ghost"
                          onClick={() => setEditingId(s._id)}
                          style={{ padding: "5px 10px" }}
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          className="sb-btn-danger"
                          onClick={() => handleDelete(s._id, s.name)}
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6M14 11v6M9 6V4h6v2" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
