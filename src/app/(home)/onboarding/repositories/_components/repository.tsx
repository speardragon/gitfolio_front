"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import "moment/locale/ko";
import { useState } from "react";
import { useRepositoryQuery } from "../_hooks/useRepositoryQuery";
import MultipleSelector, { Option } from "@/components/ui/multi-selector";
import { useResumeMutation } from "../_hooks/useResumeMutation";
import RepositorySkeleton from "./repository-skeleton";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import RESUME_TEMPLATE from "../../../../../../public/images/resume_template.png";
import { toast } from "sonner";
import { TooltipArrow } from "@radix-ui/react-tooltip";

export default function Repository() {
  const [value, setValue] = useState<Option[]>([]);
  const [requirements, setRequirements] = useState<string>("");
  const [visibility, setVisibility] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("template1");

  const { data: repositories } = useRepositoryQuery();
  const { mutate } = useResumeMutation();

  if (!repositories) {
    return <RepositorySkeleton />;
  }

  const options: Option[] = repositories.result.map((repo) => ({
    label: repo.repoName,
    value: repo.repoUrl,
    topLanguage: repo.topLanguage,
    updatedAt: repo.updatedAt,
  }));

  const onSubmit = () => {
    if (value.length > 3) {
      alert("최대 3개까지만 선택할 수 있습니다.");
      return;
    }
    const data = {
      selectedRepo: value.map((repo) => repo.value),
      requirements: requirements,
      visibility: visibility ? "PUBLIC" : "PRIVATE",
      template: selectedTemplate,
    };
    mutate({ data });
    // toast.message("You submitted the following values:", {
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // });
  };

  const handleValueChange = (selectedOptions: Option[]) => {
    if (selectedOptions.length > 3) {
      alert("최대 3개까지만 선택할 수 있습니다.");
      const updatedOptions = [...selectedOptions];
      updatedOptions.pop();
      setValue(updatedOptions);
      return;
    } else {
      setValue(selectedOptions);
    }
  };

  return (
    <div className="flex flex-col w-1/2 p-8 space-y-2 overflow-y-auto">
      <div className="flex flex-col w-full p-4 space-y-4 border-2 rounded-lg">
        <div className="flex flex-col w-full h-full">
          <div className="text-xl font-semibold">깃허브 레파지토리 선택</div>
          <div>
            이력서에 넣고 싶은 프로젝트를 생성하기 위한 레파지토리를
            선택해주세요.(최대 3개)
          </div>
        </div>
        <MultipleSelector
          className=""
          hidePlaceholderWhenSelected
          value={value}
          onChange={handleValueChange}
          defaultOptions={options}
          placeholder="원하는 레포지토리를 최대 3개까지 선택해주세요."
          emptyIndicator={
            <p className="text-lg leading-10 text-center text-gray-600 dark:text-gray-400">
              레포지토리가 존재하지 않습니다.
            </p>
          }
        />
        <Input
          type="text"
          placeholder="더 나은 이력서를 만들기 위한 요청사항을 입력해주세요."
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          className="w-full py-4 rounded-md"
        />
        <div className="flex flex-row items-center justify-between p-4 border rounded-lg">
          <div className="space-y-0.5">
            <div className="text-base">공개 여부 설정</div>
            <div className="text-sm text-gray-400">
              공개 여부를 체크하시면 커뮤니티에 회원님의 이력서가 공개됩니다!
            </div>
          </div>
          <Switch checked={visibility} onCheckedChange={setVisibility} />
        </div>
        <div className="space-y-4 ">
          <div className="text-base font-medium">이력서 템플릿 선택</div>
          <div className="grid grid-cols-3 gap-2 justify-items-center">
            {["template1", "template2", "template3"].map((template, index) => (
              <label
                key={template}
                className="flex flex-col items-center justify-center w-full p-2 space-y-2 border rounded-lg cursor-pointer aspect-square"
                onClick={() => setSelectedTemplate(template)}
              >
                <TooltipProvider>
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger className="relative w-full h-full">
                      {" "}
                      <Image
                        src={RESUME_TEMPLATE} // Placeholder 이미지 경로
                        alt={`Template ${index + 1}`}
                        fill
                        className="object-cover rounded-md"
                      />
                    </TooltipTrigger>
                    <TooltipContent
                      side="left"
                      className="TooltipContent border w-[400px] h-[600px]"
                      sideOffset={5}
                    >
                      <TooltipArrow />
                      <Image
                        src={RESUME_TEMPLATE} // Placeholder 이미지 경로
                        alt={`Template ${index + 1}`}
                        fill
                        className="object-cover border-2 border-gray-500 rounded-md"
                      />
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <input
                  type="radio"
                  name="template"
                  value={template}
                  checked={selectedTemplate === template}
                  onChange={() => setSelectedTemplate(template)}
                  className="mt-2"
                />
                <span className="text-sm">{`Template ${index + 1}`}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      <Button
        onClick={onSubmit}
        className="w-full bg-blue-500 hover:bg-blue-400"
      >
        이력서 만들러 가기
      </Button>
      <Link className="text-center text-gray-400 underline" href={"/community"}>
        이력서 등록 하지 않고 커뮤니티로 이동
      </Link>
    </div>
  );
}
