"use client";

import { useToast } from "./use-toast";

export function ToastContainer() {
  const { toasts } = useToast();

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {toasts.map((t, i) => (
        <div
          key={i}
          className={`px-4 py-3 rounded shadow-lg text-white ${
            t.variant === "destructive" ? "bg-red-500" : "bg-gray-900"
          }`}
        >
          <div className="font-semibold">{t.title}</div>
          {t.description && (
            <div className="text-sm opacity-90">{t.description}</div>
          )}
        </div>
      ))}
    </div>
  );
}
