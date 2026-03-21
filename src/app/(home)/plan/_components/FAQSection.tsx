"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_ITEMS } from "../_constants/constans";
import { useUnsubscribeMutation } from "../_hooks/useUnsubscribeMutation";

export default function FAQSection() {
  const { mutate } = useUnsubscribeMutation();

  return (
    <section className="relative mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="rounded-[34px] border border-slate-200/80 bg-white/92 px-5 py-8 shadow-[0_32px_90px_-50px_rgba(15,23,42,0.45)] backdrop-blur sm:px-8 sm:py-10">
        <div className="max-w-3xl">
          <div className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
            FAQ
          </div>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
            사용권 활용과 구독 해지 안내
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
            결제 전후에 자주 확인하는 내용을 한 화면에 정리했습니다. 해지가
            필요하면 아래 링크에서 바로 진행할 수 있습니다.
          </p>
        </div>

        <div className="mt-8 rounded-[28px] border border-slate-200/80 bg-slate-50/70 px-4 py-2 sm:px-6">
          <Accordion
            defaultValue={FAQ_ITEMS.map((item) => item.id)}
            type="multiple"
            className="w-full"
          >
            {FAQ_ITEMS.map(({ id, question, answer }) => (
              <AccordionItem key={id} value={id} className="border-slate-200">
                <AccordionTrigger className="gap-3 py-5 text-left text-lg font-semibold text-slate-950">
                  <span className="text-blue-600">Q.</span>
                  <span>{question}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-5 pl-8 text-sm leading-7 text-slate-600">
                  {answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => mutate()}
            className="text-sm font-medium text-slate-500 underline underline-offset-4 transition hover:text-slate-950"
          >
            해지하기
          </button>
        </div>
      </div>
    </section>
  );
}
