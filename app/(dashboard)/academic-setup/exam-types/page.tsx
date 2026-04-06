// src/app/(dashboard)/academic-setup/exam-types/page.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  useListExamTypesQuery,
  useCreateExamTypeMutation,
  useUpdateExamTypeMutation,
  useToggleExamTypeMutation,
  useDeleteExamTypeMutation,
} from "@/lib/services/examTypeApi";
import type { ExamType } from "@/types/academicSetup.types";

// ─── Schema ──────────────────────────────────────────────────────

const formSchema = z.object({
  name: z.string().min(1, "Name required").max(100),
  code: z.string().min(1, "Code required").max(20),
  order: z.number().int().min(0).optional(),
});
type FormData = z.infer<typeof formSchema>;

// ─── CSS ─────────────────────────────────────────────────────────

const CSS = `
@keyframes etPageIn  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
@keyframes etSlideIn { from{opacity:0;transform:translateY(6px)}  to{opacity:1;transform:none} }
@keyframes etSpin    { to{transform:rotate(360deg)} }
@keyframes etPulse   { 0%,100%{opacity:1} 50%{opacity:.4} }

.et-page  { max-width:860px; margin:0 auto; padding:28px 20px; animation:etPageIn .3s ease both; }
.et-head  { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; margin-bottom:28px; flex-wrap:wrap; }
.et-title { font-size:20px; font-weight:700; color:var(--text-primary); letter-spacing:-.4px; margin:0; }
.et-sub   { font-size:13px; color:var(--text-muted); margin:3px 0 0; }

/* Card */
.et-card { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius); padding:22px 24px; margin-bottom:14px; position:relative; overflow:hidden; animation:etSlideIn .25s ease both; }
.et-card::before { content:''; position:absolute; top:0; left:20px; right:20px; height:2px; background:linear-gradient(90deg,transparent,rgba(245,158,11,.12),transparent); }
.et-card-title { font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:.7px; margin-bottom:18px; display:flex; align-items:center; gap:8px; }
.et-card-icon  { width:24px; height:24px; border-radius:6px; background:rgba(245,158,11,.1); border:1px solid rgba(245,158,11,.2); display:flex; align-items:center; justify-content:center; color:var(--accent); font-size:12px; flex-shrink:0; }

/* Form */
.et-grid-3 { display:grid; grid-template-columns:1fr 120px 100px; gap:12px; align-items:end; }
@media(max-width:600px){ .et-grid-3 { grid-template-columns:1fr 1fr; } }
.et-field  { display:flex; flex-direction:column; gap:5px; }
.et-label  { font-size:11px; font-weight:700; color:var(--text-secondary); text-transform:uppercase; letter-spacing:.4px; }
.et-req    { color:var(--error); margin-left:2px; }
.et-input  { width:100%; box-sizing:border-box; background:var(--bg-input); border:1.5px solid var(--border); border-radius:var(--radius-sm); padding:9px 12px; font-family:inherit; font-size:13px; color:var(--text-primary); outline:none; transition:border-color .18s,box-shadow .18s; }
.et-input::placeholder { color:var(--text-muted); }
.et-input:focus { border-color:rgba(245,158,11,.5); box-shadow:0 0 0 3px rgba(245,158,11,.08); }
.et-input.err { border-color:var(--error); }
.et-error  { font-size:11px; color:var(--error); margin-top:2px; }
.et-hint   { font-size:11px; color:var(--text-muted); margin-top:2px; }

/* Buttons */
.et-btn-primary { display:inline-flex; align-items:center; gap:7px; background:var(--accent); color:#0B0F1A; border:none; border-radius:10px; padding:10px 20px; font-family:inherit; font-size:13px; font-weight:700; cursor:pointer; transition:all .18s; box-shadow:0 4px 14px rgba(245,158,11,.25); white-space:nowrap; }
.et-btn-primary:hover:not(:disabled) { background:#FBBF24; transform:translateY(-1px); }
.et-btn-primary:disabled { opacity:.5; cursor:not-allowed; transform:none; }
.et-btn-ghost  { display:inline-flex; align-items:center; gap:6px; background:none; border:1.5px solid var(--border); border-radius:8px; padding:7px 13px; font-family:inherit; font-size:12.5px; font-weight:600; color:var(--text-muted); cursor:pointer; transition:all .18s; }
.et-btn-ghost:hover { border-color:var(--text-muted); color:var(--text-primary); }
.et-btn-danger { display:inline-flex; align-items:center; gap:5px; background:rgba(248,113,113,.08); border:1px solid rgba(248,113,113,.2); border-radius:8px; padding:6px 11px; font-family:inherit; font-size:12px; font-weight:600; color:var(--error); cursor:pointer; transition:all .18s; }
.et-btn-danger:hover { background:rgba(248,113,113,.16); }

/* Table */
.et-table-wrap { overflow-x:auto; }
.et-table { width:100%; border-collapse:collapse; }
.et-table th { font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; color:var(--text-muted); padding:0 14px 10px; text-align:left; border-bottom:1px solid var(--border); white-space:nowrap; }
.et-table td { padding:13px 14px; border-bottom:1px solid rgba(30,42,64,.6); vertical-align:middle; }
.et-table tr:last-child td { border-bottom:none; }
.et-table tr:hover td { background:rgba(245,158,11,.025); }

/* Badges */
.et-badge { display:inline-flex; align-items:center; gap:5px; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:700; }
.et-badge-active   { background:rgba(52,211,153,.1); color:var(--success); border:1px solid rgba(52,211,153,.2); }
.et-badge-inactive { background:var(--bg-input); color:var(--text-muted); border:1px solid var(--border); }
.et-code { font-family:"JetBrains Mono",monospace; font-size:12px; background:rgba(245,158,11,.08); color:var(--accent); border:1px solid rgba(245,158,11,.2); padding:2px 8px; border-radius:5px; }
.et-order-badge { font-family:"JetBrains Mono",monospace; font-size:11px; color:var(--text-muted); background:var(--bg-input); border:1px solid var(--border); padding:2px 7px; border-radius:5px; }

/* Inline edit */
.et-inline-input { background:var(--bg-input); border:1.5px solid rgba(245,158,11,.4); border-radius:6px; padding:5px 8px; font-family:inherit; font-size:13px; color:var(--text-primary); outline:none; width:100%; box-sizing:border-box; }
.et-actions { display:flex; align-items:center; gap:6px; }

/* Toggle */
.et-toggle { position:relative; display:inline-block; width:36px; height:20px; cursor:pointer; }
.et-toggle input { opacity:0; width:0; height:0; }
.et-toggle-slider { position:absolute; inset:0; background:var(--bg-input); border:1.5px solid var(--border); border-radius:20px; transition:.25s; }
.et-toggle-slider::before { content:''; position:absolute; height:13px; width:13px; left:2px; top:50%; transform:translateY(-50%); background:var(--text-muted); border-radius:50%; transition:.25s; }
.et-toggle input:checked + .et-toggle-slider { background:rgba(52,211,153,.15); border-color:var(--success); }
.et-toggle input:checked + .et-toggle-slider::before { background:var(--success); transform:translate(15px,-50%); }

/* Empty / Skeleton */
.et-empty { display:flex; flex-direction:column; align-items:center; padding:48px 24px; gap:10px; text-align:center; }
.et-empty-icon  { font-size:32px; opacity:.35; }
.et-empty-title { font-size:14px; font-weight:700; color:var(--text-primary); margin:0; }
.et-empty-sub   { font-size:12.5px; color:var(--text-muted); margin:0; }
.et-skeleton { height:52px; border-radius:var(--radius-sm); background:linear-gradient(90deg,var(--bg-card) 25%,var(--bg-input) 50%,var(--bg-card) 75%); background-size:200% 100%; animation:etPulse 1.5s ease infinite; border:1px solid var(--border); margin-bottom:8px; }
.et-spinner { width:16px; height:16px; border:2px solid rgba(245,158,11,.2); border-top-color:var(--accent); border-radius:50%; animation:etSpin 1s linear infinite; }
`;

// ─── Inline-edit row ──────────────────────────────────────────────

function EditRow({
  item,
  onSave,
  onCancel,
  isSaving,
}: {
  item: ExamType;
  onSave: (v: { name: string; code: string; order: number }) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [name, setName] = useState(item.name);
  const [code, setCode] = useState(item.code);
  const [order, setOrder] = useState(item.order);

  return (
    <tr>
      <td>
        <input
          className="et-inline-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
      </td>
      <td>
        <input
          className="et-inline-input"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="CODE"
          style={{
            fontFamily: '"JetBrains Mono",monospace',
            textTransform: "uppercase",
          }}
        />
      </td>
      <td>
        <input
          className="et-inline-input"
          type="number"
          value={order}
          onChange={(e) => setOrder(Number(e.target.value))}
          min={0}
          style={{ width: 60, fontFamily: '"JetBrains Mono",monospace' }}
        />
      </td>
      <td>
        <span className="et-badge et-badge-active">active</span>
      </td>
      <td>
        <div className="et-actions">
          <button
            className="et-btn-primary"
            style={{ padding: "6px 13px", fontSize: 12 }}
            disabled={isSaving}
            onClick={() => onSave({ name, code, order })}
          >
            {isSaving ? <span className="et-spinner" /> : "Save"}
          </button>
          <button className="et-btn-ghost" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── Main page ────────────────────────────────────────────────────

export default function ExamTypesPage() {
  const {
    data: examTypes = [],
    isLoading,
    isError,
    refetch,
  } = useListExamTypesQuery();
  const [createExamType, { isLoading: isCreating }] =
    useCreateExamTypeMutation();
  const [updateExamType, { isLoading: isUpdating }] =
    useUpdateExamTypeMutation();
  const [toggleExamType] = useToggleExamTypeMutation();
  const [deleteExamType] = useDeleteExamTypeMutation();

  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", code: "", order: 0 },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createExamType({
        name: data.name,
        code: data.code,
        order: data.order ?? 0,
      }).unwrap();
      toast.success("Exam type created!");
      reset();
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message;
      toast.error("Failed to create", { description: msg });
    }
  };

  const handleUpdate = async (
    id: string,
    body: { name: string; code: string; order: number }
  ) => {
    try {
      await updateExamType({ id, body }).unwrap();
      toast.success("Updated!");
      setEditingId(null);
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleToggle = async (id: string, name: string, current: boolean) => {
    try {
      await toggleExamType(id).unwrap();
      toast.success(`"${name}" ${current ? "deactivated" : "activated"}`);
    } catch {
      toast.error("Failed to toggle");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteExamType(id).unwrap();
      toast.success(`"${name}" deleted`);
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="et-page">
        {/* Header */}
        <div className="et-head">
          <div>
            <h1 className="et-title">Exam Types</h1>
            <p className="et-sub">
              Define exam types used across result configurations
            </p>
          </div>
          <span
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "5px 12px",
            }}
          >
            {examTypes.length} type{examTypes.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Create form */}
        <div className="et-card">
          <div className="et-card-title">
            <div className="et-card-icon">+</div>
            Add New Exam Type
          </div>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="et-grid-3">
              <div className="et-field">
                <label className="et-label">
                  Name <span className="et-req">*</span>
                </label>
                <input
                  {...register("name")}
                  className={`et-input${errors.name ? " err" : ""}`}
                  placeholder="e.g. Half Yearly Examination"
                />
                {errors.name && (
                  <p className="et-error">{errors.name.message}</p>
                )}
              </div>
              <div className="et-field">
                <label className="et-label">
                  Code <span className="et-req">*</span>
                </label>
                <input
                  {...register("code")}
                  className={`et-input${errors.code ? " err" : ""}`}
                  placeholder="e.g. HY"
                  style={{
                    fontFamily: '"JetBrains Mono",monospace',
                    textTransform: "uppercase",
                  }}
                  onChange={(e) =>
                    (e.target.value = e.target.value.toUpperCase())
                  }
                />
                {errors.code ? (
                  <p className="et-error">{errors.code.message}</p>
                ) : (
                  <p className="et-hint">Unique short code</p>
                )}
              </div>
              <div className="et-field">
                <label className="et-label">Order</label>
                <input
                  type="number"
                  {...register("order", { valueAsNumber: true })}
                  className="et-input"
                  placeholder="0"
                  min={0}
                  style={{ fontFamily: '"JetBrains Mono",monospace' }}
                />
                <p className="et-hint">Sort position</p>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: 16,
              }}
            >
              <button
                type="submit"
                className="et-btn-primary"
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <span className="et-spinner" /> Creating…
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
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    Add Exam Type
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* List */}
        <div className="et-card">
          <div className="et-card-title">
            <div className="et-card-icon">📋</div>
            All Exam Types
          </div>

          {isLoading ? (
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="et-skeleton" />
              ))}
            </>
          ) : isError ? (
            <div className="et-empty">
              <div className="et-empty-icon">⚠️</div>
              <p className="et-empty-title">Failed to load</p>
              <button className="et-btn-ghost" onClick={refetch}>
                Retry
              </button>
            </div>
          ) : examTypes.length === 0 ? (
            <div className="et-empty">
              <div className="et-empty-icon">🗂️</div>
              <p className="et-empty-title">No exam types yet</p>
              <p className="et-empty-sub">Add your first exam type above</p>
            </div>
          ) : (
            <div className="et-table-wrap">
              <table className="et-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Code</th>
                    <th>Order</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {examTypes
                    .slice()
                    .sort((a, b) => a.order - b.order)
                    .map((et) =>
                      editingId === et._id ? (
                        <EditRow
                          key={et._id}
                          item={et}
                          onSave={(v) => handleUpdate(et._id, v)}
                          onCancel={() => setEditingId(null)}
                          isSaving={isUpdating}
                        />
                      ) : (
                        <tr key={et._id}>
                          <td
                            style={{
                              fontWeight: 600,
                              color: "var(--text-primary)",
                              fontSize: 13,
                            }}
                          >
                            {et.name}
                          </td>
                          <td>
                            <span className="et-code">{et.code}</span>
                          </td>
                          <td>
                            <span className="et-order-badge">{et.order}</span>
                          </td>
                          <td>
                            <label
                              className="et-toggle"
                              title={
                                et.isActive
                                  ? "Click to deactivate"
                                  : "Click to activate"
                              }
                            >
                              <input
                                type="checkbox"
                                checked={et.isActive}
                                readOnly
                                onChange={() =>
                                  handleToggle(et._id, et.name, et.isActive)
                                }
                              />
                              <span className="et-toggle-slider" />
                            </label>
                          </td>
                          <td>
                            <div className="et-actions">
                              <button
                                className="et-btn-ghost"
                                onClick={() => setEditingId(et._id)}
                                style={{ padding: "5px 11px", fontSize: 12 }}
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
                                className="et-btn-danger"
                                onClick={() => handleDelete(et._id, et.name)}
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
                          </td>
                        </tr>
                      )
                    )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
