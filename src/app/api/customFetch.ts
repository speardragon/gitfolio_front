import { useAuthStore } from "@/app/store/useAuthStore";
import * as Sentry from "@sentry/nextjs";
import { toast } from "sonner";

const customFetch = async (
  url: string,
  options: RequestInit = {},
): Promise<Response> => {
  if (typeof window === "undefined") {
    return fetch(url, options);
  }

  let accessToken = useAuthStore.getState().accessToken;

  const headers: Record<string, string> = {
    ...((options.headers instanceof Headers
      ? Object.fromEntries(options.headers.entries())
      : (options.headers as Record<string, string>)) || {}),
  };

  // 1) 토큰이 없으면 재발급 시도
  if (!accessToken) {
    const reissueResponse = await fetch(
      `/api/auth/reissue`,
      // `${process.env.NEXT_PUBLIC_AUTH_SERVER_URL}/api/auth/reissue`,
      {
        method: "POST",
        credentials: "include",
      },
    );

    if (reissueResponse.ok) {
      const data = await reissueResponse.json();
      accessToken = data.accessToken;
      useAuthStore.setState({ accessToken, authenticated: true });
    } else {
      useAuthStore.getState().resetAuth();
    }
  }

  // 2) Authorization 헤더 세팅
  headers.Authorization = `Bearer ${accessToken}`;

  // 3) JSON 요청시 Content-Type 헤더 세팅
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const response = await fetch(url, { ...options, headers });

    // 4) 401 → 재발급 로직
    if (response.status === 401) {
      // 토큰 재발급 요청
      const reissueResponse = await fetch(
        `/api/auth/reissue`,
        // `${process.env.NEXT_PUBLIC_AUTH_SERVER_URL}/api/auth/reissue`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      if (!reissueResponse.ok) {
        const errorData = await reissueResponse.json();
        const errorMessage = errorData.message || "인증에 실패하였습니다.";

        // 예상치 못한 치명적 인증오류 → captureException
        Sentry.captureException(new Error(`401 재발급 실패: ${errorMessage}`), {
          level: "error",
        });
        useAuthStore.getState().resetAuth();
        throw new Error(errorMessage);
      }

      // 재발급 성공
      const { accessToken: newAccessToken } = await reissueResponse.json();
      useAuthStore.setState({ accessToken: newAccessToken });
      headers.Authorization = `Bearer ${newAccessToken}`;

      // 동일 요청 재시도
      return fetch(url, { ...options, headers });
    }

    // 5) 여기서부터는 401 외의 에러 핸들링
    if (!response.ok) {
      console.log(response.status);
      // 응답 상태 코드를 확인해 레벨 설정
      // 4xx는 예상된(사용자/클라이언트 측) 에러이므로 warning,
      // 5xx는 서버 측 에러이므로 error 레벨로 분류
      if (response.status >= 400 && response.status < 500) {
        Sentry.captureMessage(
          `API Client Error: ${url}, status: ${response.status}`,
          { level: "warning" },
        );
      } else if (response.status >= 500) {
        Sentry.captureMessage(
          `API Server Error: ${url}, status: ${response.status}`,
          { level: "error" },
        );
      }

      // 에러 response를 바로 반환(혹은 throw)해도 되고,
      // JSON 바디를 파싱하여 에러 로직을 처리해도 됨
      return response;
    }

    return response; // 정상 응답 반환
  } catch (error) {
    // 네트워크 장애 등 예측 불가 에러 → captureException (Fatal/Error)
    Sentry.captureException(error, { level: "error" });
    throw error; // 최종 throw
  }
};

export default customFetch;
