import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type OnboardingRequest = {
  accessToken: string;
  data: FormData;
};

export function useOnboardingUpdate() {
  const queryClient = useQueryClient();
  const router = useRouter(); // router 사용 설정

  return useMutation({
    mutationKey: ["onboardingUpdate"],
    mutationFn: async ({ accessToken, data }: OnboardingRequest) => {
      console.log(data);
      Object.keys(data).forEach((key) => {
        console.log(key);
      });
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/members/me`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: data,
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw {
          status: response.status,
          message: errorData.message ?? "에러가 발생했습니다.",
        };
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast.success("코스 등록에 성공하였습니다.");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });
}
