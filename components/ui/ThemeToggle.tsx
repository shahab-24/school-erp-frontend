// src/components/ui/ThemeToggle.tsx
"use client";

import { useTheme } from "@/context/ThemeProvider";

// Sun icon
function SunIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

// Moon icon
function MoonIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

/**
 * ThemeToggle — animated sun/moon button
 *
 * Works via globals.css:
 *   .theme-icon-sun  → visible in dark mode
 *   .theme-icon-moon → visible in light mode
 *   [data-theme="light"] flips which is visible
 *
 * ThemeProvider.toggleTheme() sets data-theme on <html>
 * → CSS automatically switches the visible icon
 */
export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="erp-icon-btn"
      style={{
        overflow: "hidden",
        transition:
          "color var(--transition), background var(--transition), border-color var(--transition), transform 0.3s ease",
      }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "rotate(15deg)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "rotate(0deg)")}
    >
      {/* Sun — shown in dark mode */}
      <span className="theme-icon theme-icon-sun">
        <SunIcon />
      </span>
      {/* Moon — shown in light mode */}
      <span className="theme-icon theme-icon-moon">
        <MoonIcon />
      </span>
    </button>
  );
}
