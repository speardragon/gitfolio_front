"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LockOpen } from "lucide-react";
import moment from "moment";
import "moment/locale/ko";
import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useRepositoryQuery } from "../_hooks/useRepositoryQuery";
import { useAuthStore } from "@/app/store/useAuthStore";
import GITHUB_LOGO from "../../../../../../public/images/github-mark.png";
import MultipleSelector, { Option } from "@/components/ui/multi-selector";

export default function Repository() {
  const { accessToken } = useAuthStore((state) => state);

  const [selectedRepos, setSelectedRepos] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [value, setValue] = useState<Option[]>([]);

  const { data: repositories } = useRepositoryQuery(accessToken!);

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

  if (!repositories) {
    return <div>loading...</div>;
  }

  const filteredRepos = repositories.result.filter((repo) =>
    repo.repoName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const options: Option[] = filteredRepos.map((repo) => ({
    label: repo.repoName,
    value: repo.repoUrl,
  }));

  return (
    <div className="flex flex-col items-center justify-center w-1/2 h-full p-4 space-y-4">
      <Card className="w-full h-[600px]">
        <CardHeader>
          <CardTitle>깃허브 레파지토리 선택</CardTitle>
          <CardDescription>
            프로젝트를 생성할 레파지토리를 선택해주세요(최대 3개)
          </CardDescription>
        </CardHeader>
        <CardContent className="h-full space-y-4">
          <Input
            type="text"
            placeholder="레포지토리 이름 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-6 rounded-md"
          />
          <MultipleSelector
            className=""
            value={value}
            onChange={setValue}
            defaultOptions={options}
            placeholder="원하는 레포지토리를 최대 3개까지 선택해주세요."
            emptyIndicator={
              <p className="text-lg leading-10 text-center text-gray-600 dark:text-gray-400">
                레포지토리가 존재하지 않습니다.
              </p>
            }
          />
          {/* <div className="overflow-y-auto">
            {filteredRepos.map((repo) => (
              <div
                key={repo.repoId}
                className="flex items-center p-2 py-4 space-x-4 border border-gray-200"
              >
                <input
                  type="checkbox"
                  checked={selectedRepos.includes(repo.repoId)}
                  onChange={() => handleCheckBoxChange(repo.repoId)}
                />
                <Image
                  src={
                    repo.topLanguage
                      ? `/images/languages/${repo.topLanguage}.png`
                      : GITHUB_LOGO
                  }
                  alt="app_logo"
                  width={20}
                  height={20}
                />
                <LockOpen className="text-gray-400" />
                <div className="flex justify-between w-full px-2 pr-4">
                  <span style={{ marginRight: "1rem" }}>
                    <a
                      href={repo.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {repo.repoName}
                    </a>
                  </span>
                  <span className="text-gray-500">
                    {moment(repo.updatedAt).fromNow()}
                  </span>
                </div>
              </div>
            ))}
          </div> */}
        </CardContent>
      </Card>
      <Button className="w-full">이력서 만들러 가기</Button>
    </div>
  );
}
