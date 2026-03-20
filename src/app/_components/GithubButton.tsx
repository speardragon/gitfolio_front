import GITHUB_WHITE_LOGO from "../../../public/images/github-mark-white.png";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

export default function GithubButton() {
  const handleGithubLogin = () => {
    if (process.env.NEXT_PUBLIC_ENABLE_MSW === "true") {
      window.location.href = "/community";
      return;
    }

    if (!apiUrl || apiUrl === "undefined" || apiUrl === "null") {
      console.error("NEXT_PUBLIC_API_URL is not configured.");
      return;
    }

    window.location.href = `${apiUrl}/oauth2/authorization/github`;
  };

  return (
    <>
      <Button onClick={handleGithubLogin} className="flex gap-2">
        <Image
          alt="github_white_logo"
          src={GITHUB_WHITE_LOGO}
          width={20}
          height={20}
          className="h-auto w-auto"
        />
        <div className="font-semibold">깃허브로 로그인하기</div>
      </Button>
    </>
  );
}
