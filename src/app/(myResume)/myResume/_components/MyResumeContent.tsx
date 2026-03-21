"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  ArrowUpRight,
  Eye,
  FileText,
  Heart,
  Layers3,
  Lock,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import moment from "moment";
import "moment/locale/ko";
import { PositionType, positionTypeMap } from "@/app/types/type";
import { useMyResumeDeleteMutation } from "../_hooks/useMyResuemDeleteMutation";
import { useMyResumeInfiniteQuery } from "../_hooks/useMyResumeInfiniteQuery";
import MyResumeDeleteModal from "../[resumeId]/_components/MyResumeDeleteModal";
import Image from "next/image";
import MyResumeSkeleton from "./my-resume-skeleton";

export default function MyResumeContent() {
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [resumeId, setResumeId] = useState<string>();
  const observerRef = useRef<HTMLDivElement>(null);

  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMyResumeInfiniteQuery();
  const { mutate: deleteResume } = useMyResumeDeleteMutation();

  const onDelete = (resumeId: string) => {
    deleteResume(resumeId);
  };

  useEffect(() => {
    if (!observerRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    observer.observe(observerRef.current);
    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (!infiniteData) {
    return <MyResumeSkeleton />;
  }

  const pages = infiniteData?.pages || [];
  const allResumes = pages.flatMap((page) => page.result.content);
  const publicCount = allResumes.filter(
    (resume) => resume.visibility === "PUBLIC",
  ).length;
  const totalViews = allResumes.reduce(
    (sum, resume) => sum + resume.viewCount,
    0,
  );
  const totalLikes = allResumes.reduce(
    (sum, resume) => sum + resume.likeCount,
    0,
  );

  return (
    <div className="min-h-full bg-[#f5f7fb]">
      <MyResumeDeleteModal
        onDelete={onDelete}
        resumeId={resumeId!}
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
      />
      <div className="flex flex-col w-full gap-6 px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[34px] border border-slate-200/80 bg-white shadow-[0_32px_90px_-54px_rgba(15,23,42,0.35)]">
          <div className="grid gap-6 px-6 py-7 lg:grid-cols-[1.12fr_0.88fr] lg:px-8">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 border border-blue-100 rounded-full bg-blue-50">
                <Layers3 className="w-4 h-4" />
                My Resume Workspace
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-4xl">
                초안부터 공개 상태까지
                <br />내 이력서를 한 곳에서 관리하세요
              </h1>
              <p className="max-w-2xl mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                작성 중인 이력서와 공개 중인 버전을 함께 관리할 수 있습니다.
                좋아요와 조회 반응을 보면서 어떤 표현이 더 설득력 있는지도 바로
                비교해보세요.
              </p>

              <div className="flex flex-col gap-3 mt-8 sm:flex-row">
                <Link
                  href={"/myResume/create"}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-6 text-sm font-semibold text-white shadow-[0_20px_45px_-24px_rgba(15,23,42,0.85)] transition hover:bg-slate-800"
                >
                  <Plus className="w-4 h-4" />새 이력서 만들기
                </Link>
                <Link
                  href={"/community"}
                  className="inline-flex items-center justify-center h-12 gap-2 px-6 text-sm font-semibold transition bg-white border rounded-full border-slate-300 text-slate-700 hover:border-slate-400 hover:text-slate-950"
                >
                  커뮤니티 반응 보기
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-[26px] border border-slate-200 bg-slate-950 px-5 py-5 text-white">
                <div className="text-sm text-slate-300">총 이력서</div>
                <div className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                  {allResumes.length}
                </div>
              </div>
              <div className="rounded-[26px] border border-slate-200 bg-slate-50 px-5 py-5">
                <div className="text-sm text-slate-500">공개 중</div>
                <div className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
                  {publicCount}
                </div>
              </div>
              <div className="rounded-[26px] border border-slate-200 bg-blue-50 px-5 py-5">
                <div className="text-sm text-blue-700">누적 반응</div>
                <div className="flex items-center gap-4 mt-2 text-sm font-semibold text-slate-900">
                  <span className="inline-flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-blue-600" />
                    {totalViews}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-rose-500" />
                    {totalLikes}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {allResumes.length === 0 ? (
          <section className="rounded-[34px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-[0_28px_80px_-52px_rgba(15,23,42,0.25)]">
            <div className="inline-flex items-center justify-center mx-auto text-blue-600 h-14 w-14 rounded-2xl bg-blue-50">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
              아직 만든 이력서가 없습니다
            </h2>
            <p className="max-w-lg mx-auto mt-3 text-sm leading-7 text-slate-600">
              공개할 버전과 실험 중인 초안을 분리해두면 커뮤니티 반응을 더
              안정적으로 비교할 수 있습니다. 첫 이력서를 지금 바로 만들어
              보세요.
            </p>
            <Link
              href={"/myResume/create"}
              className="inline-flex items-center justify-center h-12 gap-2 px-6 mt-8 text-sm font-semibold text-white transition rounded-full bg-slate-950 hover:bg-slate-800"
            >
              <Plus className="w-4 h-4" />첫 이력서 만들기
            </Link>
          </section>
        ) : (
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {allResumes.map((resume, index) => {
              const tags =
                resume.tags && resume.tags.length > 0 ? resume.tags : ["기타"];

              return (
                <article
                  key={resume.resumeId}
                  onClick={() => router.push(`/myResume/${resume.resumeId}`)}
                  className="group relative cursor-pointer overflow-hidden rounded-[32px] border border-slate-200/80 bg-white p-5 shadow-[0_24px_75px_-52px_rgba(15,23,42,0.45)] transition duration-300 hover:-translate-y-1.5 hover:border-slate-300 hover:shadow-[0_32px_90px_-52px_rgba(15,23,42,0.55)]"
                >
                  <div className="pointer-events-none absolute right-0 top-0 h-36 w-36 rounded-full bg-[radial-gradient(circle,_rgba(59,130,246,0.12),_transparent_70%)]" />

                  <button
                    className="absolute inline-flex items-center justify-center w-10 h-10 transition bg-white border rounded-full right-4 top-4 border-slate-200 text-rose-500 hover:border-rose-200 hover:bg-rose-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      setResumeId(resume.resumeId);
                      setDeleteModalOpen(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="relative flex min-h-[320px] h-full justify-between flex-col">
                    <div className="flex items-start justify-between gap-4 pr-12">
                      <div className="flex items-center gap-4">
                        <Image
                          src={resume.avatarUrl}
                          width={68}
                          height={68}
                          alt="Avatar"
                          className="h-[68px] w-[68px] rounded-2xl object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                            Resume {String(index + 1).padStart(2, "0")}
                          </div>
                          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                            {positionTypeMap[resume.position as PositionType]}
                          </h2>
                        </div>
                      </div>

                      <Badge
                        className={
                          resume.visibility === "PUBLIC"
                            ? "rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 shadow-none hover:bg-emerald-50"
                            : "rounded-full bg-slate-100 px-3 py-1 text-slate-600 shadow-none hover:bg-slate-100"
                        }
                      >
                        {resume.visibility === "PUBLIC" ? (
                          <>
                            <Eye className="mr-1.5 h-3.5 w-3.5" />
                            공개 중
                          </>
                        ) : (
                          <>
                            <Lock className="mr-1.5 h-3.5 w-3.5" />
                            비공개
                          </>
                        )}
                      </Badge>
                    </div>

                    <div className="flex-1 mt-6">
                      <p className="min-h-[96px] text-sm leading-7 text-slate-600">
                        {resume.aboutMe}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-5">
                        {tags.map((tag, tagIndex) => (
                          <Badge
                            className="px-3 py-1 font-semibold text-blue-700 border border-blue-100 rounded-full shadow-none bg-blue-50 hover:bg-blue-50"
                            key={tagIndex}
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 rounded-[24px] border border-slate-200/80 bg-slate-50/90 px-4 py-4">
                      <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                        <span className="inline-flex items-center gap-1.5">
                          <Eye className="w-4 h-4 text-blue-600" />
                          조회 {resume.viewCount}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Heart className="w-4 h-4 text-rose-500" />
                          좋아요 {resume.likeCount}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-3 text-xs font-medium text-slate-500">
                        <span>
                          {moment(resume.updatedAt).isSame(moment(), "day")
                            ? moment(resume.updatedAt).fromNow()
                            : moment(resume.updatedAt).format(
                                "YYYY.MM.DD HH:mm",
                              )}
                        </span>
                        <span className="inline-flex items-center gap-1 text-slate-800">
                          상세 보기
                          <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}

        <div ref={observerRef} className="w-full h-10" />

        {isFetchingNextPage && (
          <div className="px-4 py-3 text-sm font-medium text-center bg-white border rounded-full shadow-sm border-slate-200 text-slate-500">
            더 많은 이력서를 불러오는 중입니다...
          </div>
        )}
      </div>
    </div>
  );
}
