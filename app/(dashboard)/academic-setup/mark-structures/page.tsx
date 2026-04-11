// src/app/(dashboard)/academic-setup/mark-structures/page.tsx
"use client";

import { useState } from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import {
  useListMarkStructuresQuery,
  useCreateMarkStructureMutation,
  useDeleteMarkStructureMutation,
} from "@/lib/services/markStructureApi";
import type { MarkStructure } from "@/types/academicSetup.types";
import { CreateMarkStructureInput } from "@/validaton/markStructure.validation";

// ─── Schema ──────────────────────────────────────────────────────

const componentSchema = z.object({
  key: z.string().min(1, "Key required"),
  label: z.string().min(1, "Label required"),
  totalMarks: z.number().positive("Must be positive"),
  required: z.boolean().optional(),
});

const formSchema = z.object({
  name: z.string().min(1, "Name required").max(100),
  components: z.array(componentSchema).min(1, "Add at least one component"),
});

type FormData = z.infer<typeof formSchema>;

// ─── CSS ─────────────────────────────────────────────────────────

const CSS = `
@keyframes msPageIn  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
@keyframes msSlideIn { from{opacity:0;transform:translateY(6px)}  to{opacity:1;transform:none} }
@keyframes msSpin    { to{transform:rotate(360deg)} }
@keyframes msPulse   { 0%,100%{opacity:1} 50%{opacity:.4} }

.ms-page  { max-width:940px; margin:0 auto; padding:28px 20px; animation:msPageIn .3s ease both; }
.ms-head  { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; margin-bottom:28px; flex-wrap:wrap; }
.ms-title { font-size:20px; font-weight:700; color:var(--text-primary); letter-spacing:-.4px; margin:0; }
.ms-sub   { font-size:13px; color:var(--text-muted); margin:3px 0 0; }
.ms-layout { display:grid; grid-template-columns:1fr 1fr; gap:16px; align-items:start; }
@media(max-width:768px){ .ms-layout { grid-template-columns:1fr; } }

/* Card */
.ms-card { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius); padding:22px 24px; position:relative; overflow:hidden; animation:msSlideIn .25s ease both; }
.ms-card::before { content:''; position:absolute; top:0; left:20px; right:20px; height:2px; background:linear-gradient(90deg,transparent,rgba(245,158,11,.12),transparent); }
.ms-card-title { font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:.7px; margin-bottom:18px; display:flex; align-items:center; gap:8px; }
.ms-card-icon  { width:24px; height:24px; border-radius:6px; background:rgba(245,158,11,.1); border:1px solid rgba(245,158,11,.2); display:flex; align-items:center; justify-content:center; color:var(--accent); font-size:12px; flex-shrink:0; }

/* Form */
.ms-field { display:flex; flex-direction:column; gap:5px; margin-bottom:12px; }
.ms-label { font-size:11px; font-weight:700; color:var(--text-secondary); text-transform:uppercase; letter-spacing:.4px; }
.ms-req   { color:var(--error); margin-left:2px; }
.ms-input { width:100%; box-sizing:border-box; background:var(--bg-input); border:1.5px solid var(--border); border-radius:var(--radius-sm); padding:9px 12px; font-family:inherit; font-size:13px; color:var(--text-primary); outline:none; transition:border-color .18s,box-shadow .18s; }
.ms-input::placeholder { color:var(--text-muted); }
.ms-input:focus { border-color:rgba(245,158,11,.5); box-shadow:0 0 0 3px rgba(245,158,11,.08); }
.ms-input.err { border-color:var(--error); }
.ms-error { font-size:11px; color:var(--error); margin-top:2px; }
.ms-hint  { font-size:11px; color:var(--text-muted); margin-top:2px; }

/* Component row */
.ms-comp-row { display:grid; grid-template-columns:90px 1fr 80px 54px 32px; gap:8px; align-items:end; background:var(--bg-input); border:1px solid var(--border); border-radius:var(--radius-sm); padding:10px 12px; margin-bottom:8px; transition:border-color .18s; }
.ms-comp-row:hover { border-color:rgba(245,158,11,.2); }
@media(max-width:480px){ .ms-comp-row { grid-template-columns:1fr 1fr; } }
.ms-col-hdr { font-size:10px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:.4px; }
.ms-comp-hdrs { display:grid; grid-template-columns:90px 1fr 80px 54px 32px; gap:8px; padding:0 12px; margin-bottom:4px; }
.ms-cb-row { display:flex; align-items:center; gap:7px; cursor:pointer; height:38px; }
.ms-cb-row input { width:14px; height:14px; accent-color:var(--accent); cursor:pointer; }

/* Buttons */
.ms-btn-primary { display:inline-flex; align-items:center; gap:7px; background:var(--accent); color:#0B0F1A; border:none; border-radius:10px; padding:10px 20px; font-family:inherit; font-size:13px; font-weight:700; cursor:pointer; transition:all .18s; box-shadow:0 4px 14px rgba(245,158,11,.25); white-space:nowrap; }
.ms-btn-primary:hover:not(:disabled) { background:#FBBF24; transform:translateY(-1px); }
.ms-btn-primary:disabled { opacity:.5; cursor:not-allowed; }
.ms-btn-ghost { display:inline-flex; align-items:center; gap:6px; background:none; border:1.5px solid var(--border); border-radius:8px; padding:7px 13px; font-family:inherit; font-size:12.5px; font-weight:600; color:var(--text-muted); cursor:pointer; transition:all .18s; }
.ms-btn-ghost:hover { border-color:var(--text-muted); color:var(--text-primary); }
.ms-add-btn { width:100%; display:flex; align-items:center; justify-content:center; gap:7px; background:none; border:1.5px dashed var(--border); border-radius:var(--radius-sm); padding:9px; font-family:inherit; font-size:12.5px; font-weight:600; color:var(--text-muted); cursor:pointer; transition:all .18s; }
.ms-add-btn:hover { border-color:rgba(245,158,11,.4); color:var(--accent); background:rgba(245,158,11,.04); }
.ms-rm-btn { display:flex; align-items:center; justify-content:center; width:32px; height:32px; border-radius:7px; background:rgba(248,113,113,.07); border:1px solid rgba(248,113,113,.15); color:var(--error); cursor:pointer; transition:background .18s; font-family:inherit; flex-shrink:0; }
.ms-rm-btn:hover { background:rgba(248,113,113,.18); }
.ms-btn-danger { display:inline-flex; align-items:center; gap:5px; background:rgba(248,113,113,.08); border:1px solid rgba(248,113,113,.2); border-radius:7px; padding:5px 10px; font-family:inherit; font-size:11.5px; font-weight:600; color:var(--error); cursor:pointer; transition:all .18s; }
.ms-btn-danger:hover { background:rgba(248,113,113,.16); }

/* List items */
.ms-list { display:flex; flex-direction:column; gap:10px; max-height:640px; overflow-y:auto; }
.ms-item { background:var(--bg-input); border:1px solid var(--border); border-radius:var(--radius-sm); padding:14px 16px; transition:border-color .18s; animation:msSlideIn .2s ease both; }
.ms-item:hover { border-color:rgba(245,158,11,.2); }
.ms-item-head { display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:10px; }
.ms-item-name { font-size:14px; font-weight:700; color:var(--text-primary); }
.ms-item-count { font-size:11.5px; color:var(--text-muted); background:var(--bg-card); border:1px solid var(--border); padding:2px 9px; border-radius:5px; }
.ms-comp-tags { display:flex; flex-wrap:wrap; gap:6px; }
.ms-comp-tag  { font-size:11.5px; font-weight:600; padding:3px 10px; border-radius:5px; background:rgba(96,165,250,.08); color:#60A5FA; border:1px solid rgba(96,165,250,.2); font-family:"JetBrains Mono",monospace; }
.ms-comp-marks { font-size:10.5px; color:var(--text-muted); margin-left:2px; }

/* Empty / Skeleton */
.ms-empty { display:flex; flex-direction:column; align-items:center; padding:40px 16px; gap:10px; text-align:center; }
.ms-empty-icon  { font-size:30px; opacity:.35; }
.ms-empty-title { font-size:14px; font-weight:700; color:var(--text-primary); margin:0; }
.ms-empty-sub   { font-size:12.5px; color:var(--text-muted); margin:0; }
.ms-skeleton { height:72px; border-radius:var(--radius-sm); background:linear-gradient(90deg,var(--bg-card) 25%,var(--bg-input) 50%,var(--bg-card) 75%); background-size:200% 100%; animation:msPulse 1.5s ease infinite; border:1px solid var(--border); margin-bottom:8px; }
.ms-spinner { width:16px; height:16px; border:2px solid rgba(245,158,11,.2); border-top-color:var(--accent); border-radius:50%; animation:msSpin 1s linear infinite; }

/* Summary pill */
.ms-total-pill { font-family:"JetBrains Mono",monospace; font-size:11px; background:rgba(245,158,11,.08); color:var(--accent); border:1px solid rgba(245,158,11,.2); padding:2px 8px; border-radius:5px; }
`;

// ─── StructureListItem ────────────────────────────────────────────
function StructureListItem({
  item,
  onDelete,
}: {
  item: MarkStructure;
  onDelete: (id: string, name: string) => void;
}) {
  // ✅ correct (from backend data)
  const total = item.components.reduce(
    (sum: number, c) => sum + c.totalMarks,
    0
  );

  return (
    <div className="ms-item">
      <div className="ms-item-head">
        <div>
          <div className="ms-item-name">{item.name}</div>

          <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
            <span className="ms-item-count">
              {item.components.length} component
            </span>

            <span className="ms-total-pill">Total: {total}</span>
          </div>
        </div>

        <button
          className="ms-btn-danger"
          onClick={() => onDelete(item._id, item.name)}
        >
          Delete
        </button>
      </div>

      <div className="ms-comp-tags">
        {item.components.map((c) => (
          <span key={c.key} className="ms-comp-tag">
            {c.key}
            <span className="ms-comp-marks">/{c.totalMarks}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────

export default function MarkStructuresPage() {
  const {
    data: structures = [],
    isLoading,
    isError,
    refetch,
  } = useListMarkStructuresQuery();
  const [createMarkStructure, { isLoading: isCreating }] =
    useCreateMarkStructureMutation();
  const [deleteMarkStructure] = useDeleteMarkStructureMutation();

  const MONO = { fontFamily: '"JetBrains Mono",monospace' } as const;

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      components: [
        {
          key: "written",
          label: "Written",
          totalMarks: 100,
          required: true,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "components",
  });

  // ✅ FIXED TOTAL CALCULATION
  const watchedComponents = watch("components");

  const totalMarks = watchedComponents?.reduce(
    (sum, c) => sum + (Number(c.totalMarks) || 0),
    0
  )
  const onSubmit: SubmitHandler<FormData> = async (data) => {
  try {
    const payload: CreateMarkStructureInput = {
      name: data.name.trim(),
      components: data.components.map((c) => ({
        key: c.key.trim(),
        label: c.label.trim(),
        totalMarks: c.totalMarks,
        required: c.required ?? false,
      })),
    };

    await createMarkStructure(payload).unwrap();

    toast.success("Created!");

    reset();
  } catch (err: any) {
    toast.error(err?.data?.message || "Error");
  }
};

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;

    try {
      await deleteMarkStructure(id).unwrap();
      toast.success("Deleted");
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="ms-page">
        {/* Header */}
        <div className="ms-head">
          <div>
            <h1 className="ms-title">Mark Structures</h1>
            <p className="ms-sub">
              Define how marks are split across components (written, oral,
              practical…)
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
            {structures.length} structure{structures.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="ms-layout">
          {/* ── Left: Create Form ── */}
          <div className="ms-card" style={{ position: "sticky", top: 80 }}>
            <div className="ms-card-title">
              <div className="ms-card-icon">+</div>
              New Mark Structure
            </div>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="ms-field">
                <label className="ms-label">
                  Structure Name <span className="ms-req">*</span>
                </label>
                <input
                  {...register("name")}
                  className={`ms-input${errors.name ? " err" : ""}`}
                  placeholder="e.g. Standard 100"
                />
                {errors.name && (
                  <p className="ms-error">{errors.name.message}</p>
                )}
              </div>

              {/* Components */}
              <div style={{ marginTop: 14 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span className="ms-label">
                    Components <span className="ms-req">*</span>
                  </span>
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    Total:{" "}
                    {fields.reduce((s, _, i) => {
                      const el = document.querySelector<HTMLInputElement>(
                        `input[name="components.${i}.totalMarks"]`
                      );
                      return s + (Number(el?.value) || 0);
                    }, 0)}
                  </span>
                </div>

                <div className="ms-comp-hdrs">
                  {["Key", "Label", "Marks", "Req'd", ""].map((h, i) => (
                    <span key={i} className="ms-col-hdr">
                      {h}
                    </span>
                  ))}
                </div>

                {fields.map((field, i) => (
                  <div key={field.id} className="ms-comp-row">
                    <div className="ms-field" style={{ margin: 0 }}>
                      <input
                        {...register(`components.${i}.key`)}
                        className={`ms-input${
                          errors.components?.[i]?.key ? " err" : ""
                        }`}
                        placeholder="written"
                        style={{ ...MONO, fontSize: 12 }}
                      />
                      {errors.components?.[i]?.key && (
                        <p className="ms-error">
                          {errors.components[i]!.key!.message}
                        </p>
                      )}
                    </div>
                    <div className="ms-field" style={{ margin: 0 }}>
                      <input
                        {...register(`components.${i}.label`)}
                        className={`ms-input${
                          errors.components?.[i]?.label ? " err" : ""
                        }`}
                        placeholder="Written Exam"
                      />
                    </div>
                    <div className="ms-field" style={{ margin: 0 }}>
                      <input
                        type="number"
                        {...register(`components.${i}.totalMarks`, {
                          valueAsNumber: true,
                        })}
                        className={`ms-input${
                          errors.components?.[i]?.totalMarks ? " err" : ""
                        }`}
                        placeholder="100"
                        min={1}
                        style={MONO}
                      />
                    </div>
                    <label className="ms-cb-row">
                      <input
                        type="checkbox"
                        {...register(`components.${i}.required`)}
                        defaultChecked
                      />
                    </label>
                    <button
                      type="button"
                      className="ms-rm-btn"
                      onClick={() => remove(i)}
                      disabled={fields.length === 1}
                    >
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
                    </button>
                  </div>
                ))}

                {(errors.components as { message?: string })?.message && (
                  <p className="ms-error" style={{ marginBottom: 8 }}>
                    {(errors.components as { message?: string }).message}
                  </p>
                )}

                <button
                  type="button"
                  className="ms-add-btn"
                  onClick={() =>
                    append({
                      key: "",
                      label: "",
                      totalMarks: 0,
                      required: true,
                    })
                  }
                >
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
                  Add Component
                </button>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: 18,
                }}
              >
                <button
                  type="submit"
                  className="ms-btn-primary"
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <>
                      <span className="ms-spinner" /> Saving…
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
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v14a2 2 0 0 1-2 2z" />
                        <polyline points="17 21 17 13 7 13 7 21" />
                        <polyline points="7 3 7 8 15 8" />
                      </svg>
                      Save Structure
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* ── Right: List ── */}
          <div className="ms-card">
            <div className="ms-card-title">
              <div className="ms-card-icon">📊</div>
              Saved Structures
            </div>

            {isLoading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="ms-skeleton" />
                ))}
              </>
            ) : isError ? (
              <div className="ms-empty">
                <div className="ms-empty-icon">⚠️</div>
                <p className="ms-empty-title">Failed to load</p>
                <button className="ms-btn-ghost" onClick={refetch}>
                  Retry
                </button>
              </div>
            ) : structures.length === 0 ? (
              <div className="ms-empty">
                <div className="ms-empty-icon">📊</div>
                <p className="ms-empty-title">No structures yet</p>
                <p className="ms-empty-sub">
                  Create your first mark structure on the left
                </p>
              </div>
            ) : (
              <div className="ms-list">
                {structures.map((s) => (
                  <StructureListItem
                    key={s._id}
                    item={s}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
