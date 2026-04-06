// src/components/Guard/AuthGuard.tsx
"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import type { RootState } from "@/lib/store";

/**
 * AuthGuard wraps dashboard routes.
 * Shows a loading screen while auth state is being determined,
 * then redirects to /login if not authenticated.
 *
 * Why mounted state?
 * Redux is hydrated client-side. On first render, isAuthenticated
 * is always false (SSR default). Without mounted check, every page
 * flashes the loading screen then redirects even for logged-in users.
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Small delay to allow AuthInitializer's /me query to resolve
    const timer = setTimeout(() => setChecked(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (checked && !isAuthenticated) {
      router.replace("/login");
    }
  }, [checked, isAuthenticated, router]);

  // Still waiting for auth check
  if (!checked) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100dvh",
          background: "var(--bg-body)",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 11,
            background: "var(--accent-soft)",
            border: "1.5px solid rgba(245,158,11,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--accent)",
            animation: "iconPulse 2s ease-in-out infinite",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
        </div>
        <div
          style={{
            width: 28,
            height: 28,
            border: "2.5px solid var(--border)",
            borderTopColor: "var(--accent)",
            borderRadius: "50%",
            animation: "spin 0.7s linear infinite",
          }}
        />
        <p
          style={{
            fontSize: 13,
            color: "var(--text-muted)",
            fontFamily: '"Sora", sans-serif',
          }}
        >
          Loading…
        </p>
      </div>
    );
  }

  // Not authenticated — render nothing (redirect in progress)
  if (!isAuthenticated) return null;

  return <>{children}</>;
}
