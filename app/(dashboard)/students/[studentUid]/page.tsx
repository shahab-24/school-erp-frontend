// src/app/(dashboard)/students/[studentUid]/page.tsx
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import {
  useGetStudentQuery,
  useUpdateStudentStatusMutation,
} from "@/lib/services/studentApi";
import type {
  Student,
  StudentStatus,
  Guardian,
  PromotionEntry,
} from "@/types/student.types";

/* ═══════════════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════════════ */
const ALL_STATUSES: StudentStatus[] = [
  "active",
  "repeat",
  "passed",
  "transferred",
  "archived",
];

const STATUS_COLOR: Record<StudentStatus, string> = {
  active: "var(--success)",
  repeat: "var(--accent)",
  passed: "#3B82F6",
  transferred: "#8B5CF6",
  archived: "var(--text-muted)",
};

const STATUS_BG: Record<StudentStatus, string> = {
  active: "rgba(52,211,153,.12)",
  repeat: "rgba(245,158,11,.12)",
  passed: "rgba(59,130,246,.12)",
  transferred: "rgba(139,92,246,.12)",
  archived: "rgba(107,114,128,.12)",
};

type Tab = "overview" | "guardians" | "promotions" | "stipend";

/* ═══════════════════════════════════════════════════════════════
   CSS
═══════════════════════════════════════════════════════════════ */
const CSS = `
.sd-wrap { max-width:900px; margin:0 auto; animation:pageEnter .3s ease both; }

/* Breadcrumb */
.sd-bc { display:flex; align-items:center; gap:8px; font-size:12.5px; margin-bottom:16px; }
.sd-bc-link { color:var(--text-muted); text-decoration:none; transition:color .18s; }
.sd-bc-link:hover { color:var(--text-primary); }
.sd-bc-sep  { color:var(--border); }
.sd-bc-cur  { color:var(--text-secondary); font-weight:500; }

/* Profile header */
.sd-header {
  background:var(--bg-card); border:1px solid var(--border);
  border-radius:var(--radius); padding:24px; position:relative; overflow:hidden;
}
.sd-header-glow {
  position:absolute; inset:0; pointer-events:none;
  background:linear-gradient(135deg, rgba(245,158,11,.05) 0%, transparent 60%);
}
.sd-avatar-fallback {
  width:80px; height:80px; border-radius:16px; flex-shrink:0;
  background:rgba(245,158,11,.12); border:1px solid rgba(245,158,11,.2);
  display:flex; align-items:center; justify-content:center;
  font-size:28px; font-weight:800; color:var(--accent);
}
.sd-avatar-img {
  width:80px; height:80px; border-radius:16px; object-fit:cover;
  border:1px solid var(--border); flex-shrink:0;
}
.sd-name-en { font-size:22px; font-weight:800; color:var(--text-primary); line-height:1.2; margin:0; }
.sd-name-bn { font-size:13px; color:var(--text-muted); margin:3px 0 0; }

/* Status button */
.sd-status-btn {
  display:inline-flex; align-items:center; gap:6px;
  font-size:12px; font-weight:700; padding:5px 11px;
  border-radius:20px; border:1px solid; cursor:pointer;
  font-family:inherit; transition:opacity .18s; text-transform:capitalize;
}
.sd-status-btn:hover:not(:disabled) { opacity:.8; }
.sd-status-btn:disabled { cursor:not-allowed; }
.sd-status-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; }

/* Status dropdown */
.sd-dropdown {
  position:absolute; left:0; top:calc(100% + 6px); min-width:160px;
  background:var(--bg-sidebar); border:1px solid var(--border);
  border-radius:11px; box-shadow:0 8px 32px rgba(0,0,0,.3); z-index:50; overflow:hidden;
}
.sd-dropdown-item {
  width:100%; display:flex; align-items:center; gap:8px;
  padding:9px 14px; font-size:12px; font-weight:600; text-align:left;
  background:none; border:none; cursor:pointer; font-family:inherit;
  color:var(--text-muted); transition:background .15s,color .15s; text-transform:capitalize;
}
.sd-dropdown-item:hover { background:rgba(255,255,255,.04); color:var(--text-primary); }
.sd-dropdown-item.active { color:var(--accent); }

/* Meta chips */
.sd-meta { display:flex; flex-wrap:wrap; gap:8px; margin-top:12px; align-items:center; }
.sd-chip  { font-size:11.5px; color:var(--text-muted); display:flex; align-items:center; gap:5px; }
.sd-chip-mono { font-family:"JetBrains Mono",monospace; font-size:12px; color:var(--accent); font-weight:700; }
.sd-sep  { color:var(--border); font-size:10px; }

/* Action buttons */
.sd-action-promote {
  display:inline-flex; align-items:center; gap:6px;
  background:var(--accent); color:#0B0F1A; border:none; border-radius:10px;
  padding:8px 16px; font-size:12px; font-weight:700; font-family:inherit;
  cursor:pointer; text-decoration:none; transition:all .18s; white-space:nowrap;
  box-shadow:0 3px 10px rgba(245,158,11,.25);
}
.sd-action-promote:hover { filter:brightness(1.1); transform:translateY(-1px); }
.sd-action-secondary {
  display:inline-flex; align-items:center; gap:6px;
  border:1.5px solid var(--border); border-radius:10px;
  padding:8px 14px; font-size:12px; font-weight:600; font-family:inherit;
  color:var(--text-muted); background:none; cursor:pointer;
  text-decoration:none; transition:all .18s; white-space:nowrap;
}
.sd-action-secondary:hover { border-color:var(--text-muted); color:var(--text-primary); }

/* Tabs */
.sd-tabs {
  display:flex; gap:3px; background:var(--bg-card); border:1px solid var(--border);
  border-radius:12px; padding:4px; overflow-x:auto;
}
.sd-tab {
  padding:7px 18px; border-radius:9px; font-size:12px; font-weight:600;
  background:none; border:none; cursor:pointer; font-family:inherit;
  color:var(--text-muted); transition:all .18s; white-space:nowrap; text-transform:capitalize;
}
.sd-tab:hover:not(.active) { color:var(--text-primary); background:rgba(255,255,255,.03); }
.sd-tab.active { background:var(--accent); color:#0B0F1A; }

/* Info card */
.sd-card {
  background:var(--bg-card); border:1px solid var(--border);
  border-radius:var(--radius-sm); overflow:hidden;
}
.sd-card-head {
  padding:11px 16px; border-bottom:1px solid var(--border);
  background:var(--bg-sidebar);
}
.sd-card-title { font-size:10.5px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:.6px; }
.sd-card-body  { padding:4px 0; }

/* Info row */
.sd-row {
  display:flex; justify-content:space-between; align-items:flex-start;
  padding:9px 16px; gap:16px; border-bottom:1px solid var(--border);
}
.sd-row:last-child { border-bottom:none; }
.sd-row-key { font-size:11.5px; color:var(--text-muted); font-weight:500; flex-shrink:0; white-space:nowrap; }
.sd-row-val { font-size:13px; color:var(--text-primary); font-weight:600; text-align:right; word-break:break-word; max-width:65%; }
.sd-row-val.mono { font-family:"JetBrains Mono",monospace; font-size:12px; color:var(--accent); }
.sd-row-val.empty { color:var(--text-muted); font-weight:400; font-style:italic; }

/* Grid */
.sd-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
@media(max-width:640px){ .sd-grid-2 { grid-template-columns:1fr; } }

/* Empty state */
.sd-empty {
  padding:52px 24px; text-align:center;
  background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-sm);
}
.sd-empty-text { font-size:13px; color:var(--text-muted); margin:0; }

/* Promotions table */
.sd-table { width:100%; border-collapse:collapse; }
.sd-th { padding:10px 14px; text-align:left; font-size:10.5px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:.5px; border-bottom:1px solid var(--border); background:var(--bg-sidebar); }
.sd-td { padding:10px 14px; font-size:13px; color:var(--text-secondary); border-bottom:1px solid var(--border); }
.sd-tr:last-child .sd-td { border-bottom:none; }
.sd-tr:hover .sd-td { background:rgba(255,255,255,.015); }
.sd-promo-badge {
  display:inline-flex; align-items:center; padding:3px 9px;
  border-radius:5px; font-size:11.5px; font-weight:700; border:1px solid;
}

/* Skeleton */
.sd-skel { background:var(--bg-input); border-radius:8px; animation:sdPulse 1.5s ease infinite; }
@keyframes sdPulse { 0%,100%{opacity:1} 50%{opacity:.4} }

/* Error state */
.sd-error-wrap {
  max-width:380px; margin:60px auto; text-align:center;
  display:flex; flex-direction:column; align-items:center; gap:12px;
}
.sd-error-icon {
  width:56px; height:56px; border-radius:16px;
  background:rgba(248,113,113,.1); border:1px solid rgba(248,113,113,.2);
  display:flex; align-items:center; justify-content:center;
}
.sd-spinner {
  width:12px; height:12px; border:2px solid rgba(245,158,11,.3);
  border-top-color:var(--accent); border-radius:50%;
  animation:sdSpin 1s linear infinite; flex-shrink:0;
}
@keyframes sdSpin { to { transform:rotate(360deg); } }
`;

/* ═══════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════ */
function InfoRow({
  label,
  value,
  mono,
}: {
  label: string;
  value?: string | number | null;
  mono?: boolean;
}) {
  const empty = value === undefined || value === null || value === "";
  return (
    <div className="sd-row">
      <span className="sd-row-key">{label}</span>
      <span
        className={`sd-row-val${mono ? " mono" : ""}${empty ? " empty" : ""}`}
      >
        {empty ? "—" : String(value)}
      </span>
    </div>
  );
}

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="sd-card">
      <div className="sd-card-head">
        <span className="sd-card-title">{title}</span>
      </div>
      <div className="sd-card-body">{children}</div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="sd-wrap">
      <div
        className="sd-skel"
        style={{ height: 14, width: 200, marginBottom: 16, borderRadius: 6 }}
      />
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: 24,
          marginBottom: 14,
          display: "flex",
          gap: 18,
          alignItems: "center",
        }}
      >
        <div
          className="sd-skel"
          style={{ width: 80, height: 80, borderRadius: 16, flexShrink: 0 }}
        />
        <div style={{ flex: 1 }}>
          <div
            className="sd-skel"
            style={{ height: 20, width: 200, marginBottom: 10 }}
          />
          <div className="sd-skel" style={{ height: 12, width: 280 }} />
        </div>
      </div>
      <div
        className="sd-skel"
        style={{ height: 46, marginBottom: 14, borderRadius: 12 }}
      />
      <div className="sd-grid-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="sd-skel"
            style={{ height: 200, borderRadius: "var(--radius-sm)" }}
          />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   OVERVIEW TAB — inline (same data, no extra fetch)
═══════════════════════════════════════════════════════════════ */
function OverviewTab({ student }: { student: Student }) {
  return (
    <div className="sd-grid-2">
      <InfoCard title="Personal Info">
        <InfoRow label="Name (EN)" value={student.name.en} />
        <InfoRow label="Name (BN)" value={student.name.bn} />
        <InfoRow
          label="Birth Date"
          value={new Date(student.birthDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        />
        <InfoRow label="Birth Reg." value={student.birthRegistration} mono />
        <InfoRow
          label="Gender"
          value={
            student.gender.charAt(0).toUpperCase() + student.gender.slice(1)
          }
        />
        <InfoRow label="Religion" value={student.religion} />
        <InfoRow label="Blood Group" value={student.bloodGroup} />
        <InfoRow label="Nationality" value={student.nationality} />
        <InfoRow
          label="Language"
          value={
            student.languagePreference === "bn" ? "Bengali (বাংলা)" : "English"
          }
        />
        <InfoRow
          label="Registered"
          value={new Date(student.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        />
      </InfoCard>

      <InfoCard title="Enrollment">
        <InfoRow label="Student UID" value={student.studentUid} mono />
        <InfoRow label="Session" value={student.current.session} mono />
        <InfoRow label="Class" value={`Class ${student.current.class}`} />
        <InfoRow label="Roll No." value={`#${student.current.roll}`} />
        <div className="sd-row">
          <span className="sd-row-key">Status</span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              fontSize: 12,
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: 20,
              textTransform: "capitalize",
              color: STATUS_COLOR[student.status],
              background: STATUS_BG[student.status],
              border: `1px solid ${STATUS_COLOR[student.status]}40`,
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: STATUS_COLOR[student.status],
                flexShrink: 0,
              }}
            />
            {student.status}
          </span>
        </div>
        <InfoRow
          label="Total Promotions"
          value={student.promotions?.length ?? 0}
        />
      </InfoCard>

      <InfoCard title="Father's Info">
        <InfoRow label="Name (EN)" value={student.father.name.en} />
        <InfoRow label="Name (BN)" value={student.father.name.bn} />
        <InfoRow label="Mobile" value={student.father.mobile} mono />
        <InfoRow label="NID" value={student.father.nid} mono />
        <InfoRow
          label="Birth Reg."
          value={student.father.birthRegistration}
          mono
        />
        <InfoRow label="Occupation" value={student.father.occupation} />
      </InfoCard>

      <InfoCard title="Mother's Info">
        <InfoRow label="Name (EN)" value={student.mother.name.en} />
        <InfoRow label="Name (BN)" value={student.mother.name.bn} />
        <InfoRow label="Mobile" value={student.mother.mobile} mono />
        <InfoRow label="NID" value={student.mother.nid} mono />
        <InfoRow
          label="Birth Reg."
          value={student.mother.birthRegistration}
          mono
        />
        <InfoRow label="Occupation" value={student.mother.occupation} />
      </InfoCard>

      {student.address?.village && (
        <InfoCard title="Address">
          <InfoRow label="Village / Para" value={student.address.village} />
          <InfoRow label="Union / Ward" value={student.address.union} />
          <InfoRow label="Upazila" value={student.address.upazila} />
          <InfoRow label="District" value={student.address.district} />
          <InfoRow label="Post Code" value={student.address.postCode} mono />
        </InfoCard>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   GUARDIANS TAB
═══════════════════════════════════════════════════════════════ */
function GuardiansTab({ student }: { student: Student }) {
  if (student.guardians.length === 0) {
    return (
      <div className="sd-empty">
        <p className="sd-empty-text">No additional guardians registered.</p>
      </div>
    );
  }
  return (
    <div className="sd-grid-2">
      {student.guardians.map((g: Guardian, i: number) => (
        <InfoCard
          key={i}
          title={`Guardian #${i + 1} · ${
            g.relation.charAt(0).toUpperCase() + g.relation.slice(1)
          }`}
        >
          <InfoRow label="Name (EN)" value={g.name.en} />
          <InfoRow label="Name (BN)" value={g.name.bn} />
          <InfoRow label="Mobile" value={g.mobile} mono />
          <InfoRow label="NID" value={g.nid} mono />
          <InfoRow label="Wallet" value={g.walletProvider} />
        </InfoCard>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PROMOTIONS TAB
═══════════════════════════════════════════════════════════════ */
function PromotionsTab({
  student,
  studentUid,
}: {
  student: Student;
  studentUid: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Link
          href={`/students/${studentUid}/promote`}
          className="sd-action-promote"
          style={{ fontSize: 12 }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          New Promotion
        </Link>
      </div>
      {student.promotions.length === 0 ? (
        <div className="sd-empty">
          <p className="sd-empty-text">No promotion history yet.</p>
        </div>
      ) : (
        <div className="sd-card">
          <table className="sd-table">
            <thead>
              <tr>
                {["Session", "From", "To", "Result", "Roll", "Date"].map(
                  (h) => (
                    <th key={h} className="sd-th">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {[...student.promotions]
                .reverse()
                .map((p: PromotionEntry, i: number) => {
                  const isPromo = p.result === "promoted";
                  return (
                    <tr key={i} className="sd-tr">
                      <td
                        className="sd-td"
                        style={{
                          fontFamily: '"JetBrains Mono",monospace',
                          fontSize: 12,
                          color: "var(--text-muted)",
                        }}
                      >
                        {p.session}
                      </td>
                      <td className="sd-td">Class {p.fromClass}</td>
                      <td
                        className="sd-td"
                        style={{
                          fontWeight: 700,
                          color: "var(--text-primary)",
                        }}
                      >
                        Class {p.toClass}
                      </td>
                      <td className="sd-td">
                        <span
                          className="sd-promo-badge"
                          style={{
                            color: isPromo ? "var(--success)" : "var(--accent)",
                            background: isPromo
                              ? "rgba(52,211,153,.1)"
                              : "rgba(245,158,11,.1)",
                            borderColor: isPromo
                              ? "rgba(52,211,153,.25)"
                              : "rgba(245,158,11,.25)",
                          }}
                        >
                          {p.result}
                        </span>
                      </td>
                      <td
                        className="sd-td"
                        style={{
                          fontFamily: '"JetBrains Mono",monospace',
                          fontSize: 12,
                        }}
                      >
                        {p.newRoll ?? "—"}
                      </td>
                      <td
                        className="sd-td"
                        style={{ fontSize: 11.5, color: "var(--text-muted)" }}
                      >
                        {new Date(p.decidedAt).toLocaleDateString("en-GB")}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STIPEND TAB
═══════════════════════════════════════════════════════════════ */
function StipendTab({
  student,
  studentUid,
}: {
  student: Student;
  studentUid: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Link
          href={`/students/${studentUid}/stipend`}
          className="sd-action-secondary"
          style={{ fontSize: 12 }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Update Stipend
        </Link>
      </div>
      {!student.stipendBeneficiary ? (
        <div className="sd-empty">
          <p className="sd-empty-text">No stipend beneficiary configured.</p>
          <Link
            href={`/students/${studentUid}/stipend`}
            style={{
              fontSize: 12,
              color: "var(--accent)",
              textDecoration: "none",
              marginTop: 8,
              display: "inline-block",
            }}
          >
            Set up now →
          </Link>
        </div>
      ) : (
        <div className="sd-grid-2">
          <InfoCard title="Stipend Beneficiary">
            <InfoRow label="Name" value={student.stipendBeneficiary.name} />
            <InfoRow
              label="Mobile"
              value={student.stipendBeneficiary.mobile}
              mono
            />
            <InfoRow
              label="Relation"
              value={student.stipendBeneficiary.relation}
            />
            <InfoRow
              label="Payment Method"
              value={student.stipendBeneficiary.paymentMethod.replace("_", " ")}
            />
            <InfoRow
              label="Wallet"
              value={student.stipendBeneficiary.walletProvider}
            />
            <div className="sd-row">
              <span className="sd-row-key">Active</span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "3px 9px",
                  borderRadius: 5,
                  border: "1px solid",
                  color: student.stipendBeneficiary.isActive
                    ? "var(--success)"
                    : "var(--error)",
                  background: student.stipendBeneficiary.isActive
                    ? "rgba(52,211,153,.1)"
                    : "rgba(248,113,113,.1)",
                  borderColor: student.stipendBeneficiary.isActive
                    ? "rgba(52,211,153,.25)"
                    : "rgba(248,113,113,.25)",
                }}
              >
                {student.stipendBeneficiary.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <InfoRow
              label="Last Updated"
              value={new Date(
                student.stipendBeneficiary.updatedAt
              ).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            />
          </InfoCard>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */
export default function StudentDetailPage() {
  const params = useParams();
  const studentUid = params.studentUid as string;

  const { data, isLoading, isError } = useGetStudentQuery(studentUid);
  
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateStudentStatusMutation();

  const [tab, setTab] = useState<Tab>("overview");
  const [statusDropdown, setStatusDropdown] = useState(false);

  // ✅ Correct unwrap — API returns { success, data: Student }
  const student: Student | undefined = data;

  

  const handleStatusChange = async (status: StudentStatus) => {
    if (!student || status === student.status) {
      setStatusDropdown(false);
      return;
    }
    try {
      await updateStatus({ studentUid, status }).unwrap();
      toast.success(`Status updated to ${status}`);
      setStatusDropdown(false);
    } catch (err: unknown) {
      toast.error("Failed to update status", {
        description: (err as any)?.data?.message ?? "Please try again.",
      });
    }
  };

  if (isLoading)
    return (
      <>
        <style>{CSS}</style>
        <Skeleton />
      </>
    );

  if (isError || !student) {
    return (
      <>
        <style>{CSS}</style>
        <div className="sd-error-wrap">
          <div className="sd-error-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--error)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p
            style={{
              margin: 0,
              fontWeight: 700,
              color: "var(--text-secondary)",
            }}
          >
            Student Not Found
          </p>
          <p style={{ margin: 0, fontSize: 12.5, color: "var(--text-muted)" }}>
            No record for UID{" "}
            <code
              style={{
                color: "var(--accent)",
                fontFamily: '"JetBrains Mono",monospace',
              }}
            >
              {studentUid}
            </code>
          </p>
          <Link
            href="/students"
            style={{
              fontSize: 13,
              color: "var(--accent)",
              textDecoration: "none",
            }}
          >
            ← Back to Students
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="sd-wrap">
        {/* Breadcrumb */}
        <div className="sd-bc">
          <Link href="/students" className="sd-bc-link">
            Students
          </Link>
          <span className="sd-bc-sep">/</span>
          <span className="sd-bc-cur">{student.name.en}</span>
        </div>

        {/* Profile header */}
        <div className="sd-header" style={{ marginBottom: 14 }}>
          <div className="sd-header-glow" />
          <div
            style={{
              position: "relative",
              display: "flex",
              flexWrap: "wrap",
              gap: 18,
              alignItems: "flex-start",
            }}
          >
            {/* Avatar */}
            {student.imageUrl ? (
              <img
                src={student.imageUrl}
                alt={student.name.en}
                className="sd-avatar-img"
              />
            ) : (
              <div className="sd-avatar-fallback">
                {student.name.en.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Name + status */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <h1 className="sd-name-en">{student.name.en}</h1>
                  {student.name.bn && (
                    <p className="sd-name-bn">{student.name.bn}</p>
                  )}
                </div>

                {/* Status badge & dropdown */}
                <div style={{ position: "relative" }}>
                  <button
                    className="sd-status-btn"
                    onClick={() => setStatusDropdown((v) => !v)}
                    disabled={isUpdating}
                    style={{
                      color: STATUS_COLOR[student.status],
                      background: STATUS_BG[student.status],
                      borderColor: STATUS_COLOR[student.status] + "40",
                    }}
                  >
                    {isUpdating ? (
                      <div className="sd-spinner" />
                    ) : (
                      <span
                        className="sd-status-dot"
                        style={{ background: STATUS_COLOR[student.status] }}
                      />
                    )}
                    {student.status}
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>

                  {statusDropdown && (
                    <>
                      {/* Backdrop */}
                      <div
                        style={{ position: "fixed", inset: 0, zIndex: 40 }}
                        onClick={() => setStatusDropdown(false)}
                      />
                      <div className="sd-dropdown">
                        {ALL_STATUSES.map((s) => (
                          <button
                            key={s}
                            className={`sd-dropdown-item${
                              s === student.status ? " active" : ""
                            }`}
                            onClick={() => handleStatusChange(s)}
                          >
                            <span
                              style={{
                                width: 7,
                                height: 7,
                                borderRadius: "50%",
                                background: STATUS_COLOR[s],
                                flexShrink: 0,
                              }}
                            />
                            {s}
                            {s === student.status && (
                              <svg
                                style={{ marginLeft: "auto" }}
                                width="11"
                                height="11"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M20 6 9 17l-5-5" />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Meta */}
              <div className="sd-meta">
                <span className="sd-chip sd-chip-mono">
                  {student.studentUid}
                </span>
                <span className="sd-sep">·</span>
                <span className="sd-chip">
                  Class {student.current.class} · Roll #{student.current.roll}
                </span>
                <span className="sd-sep">·</span>
                <span
                  className="sd-chip"
                  style={{ textTransform: "capitalize" }}
                >
                  {student.gender}
                </span>
                <span className="sd-sep">·</span>
                <span className="sd-chip">{student.religion}</span>
                <span className="sd-sep">·</span>
                <span
                  className="sd-chip"
                  style={{
                    fontFamily: '"JetBrains Mono",monospace',
                    fontSize: 11.5,
                  }}
                >
                  {student.current.session}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                flexShrink: 0,
              }}
            >
              <Link
                href={`/students/${studentUid}/promote`}
                className="sd-action-promote"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                Promote
              </Link>
              <Link
                href={`/students/${studentUid}/stipend`}
                className="sd-action-secondary"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="M2 10h20" />
                </svg>
                Stipend
              </Link>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="sd-tabs" style={{ marginBottom: 14 }}>
          {(["overview", "guardians", "promotions", "stipend"] as Tab[]).map(
            (t) => (
              <button
                key={t}
                className={`sd-tab${tab === t ? " active" : ""}`}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            )
          )}
        </div>

        {/* Tab content */}
        {tab === "overview" && <OverviewTab student={student} />}
        {tab === "guardians" && <GuardiansTab student={student} />}
        {tab === "promotions" && (
          <PromotionsTab student={student} studentUid={studentUid} />
        )}
        {tab === "stipend" && (
          <StipendTab student={student} studentUid={studentUid} />
        )}
      </div>
    </>
  );
}
