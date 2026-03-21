import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function MyResumeDetailSkeleton() {
  return (
    <div className="relative min-h-full bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[34px] border border-slate-200/80 bg-white shadow-[0_32px_90px_-54px_rgba(15,23,42,0.35)]">
          <div className="grid gap-6 px-6 py-7 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10 lg:px-8">
            <div>
              <Skeleton className="h-10 w-28 rounded-full" />
              <Skeleton className="mt-5 h-10 w-48 rounded-full" />
              <Skeleton className="mt-4 h-12 w-4/5 rounded-2xl" />
              <Skeleton className="mt-3 h-12 w-3/4 rounded-2xl" />
              <Skeleton className="mt-4 h-5 w-full rounded" />
              <Skeleton className="mt-2 h-5 w-4/5 rounded" />
              <Skeleton className="mt-2 h-5 w-3/5 rounded" />
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-[26px] border border-slate-200 bg-slate-950 px-5 py-5">
                <Skeleton className="h-4 w-20 bg-white/20" />
                <div className="mt-3 flex items-center justify-between">
                  <Skeleton className="h-7 w-24 bg-white/20" />
                  <Skeleton className="h-7 w-12 rounded-full bg-white/20" />
                </div>
                <Skeleton className="mt-3 h-4 w-full bg-white/15" />
                <Skeleton className="mt-2 h-4 w-3/4 bg-white/15" />
              </div>

              <div className="rounded-[26px] border border-slate-200 bg-slate-50 px-5 py-5">
                <Skeleton className="h-4 w-20" />
                <div className="mt-3 flex gap-3">
                  <Skeleton className="h-5 w-14 rounded-full" />
                  <Skeleton className="h-5 w-14 rounded-full" />
                </div>
                <Skeleton className="mt-3 h-4 w-2/3" />
              </div>

              <div className="rounded-[26px] border border-slate-200 bg-blue-50 px-5 py-5">
                <Skeleton className="h-4 w-12 bg-white/80" />
                <div className="mt-3 flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-14 rounded-full bg-white" />
                  <Skeleton className="h-6 w-16 rounded-full bg-white" />
                  <Skeleton className="h-6 w-12 rounded-full bg-white" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <main className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-[34px] border border-slate-200/80 bg-white shadow-[0_28px_80px_-52px_rgba(15,23,42,0.35)]">
              <div className="px-20 space-y-10 border border-gray-300 rounded-lg p-14 w-full">
                <div className="flex flex-row">
                  <div className="flex flex-col flex-grow">
                    <Skeleton className="mb-4 h-10 w-1/2" />
                    <Skeleton className="h-8 w-1/3" />
                  </div>
                  <Skeleton className="h-[128px] w-[128px] rounded-lg md:h-[180px] md:w-[180px]" />
                </div>

                <Separator className="bg-black" />
                <div className="space-y-4">
                  <Skeleton className="h-6 w-1/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>

                <Separator className="bg-black" />
                <div className="space-y-4">
                  <Skeleton className="h-6 w-1/4" />
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                </div>

                <Separator className="bg-black" />
                <div className="space-y-4">
                  <Skeleton className="h-6 w-1/4" />
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                </div>

                <Separator className="bg-black" />
                <div className="space-y-4">
                  <Skeleton className="h-6 w-1/4" />
                  <Skeleton className="h-4 w-2/3" />
                </div>

                <Separator className="bg-black" />
                <div className="space-y-4">
                  <Skeleton className="h-6 w-1/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_75px_-52px_rgba(15,23,42,0.35)]">
              <div className="rounded-t-[28px] border-b border-slate-200 bg-white px-10 py-5">
                <Skeleton className="h-7 w-16" />
              </div>
              <div className="space-y-6 px-10 py-6">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="space-y-4">
                    <div className="flex items-start gap-3 p-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    </div>
                    {index < 2 && <Separator />}
                  </div>
                ))}

                <div className="flex items-center gap-2 pt-2">
                  <Skeleton className="h-10 flex-1 rounded-full" />
                  <Skeleton className="h-10 w-16 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-[34px] border border-slate-200/80 bg-white p-4 shadow-[0_28px_80px_-52px_rgba(15,23,42,0.35)] xl:sticky xl:top-28">
            <div className="rounded-[28px] bg-slate-950 px-5 py-5">
              <Skeleton className="h-4 w-28 bg-white/20" />
              <Skeleton className="mt-3 h-8 w-24 bg-white/20" />
              <Skeleton className="mt-3 h-4 w-full bg-white/15" />
              <Skeleton className="mt-2 h-4 w-4/5 bg-white/15" />
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-3">
                <Skeleton className="h-12 w-full rounded-[20px]" />
              </div>
              <Skeleton className="h-12 w-full rounded-[20px]" />
              <Skeleton className="h-12 w-full rounded-[20px]" />

              <div className="rounded-[26px] border border-blue-100 bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-10 w-10 rounded-2xl bg-white" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-20 bg-white/80" />
                    <Skeleton className="h-4 w-full bg-white/80" />
                    <Skeleton className="h-4 w-4/5 bg-white/80" />
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
