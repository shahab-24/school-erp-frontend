// src/app/layout.tsx  ← ROOT layout (server component)
import type { Metadata } from "next";
import { appConfig } from "@/lib/config/appConfig";
import ClientLayout from "./ClientLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: `${appConfig.schoolNameEn} — ERP`,
  description: `School management system for ${appConfig.schoolNameEn}`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning is REQUIRED:
    // ThemeProvider sets data-theme on <html> client-side (useEffect).
    // Server renders <html> without it → React sees mismatch → warning.
    // This prop silences only that one attribute mismatch — nothing else.
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
