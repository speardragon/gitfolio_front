import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ResumeFilter } from "./useResumeQuery";
import customFetch from "@/app/api/customFetch";

export function useLikeMutation(
  page: number,
  size: number,
  filters: ResumeFilter,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["likes"],
    retry: 0,
    mutationFn: async (resumeId: string) => {
      const response = await customFetch(
        // `${process.env.NEXT_PUBLIC_RESUMES_SERVER_URL}/api/resumes/${resumeId}/likes`,
        `/api/resumes/${resumeId}/likes`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      return response.json();
    },
    onMutate: async (resumeId) => {
      await queryClient.cancelQueries({
        queryKey: ["resumes", page, size, filters],
      });

      const previousResumes = queryClient.getQueryData([
        "resumes",
        page,
        size,
        filters,
      ]);

      queryClient.setQueryData(["resumes", page, size, filters], (old: any) => {
        if (!old?.result?.content) {
          return old;
        }

        return {
          ...old,
          result: {
            ...old.result,
            content: old.result.content.map((resume: any) =>
              resume.resumeId === resumeId
                ? {
                    ...resume,
                    isLiked: !resume.isLiked,
                    liked: !resume.isLiked,
                    likeCount:
                      resume.likeCount + (resume.isLiked ? -1 : 1),
                  }
                : resume,
            ),
          },
        };
      });

      return { previousResumes };
    },
    onSuccess: () => {},
    onError: (error: any, _, context: any) => {
      if (context?.previousResumes) {
        queryClient.setQueryData(
          ["resumes", page, size, filters],
          context.previousResumes,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
  });
}
