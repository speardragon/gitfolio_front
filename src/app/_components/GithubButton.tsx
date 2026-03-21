"use client";

import GITHUB_WHITE_LOGO from "../../../public/images/github-mark-white.png";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useAuthStore } from "../store/useAuthStore";

type GithubButtonProps = {
  className?: string;
  label?: string;
};

export default function GithubButton({
  className,
  label = "깃허브로 로그인하기",
}: GithubButtonProps) {
  const login = useAuthStore((state) => state.login);

  const handleGithubLogin = () => {
    login("mock-access-token");
    window.location.href = "/community";
  };

  return (
    <Button
      onClick={handleGithubLogin}
      className={cn(
        "flex gap-2 rounded-full border border-slate-900 bg-slate-950 px-5 text-white shadow-[0_16px_40px_-18px_rgba(15,23,42,0.75)] hover:bg-slate-800",
        className,
      )}
    >
      <Image
        alt="GitHub logo"
        src={GITHUB_WHITE_LOGO}
        width={20}
        height={20}
        className="h-auto w-auto"
      />
      <span className="font-semibold">{label}</span>
    </Button>
  );
}
