import { Skeleton } from "@/components/ui/skeleton";

export default function RepositorySkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <section className="overflow-hidden rounded-[30px] border border-slate-200/80 bg-white/92 p-4 shadow-[0_28px_80px_-48px_rgba(15,23,42,0.45)] backdrop-blur sm:p-6 lg:p-8">
        <div className="rounded-[28px] border border-slate-200/80 bg-white/90 px-5 py-5 sm:px-6">
          <Skeleton className="h-10 w-32 rounded-full" />
          <Skeleton className="mt-4 h-12 w-2/3 rounded-2xl" />
          <Skeleton className="mt-3 h-12 w-1/2 rounded-2xl" />
          <Skeleton className="mt-4 h-5 w-full rounded" />
          <Skeleton className="mt-2 h-5 w-4/5 rounded" />

          <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:min-w-[360px]">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <Skeleton className="h-4 w-14 rounded" />
                <Skeleton className="mt-2 h-6 w-16 rounded" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-6">
          <div className="rounded-[28px] border border-slate-200/80 bg-white px-5 py-6 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.42)] sm:px-6">
            <Skeleton className="h-10 w-44 rounded-full" />
            <Skeleton className="mt-4 h-8 w-56 rounded" />
            <Skeleton className="mt-3 h-4 w-full rounded" />

            <Skeleton className="mt-6 h-14 w-full rounded-[22px]" />

            <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="mt-3 h-12 w-full rounded-2xl" />
                <Skeleton className="mt-3 h-4 w-4/5 rounded" />
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="mt-3 h-24 w-full rounded-[20px]" />
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200/80 bg-white px-5 py-6 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.42)] sm:px-6">
            <Skeleton className="h-10 w-32 rounded-full" />
            <Skeleton className="mt-4 h-8 w-48 rounded" />
            <Skeleton className="mt-3 h-4 w-full rounded" />

            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
              <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="rounded-[26px] border border-slate-200 bg-slate-50/70 p-4"
                  >
                    <Skeleton className="h-44 w-full rounded-[20px]" />
                    <Skeleton className="mt-4 h-6 w-24 rounded" />
                    <Skeleton className="mt-2 h-4 w-full rounded" />
                    <Skeleton className="mt-2 h-4 w-4/5 rounded" />
                  </div>
                ))}
              </div>

              <div className="overflow-hidden rounded-[30px] border border-slate-200/80 bg-white/92 p-5 shadow-[0_28px_80px_-48px_rgba(15,23,42,0.45)] backdrop-blur sm:p-6">
                <Skeleton className="h-10 w-32 rounded-full" />
                <Skeleton className="mt-5 h-8 w-48 rounded" />
                <Skeleton className="mt-3 h-4 w-full rounded" />
                <Skeleton className="mt-2 h-4 w-4/5 rounded" />

                <div className="mt-6 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                  {[...Array(3)].map((_, index) => (
                    <div
                      key={index}
                      className="rounded-[24px] border border-slate-200/80 bg-white/90 px-5 py-5"
                    >
                      <Skeleton className="h-4 w-14 rounded" />
                      <Skeleton className="mt-3 h-7 w-20 rounded" />
                      <Skeleton className="mt-2 h-4 w-full rounded" />
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-[28px] border border-slate-200/80 bg-slate-950 px-5 py-5">
                  <Skeleton className="h-6 w-32 bg-white/20" />
                  <Skeleton className="mt-3 h-4 w-full bg-white/15" />
                  <Skeleton className="mt-2 h-4 w-4/5 bg-white/15" />
                </div>

                <div className="mt-6 rounded-[32px] border border-slate-200/80 bg-white p-3">
                  <Skeleton className="aspect-[3/4] w-full rounded-[26px]" />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200/80 bg-slate-950 px-5 py-5 text-white sm:px-6">
            <Skeleton className="h-4 w-16 bg-white/20" />
            <Skeleton className="mt-3 h-8 w-56 bg-white/20" />
            <Skeleton className="mt-3 h-4 w-full bg-white/15" />
            <Skeleton className="mt-2 h-4 w-5/6 bg-white/15" />

            <div className="mt-5 flex flex-col gap-3 lg:w-auto lg:min-w-[280px]">
              <Skeleton className="h-12 w-full rounded-full bg-white/20" />
              <Skeleton className="h-12 w-full rounded-full bg-white/10" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
