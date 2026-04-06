// src/context/ThemeProvider.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  isDark: true,
  toggleTheme: () => {},
});

const KEY = "erp-theme";

function apply(theme: Theme) {
  // This is the ONLY thing that needs to happen for CSS vars to switch.
  // globals.css listens to [data-theme="dark"|"light"] on <html>.
  document.documentElement.setAttribute("data-theme", theme);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = localStorage.getItem(KEY) as Theme | null;
    const system: Theme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    const initial = stored ?? system;
    setTheme(initial);
    apply(initial);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      localStorage.setItem(KEY, next);
      apply(next);
      return next;
    });
  };

  return (
    <ThemeContext.Provider
      value={{ theme, isDark: theme === "dark", toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
