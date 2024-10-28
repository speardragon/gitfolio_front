import Image from "next/image";
import GITFOLIO_LOGO from "../../../../public/images/gitfolio-logo.png";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex flex-col h-full p-4 bg-white">
      <Link href={"/"}>
        <Image alt="github_white_logo" src={GITFOLIO_LOGO} width={200} />
      </Link>
    </header>
  );
}
