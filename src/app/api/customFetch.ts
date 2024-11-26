import { useAuthStore } from "@/app/store/useAuthStore";
import * as Sentry from "@sentry/nextjs";

const customFetch = async (url: string, options: RequestInit = {}) => {
  const accessToken = useAuthStore.getState().accessToken; // zustand에서 현재 토큰 확인
  // let headers = options.headers || {};
  let headers: Record<string, string> =
    options.headers instanceof Headers
      ? Object.fromEntries(options.headers.entries())
      : (options.headers as Record<string, string>) || {};

  // Access Token이 있다면 Authorization 헤더 추가
  if (accessToken) {
    headers = {
      ...headers,
      Authorization: `Bearer ${accessToken}`,
    };
  }

  try {
    const response = await fetch(url, { ...options, headers });

    // Access Token 만료(401) 시 처리
    if (response.status === 401) {
      // 토큰 재발급 요청
      const reissueResponse = await fetch("/api/auth/reissue", {
        method: "POST",
        credentials: "include", // 쿠키 전송을 위해 필요
      });

      if (!reissueResponse.ok) {
        const errorData = await reissueResponse.json();
        const errorMessage = errorData.message || "인증에 실패하였습니다."; // 메시지가 없으면 기본 메시지 사용
        useAuthStore.setState({ accessToken: "" });
        useAuthStore.setState({ authenticated: false });
        window.location.href = "/community";
        throw new Error(errorMessage); // 메시지를 에러에 전달
      }

      const { accessToken } = await reissueResponse.json();

      // zustand에 새 토큰 저장
      useAuthStore.setState({ accessToken });

      // 재발급 받은 토큰으로 동일 요청 재시도
      headers.Authorization = `Bearer ${accessToken}`;
      return fetch(url, { ...options, headers });
    }

    return response; // 정상 응답 반환
  } catch (error) {
    Sentry.captureException(error);
    throw error;
  }
};

export default customFetch;
