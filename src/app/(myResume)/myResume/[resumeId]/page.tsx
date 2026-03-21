"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faHeart } from "@fortawesome/free-solid-svg-icons";
import {
  ArrowLeft,
  ArrowUp,
  EllipsisVertical,
  Pencil,
  Sparkles,
  Trash2,
} from "lucide-react";

import { useCallback, useEffect, useRef, useState } from "react";
import PdfDownloadButton from "./_components/PdfDownloadButton";
import { Switch } from "@/components/ui/switch";
import { useVisibility } from "./hooks/useVisibility";
import { useMyResumeDetailQuery } from "@/app/(home)/community/_hooks/useResumeQuery";
import ResumeComment from "@/app/(home)/community/resumes/[resumeId]/_components/resume-comment";
import MyResumeDetailSkeleton from "./_components/MyResumeDetailSkeleton";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useResumeAIPatchMutation } from "./hooks/useResumeAIPatchMutation";
import { LoadingButton } from "@/components/ui/loading-button";
import AIResumePatchDialog from "./_components/AIResumePatchDialog";
import useOpenDialogStore from "@/app/store/useDialogOpenStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useMyResumeDeleteMutation } from "../_hooks/useMyResuemDeleteMutation";
import { useOnborda } from "onborda";
import { ResumeDetailContent } from "@/app/(home)/_components/ResumeDetailContent";
import Goorm from "./_components/Goorm";
import MyResumeDeleteModal from "./_components/MyResumeDeleteModal";
import moment from "moment";
import "moment/locale/ko";

type Props = {
  params: { resumeId: string };
};

// 섹션 id를 찾는 헬퍼 함수
function findSectionId(element: Node | null): string {
  let current: HTMLElement | null =
    element instanceof HTMLElement ? element : element?.parentElement ?? null;
  while (current && current !== document.body) {
    if (current.id) return current.id;
    current = current.parentElement;
  }
  return "";
}

export default function Page({ params }: Props) {
  const resumeId = params.resumeId;

  const router = useRouter();

  const { startOnborda } = useOnborda();
  const handleStartOnborda = useCallback(
    (tourName: string) => {
      if (startOnborda) {
        startOnborda(tourName);
      }
    },
    [startOnborda],
  );

  const { data: resume, error } = useMyResumeDetailQuery(resumeId);

  const [requirement, setRequirement] = useState("");
  const [selectedText, setSelectedText] = useState<string>("");
  const [isPopOver, setIsPopOver] = useState<boolean>(false);
  const [modifiedResume, setModifiedResume] = useState<any>(null);
  const [position, setPosition] = useState<Record<string, number>>();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { open, setOpen } = useOpenDialogStore((state) => state);

  const popoverRef = useRef<HTMLDivElement>(null);

  const { visibility, handleToggleVisibility } = useVisibility(
    resume,
    resumeId,
  );

  const { mutate: deleteResume } = useMyResumeDeleteMutation();
  const { mutate, isPending } = useResumeAIPatchMutation(resumeId);

  const handleDelete = (id: string) => {
    deleteResume(id);
  };

  const onMouseUp = useCallback((event: MouseEvent) => {
    if (
      popoverRef.current &&
      popoverRef.current.contains(event.target as Node)
    ) {
      return;
    }

    const selection = document.getSelection();
    const text = selection?.toString();

    if (!selection || !text) {
      setIsPopOver(false);
      return;
    }

    const resumeContentElement = document.getElementById("resumeContent");
    if (!resumeContentElement?.contains(selection.anchorNode)) {
      setIsPopOver(false);
      setSelectedText("");
      return;
    }

    // 시작점 섹션 찾기
    const startElement =
      selection.anchorNode instanceof Element
        ? selection.anchorNode
        : selection.anchorNode?.parentElement;
    const endElement =
      selection.focusNode instanceof Element
        ? selection.focusNode
        : selection.focusNode?.parentElement;

    const startSectionId = findSectionId(startElement!);
    const endSectionId = findSectionId(endElement!);

    if (!startSectionId || !endSectionId || startSectionId !== endSectionId) {
      // 섹션이 다르다면 드래그해도 popover 표시 안 함
      setIsPopOver(false);
      setSelectedText("");
      toast.error("하나의 올바른 영역 내에서 텍스트를 드래그해 주세요.");
      return;
    }

    // 하나의 섹션 안에서만 선택되었다면 기존 로직 실행
    setSelectedText(text);

    const rect = selection.getRangeAt(0).getBoundingClientRect();
    setIsPopOver(true);
    setPosition({
      x: rect.left + rect.width / 2 - 150,
      y: rect.top + window.scrollY - 20,
      width: rect.width,
      height: rect.height,
    });
  }, []);

  useEffect(() => {
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseUp]);

  useEffect(() => {
    if (error && (error as any).status === 403) {
      toast.error("접근 권한이 없습니다."); // Display error message
      router.push("/community"); // Redirect to /community
    }
  }, [error, router]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isOnboardaCompleted = localStorage.getItem("isOnboardaCompleted");

    if (
      resume && // resume 데이터가 존재할 때만
      (isOnboardaCompleted === "false" || isOnboardaCompleted === null)
    ) {
      // resume가 도착한 후 1초 뒤에 실행
      const timer = setTimeout(() => {
        handleStartOnborda("tour1");
      }, 1000); // 1초 (1000ms)

      return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 해제
    }
  }, [resume, handleStartOnborda]);

  const handleSend = () => {
    if (!requirement.trim()) {
      toast.error("요구사항은 반드시 입력해야 합니다", {
        position: "top-right",
      });
      return;
    }

    const data = {
      selectedText,
      requirement,
      // sectionId: selectedSection, // 섹션 ID 포함
    };

    mutate(data, {
      onSuccess: (result) => {
        setModifiedResume(result.result);
        setOpen(true);
      },
    });

    setIsPopOver(false);
    setSelectedText("");
    setRequirement("");
  };

  if (!resume) {
    return <MyResumeDetailSkeleton />;
  }

  return (
    <div className="relative min-h-full bg-[#f5f7fb]">
      {position && isPending && (
        <div
          className="z-50"
          style={{
            transform: `translate(${position.x - 40}px, ${position.y - 300}px)`,
          }}
        >
          <Goorm />
        </div>
      )}
      <AIResumePatchDialog
        open={open}
        setOpen={setOpen}
        resume={modifiedResume}
      />
      <MyResumeDeleteModal
        onDelete={handleDelete}
        resumeId={resumeId}
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
      />
      {isPopOver && (
        <div
          ref={popoverRef}
          style={{
            transform: `translate3d(${position?.x}px, ${position?.y}px, 0)`,
          }}
          className="absolute left-0 top-0 z-50 flex w-[320px] flex-col space-y-3 rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-[0_28px_80px_-40px_rgba(15,23,42,0.45)]"
        >
          {selectedText && (
            <div className="relative flex w-full items-center rounded-2xl bg-slate-100 px-4 py-3 text-slate-500">
              <span className="flex-grow text-sm leading-6 line-clamp-2">{`"${selectedText}"`}</span>
            </div>
          )}
          <div className="relative flex items-center w-full">
            <input
              type="text"
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
              placeholder="AI에게 이력서 수정 요청하기"
              onKeyDown={(e: any) => {
                if (e.isComposing || e.keyCode === 229) return;
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
              className="flex w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm shadow-none transition-colors placeholder:text-slate-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
            <LoadingButton
              loading={isPending}
              disabled={!requirement}
              onClick={handleSend}
              className="absolute right-2 h-9 w-9 rounded-full bg-slate-950 text-sm text-white hover:bg-slate-800 disabled:bg-slate-300"
            >
              <ArrowUp size={20} className="absolute" />
            </LoadingButton>
          </div>
        </div>
      )}

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[34px] border border-slate-200/80 bg-white shadow-[0_32px_90px_-54px_rgba(15,23,42,0.35)]">
          <div className="grid gap-6 px-6 py-7 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10 lg:px-8">
            <div>
              <button
                onClick={() => router.push("/myResume")}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-950"
              >
                <ArrowLeft className="h-4 w-4" />
                목록으로
              </button>
              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
                <Sparkles className="h-4 w-4" />
                Resume Editor Preview
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-4xl">
                {resume.result.memberName}님의 이력서
                <br />
                공개 상태와 문장을 함께 다듬는 작업 공간
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                선택한 문장을 AI로 다듬고, 공개 여부를 조정하고, 완성된
                버전은 PDF로 저장할 수 있습니다. 현재 화면은 실제 공개 전에
                마지막으로 검토하는 preview canvas 역할을 합니다.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-[26px] border border-slate-200 bg-slate-950 px-5 py-5 text-white">
                <div className="text-sm text-slate-300">공개 상태</div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-xl font-semibold">
                    {visibility ? "공개 중" : "비공개"}
                  </div>
                  <Switch
                    checked={visibility}
                    onCheckedChange={() => handleToggleVisibility()}
                    id="tour1-step1"
                  />
                </div>
                <div className="mt-3 text-sm text-slate-300">
                  공개로 전환하면 커뮤니티에서 바로 노출됩니다.
                </div>
              </div>
              <div className="rounded-[26px] border border-slate-200 bg-slate-50 px-5 py-5">
                <div className="text-sm text-slate-500">반응 지표</div>
                <div className="mt-3 flex items-center gap-4 text-sm font-semibold text-slate-800">
                  <span className="inline-flex items-center gap-1.5">
                    <FontAwesomeIcon color="currentColor" icon={faHeart} />
                    {resume.result.likeCount}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <FontAwesomeIcon color="currentColor" icon={faEye} />
                    {resume.result.viewCount}
                  </span>
                </div>
                <div className="mt-3 text-sm text-slate-500">
                  마지막 업데이트 {moment(resume.result.updatedAt).format("YYYY.MM.DD HH:mm")}
                </div>
              </div>
              <div className="rounded-[26px] border border-slate-200 bg-blue-50 px-5 py-5">
                <div className="text-sm text-blue-700">태그</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(resume.result.tags && resume.result.tags.length > 0
                    ? resume.result.tags
                    : ["기타"]
                  ).map((tag, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <main className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <div
              id="resumeContent"
              className="overflow-hidden rounded-[34px] border border-slate-200/80 bg-white shadow-[0_28px_80px_-52px_rgba(15,23,42,0.35)]"
            >
              <ResumeDetailContent resume={resume.result} />
            </div>

            <div id="tour1-step3" className="flex w-full">
              <ResumeComment resumeId={resumeId} />
            </div>
          </div>

          <aside className="h-fit rounded-[34px] border border-slate-200/80 bg-white p-4 shadow-[0_28px_80px_-52px_rgba(15,23,42,0.35)] xl:sticky xl:top-28">
            <div className="rounded-[28px] bg-slate-950 px-5 py-5 text-white">
              <div className="text-sm text-slate-300">Workspace Actions</div>
              <div className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                바로 실행
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                이력서 저장, 편집, 삭제 같은 주요 작업을 여기서 빠르게
                처리할 수 있습니다.
              </p>
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-3">
                <PdfDownloadButton resume={resume} />
              </div>

              <Button
                onClick={() => router.push(`/myResume/${resumeId}/edit`)}
                className="h-12 w-full justify-between rounded-[20px] bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700"
              >
                직접 수정
                <Pencil className="h-4 w-4" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-12 w-full justify-between rounded-[20px] border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    추가 작업
                    <EllipsisVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60 rounded-2xl">
                  <DropdownMenuLabel>내 이력서 관리</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => router.push(`/myResume/${resumeId}/edit`)}
                      className="py-3"
                    >
                      직접 수정
                      <DropdownMenuShortcut>
                        <Pencil size={16} />
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="py-3 text-rose-500 focus:text-rose-500"
                      onClick={() => setDeleteModalOpen(true)}
                    >
                      내 이력서 삭제
                      <DropdownMenuShortcut>
                        <Trash2 size={16} />
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="rounded-[26px] border border-blue-100 bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      AI 수정 팁
                    </div>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      한 섹션 안에서 문장을 드래그한 뒤, 어떤 방향으로 고치고
                      싶은지 짧게 요청하면 preview 결과를 확인할 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
