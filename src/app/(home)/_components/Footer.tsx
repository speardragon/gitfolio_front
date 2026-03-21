import Image from "next/image";
import GITFOLIO_LOGO from "../../../../public/images/gitfolio-logo.png";

const serviceUrl = process.env.NEXT_PUBLIC_SERVICE_URL?.trim();
const termsUrl =
  serviceUrl && serviceUrl !== "undefined" && serviceUrl !== "null"
    ? `${serviceUrl}/terms-of-service`
    : null;

export function Footer() {
  return (
    <footer className="border-t border-border/40 px-4 py-8 dark:border-border sm:px-6 md:px-8">
      <div className="container mx-auto flex flex-col gap-6">
        <div className="flex flex-col items-center gap-4 text-center sm:items-start sm:text-left">
          <div className="flex justify-center sm:justify-start">
            <Image
              className="h-auto w-32 object-contain sm:w-36"
              src={GITFOLIO_LOGO}
              alt="logo"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm leading-6 text-muted-foreground sm:justify-start">
            <span>Built by</span>
            <a
              href={"/#"}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              gitfolio
            </a>
            <span>·</span>
            <span>The source code is available on</span>
            <a
              href={"https://github.com/KTB-Sixmen"}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </a>
            {termsUrl ? (
              <a
                href={termsUrl}
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                이용 약관
              </a>
            ) : null}
          </div>
        </div>

        <div className="border-t border-border/60 pt-4 text-center text-xs leading-6 text-muted-foreground sm:text-left">
          <p className="break-keep">
            깃트폴리오 | 대표 : 강창룡 | 개인정보보호책임자 : 김윤섭 |
            사업자등록번호 : 000-00-0000
          </p>
          <p className="mt-1 break-keep">
            경기도 성남시 분당구 판교로660 유스페이스1 4층
          </p>
          <p className="mt-1">@Gitfolio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
