"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LockOpen } from "lucide-react";
import moment from "moment";
import "moment/locale/ko";
import { useState } from "react";
import { repositories } from "../../dummy";
import TYPESCRIPT_LOGO from "../../../../../../public/images/typescript-logo.png";
import Image from "next/image";

export default function Repository() {
  const [selectedRepos, setSelectedRepos] = useState<number[]>([]);

  // const handleCheckBoxChange = (id: number) => {
  //   setSelectedRepos((prev) =>
  //     prev.includes(id) ? prev.filter((repoId) => repoId !== id) : [...prev, id]
  //   );
  // };

  const handleCheckBoxChange = (id: number) => {
    if (selectedRepos.includes(id)) {
      // 이미 선택된 항목을 선택 해제
      setSelectedRepos((prev) => prev.filter((repoId) => repoId !== id));
    } else if (selectedRepos.length < 3) {
      // 최대 3개까지 선택 가능
      setSelectedRepos((prev) => [...prev, id]);
    } else {
      // 최대 3개를 초과한 경우 알림 (또는 다른 처리)
      alert("최대 3개까지만 선택할 수 있습니다.");
    }
  };

  return (
    <div className="flex flex-col w-2/3 p-4 space-y-2 justify-center items-center">
      <Card className="h-[300px] overflow-y-auto">
        <CardHeader>
          <CardTitle>깃허브 레파지토리 선택</CardTitle>
          <CardDescription>
            프로젝트를 생성할 레파지토리를 선택해주세요(최대 3개)
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-y-auto">
          <div className="overflow-y-auto">
            {repositories.map((repo) => (
              <div
                key={repo.repoId}
                className="flex items-center p-2 py-4 border space-x-4 border-gray-100"
              >
                <input
                  type="checkbox"
                  checked={selectedRepos.includes(repo.repoId)}
                  onChange={() => handleCheckBoxChange(repo.repoId)}
                />
                <Image src={TYPESCRIPT_LOGO} alt="app_logo" width={20} />
                <LockOpen className="text-gray-400" />
                <span style={{ marginRight: "1rem" }}>
                  <a
                    href={repo.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {repo.repoName}
                  </a>
                </span>
                {/* UpdatedAt (한국어 표기로 몇일 전인지 표시) */}
                <span>
                  {moment(repo.updatedAt).fromNow()} {/* n일 전 */}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Button>이력서 만들러 가기</Button>
    </div>
  );
}
