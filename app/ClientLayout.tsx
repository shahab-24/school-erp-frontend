// src/app/ClientLayout.tsx  ← "use client" wrapper for all providers
"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { ThemeProvider } from "@/context/ThemeProvider";

// Separated from RootLayout (which is a server component) so that:
// 1. RootLayout can export `metadata` (only allowed in server components)
// 2. Client-side providers live here without infecting the root

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <Provider store={store}>{children}</Provider>
    </ThemeProvider>
  );
}
