"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  Clock3,
  Eye,
  Globe2,
  Heart,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CommunitySkeleton from "../_components/community-skeleton";
import { useLikeMutation } from "../_hooks/useLikeMutation";
import { Resume, ResumeFilter, useResumeQuery } from "../_hooks/useResumeQuery";
import { useAuthStore } from "@/app/store/useAuthStore";
import {
  PositionType,
  positionTypeMap,
  schoolTypeMap,
  SchoolType,
} from "@/app/types/type";

const sortOrderLabelMap = {
  recent: "최신순",
  like: "좋아요 많은 순",
  view: "조회수 많은 순",
} as const;

const formatPositionLabel = (position: string) => {
  const normalized = positionTypeMap[position as PositionType] ?? position ?? "";

  if (!normalized) {
    return "기본 포지션";
  }

  return normalized.includes("개발자") ? normalized : `${normalized} 개발자`;
};

const formatUpdatedAt = (updatedAt: string) => {
  const date = new Date(updatedAt);

  if (Number.isNaN(date.getTime())) {
    return "업데이트 정보 없음";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

const getFilterSummary = (filters: ResumeFilter) => {
  const summaries: string[] = [];

  if (filters.position) {
    summaries.push(
      `포지션 ${positionTypeMap[filters.position as PositionType] ?? filters.position}`,
    );
  }

  if (filters.techStack) {
    summaries.push(`기술 ${filters.techStack}`);
  }

  if (filters.schoolType) {
    summaries.push(
      `학력 ${
        schoolTypeMap[filters.schoolType as SchoolType] ?? filters.schoolType
      }`,
    );
  }

  if (filters.sortOrder) {
    summaries.push(
      `정렬 ${
        sortOrderLabelMap[filters.sortOrder as keyof typeof sortOrderLabelMap] ??
        filters.sortOrder
      }`,
    );
  }

  if (filters.liked === "true") {
    summaries.push("좋아요한 이력서");
  }

  return summaries;
};

const buildCommunityHref = (filters: ResumeFilter, page: number) => {
  const query = new URLSearchParams();

  Object.entries(filters).forEach(([key, val]) => {
    if (val && val !== "false") {
      query.append(key, val as string);
    }
  });

  if (page > 1) {
    query.append("page", page.toString());
  }

  const queryString = query.toString();
  return queryString ? `/community?${queryString}` : "/community";
};

const generatePageNumbers = (currentPage: number, totalPages: number) => {
  const maxPagesToShow = 5;
  const pages: (number | string)[] = [];

  if (totalPages <= maxPagesToShow) {
    for (let i = 1; i <= totalPages; i += 1) {
      pages.push(i);
    }
    return pages;
  }

  let startPage: number;
  let endPage: number;

  if (currentPage <= 3) {
    startPage = 2;
    endPage = 4;
  } else if (currentPage >= totalPages - 2) {
    startPage = totalPages - 3;
    endPage = totalPages - 1;
  } else {
    startPage = currentPage - 1;
    endPage = currentPage + 1;
  }

  pages.push(1);

  if (startPage > 2) {
    pages.push("left-ellipsis");
  }

  for (let i = startPage; i <= endPage; i += 1) {
    pages.push(i);
  }

  if (endPage < totalPages - 1) {
    pages.push("right-ellipsis");
  }

  pages.push(totalPages);
  return pages;
};

function ResumeCard({
  resume,
  onLike,
}: {
  resume: Resume;
  onLike: (resumeId: string) => void;
}) {
  const tags = resume.tags && resume.tags.length > 0 ? resume.tags : ["#기타"];

  return (
    <article className="flex h-full flex-col rounded-[28px] border border-slate-200/80 bg-white shadow-[0_24px_60px_-42px_rgba(15,23,42,0.45)] transition duration-200 hover:-translate-y-1 hover:border-slate-300">
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <Image
            src={resume.avatarUrl}
            alt="프로필 이미지"
            width={52}
            height={52}
            className="h-12 w-12 rounded-2xl border border-slate-200 object-cover"
          />
          <div className="min-w-0">
            <div className="truncate text-lg font-semibold tracking-[-0.03em] text-slate-950">
              {formatPositionLabel(resume.position)}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Globe2 className="h-3.5 w-3.5" />
                {resume.visibility === "PUBLIC" ? "공개" : "비공개"}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock3 className="h-3.5 w-3.5" />
                {formatUpdatedAt(resume.updatedAt)}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onLike(resume.resumeId)}
          className={cn(
            "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition",
            resume.isLiked
              ? "border-rose-200 bg-rose-50 text-rose-500 hover:bg-rose-100"
              : "border-slate-200 bg-white text-slate-400 hover:border-slate-300 hover:text-slate-700",
          )}
          aria-label={resume.isLiked ? "좋아요 취소" : "좋아요"}
        >
          <Heart
            className="h-5 w-5"
            fill={resume.isLiked ? "currentColor" : "none"}
          />
        </button>
      </div>

      <Link
        href={`/community/resumes/${resume.resumeId}`}
        className="flex flex-1 flex-col px-5 py-5"
      >
        <p className="min-h-[88px] text-sm leading-7 text-slate-600 line-clamp-4">
          {resume.aboutMe || "자기소개가 아직 등록되지 않았습니다."}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {tags.slice(0, 4).map((tag, index) => (
            <Badge
              key={`${resume.resumeId}-${tag}-${index}`}
              variant="secondary"
              className="max-w-full rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-600"
              title={tag}
            >
              <span className="truncate">{tag}</span>
            </Badge>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-5">
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Heart className="h-4 w-4" />
              {resume.likeCount}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Eye className="h-4 w-4" />
              {resume.viewCount}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-slate-950">
            상세 보기
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </article>
  );
}

export default function Community() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialFilters: ResumeFilter = {
    position: searchParams.get("position") || "",
    techStack: searchParams.get("techStack") || "",
    schoolType: searchParams.get("schoolType") || "",
    sortOrder: searchParams.get("sortOrder") || "",
    liked: searchParams.get("liked") || "false",
  };

  const initialPage = parseInt(searchParams.get("page") || "1", 10);

  const [filters, setFilters] = useState<ResumeFilter>(initialFilters);
  const [page, setPage] = useState<number>(initialPage);
  const [size] = useState(12);

  const { accessToken } = useAuthStore((state) => state);
  const { data: resumes } = useResumeQuery(page, size, filters);
  const { mutate } = useLikeMutation(page, size, filters);

  useEffect(() => {
    router.replace(buildCommunityHref(filters, page), { scroll: false });
  }, [filters, page, router]);

  const resetFilter = () => {
    setFilters({
      position: "",
      techStack: "",
      schoolType: "",
      sortOrder: "",
      liked: "false",
    });
    setPage(1);
  };

  const handleFilterChange = (field: keyof ResumeFilter, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value === "all" ? "" : value,
    }));
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (!resumes) {
    return <CommunitySkeleton size={size} />;
  }

  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) => value && !(key === "liked" && value === "false"),
  );
  const filterSummary = getFilterSummary(filters);
  const pageNumbers = generatePageNumbers(page, resumes.result.totalPages);
  const resultLabel = hasActiveFilters ? "검색 결과" : "공개 이력서";

  return (
    <div className="min-h-full bg-[#f5f7fb]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-white shadow-[0_32px_90px_-54px_rgba(15,23,42,0.35)]">
          <div className="grid gap-6 px-6 py-7 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
                <SlidersHorizontal className="h-4 w-4" />
                Resume Directory
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
                공개 이력서를 빠르게 비교하고
                <br />
                더 좋은 표현을 찾아보세요
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                포지션, 학교, 기술 스택, 인기 순 정렬로 원하는 이력서를 빠르게
                찾을 수 있습니다. 좋아요와 조회수를 비교하면서 커뮤니티에서
                실제로 반응이 좋은 이력서 표현을 참고해보세요.
              </p>
            </div>

            <div className="flex flex-col justify-between gap-4 rounded-[28px] border border-slate-200 bg-slate-50 p-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[22px] bg-white px-4 py-4">
                  <div className="text-sm text-slate-500">{resultLabel}</div>
                  <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                    {resumes.result.totalElements.toLocaleString()}개
                  </div>
                </div>
                <div className="rounded-[22px] bg-white px-4 py-4">
                  <div className="text-sm text-slate-500">현재 페이지</div>
                  <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                    {page}
                    <span className="ml-1 text-base font-medium text-slate-400">
                      / {resumes.result.totalPages}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm leading-6 text-slate-600">
                  {hasActiveFilters
                    ? "필터 조건에 맞는 이력서를 모아 보여주고 있습니다."
                    : "지금은 전체 공개 이력서를 기준으로 정렬된 결과를 보여주고 있습니다."}
                </div>
                {accessToken && (
                  <Button
                    className="h-11 rounded-full bg-slate-950 px-5 text-white hover:bg-slate-800"
                    onClick={() => {
                      router.push("/myResume/create");
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    새 이력서 만들기
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-200/80 bg-white px-5 py-5 shadow-[0_28px_80px_-52px_rgba(15,23,42,0.35)] sm:px-6">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
                  Explore
                </div>
                <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-slate-950">
                  필터로 원하는 이력서를 바로 찾기
                </h2>
              </div>
              <Button
                variant="outline"
                className="h-10 w-full rounded-full border-slate-300 text-slate-700 hover:bg-slate-50 sm:w-auto"
                onClick={resetFilter}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                필터 초기화
              </Button>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1.2fr_auto]">
              <Select
                value={filters.position || "all"}
                onValueChange={(value) => handleFilterChange("position", value)}
              >
                <SelectTrigger className="h-11 rounded-2xl border-slate-200 bg-white px-4">
                  <SelectValue placeholder="포지션" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 포지션</SelectItem>
                  {Object.entries(positionTypeMap).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.schoolType || "all"}
                onValueChange={(value) =>
                  handleFilterChange("schoolType", value)
                }
              >
                <SelectTrigger className="h-11 rounded-2xl border-slate-200 bg-white px-4">
                  <SelectValue placeholder="학교" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 학력</SelectItem>
                  {Object.entries(schoolTypeMap).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.sortOrder || "all"}
                onValueChange={(value) =>
                  handleFilterChange("sortOrder", value)
                }
              >
                <SelectTrigger className="h-11 rounded-2xl border-slate-200 bg-white px-4">
                  <SelectValue placeholder="정렬 기준" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">기본 정렬</SelectItem>
                  <SelectItem value="recent">최신순</SelectItem>
                  <SelectItem value="like">좋아요 많은 순</SelectItem>
                  <SelectItem value="view">조회수 많은 순</SelectItem>
                </SelectContent>
              </Select>

              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={filters.techStack}
                  onChange={(event) =>
                    handleFilterChange("techStack", event.target.value)
                  }
                  className="h-11 rounded-2xl border-slate-200 bg-white pl-11 pr-4 placeholder:text-slate-400"
                  placeholder="기술 스택 검색"
                />
              </div>

              <Button
                variant="outline"
                className={cn(
                  "h-11 rounded-2xl border px-4",
                  filters.liked === "true"
                    ? "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                )}
                onClick={() => {
                  handleFilterChange(
                    "liked",
                    filters.liked === "true" ? "false" : "true",
                  );
                }}
              >
                <Heart
                  className="mr-2 h-4 w-4"
                  fill={filters.liked === "true" ? "currentColor" : "none"}
                />
                좋아요만 보기
              </Button>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                {filterSummary.length > 0 ? (
                  filterSummary.map((summary) => (
                    <Badge
                      key={summary}
                      variant="secondary"
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                    >
                      {summary}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-slate-500">
                    현재는 필터 없이 전체 목록을 보고 있습니다.
                  </span>
                )}
              </div>
              <div className="text-sm font-medium text-slate-600">
                {resumes.result.totalElements.toLocaleString()}개의 결과
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
                Results
              </div>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                {resultLabel} {resumes.result.totalElements.toLocaleString()}개
              </h2>
            </div>
            <p className="text-sm text-slate-500">
              페이지당 {size}개씩, 비교하기 좋은 밀도로 정리했습니다.
            </p>
          </div>

          {resumes.result.content.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {resumes.result.content.map((resume) => (
                <ResumeCard
                  key={resume.resumeId}
                  resume={resume}
                  onLike={(resumeId) => {
                    mutate(resumeId);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[32px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-[0_24px_70px_-50px_rgba(15,23,42,0.3)]">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                조건에 맞는 이력서를 찾지 못했습니다
              </h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
                필터를 조금 넓히거나 기술 스택 검색어를 바꾸면 더 많은 이력서를
                찾을 수 있습니다.
              </p>
              <div className="mt-6 flex justify-center">
                <Button
                  onClick={resetFilter}
                  className="rounded-full bg-slate-950 px-5 text-white hover:bg-slate-800"
                >
                  필터 초기화하기
                </Button>
              </div>
            </div>
          )}
        </section>

        {resumes.result.totalPages > 1 && (
          <section className="rounded-[28px] border border-slate-200/80 bg-white px-4 py-4 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.3)]">
            <Pagination>
              <PaginationContent>
                <PaginationPrevious
                  href={buildCommunityHref(filters, Math.max(page - 1, 1))}
                  onClick={() => handlePageChange(Math.max(page - 1, 1))}
                  className={cn(
                    "rounded-full border border-slate-200 bg-white",
                    page === 1 && "pointer-events-none opacity-50",
                  )}
                />
                {pageNumbers.map((pageNum, index) => {
                  if (pageNum === "left-ellipsis" || pageNum === "right-ellipsis") {
                    return <PaginationEllipsis key={`${pageNum}-${index}`} />;
                  }

                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href={buildCommunityHref(filters, pageNum as number)}
                        onClick={() => handlePageChange(pageNum as number)}
                        isActive={pageNum === page}
                        className={cn(
                          "rounded-full",
                          pageNum === page
                            ? "border-slate-950 bg-slate-950 text-white hover:bg-slate-900 hover:text-white"
                            : "border border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50",
                        )}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                <PaginationNext
                  href={buildCommunityHref(
                    filters,
                    Math.min(page + 1, resumes.result.totalPages),
                  )}
                  onClick={() =>
                    handlePageChange(Math.min(page + 1, resumes.result.totalPages))
                  }
                  className={cn(
                    "rounded-full border border-slate-200 bg-white",
                    page === resumes.result.totalPages &&
                      "pointer-events-none opacity-50",
                  )}
                />
              </PaginationContent>
            </Pagination>
          </section>
        )}
      </div>
    </div>
  );
}
