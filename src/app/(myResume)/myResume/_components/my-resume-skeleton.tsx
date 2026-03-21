import React from "react";

export default function MyResumeSkeleton() {
  return (
    <div className="min-h-full bg-[#f5f7fb]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[34px] border border-slate-200/80 bg-white px-6 py-7 shadow-[0_32px_90px_-54px_rgba(15,23,42,0.35)] lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
            <div className="space-y-4">
              <div className="h-10 w-44 animate-pulse rounded-full bg-blue-100" />
              <div className="h-12 w-3/4 animate-pulse rounded-2xl bg-slate-200" />
              <div className="h-5 w-full animate-pulse rounded bg-slate-200" />
              <div className="h-5 w-2/3 animate-pulse rounded bg-slate-200" />
              <div className="flex gap-3">
                <div className="h-12 w-40 animate-pulse rounded-full bg-slate-300" />
                <div className="h-12 w-40 animate-pulse rounded-full bg-slate-200" />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="h-28 animate-pulse rounded-[26px] border border-slate-200 bg-slate-100"
                />
              ))}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-white p-5 shadow-[0_24px_75px_-52px_rgba(15,23,42,0.45)]"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-[68px] w-[68px] animate-pulse rounded-2xl bg-slate-200" />
                  <div className="space-y-2">
                    <div className="h-4 w-16 animate-pulse rounded bg-slate-200" />
                    <div className="h-8 w-28 animate-pulse rounded bg-slate-200" />
                  </div>
                </div>
                <div className="h-8 w-20 animate-pulse rounded-full bg-slate-200" />
              </div>

              <div className="mt-6 space-y-3">
                <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-4/5 animate-pulse rounded bg-slate-200" />
              </div>

              <div className="mt-5 flex gap-2">
                <div className="h-7 w-16 animate-pulse rounded-full bg-blue-100" />
                <div className="h-7 w-20 animate-pulse rounded-full bg-blue-100" />
              </div>

              <div className="mt-6 rounded-[24px] border border-slate-200/80 bg-slate-50/90 px-4 py-4">
                <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-slate-200" />
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
