"use client";

import CheckIcon from "@/components/ui/CheckIcon";
import { usePlanMutation } from "../_hooks/usePlanMutation";
import { LoadingButton } from "@/components/ui/loading-button";
import { cn } from "@/lib/utils";

export default function PlanCard({
  title,
  price,
  description,
  buttonLabel,
  buttonDisabled,
  benefits,
  isCurrentPlan,
}: {
  title: string;
  price: string;
  description: string;
  buttonLabel: string;
  buttonDisabled: boolean;
  benefits: string[];
  animationDelay: string;
  isCurrentPlan?: boolean;
}) {
  const { mutate, isPending } = usePlanMutation();
  const isPro = title === "Pro";

  const handleButtonClick = () => {
    if (isPro && !buttonDisabled) {
      mutate("PRO");
    }
  };

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-[30px] border px-6 py-6 transition duration-200 sm:px-7 sm:py-7",
        isPro
          ? "border-slate-950 bg-slate-950 text-white shadow-[0_36px_90px_-48px_rgba(15,23,42,0.88)]"
          : "border-slate-200 bg-white text-slate-950 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.42)]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div
            className={cn(
              "inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]",
              isPro
                ? "border-white/15 bg-white/10 text-slate-100"
                : "border-slate-200 bg-slate-50 text-slate-600",
            )}
          >
            {title}
          </div>
          <div className="mt-5 flex items-end gap-2">
            <span className="text-4xl font-semibold tracking-[-0.04em]">
              {price}
            </span>
            <span
              className={cn(
                "pb-1 text-sm",
                isPro ? "text-slate-300" : "text-slate-500",
              )}
            >
              원 / 월
            </span>
          </div>
        </div>
        {isCurrentPlan ? (
          <div className="rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
            Current
          </div>
        ) : null}
      </div>

      <p
        className={cn(
          "mt-4 text-sm leading-6",
          isPro ? "text-slate-300" : "text-slate-600",
        )}
      >
        {description}
      </p>

      <LoadingButton
        loading={isPending}
        className={cn(
          "mt-6 h-12 w-full rounded-full text-base font-semibold",
          buttonDisabled
            ? isPro
              ? "cursor-not-allowed bg-white/10 text-slate-400 hover:bg-white/10"
              : "cursor-not-allowed bg-slate-100 text-slate-400 hover:bg-slate-100"
            : isPro
              ? "bg-white text-slate-950 hover:bg-slate-100"
              : "bg-slate-950 text-white hover:bg-slate-800",
        )}
        onClick={handleButtonClick}
      >
        {buttonLabel}
      </LoadingButton>

      <div
        className={cn(
          "mt-6 rounded-[24px] border px-4 py-4",
          isPro ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50/70",
        )}
      >
        <div
          className={cn(
            "text-sm font-semibold",
            isPro ? "text-slate-100" : "text-slate-950",
          )}
        >
          포함 기능
        </div>
        <ul className="mt-4 space-y-3 text-sm">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-3">
              <CheckIcon />
              <span className={isPro ? "text-slate-200" : "text-slate-600"}>
                {benefit}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
