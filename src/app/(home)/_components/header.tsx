import Image from "next/image";
import GITFOLIO_LOGO from "../../../../public/images/gitfolio-logo.png";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex flex-col h-full p-4 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between">
        <Link href={"/community"}>
          <Image
            alt="github_white_logo"
            src={GITFOLIO_LOGO}
            width={150}
            priority
          />
        </Link>
        <div className="flex gap-4">
          <Link href="/my-resume">
            <button className="text-blue-500 hover:underline font-semibold">
              내이력서
            </button>
          </Link>
          <button
            className=" hover:underline font-semibold"
            onClick={() => {
              /* 로그아웃 로직 추가 */
            }}
          >
            로그아웃
          </button>
        </div>
      </div>
    </header>
  );
}
