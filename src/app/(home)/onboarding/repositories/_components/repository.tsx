"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import "moment/locale/ko";
import { useRef, useState } from "react";
import { useRepositoryQuery } from "../_hooks/useRepositoryQuery";
import MultipleSelector, { Option } from "@/components/ui/multi-selector";
import { useResumeMutation } from "../_hooks/useResumeMutation";
import RepositorySkeleton from "./repository-skeleton";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import RESUME_TEMPLATE1 from "../../../../../../public/images/resume_basic_template.png";
import RESUME_TEMPLATE2 from "../../../../../../public/images/resume_star_template.png";
import RESUME_TEMPLATE3 from "../../../../../../public/images/resume_gitfolio_template.png";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  FolderGit2,
  Globe2,
  Layers3,
  LockKeyhole,
  MousePointerClick,
  Sparkles,
  Wand2,
} from "lucide-react";

const templateImages = {
  BASIC: RESUME_TEMPLATE1,
  STAR: RESUME_TEMPLATE2,
  GITFOLIO: RESUME_TEMPLATE3,
};

const templateMeta = {
  BASIC: {
    title: "BASIC",
    summary: "담당 업무와 프로젝트를 가장 안정적으로 정리하는 기본형",
  },
  STAR: {
    title: "STAR",
    summary: "상황, 과제, 행동, 결과 구조로 성과를 강조하는 형식",
  },
  GITFOLIO: {
    title: "GITFOLIO",
    summary: "문제 정의와 해결 흐름을 드러내는 트러블슈팅 중심형",
  },
} as const;

const magnifierSize = 220;
const zoomLevel = 1.6;

const surfaceClass =
  "rounded-[30px] border border-slate-200/80 bg-white/92 shadow-[0_28px_80px_-48px_rgba(15,23,42,0.45)] backdrop-blur";

export default function Repository() {
  const [value, setValue] = useState<Option[]>([]);
  const [requirements, setRequirements] = useState<string>("");
  const [visibility, setVisibility] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<keyof typeof templateImages>("BASIC");
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  const { data: repositories } = useRepositoryQuery();
  const { mutate } = useResumeMutation();

  if (!repositories) {
    return <RepositorySkeleton />;
  }

  const options: Option[] = repositories.result.map((repo) => ({
    label: repo.repoName,
    value: repo.repoUrl,
    topLanguage: repo.topLanguage,
    updatedAt: repo.updatedAt,
  }));

  const onSubmit = () => {
    if (value.length > 3) {
      alert("최대 3개까지만 선택할 수 있습니다.");
      return;
    }

    const data = {
      selectedRepo: value.map((repo) => repo.value),
      requirements,
      visibility: visibility ? "PUBLIC" : "PRIVATE",
      template: selectedTemplate,
    };

    mutate({ data });
  };

  const handleValueChange = (selectedOptions: Option[]) => {
    if (selectedOptions.length > 3) {
      alert("최대 3개까지만 선택할 수 있습니다.");
      const updatedOptions = [...selectedOptions];
      updatedOptions.pop();
      setValue(updatedOptions);
      return;
    }

    setValue(selectedOptions);
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[1.02fr_0.98fr]">
      <section className={cn(surfaceClass, "p-4 sm:p-6 lg:p-8")}>
        <div className="rounded-[28px] border border-slate-200/80 bg-white/90 px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
                <Sparkles className="h-4 w-4" />
                Step 2 of 3
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
                이력서에 담을 프로젝트와
                <br />
                템플릿 방향을 고릅니다
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                레포지토리는 최대 3개까지 선택할 수 있습니다. 선택한
                프로젝트와 템플릿 조합에 따라 이후 생성되는 소개 문장과 구조가
                달라집니다.
              </p>
            </div>
            <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-3 lg:min-w-[360px]">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="text-slate-400">선택 수</div>
                <div className="mt-1 text-lg font-semibold text-slate-950">
                  {value.length}/3
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="text-slate-400">공개 설정</div>
                <div className="mt-1 font-semibold text-slate-950">
                  {visibility ? "커뮤니티 공개" : "비공개 저장"}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="text-slate-400">선택 템플릿</div>
                <div className="mt-1 font-semibold text-slate-950">
                  {selectedTemplate}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          <div className="rounded-[28px] border border-slate-200/80 bg-white px-5 py-6 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.42)] sm:px-6">
            <div className="flex flex-col gap-5 border-b border-slate-200/80 pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-950 text-white">
                  <FolderGit2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-700">
                    Workspace
                  </div>
                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                    GitHub 레포지토리 선택
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    이력서에 넣고 싶은 프로젝트를 고르세요. 언어와 업데이트
                    일시를 함께 참고해 최신성과 대표성을 동시에 챙길 수
                    있습니다.
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                최대 3개까지 선택 가능합니다.
              </div>
            </div>

            <div className="mt-6">
              <MultipleSelector
                hidePlaceholderWhenSelected
                value={value}
                onChange={handleValueChange}
                defaultOptions={options}
                placeholder="원하는 레포지토리를 최대 3개까지 선택해주세요."
                className="min-h-14 rounded-[22px] border-slate-200 bg-slate-50/80 px-4 py-3 text-sm shadow-none"
                badgeClassName="rounded-full bg-slate-950 px-3 py-1 text-white hover:bg-slate-950/90"
                inputProps={{
                  className: "text-sm text-slate-700 placeholder:text-slate-400",
                }}
                emptyIndicator={
                  <p className="py-10 text-center text-sm text-slate-500">
                    레포지토리가 존재하지 않습니다.
                  </p>
                }
              />
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4">
                <div className="mb-3 text-sm font-semibold text-slate-950">
                  생성 요청사항
                </div>
                <Input
                  type="text"
                  placeholder="강조하고 싶은 역할, 기술, 문제 해결 포인트를 짧게 입력해주세요."
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className="h-12 rounded-2xl border-slate-200 bg-white"
                />
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  예: 프론트엔드 성능 개선, 협업 방식, 트러블슈팅 경험을 더
                  드러내고 싶어요.
                </p>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4">
                <div className="mb-3 text-sm font-semibold text-slate-950">
                  공개 여부 설정
                </div>
                <div className="flex items-center justify-between rounded-[20px] border border-slate-200 bg-white px-4 py-4">
                  <div className="pr-4">
                    <div className="text-sm font-semibold text-slate-950">
                      {visibility ? "커뮤니티에 공개" : "비공개로 저장"}
                    </div>
                    <div className="mt-1 text-sm leading-6 text-slate-500">
                      공개하면 다른 사용자들이 커뮤니티에서 이력서를 볼 수
                      있습니다.
                    </div>
                  </div>
                  <Switch checked={visibility} onCheckedChange={setVisibility} />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200/80 bg-white px-5 py-6 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.42)] sm:px-6">
            <div className="flex flex-col gap-5 border-b border-slate-200/80 pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-950 text-white">
                  <Layers3 className="h-5 w-5" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-700">
                    Template
                  </div>
                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                    이력서 템플릿 선택
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    같은 프로젝트라도 어떤 흐름으로 설명하느냐에 따라 읽히는
                    인상이 달라집니다. 원하는 표현 방식에 가까운 템플릿을
                    선택하세요.
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                우측 미리보기에서 확대해 볼 수 있습니다.
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {(["BASIC", "STAR", "GITFOLIO"] as const).map((template) => {
                const selected = selectedTemplate === template;

                return (
                  <button
                    key={template}
                    type="button"
                    onClick={() => setSelectedTemplate(template)}
                    className={cn(
                      "group rounded-[26px] border px-4 py-4 text-left transition duration-200",
                      selected
                        ? "border-slate-950 bg-slate-950 text-white shadow-[0_28px_70px_-45px_rgba(15,23,42,0.9)]"
                        : "border-slate-200 bg-slate-50/70 text-slate-950 hover:-translate-y-1 hover:border-slate-300 hover:bg-white",
                    )}
                  >
                    <div className="overflow-hidden rounded-[20px] border border-slate-200/70 bg-white">
                      <Image
                        src={templateImages[template]}
                        alt={template}
                        className="h-44 w-full object-cover object-top transition duration-300 group-hover:scale-[1.02]"
                      />
                    </div>
                    <div className="mt-4 flex items-start justify-between gap-3">
                      <div>
                        <div className="text-lg font-semibold tracking-[-0.03em]">
                          {templateMeta[template].title}
                        </div>
                        <p
                          className={cn(
                            "mt-2 text-sm leading-6",
                            selected ? "text-slate-300" : "text-slate-600",
                          )}
                        >
                          {templateMeta[template].summary}
                        </p>
                      </div>
                      <div
                        className={cn(
                          "mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
                          selected
                            ? "border-white/20 bg-white/10"
                            : "border-slate-300 bg-white",
                        )}
                      >
                        {selected ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200/80 bg-slate-950 px-5 py-5 text-white sm:px-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-300">
                  Finalize
                </div>
                <div className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                  선택한 재료로 이력서 생성을 시작합니다
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                  이력서를 생성함으로써 귀하는 이력서에 포함된 데이터가 자사에
                  의해 저장 및 관리되며, 해당 데이터는{" "}
                  <a
                    href={`${process.env.NEXT_PUBLIC_SERVICE_URL}/terms-of-service`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-white underline underline-offset-4"
                  >
                    개인정보 처리방침 및 이용약관
                  </a>
                  에 따라 사용됨에 동의하는 것으로 간주됩니다.
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 lg:w-auto lg:min-w-[280px]">
                <Button
                  onClick={onSubmit}
                  className="h-12 rounded-full bg-white text-base font-semibold text-slate-950 hover:bg-slate-100"
                >
                  이력서 만들러 가기
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Link
                  className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                  href={"/community"}
                >
                  이력서 등록 없이 커뮤니티로 이동
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <aside className="xl:sticky xl:top-24 xl:self-start">
        <div className={cn(surfaceClass, "overflow-hidden p-6 sm:p-8")}>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
            <Wand2 className="h-4 w-4" />
            Live preview
          </div>
          <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
            선택 결과를 미리 확인하면서
            <br />
            생성 품질을 조정합니다
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
            오른쪽 미리보기는 실제 템플릿 비율을 기준으로 보여줍니다.
            마우스를 올리면 세부 구성을 확대해서 확인할 수 있습니다.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-[24px] border border-slate-200/80 bg-white/90 px-5 py-5">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Selected repos
              </div>
              <div className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                {value.length}
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                가장 대표성이 높은 프로젝트 조합을 고르는 것이 좋습니다.
              </p>
            </div>
            <div className="rounded-[24px] border border-slate-200/80 bg-white/90 px-5 py-5">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Visibility
              </div>
              <div className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                {visibility ? "PUBLIC" : "PRIVATE"}
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                커뮤니티 피드백을 받고 싶다면 공개 저장이 적합합니다.
              </p>
            </div>
            <div className="rounded-[24px] border border-slate-200/80 bg-white/90 px-5 py-5">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Template
              </div>
              <div className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                {selectedTemplate}
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                선택한 구조에 맞춰 표현 방식과 흐름이 달라집니다.
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-[28px] border border-slate-200/80 bg-slate-950 px-5 py-5 text-white">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-white/10 p-3">
                <MousePointerClick className="h-5 w-5" />
              </div>
              <div>
                <div className="text-lg font-semibold">미리보기 사용 팁</div>
                <div className="mt-2 space-y-2 text-sm leading-6 text-slate-300">
                  <div className="flex items-start gap-2">
                    <Eye className="mt-1 h-4 w-4 shrink-0 text-blue-300" />
                    <span>마우스를 올리면 상세 구성을 확대해서 볼 수 있습니다.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Globe2 className="mt-1 h-4 w-4 shrink-0 text-blue-300" />
                    <span>공개 저장 시 커뮤니티 카드에도 같은 톤이 반영됩니다.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <LockKeyhole className="mt-1 h-4 w-4 shrink-0 text-blue-300" />
                    <span>비공개 저장 후 나중에 공개 전환도 가능합니다.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center rounded-[32px] border border-slate-200/80 bg-white p-3 shadow-[0_40px_100px_-50px_rgba(15,23,42,0.55)]">
            <div
              ref={containerRef}
              className="relative aspect-[3/4] w-full max-w-[520px] overflow-hidden rounded-[26px] border border-slate-200 bg-slate-50"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setMousePosition({
                  x: e.clientX - rect.left,
                  y: e.clientY - rect.top,
                });
              }}
            >
              <Image
                className="absolute inset-0 h-full w-full object-contain object-top"
                src={templateImages[selectedTemplate]}
                alt={selectedTemplate}
                fill
              />
              {isHovering && (
                <div
                  className="absolute pointer-events-none rounded-[24px] border border-slate-300 bg-white/40 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.55)] backdrop-blur-sm"
                  style={{
                    width: magnifierSize,
                    height: magnifierSize,
                    top: mousePosition.y - magnifierSize / 2,
                    left: mousePosition.x - magnifierSize / 2,
                    backgroundImage: `url(${templateImages[selectedTemplate].src})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: `${520 * zoomLevel}px auto`,
                    backgroundPosition: `-${
                      mousePosition.x * zoomLevel - magnifierSize / 2
                    }px -${mousePosition.y * zoomLevel - magnifierSize / 2 - 40}px`,
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
