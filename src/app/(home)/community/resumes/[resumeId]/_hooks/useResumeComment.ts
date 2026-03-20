import customFetch from "@/app/api/customFetch";
import { useQuery } from "@tanstack/react-query";

interface Result {
  id: number;
  resumeId: string;
  memberId: number;
  nickname: string;
  avatarUrl: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface ResumeCommentResponse {
  time: string;
  status: string;
  code: string;
  message: string;
  result: Result[];
}
const getResumeComment = async (resumeId: string) => {
  const response = await customFetch(
    `/api/resumes/${resumeId}/comments`,
    // `${process.env.NEXT_PUBLIC_RESUMES_SERVER_URL}/api/resumes/${resumeId}/comments`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "댓글 데이터를 가져올 수 없습니다.");
  }

  const data: ResumeCommentResponse = await response.json();

  return data;
};
export const useResumeCommentQuery = (resumeId: string) => {
  return useQuery<ResumeCommentResponse>({
    queryKey: ["resumes", resumeId, "comments"],
    queryFn: () => getResumeComment(resumeId),
  });
};
