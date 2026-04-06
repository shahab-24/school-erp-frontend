// src/lib/Providers.tsx
"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import { ThemeProvider } from "@/context/ThemeProvider";
import AuthInitializer from "@/components/AuthInitializer";

/**
 * Provider order matters:
 *  1. Redux Provider  — store must wrap everything
 *  2. ThemeProvider   — sets data-theme on <html>, reads localStorage
 *  3. AuthInitializer — uses Redux dispatch + RTK Query (needs Redux)
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthInitializer>{children}</AuthInitializer>
      </ThemeProvider>
    </Provider>
  );
}
