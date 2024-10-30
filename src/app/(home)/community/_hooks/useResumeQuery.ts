import { useQuery } from "@tanstack/react-query";

export interface ResumeFilter {
  tag?: string[];
  position: string;
  techStack: string;
  schoolType: string;
  sortOrder: string;
}

interface Resume {
  resumeId: string;
  memberId: number;
  aboutMe: string;
  tags: string[] | null;
  likeCount: number;
  viewCount: number;
}

interface Result {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  size: 10;
  content: Resume[];
}

interface ApiResponse {
  time: string;
  status: string;
  code: string;
  message: string;
  result: Result;
}

const getResumeProfile = async (
  accessToken: string,
  page: number,
  size: number,
  filters: ResumeFilter
) => {
  const filterParams = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      filterParams.append(key, value); // 필터 값이 있는 경우만 쿼리 추가
    }
  });

  const response = await fetch(
    `/api/resumes?page=${page - 1}&size=${size}&${filterParams.toString()}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data: ApiResponse = await response.json();
  return data || "";
};
export const useResumeQuery = (
  accessToken: string,
  page: number,
  size: number,
  filters: any
) => {
  return useQuery<ApiResponse>({
    queryKey: ["resume", page, size, filters],
    queryFn: () => getResumeProfile(accessToken, page, size, filters),
    enabled: !!accessToken,
  });
};
