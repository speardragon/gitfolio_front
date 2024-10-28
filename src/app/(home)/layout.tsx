"use client";

import { useEffect } from "react";
import Header from "./_components/header";
import { useAuthStore } from "../store/useAuthStore";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { setAccessToken } = useAuthStore((state) => state);

  useEffect(() => {
    const reissueAccessToken = async () => {
      try {
        const response = await fetch(`/api/auth/reissue`, {
          method: "POST",
          credentials: "include", // 쿠키가 필요하면 이 옵션을 사용
        });

        if (response.ok) {
          const data = await response.json();
          const accessToken = data.accessToken;
          // console.log(accessToken);
          setAccessToken(accessToken);
        } else {
          console.error("Failed to reissue access token");
        }
      } catch (error) {
        console.error("Error reissuing access token:", error);
      }
    };

    reissueAccessToken();
  }, []);
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      {children}
    </div>
  );
}
