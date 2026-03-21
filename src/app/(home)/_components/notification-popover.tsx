"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell, Heart, MessageSquare, Sparkles } from "lucide-react";
import { useNotificationsQuery } from "../_hooks/useNotificationQuery";
import { useRouter } from "next/navigation";
import { useNotificationMutation } from "../_hooks/useNotificationMutation";
import { useCallback } from "react";
import { cn } from "@/lib/utils";

export default function NotificationPopover() {
  const router = useRouter();
  const { data: notifications } = useNotificationsQuery();
  const { mutate } = useNotificationMutation();
  const notificationItems = notifications?.result ?? [];
  const unreadCount = notificationItems.filter((noti) => !noti.isRead).length;

  const getNotificationMessage = useCallback(
    (type: string, senderName: string) => {
      if (type === "LIKE") {
        return `${senderName}님이 회원님의 이력서에 좋아요를 눌렀습니다!`;
      } else if (type === "COMMENT") {
        return `${senderName}님이 회원님의 이력서에 댓글을 달았습니다!`;
      }
      return "";
    },
    [],
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 inline-flex min-w-[1.15rem] items-center justify-center rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={14}
        className="w-[380px] overflow-hidden rounded-[24px] border border-slate-200/80 bg-white p-0 shadow-[0_28px_80px_-45px_rgba(15,23,42,0.45)]"
      >
        <div className="border-b border-slate-200/80 bg-slate-950 px-5 py-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-base font-semibold">알림</div>
              <div className="mt-1 text-sm text-slate-300">
                읽지 않은 업데이트 {unreadCount}개
              </div>
            </div>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-slate-100">
              <Sparkles className="h-4 w-4" />
            </span>
          </div>
        </div>

        <div className="max-h-[420px] overflow-y-auto p-3">
          {notificationItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[20px] border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                <Bell className="h-5 w-5" />
              </div>
              <div className="mt-4 text-sm font-semibold text-slate-700">
                아직 도착한 알림이 없습니다.
              </div>
              <div className="mt-1 text-sm text-slate-500">
                좋아요나 댓글이 생기면 여기에서 바로 확인할 수 있습니다.
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {notificationItems.map((noti) => (
                <button
                key={noti.notificationId}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-[20px] border px-4 py-4 text-left transition",
                    noti.isRead
                      ? "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                      : "border-blue-100 bg-blue-50/70 hover:border-blue-200 hover:bg-blue-50",
                  )}
                  onClick={() => {
                    router.push(`/myResume/${noti.resumeId}`);
                    mutate(noti.notificationId);
                  }}
                >
                  <span
                    className={cn(
                      "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
                      noti.type === "LIKE"
                        ? "bg-rose-100 text-rose-500"
                        : "bg-blue-100 text-blue-600",
                    )}
                  >
                    {noti.type === "LIKE" ? (
                      <Heart className="h-4 w-4" />
                    ) : (
                      <MessageSquare className="h-4 w-4" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold leading-6 text-slate-800">
                      {getNotificationMessage(noti.type, noti.senderNickname)}
                    </p>
                    <p className="mt-1 text-xs font-medium text-slate-500">
                      {noti.isRead ? "읽음" : "새 알림"} · 내 이력서로 이동
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
