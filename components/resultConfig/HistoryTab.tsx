// src/app/(dashboard)/results/config/_components/HistoryTab.tsx
"use client";

import { useState} from "react";
import { useListResultConfigsQuery } from "@/lib/services/resultConfigApi";
import type { ResultConfig } from "@/types/resultConfig.types";
import { SkeletonList, EmptyState } from "./RcPrimitive";

// ─── HistoryCard ──────────────────────────────────────────────────

function HistoryCard({
  config: cfg,
  delay = 0,
}: {
  config: ResultConfig;
  delay?: number;
}) {
  const [open, setOpen] = useState(false);

  const createdAt = new Date(cfg.createdAt).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="rc-hist-item" style={{ animationDelay: `${delay}s` }}>
      {/* Head row */}
      <div className="rc-hist-head">
        <div>
          <div className="rc-hist-title">
            Session {cfg.session} · Class {cfg.class}
          </div>
          <div className="rc-hist-meta">Created {createdAt}</div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <span className="rc-badge rc-badge-v">v{cfg.version}</span>
          <span
            className={`rc-badge ${
              cfg.isActive ? "rc-badge-active" : "rc-badge-inactive"
            }`}
          >
            {cfg.isActive ? "● Active" : "Inactive"}
          </span>
          <button
            className="rc-btn-ghost"
            style={{ padding: "4px 10px", fontSize: 12 }}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "Hide" : "Details"}
          </button>
        </div>
      </div>

      {/* Summary pills */}
      <div className="rc-hist-pills">
        <span className="rc-pill rc-pill-accent">{cfg.exams.length} exams</span>
        <span className="rc-pill">{cfg.aggregation.type}</span>
        {cfg.passRules && (
          <span className="rc-pill">Pass: {cfg.passRules.passPercentage}%</span>
        )}
        {cfg.grading && <span className="rc-pill">{cfg.grading.type}</span>}
        {cfg.normalization.length > 0 && (
          <span className="rc-pill">{cfg.normalization.length} normalized</span>
        )}
      </div>

      {/* Expanded detail */}
      {open && (
        <div style={{ marginTop: 14 }}>
          {/* Exam tags */}
          <div className="rc-hist-exams">
            {cfg.exams.map((ex) => (
              <span key={ex.key} className="rc-exam-tag">
                {ex.label} ({ex.totalMarks})
              </span>
            ))}
          </div>

          {/* Grade scale */}
          {(cfg.grading?.scale?.length ?? 0) > 0 && (
            <div style={{ marginTop: 12 }}>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: ".5px",
                }}
              >
                Grade Scale
              </span>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                  marginTop: 6,
                }}
              >
                {cfg.grading!.scale!.map((g, i) => (
                  <span key={i} className="rc-pill">
                    {g.label} ≥{g.min}%{g.point != null ? ` (${g.point})` : ""}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Normalization */}
          {cfg.normalization.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: ".5px",
                }}
              >
                Normalization
              </span>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                  marginTop: 6,
                }}
              >
                {cfg.normalization.map((n, i) => (
                  <span key={i} className="rc-pill rc-pill-accent">
                    {n.examKey}: {n.from}→{n.to}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── HistoryTab ───────────────────────────────────────────────────

interface HistoryTabProps {
  sessions: string[];
  classOptions: number[];
}

export function HistoryTab({ sessions, classOptions }: HistoryTabProps) {
  const [filterSession, setFilterSession] = useState("");
  const [filterClass, setFilterClass] = useState<number | "">("");

  const {
    data: configs = [],
    isLoading,
    isError,
  } = useListResultConfigsQuery({
    session: filterSession || undefined,
    class: filterClass || undefined,
  });

  const hasFilter = filterSession !== "" || filterClass !== "";

  return (
    <div>
      {/* Filters */}
      <div className="rc-hist-filters">
        <select
          className="rc-select"
          style={{ width: 160 }}
          value={filterSession}
          onChange={(e) => setFilterSession(e.target.value)}
        >
          <option value="">All Sessions</option>
          {sessions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          className="rc-select"
          style={{ width: 140 }}
          value={filterClass}
          onChange={(e) =>
            setFilterClass(e.target.value ? Number(e.target.value) : "")
          }
        >
          <option value="">All Classes</option>
          {classOptions.map((c) => (
            <option key={c} value={c}>
              Class {c}
            </option>
          ))}
        </select>

        {hasFilter && (
          <button
            className="rc-btn-ghost"
            onClick={() => {
              setFilterSession("");
              setFilterClass("");
            }}
          >
            Clear
          </button>
        )}
      </div>

      {isLoading && <SkeletonList count={3} />}

      {isError && (
        <EmptyState
          icon="⚠️"
          title="Failed to load history"
          subtitle="Please refresh and try again"
        />
      )}

      {!isLoading && !isError && configs.length === 0 && (
        <EmptyState
          icon="📋"
          title="No configurations found"
          subtitle="Create your first config using the Builder tab"
        />
      )}

      {configs.map((cfg, i) => (
        <HistoryCard key={cfg._id} config={cfg} delay={i * 0.05} />
      ))}
    </div>
  );
}
