"use client";

import Image from "next/image";
import { Heart, RefreshCw } from "lucide-react";
import MAIN_BANNER from "../../../../public/images/main-banner.png";
import { ResumeFilter, useResumeQuery } from "./_hooks/useResumeQuery";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { faker } from "@faker-js/faker";
import Link from "next/link";
import CommunitySkeleton from "./_components/community-skeleton";

const tagList = ["#Kakao", "#Toss", "#라인", "#우아한형제들"];

export default function Page() {
  // faker.seed(123);
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") as string);

  const [size, setsize] = useState(12);
  const [filters, setFilters] = useState<ResumeFilter>({
    tag: [""],
    position: "",
    techStack: "",
    schoolType: "",
    sortOrder: "recent",
  });

  const [appliedFilters, setAppliedFilters] = useState<ResumeFilter>({
    tag: [""],
    position: "",
    techStack: "",
    schoolType: "",
    sortOrder: "recent",
  });

  const router = useRouter();

  const { accessToken } = useAuthStore((state) => state);

  const { data: resumes, isLoading } = useResumeQuery(
    accessToken!,
    page || 1,
    size,
    appliedFilters
  );

  useEffect(() => {
    const initialFilters = {
      // tag: searchParams.get("tag") || [],
      position: searchParams.get("position") || "",
      techStack: searchParams.get("techStack") || "",
      schoolType: searchParams.get("schoolType") || "",
      sortOrder: searchParams.get("sortOrder") || "recent",
    };
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
  }, []);

  if (isLoading || !resumes) {
    return <CommunitySkeleton size={size} />;
  }

  const dummyImages = Array.from(
    { length: resumes?.result.content.length },
    () => faker.image.avatar()
  );

  const handlePageChange = (newPage: number) => {
    // setPage(newPage);
    router.push(`/community?page=${newPage}`); // 페이지 이동
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value,
    }));
  };

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    const query = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        query.append(key, value as string); // 필터 값이 있을 때만 쿼리 추가
      }
    });
    query.append("page", "1"); // 필터 적용 시 페이지를 1로 초기화
    router.push(`/community?${query.toString()}`);
  };

  return (
    <>
      <div className="w-full">
        <Image src={MAIN_BANNER} alt="sdf" priority />
      </div>
      <div className="container mx-auto px-4 py-8 space-y-8 items-center">
        <div className="flex flex-wrap items-center justify-between p-4 gap-2 bg-white rounded-lg shadow-lg">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="icon" className="w-10 h-10">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Select
              onValueChange={(value) => handleFilterChange("position", value)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="포지션" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 포지션</SelectItem>
                <SelectItem value="developer">개발자</SelectItem>
                <SelectItem value="designer">디자이너</SelectItem>
                <SelectItem value="manager">매니저</SelectItem>
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) => handleFilterChange("sortOrder", value)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="정렬" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">최신순</SelectItem>
                <SelectItem value="relevant">관련성순</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex-grow flex gap-2">
              <Input
                onChange={(e) =>
                  handleFilterChange("techStack", e.target.value)
                }
                className="flex-grow"
                placeholder="직무 스킬 검색"
              />
              <Input
                onChange={(e) =>
                  handleFilterChange("schoolType", e.target.value)
                }
                className="flex-grow"
                placeholder="사용자 검색"
              />
            </div>
            <Button
              onClick={handleApplyFilters}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              필터 적용하기
            </Button>
          </div>
          <Button
            variant="outline"
            className="flex p-2 gap-2 text-gray-500 rounded-2xl px-4 border border-gray-400"
          >
            <Heart className="h-4 w-4" />
            좋아요 누른 이력서만 보기
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {resumes.result.content.map((resume, idx) => (
            <Link
              href={`/community/resumes/${resume.resumeId}`}
              // onClick={() => router.push()}
              key={resume.resumeId}
              className="border rounded-lg overflow-hidden shadow-lg cursor-pointer transform transition-transform duration-500 ease-in-out hover:-translate-y-1"
            >
              <div className="p-2">
                <div className="flex space-x-2 text-xs text-gray-500 items-center">
                  {tagList.map((tag, index) => (
                    <span
                      key={index}
                      className="rounded-lg p-1 px-2 bg-gray-100 text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <Image
                src={dummyImages[idx]}
                alt="프로필 이미지"
                width={300}
                height={300}
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    {"백엔드 개발자(TODO)"}
                  </h3>
                  <Heart fill="red" strokeWidth={0} />
                </div>
                <p className="text-sm text-gray-600 mt-2 line-clamp-6 whitespace-pre-line">
                  {resume.aboutMe}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationPrevious
              href={`?page=${
                resumes.result.currentPage > 0
                  ? resumes.result.currentPage - 1
                  : 0
              }`}
              onClick={() =>
                resumes.result.currentPage > 0 &&
                handlePageChange(resumes.result.currentPage - 1)
              }
              aria-disabled={resumes.result.currentPage === 0}
            />
            {Array.from({ length: resumes.result.totalPages }).map(
              (_, index) => (
                <PaginationItem className="cursor-pointer" key={index}>
                  <PaginationLink
                    onClick={() => handlePageChange(index + 1)}
                    href={`?page=${index + 1}`}
                    className={
                      index === resumes.result.currentPage ? "font-bold" : ""
                    }
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
            <PaginationNext
              className="cursor-pointer"
              onClick={() =>
                resumes.result.currentPage < resumes.result.totalPages - 1 &&
                handlePageChange(resumes.result.currentPage + 1)
              }
              href={`?page=${
                resumes.result.currentPage < resumes.result.totalPages - 1
                  ? resumes.result.currentPage + 1
                  : resumes.result.totalPages - 1
              }`}
            />
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
}
