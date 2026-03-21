"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { useLogout } from "../_hooks/useLogout";
import {
  BadgeDollarSign,
  ChevronDown,
  Crown,
  LogOut,
  PencilLine,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  avatarUrl: string;
  nickname: string;
  plan: string;
};

export default function HeaderPopover({ avatarUrl, nickname, plan }: Props) {
  const { mutate } = useLogout();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="group flex items-center gap-3 rounded-full border border-transparent bg-white px-2 py-1.5 text-left transition hover:border-slate-200 hover:bg-white">
          <Avatar className="h-10 w-10 ring-1 ring-slate-200">
            <AvatarImage
              className="object-cover"
              src={avatarUrl}
              alt="Profile Image"
            />
          </Avatar>
          <div className="hidden min-w-0 sm:block">
            <div className="truncate text-sm font-semibold text-slate-950">
              {nickname}
            </div>
            <div className="text-xs text-slate-500">
              {plan === "PRO" ? "Pro workspace" : "Free workspace"}
            </div>
          </div>
          <ChevronDown className="hidden h-4 w-4 text-slate-400 transition group-data-[state=open]:rotate-180 sm:block" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={14}
        className="w-72 overflow-hidden rounded-[24px] border border-slate-200/80 bg-white p-0 shadow-[0_28px_80px_-45px_rgba(15,23,42,0.45)]"
      >
        <div className="border-b border-slate-200/80 bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(30,41,59,0.92))] px-5 py-5 text-white">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-14 w-14 ring-2 ring-white/20">
                <AvatarImage
                  className="object-cover"
                  src={avatarUrl}
                  alt="Profile Image"
                />
              </Avatar>
              {plan === "PRO" && (
                <span className="absolute -right-1 -top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-slate-950 shadow-lg">
                  <Crown size={14} fill="currentColor" />
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold">{nickname}</p>
              <div
                className={cn(
                  "mt-2 inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
                  plan === "PRO"
                    ? "bg-amber-300 text-slate-950"
                    : "bg-white/12 text-slate-200",
                )}
              >
                {plan}
              </div>
            </div>
          </div>
        </div>

        <div className="p-3">
          <div className="space-y-1">
            <Link
              scroll={false}
              onClick={() => setIsOpen(false)}
              href={"/plan"}
              className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <BadgeDollarSign className="h-4 w-4" />
              </span>
              <div>
                <div>내 플랜</div>
                <div className="text-xs font-medium text-slate-500">
                  현재 사용 중인 요금제 확인
                </div>
              </div>
            </Link>
            <Link
              scroll={false}
              onClick={() => setIsOpen(false)}
              href={"/edit"}
              className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <PencilLine className="h-4 w-4" />
              </span>
              <div>
                <div>내 정보 수정</div>
                <div className="text-xs font-medium text-slate-500">
                  프로필과 링크, 연락처 관리
                </div>
              </div>
            </Link>
          </div>

          <Separator className="my-3" />

          <button
            onClick={() => {
              mutate();
              setIsOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-semibold text-rose-500 transition hover:bg-rose-50"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
              <LogOut className="h-4 w-4" />
            </span>
            <div>
              <div>로그아웃</div>
              <div className="text-xs font-medium text-rose-400">
                현재 세션을 종료하고 홈으로 이동
              </div>
            </div>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
