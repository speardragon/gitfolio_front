import Image from "next/image";
import GITFOLIO_LOGO from "../../../../public/images/gitfolio-logo.png";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex flex-col bg-white h-full p-4">
      {/* <h1 className="text-2xl font-bold text-gray-900">GITFOLIO</h1> */}
      <Link href={"/"}>
        <Image alt="github_white_logo" src={GITFOLIO_LOGO} width={200} />
      </Link>
    </header>
  );
}
