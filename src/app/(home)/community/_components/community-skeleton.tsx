import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  size?: number;
};

export default function CommunitySkeleton({ size = 12 }: Props) {
  return (
    <div className="min-h-full bg-[#f5f7fb]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-slate-200/80 bg-white px-6 py-7 shadow-[0_32px_90px_-54px_rgba(15,23,42,0.35)] lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <Skeleton className="h-9 w-40 rounded-full" />
              <Skeleton className="h-12 w-full max-w-[520px]" />
              <Skeleton className="h-6 w-full max-w-[640px]" />
              <Skeleton className="h-6 w-full max-w-[520px]" />
            </div>
            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
              <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-24 rounded-[22px]" />
                <Skeleton className="h-24 rounded-[22px]" />
              </div>
              <Skeleton className="mt-4 h-11 w-full rounded-full" />
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-200/80 bg-white px-5 py-5 shadow-[0_28px_80px_-52px_rgba(15,23,42,0.35)] sm:px-6">
          <div className="space-y-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-8 w-56" />
              </div>
              <Skeleton className="h-10 w-32 rounded-full" />
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1.2fr_auto]">
              <Skeleton className="h-11 rounded-2xl" />
              <Skeleton className="h-11 rounded-2xl" />
              <Skeleton className="h-11 rounded-2xl" />
              <Skeleton className="h-11 rounded-2xl" />
              <Skeleton className="h-11 rounded-2xl" />
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-7 w-24 rounded-full" />
                <Skeleton className="h-7 w-28 rounded-full" />
                <Skeleton className="h-7 w-20 rounded-full" />
              </div>
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-8 w-48" />
          </div>
          <Skeleton className="h-5 w-40" />
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: size }).map((_, idx) => (
            <div
              key={idx}
              className="rounded-[28px] border border-slate-200/80 bg-white shadow-[0_24px_60px_-42px_rgba(15,23,42,0.45)]"
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-2xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="h-4 w-36" />
                  </div>
                </div>
                <Skeleton className="h-11 w-11 rounded-full" />
              </div>
              <div className="px-5 py-5">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-[92%]" />
                <Skeleton className="mt-2 h-4 w-[84%]" />
                <Skeleton className="mt-2 h-4 w-[70%]" />

                <div className="mt-5 flex flex-wrap gap-2">
                  <Skeleton className="h-7 w-16 rounded-full" />
                  <Skeleton className="h-7 w-20 rounded-full" />
                  <Skeleton className="h-7 w-14 rounded-full" />
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
