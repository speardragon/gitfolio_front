import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type OnboardingRequest = {
  accessToken: string;
  data: {
    selectedRepo: string[];
    requirements: string;
  };
};

export function useResumeMutation() {
  const router = useRouter();
  return useMutation({
    mutationKey: ["createResume"],
    mutationFn: async ({ accessToken, data }: OnboardingRequest) => {
      console.log(data);
      const promise = fetch(`/api/resumes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify(data),
      }).then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json();
          console.error(errorData.message);
          throw new Error(errorData.message ?? "에러가 발생했습니다.");
        }
        return response.json();
      });

      // const promise = () =>
      //   new Promise((resolve) =>
      //     setTimeout(() => resolve({ name: "Sonner" }), 20000)
      //   );

      return toast.promise(promise, {
        loading: "이력서 생성 중...",
        success: "이력서 등록에 성공하였습니다.",
        error: (error) => error.message || "이력서 등록에 실패했습니다.",
        position: "top-right",
        className: "bg-blue-50 text-blue-500",
      });
    },
    onSuccess: (data) => {
      // router.push("/onboarding/repositories");
    },
    onError: (error: any) => {
      toast.error(error.message);
      router.push("/onboarding/repositories");
    },
  });
}
