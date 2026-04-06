// src/app/(dashboard)/results/config/page.tsx
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

import {
  useGetSessionsQuery,
  useGetClassesQuery,
} from "@/lib/services/studentApi";
import { RC_CSS } from "@/components/resultConfig/RcStyle";
import { BuilderForm } from "@/components/resultConfig/BuilderForm";
import { HistoryTab } from "@/components/resultConfig/HistoryTab";


// ─── Types ───────────────────────────────────────────────────────

type ActiveTab = "builder" | "history";

const TABS: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
  {
    id: "builder",
    label: "Builder",
    icon: (
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
      </svg>
    ),
  },
  {
    id: "history",
    label: "History",
    icon: (
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14,2 14,8 20,8" />
      </svg>
    ),
  },
];

// ─── Page ────────────────────────────────────────────────────────

export default function ResultConfigPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("builder");

  const { data: sessions = [] } = useGetSessionsQuery();
  const { data: classes = [] } = useGetClassesQuery();

  // Always include classes 1–12; merge with any extra from DB
  const sessionOptions =
    sessions.length > 0
      ? sessions
      : [
          String(new Date().getFullYear()),
          String(new Date().getFullYear() + 1),
        ];

  const classOptions = useMemo(
    () =>
      Array.from(
        new Set([...Array.from({ length: 12 }, (_, i) => i + 1), ...classes])
      ).sort((a, b) => a - b),
    [classes]
  );

  return (
    <>
      <style>{RC_CSS}</style>
      <div className="rc">
        {/* Back link */}
        <Link href="/results" className="rc-back">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Results
        </Link>

        {/* Header */}
        <div className="rc-head">
          <div>
            <h1 className="rc-title">Result Configuration</h1>
            <p className="rc-sub">
              Define exam structure, normalization, aggregation, grading &amp;
              pass rules per session and class
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="rc-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`rc-tab${activeTab === t.id ? " active" : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "builder" && (
          <BuilderForm
            sessionOptions={sessionOptions}
            classOptions={classOptions}
            onSuccess={() => setActiveTab("history")}
          />
        )}

        {activeTab === "history" && (
          <HistoryTab sessions={sessionOptions} classOptions={classOptions} />
        )}
      </div>
    </>
  );
}
