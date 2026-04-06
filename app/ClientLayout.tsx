// app/ClientLayout.tsx অথবা app/layout.tsx এর ক্লায়েন্ট অংশে
"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { ThemeProvider } from "@/context/ThemeProvider";
import { csrfUtils } from "@/lib/utils/csrf";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // ✅ App start এ CSRF token fetch করুন
    csrfUtils.fetchToken();

    // প্রতি ঘন্টায় token refresh (optional)
    const interval = setInterval(() => {
      csrfUtils.fetchToken();
    }, 60 * 60 * 1000); // 1 hour

    return () => clearInterval(interval);
  }, []);

  return (
    <ThemeProvider>
      <Provider store={store}>{children}</Provider>
    </ThemeProvider>
  );
}
