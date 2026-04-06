// src/app/(dashboard)/results/config/_components/rc-primitives.tsx
// Small, reusable UI atoms used across the result config module

import React from "react";

// ─── Field wrapper ────────────────────────────────────────────────

interface FieldProps {
  label?: React.ReactNode;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

export function Field({ label, required, error, hint, children }: FieldProps) {
  return (
    <div className="rc-field">
      {label !== undefined && (
        <label className="rc-label">
          {label}
          {required && <span className="rc-req">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <span className="rc-hint">{hint}</span>}
      {error && (
        <span className="rc-error">
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </span>
      )}
    </div>
  );
}

// ─── Add row button ───────────────────────────────────────────────

export function AddBtn({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button type="button" className="rc-add-btn" onClick={onClick}>
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
      {label}
    </button>
  );
}

// ─── Remove row button ────────────────────────────────────────────

export function RemoveBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="rc-rm-btn"
      onClick={onClick}
      title="Remove"
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
  );
}

// ─── Column header row ────────────────────────────────────────────

export function ColHeaders({ cols }: { cols: string[] }) {
  return (
    <div style={{ display: "contents" }}>
      {cols.map((h, i) => (
        <span key={i} className="rc-col-hdr">
          {h}
        </span>
      ))}
    </div>
  );
}

// ─── Info callout ─────────────────────────────────────────────────

export function InfoCallout({ children }: { children: React.ReactNode }) {
  return (
    <div className="rc-info">
      <svg
        className="rc-info-icon"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
      {children}
    </div>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────

export function Spinner() {
  return <div className="rc-spinner" />;
}

// ─── Skeleton list ────────────────────────────────────────────────

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="rc-skeleton"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </>
  );
}

// ─── Empty state ──────────────────────────────────────────────────

export function EmptyState({
  icon,
  title,
  subtitle,
}: {
  icon: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="rc-empty">
      <div className="rc-empty-icon">{icon}</div>
      <p className="rc-empty-title">{title}</p>
      <p className="rc-empty-sub">{subtitle}</p>
    </div>
  );
}

// ─── Card wrapper ─────────────────────────────────────────────────

export function Card({
  icon,
  title,
  badge,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rc-card">
      <div className="rc-card-title">
        <span className="rc-card-icon">{icon}</span>
        {title}
        {badge && (
          <span
            style={{
              marginLeft: "auto",
              fontSize: 11,
              fontWeight: 400,
              textTransform: "none",
              color: "var(--text-muted)",
            }}
          >
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
