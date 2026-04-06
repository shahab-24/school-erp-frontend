// src/app/layout.tsx
import type { Metadata } from "next";
import { appConfig } from "@/lib/config/appConfig";
import { Providers } from "@/lib/Providers";
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
    // ThemeProvider sets data-theme on <html> inside useEffect (client-only).
    // Server renders <html> without it → React mismatch → this silences it safely.
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
