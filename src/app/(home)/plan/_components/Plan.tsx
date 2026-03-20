"use client";

import PlanCard from "./PlanCard";
import { PLANS } from "../_constants/constans";
import { useProfileQuery } from "../../onboarding/_hooks/useProfileQuery";
import FAQSection from "./FAQSection";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import confetti from "canvas-confetti";
import { CheckCircle2, Crown, Sparkles } from "lucide-react";

const benefitHighlights = [
  "생성과 수정 횟수 제한 없이 반복 개선",
  "프로젝트별 템플릿 선택과 PDF 활용",
  "커뮤니티 공개 전 빠른 초안 반복",
];

export default function Plan() {
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get("success");

  useEffect(() => {
    if (isSuccess === "true") {
      confetti({
        particleCount: 150,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  }, [isSuccess]);

  const { data: userProfile } = useProfileQuery();
  const isCurrentPlanPro = userProfile?.result?.paidPlan === "PRO";

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.08),_transparent_24%),radial-gradient(circle_at_80%_15%,_rgba(148,163,184,0.14),_transparent_22%),linear-gradient(180deg,_rgba(255,255,255,0.92),_rgba(245,247,251,0.98))]" />

      <section className="relative mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="rounded-[34px] border border-slate-200/80 bg-white/92 p-6 shadow-[0_32px_90px_-50px_rgba(15,23,42,0.45)] backdrop-blur sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
                <Sparkles className="h-4 w-4" />
                Premium plans
              </div>
              <h1 className="mt-5 text-4xl font-semibold leading-[1.06] tracking-[-0.05em] text-slate-950 sm:text-5xl">
                더 자주 만들고,
                <br />
                더 깊게 다듬는 이력서 작업 공간
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                무료 플랜으로 흐름을 익히고, 필요할 때 Pro로 확장할 수
                있습니다. 사용량보다 중요한 건 반복 편집과 완성도이기 때문에,
                업그레이드 화면도 과장 없이 기능 중심으로 정리했습니다.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {benefitHighlights.map((item) => (
                  <div
                    key={item}
                    className="rounded-[24px] border border-slate-200/80 bg-slate-50/70 px-5 py-5"
                  >
                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-[28px] border border-slate-200/80 bg-slate-950 px-5 py-5 text-white">
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl bg-white/10 p-3">
                    <Crown className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold">
                      현재 계정 상태
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {isCurrentPlanPro
                        ? "이미 Pro 플랜을 사용 중입니다. 현재 상태에서 무제한 생성과 수정 기능을 계속 사용할 수 있습니다."
                        : "현재는 Free 플랜입니다. 더 자주 생성하고 수정해야 한다면 Pro 전환이 작업 효율에 유리합니다."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {PLANS.map((plan) => {
                const isProPlan = plan.title === "Pro";
                const isFreePlan = plan.title === "Free";

                return (
                  <PlanCard
                    key={plan.title}
                    {...plan}
                    buttonLabel={
                      isFreePlan
                        ? "무료 플랜"
                        : isProPlan && isCurrentPlanPro
                          ? "현재 나의 플랜"
                          : plan.buttonLabel
                    }
                    buttonDisabled={
                      isFreePlan || (isProPlan && isCurrentPlanPro)
                    }
                    isCurrentPlan={isProPlan && isCurrentPlanPro}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <FAQSection />
    </div>
  );
}
