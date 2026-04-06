// src/app/(dashboard)/students/loading.tsx
// Next.js Suspense boundary — shows while page.tsx loads

export default function StudentsLoading() {
  return (
    <div className="space-y-5 animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-6 w-32 rounded-xl bg-white/5" />
          <div className="h-4 w-56 rounded-xl bg-white/5" />
        </div>
        <div className="h-10 w-36 rounded-xl bg-white/5" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 rounded-xl bg-white/5" />
        ))}
      </div>

      {/* Filter bar */}
      <div className="h-16 rounded-xl bg-white/5" />

      {/* Table */}
      <div className="rounded-xl bg-white/[0.03] border border-white/8 overflow-hidden">
        <div className="h-12 bg-white/[0.02] border-b border-white/8" />
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-4 py-3.5 border-b border-white/5"
          >
            <div className="w-8 h-8 rounded-lg bg-white/5 shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 rounded-full bg-white/5 w-2/5" />
              <div className="h-2.5 rounded-full bg-white/5 w-1/4" />
            </div>
            <div className="h-3 rounded-full bg-white/5 w-24" />
            <div className="h-3 rounded-full bg-white/5 w-16" />
            <div className="h-5 rounded-lg bg-white/5 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
