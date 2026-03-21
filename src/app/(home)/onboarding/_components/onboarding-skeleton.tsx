import { Skeleton } from "@/components/ui/skeleton";

export default function OnboardingSkeleton() {
  return (
    <div className="relative min-h-full overflow-hidden bg-[#f5f7fb] text-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.1),_transparent_26%),radial-gradient(circle_at_85%_15%,_rgba(148,163,184,0.14),_transparent_24%),linear-gradient(180deg,_rgba(255,255,255,0.96),_rgba(245,247,251,0.98))]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[linear-gradient(rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <section className="overflow-hidden rounded-[30px] border border-slate-200/80 bg-white/92 p-6 shadow-[0_28px_80px_-48px_rgba(15,23,42,0.45)] backdrop-blur sm:p-8">
            <Skeleton className="h-10 w-40 rounded-full" />
            <Skeleton className="mt-5 h-12 w-2/3 rounded-2xl" />
            <Skeleton className="mt-3 h-12 w-1/2 rounded-2xl" />
            <Skeleton className="mt-5 h-5 w-full rounded" />
            <Skeleton className="mt-2 h-5 w-4/5 rounded" />

            <div className="mt-8 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="rounded-[24px] border border-slate-200/80 bg-white/90 px-5 py-5"
                >
                  <Skeleton className="h-4 w-16 rounded" />
                  <Skeleton className="mt-3 h-8 w-20 rounded" />
                  <Skeleton className="mt-3 h-4 w-full rounded" />
                  <Skeleton className="mt-2 h-4 w-4/5 rounded" />
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[28px] border border-slate-200/80 bg-slate-950 px-5 py-5 text-white">
              <div className="flex items-center gap-3">
                <Skeleton className="h-14 w-14 rounded-2xl bg-white/20" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 bg-white/20" />
                  <Skeleton className="mt-2 h-6 w-36 bg-white/20" />
                  <Skeleton className="mt-2 h-4 w-40 bg-white/20" />
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Skeleton className="mt-0.5 h-4 w-4 rounded-full bg-white/20" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-full bg-white/20" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[30px] border border-slate-200/80 bg-white/92 p-4 shadow-[0_28px_80px_-48px_rgba(15,23,42,0.45)] backdrop-blur sm:p-6 lg:p-8">
            <div className="mb-8 rounded-[28px] border border-slate-200/80 bg-white/90 px-5 py-5 sm:px-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <Skeleton className="h-4 w-20 rounded" />
                  <Skeleton className="mt-3 h-8 w-2/3 rounded" />
                  <Skeleton className="mt-3 h-4 w-full rounded" />
                </div>
                <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[360px]">
                  {[...Array(3)].map((_, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                    >
                      <Skeleton className="h-4 w-10 rounded" />
                      <Skeleton className="mt-2 h-4 w-full rounded" />
                      <Skeleton className="mt-2 h-4 w-4/5 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {[...Array(3)].map((_, index) => (
                <section
                  key={index}
                  className="rounded-[28px] border border-slate-200/80 bg-white px-5 py-5 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.42)] sm:px-7 sm:py-7"
                >
                  <div className="border-b border-slate-200/80 pb-5">
                    <div className="flex gap-4">
                      <Skeleton className="h-12 w-12 rounded-2xl" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-24 rounded-full" />
                        <Skeleton className="mt-3 h-8 w-40 rounded" />
                        <Skeleton className="mt-2 h-4 w-full rounded" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
                    <div className="rounded-[26px] border border-slate-200/80 bg-slate-50/80 p-5">
                      <Skeleton className="mx-auto h-[148px] w-[148px] rounded-[28px]" />
                      <Skeleton className="mt-4 h-4 w-full rounded" />
                      <Skeleton className="mt-2 h-4 w-4/5 rounded" />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {[...Array(4)].map((__, fieldIndex) => (
                        <div key={fieldIndex} className="space-y-2">
                          <Skeleton className="h-4 w-16 rounded" />
                          <Skeleton className="h-12 w-full rounded-2xl" />
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              ))}

              <div className="flex justify-end">
                <Skeleton className="h-12 w-40 rounded-full" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
