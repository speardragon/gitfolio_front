"use client";

import Image from "next/image";
import GITFOLIO_LOGO from "../../../../public/images/gitfolio-logo.png";
import Link from "next/link";
import { useProfileQuery } from "../onboarding/_hooks/useProfileQuery";
import HeaderPopover from "./header-popover";
import NotificationPopover from "./notification-popover";
import GithubButton from "@/app/_components/GithubButton";
import { useAuthStore } from "@/app/store/useAuthStore";
import { cn } from "@/lib/utils";
import { ArrowRight, Compass, FileText, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Header() {
  const { data: userProfile } = useProfileQuery();
  const authenticated = useAuthStore((state) => state.authenticated);
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  const navItems = authenticated
    ? [
        { href: "/community", label: "커뮤니티", icon: Compass },
        { href: "/myResume", label: "내 이력서", icon: FileText },
        { href: "/plan", label: "플랜", icon: Sparkles },
      ]
    : [
        { href: "/community", label: "커뮤니티", icon: Compass },
        { href: "/plan", label: "플랜", icon: Sparkles },
      ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY.current;

      if (currentScrollY <= 24) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      if (Math.abs(scrollDelta) < 6) {
        return;
      }

      setIsVisible(scrollDelta < 0);
      lastScrollY.current = currentScrollY;
    };

    lastScrollY.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 px-4 pt-4 transition-transform duration-300 ease-out sm:px-6 lg:px-8",
        isVisible ? "translate-y-0" : "-translate-y-[calc(100%+1rem)]",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-[28px] border border-white/70 bg-white/82 px-4 py-3 shadow-[0_24px_70px_-42px_rgba(15,23,42,0.5)] backdrop-blur-xl">
        <div className="flex min-w-0 items-center gap-3 md:gap-5">
          <Link
            href="/community"
            className="flex shrink-0 items-center gap-3 rounded-full border border-slate-200/80 bg-white/80 px-3 py-2 transition hover:border-slate-300"
          >
            <Image
              alt="github_white_logo"
              src={GITFOLIO_LOGO}
              width={132}
              priority
              className="h-auto w-auto"
            />
            <span className="hidden rounded-full bg-slate-950 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white lg:inline-flex">
              Resume Lab
            </span>
          </Link>

          <nav className="hidden min-w-0 items-center gap-2 md:flex">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active =
                href === "/community"
                  ? pathname.startsWith("/community")
                  : href === "/myResume"
                    ? pathname.startsWith("/myResume")
                    : pathname.startsWith(href);

              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition md:w-11 md:px-0 xl:w-auto xl:px-4",
                    active
                      ? "bg-slate-950 text-white shadow-[0_16px_30px_-20px_rgba(15,23,42,0.9)]"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden xl:inline">{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {authenticated ? (
            <div className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-slate-50/90 p-1.5">
              <NotificationPopover />
              <HeaderPopover
                plan={userProfile?.result.paidPlan!}
                avatarUrl={userProfile?.result.avatarUrl as string}
                nickname={userProfile?.result.nickname!}
              />
            </div>
          ) : (
            <>
              <Link
                href="/community"
                className="hidden h-11 shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold whitespace-nowrap text-slate-700 transition hover:border-slate-300 hover:text-slate-950 xl:inline-flex"
              >
                먼저 둘러보기
                <ArrowRight className="h-4 w-4" />
              </Link>
              <GithubButton
                className="h-11 w-11 px-0 text-sm sm:w-auto sm:px-5"
                labelClassName="hidden sm:inline"
              />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
