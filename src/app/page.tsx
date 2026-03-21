"use client";

import GITFOLIO_LOGO from "../../public/images/gitfolio-logo.png";
import LANDING_IMAGE from "../../public/images/langing-image.png";
import GithubButton from "./_components/GithubButton";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  FolderGit2,
  LayoutTemplate,
  MessageSquareText,
  Sparkles,
} from "lucide-react";

const highlightStats = [
  { label: "완성 시간", value: "3분 내외" },
  { label: "선택 가능한 레포", value: "최대 3개" },
  { label: "이력서 템플릿", value: "3종 제공" },
];

const featureCards = [
  {
    icon: FolderGit2,
    title: "GitHub 레포를 바로 이력서 문장으로",
    description:
      "프로젝트 설명을 처음부터 쓰지 않아도 됩니다. 공개 레포를 선택하면 이력서용 프로젝트 항목을 자동으로 정리합니다.",
  },
  {
    icon: LayoutTemplate,
    title: "BASIC · STAR · GITFOLIO 템플릿",
    description:
      "업무 중심, STAR 구조, 트러블슈팅 중심까지 원하는 방식으로 골라 같은 프로젝트도 더 설득력 있게 보여줄 수 있습니다.",
  },
  {
    icon: FileText,
    title: "수정과 저장까지 이어지는 흐름",
    description:
      "자동 생성으로 시작하고, 필요한 부분만 다듬은 뒤 PDF 저장까지 이어지는 실전형 작성 경험을 제공합니다.",
  },
  {
    icon: MessageSquareText,
    title: "커뮤니티에서 바로 반응 확인",
    description:
      "생성한 이력서를 공개해 좋아요, 조회수, 댓글로 피드백을 받고 다른 사람의 이력서도 참고할 수 있습니다.",
  },
];

const steps = [
  {
    title: "GitHub로 시작",
    description: "로그인 후 기본 정보와 직군, 경력, 링크를 간단히 입력합니다.",
  },
  {
    title: "레포지토리 선택",
    description: "이력서에 넣을 공개 레포를 최대 3개까지 선택하고 요청사항을 남깁니다.",
  },
  {
    title: "AI 이력서 생성",
    description: "프로젝트 내용과 템플릿 구조를 반영해 초안을 자동으로 구성합니다.",
  },
  {
    title: "수정 후 공유",
    description: "완성본을 다듬고 PDF로 저장하거나 커뮤니티에 공개해 반응을 확인합니다.",
  },
];

const templateCards = [
  {
    name: "BASIC",
    summary: "담당 업무를 명확하게 정리하는 기본형",
  },
  {
    name: "STAR",
    summary: "Situation, Task, Action, Result 구조로 성과를 강조하는 형식",
  },
  {
    name: "GITFOLIO",
    summary: "문제 정의와 해결 과정을 보여주는 트러블슈팅 특화형",
  },
];

export default function Home() {
  const authenticated = useAuthStore((state) => state.authenticated);
  const router = useRouter();

  useEffect(() => {
    if (authenticated) {
      router.push("/community");
    }
  }, [authenticated, router]);

  return (
    <div className="min-h-screen overflow-hidden bg-[#f5f7fb] text-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.12),_transparent_28%),radial-gradient(circle_at_80%_20%,_rgba(148,163,184,0.16),_transparent_24%),linear-gradient(180deg,_rgba(255,255,255,0.92),_rgba(245,247,251,0.98))]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[linear-gradient(rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />

      <main className="relative mx-auto flex w-full max-w-7xl flex-col px-5 pb-20 pt-6 sm:px-8 lg:px-10">
        <header className="mb-10 flex items-center justify-between rounded-full border border-white/70 bg-white/80 px-4 py-3 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.45)] backdrop-blur md:px-6">
          <div className="flex items-center gap-3">
            <Image
              alt="Gitfolio logo"
              src={GITFOLIO_LOGO}
              width={142}
              priority
            />
            <span className="hidden text-sm text-slate-500 md:inline">
              GitHub 기반 이력서 빌더
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/community"
              className="inline-flex h-10 items-center rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
            >
              커뮤니티 둘러보기
            </Link>
            <GithubButton className="hidden h-10 px-4 text-sm sm:inline-flex" />
          </div>
        </header>

        <section className="grid gap-8 pb-14 pt-4 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
              <Sparkles className="h-4 w-4" />
              GitHub 데이터를 바탕으로 이력서를 빠르게 구성합니다
            </div>
            <h1 className="text-4xl font-semibold leading-[1.08] tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-6xl">
              깔끔한 초안부터
              <br />
              설득력 있는 이력서 완성까지
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              깃트폴리오는 GitHub 레포지토리와 기본 프로필 정보를 바탕으로
              이력서를 자동 생성해주는 서비스입니다. 처음 쓰는 사람도 빠르게
              시작할 수 있고, 이미 작성 경험이 있는 사람도 문장 구조와 표현을
              더 정돈된 형태로 가져갈 수 있습니다.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <GithubButton className="h-12 px-6 text-base" />
              <Link
                href="/community"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 text-base font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
              >
                로그인 없이 먼저 보기
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-slate-600">
              <div className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-600" />
                공개 레포 기반 자동 작성
              </div>
              <div className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-600" />
                템플릿 3종 선택 가능
              </div>
              <div className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-600" />
                커뮤니티 공개 및 피드백
              </div>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {highlightStats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[24px] border border-slate-200/80 bg-white/88 px-5 py-5 shadow-[0_24px_55px_-38px_rgba(15,23,42,0.48)] backdrop-blur"
                >
                  <div className="text-sm text-slate-500">{item.label}</div>
                  <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="mb-4 hidden w-fit max-w-full rounded-[28px] border border-blue-100 bg-white/90 p-4 shadow-[0_25px_60px_-35px_rgba(37,99,235,0.35)] backdrop-blur md:block lg:ml-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
                  <Clock3 className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm text-slate-500">작성 리드타임</div>
                  <div className="font-semibold text-slate-950">
                    평균 3분 안에 초안 완성
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-white p-3 shadow-[0_40px_100px_-50px_rgba(15,23,42,0.55)]">
              <div className="rounded-[26px] border border-slate-200 bg-slate-950 px-5 py-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-300">
                      Resume workspace
                    </div>
                    <div className="mt-1 text-xl font-semibold">
                      Gitfolio Builder
                    </div>
                  </div>
                  <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-100">
                    Live Preview
                  </div>
                </div>
              </div>
              <div className="relative mt-3 overflow-hidden rounded-[26px] border border-slate-200 bg-[#eef2ff] p-4">
                <div className="mb-3 flex items-center justify-between rounded-2xl border border-white/80 bg-white/80 px-4 py-3 text-sm text-slate-600 backdrop-blur">
                  <span>레포 선택, 템플릿, 커뮤니티 공개 여부까지 한 번에</span>
                  <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
                    Preview
                  </span>
                </div>
                <Image
                  alt="Gitfolio 서비스 화면 미리보기"
                  src={LANDING_IMAGE}
                  priority
                  className="rounded-[20px] border border-slate-200 object-cover shadow-[0_30px_70px_-40px_rgba(15,23,42,0.55)]"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 border-y border-slate-200/80 py-7 sm:grid-cols-3">
          <div>
            <div className="text-sm font-medium text-slate-500">Core Value</div>
            <p className="mt-2 text-lg font-semibold tracking-[-0.03em] text-slate-950">
              정보는 충분하게, 화면은 가볍게.
            </p>
          </div>
          <p className="text-sm leading-6 text-slate-600">
            처음 방문한 사람도 서비스 가치를 바로 이해할 수 있도록 핵심
            메시지와 행동 경로를 분리했습니다.
          </p>
          <p className="text-sm leading-6 text-slate-600">
            밝은 톤의 배경과 얇은 그리드, 짙은 텍스트, 제한된 블루 포인트로
            트렌디하지만 과하지 않은 인상을 유지합니다.
          </p>
        </section>

        <section className="py-16">
          <div className="max-w-2xl">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
              Why Gitfolio
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              이력서 작성의 시작점과 완성도를 동시에 올립니다
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              빈 문서를 보고 막히는 순간을 줄이고, 프로젝트 설명과 경력 표현을
              더 구조적으로 정리할 수 있게 도와줍니다.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {featureCards.map((card) => {
              const Icon = card.icon;

              return (
                <article
                  key={card.title}
                  className="group rounded-[28px] border border-slate-200/80 bg-white px-6 py-6 shadow-[0_28px_70px_-42px_rgba(15,23,42,0.45)] transition duration-200 hover:-translate-y-1 hover:border-slate-300"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white transition group-hover:bg-blue-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-slate-950">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {card.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="grid gap-6 rounded-[36px] border border-slate-200/80 bg-white px-6 py-8 shadow-[0_40px_90px_-54px_rgba(15,23,42,0.45)] lg:grid-cols-[0.86fr_1.14fr] lg:px-8">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
              Flow
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
              복잡하지 않은 4단계
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              필요한 정보는 충분히 담되, 사용자가 헤매지 않도록 실제 작성
              순서대로 흐름을 단순화했습니다.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {steps.map((step, index) => (
              <article
                key={step.title}
                className="rounded-[24px] bg-slate-50 px-5 py-5"
              >
                <div className="text-sm font-semibold text-blue-700">
                  0{index + 1}
                </div>
                <h3 className="mt-3 text-lg font-semibold tracking-[-0.03em] text-slate-950">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-5 py-16 lg:grid-cols-2">
          <article className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-[#0f172a] p-7 text-white shadow-[0_40px_90px_-54px_rgba(15,23,42,0.65)]">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">
              Templates
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
              목적에 맞게 선택하는 세 가지 템플릿
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              같은 프로젝트라도 어떤 구조로 설명하느냐에 따라 읽히는 방식이
              달라집니다. 깃트폴리오는 용도에 맞는 템플릿 선택을 전제로
              설계되어 있습니다.
            </p>
            <div className="mt-8 space-y-3">
              {templateCards.map((template) => (
                <div
                  key={template.name}
                  className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-4"
                >
                  <div className="text-sm font-semibold text-blue-300">
                    {template.name}
                  </div>
                  <div className="mt-1 text-sm leading-6 text-slate-200">
                    {template.summary}
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-white p-7 shadow-[0_40px_90px_-54px_rgba(15,23,42,0.45)]">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
              Community
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
              다른 사람의 이력서를 보며 바로 비교하고 배우기
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              생성 후 끝나는 서비스가 아니라, 좋아요와 조회수, 댓글을 통해
              반응을 확인하고 더 나은 표현을 참고할 수 있는 커뮤니티 구조를
              함께 제공합니다.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[24px] bg-slate-50 px-4 py-5">
                <div className="text-sm text-slate-500">탐색</div>
                <div className="mt-2 font-semibold text-slate-950">
                  공개 이력서 리스트
                </div>
              </div>
              <div className="rounded-[24px] bg-slate-50 px-4 py-5">
                <div className="text-sm text-slate-500">반응</div>
                <div className="mt-2 font-semibold text-slate-950">
                  좋아요 · 조회수 · 댓글
                </div>
              </div>
              <div className="rounded-[24px] bg-slate-50 px-4 py-5">
                <div className="text-sm text-slate-500">참고</div>
                <div className="mt-2 font-semibold text-slate-950">
                  포지션별 필터링
                </div>
              </div>
            </div>

            <Link
              href="/community"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-950 transition hover:text-blue-700"
            >
              커뮤니티 먼저 둘러보기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        </section>

        <section className="rounded-[36px] border border-blue-100 bg-[linear-gradient(135deg,#eff6ff_0%,#ffffff_65%,#f8fafc_100%)] px-6 py-10 shadow-[0_35px_90px_-58px_rgba(37,99,235,0.45)] sm:px-8">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
                Start Now
              </div>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
                GitHub에 쌓인 기록을
                <br />
                이력서 초안으로 바로 바꿔보세요
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
                로그인 후 기본 정보만 정리하면 깃트폴리오가 작성 출발점을
                만들어줍니다. 초안 생성 후에는 직접 다듬고, 저장하고, 공개할
                수 있습니다.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-end">
              <GithubButton className="h-12 px-6 text-base" />
              <Link
                href="/community"
                className="inline-flex h-12 items-center justify-center rounded-full border border-slate-300 bg-white px-6 text-base font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
              >
                둘러보기만 먼저 하기
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
