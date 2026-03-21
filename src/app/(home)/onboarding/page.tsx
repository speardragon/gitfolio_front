"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import {
  ArrowDown,
  ArrowUp,
  BriefcaseBusiness,
  CalendarRange,
  CheckCircle2,
  CirclePlus,
  GraduationCap,
  Link as LinkIcon,
  PlusCircle,
  ShieldCheck,
  Sparkles,
  Trash,
  UserRound,
} from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Github } from "lucide-react";
import Notion from "../../../../public/notion.svg";
import Tistory from "../../../../public/tistory.svg";
import Linkedin from "../../../../public/linkedin.svg";
import { OnboardingFormSchema } from "./_lib/schema";
import { useOnboardingUpdate } from "./_hooks/useOnboardingUpdate";
import CustomMonthRangePicker from "./_components/custom-month-range-picker";
import { useProfileQuery } from "./_hooks/useProfileQuery";
import OnboardingSkeleton from "./_components/onboarding-skeleton";
import { useRepositoryQuery } from "./repositories/_hooks/useRepositoryQuery";
import { positionTypeMap } from "@/app/types/type";
import { LoadingButton } from "@/components/ui/loading-button";

const surfaceClass =
  "rounded-[30px] border border-slate-200/80 bg-white/92 shadow-[0_28px_80px_-48px_rgba(15,23,42,0.45)] backdrop-blur";
const sectionClass =
  "rounded-[28px] border border-slate-200/80 bg-white px-5 py-5 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.42)] sm:px-7 sm:py-7";
const nestedCardClass =
  "rounded-[24px] border border-slate-200/80 bg-slate-50/70 px-4 py-4 shadow-none sm:px-5";
const actionButtonClass =
  "rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950";

const summaryItems = [
  {
    label: "입력 단계",
    value: "01",
    description: "프로필과 경력 정보를 먼저 정리합니다.",
  },
  {
    label: "이어서 진행",
    value: "02",
    description: "다음 화면에서 레포를 선택하고 초안을 생성합니다.",
  },
  {
    label: "권장 방식",
    value: "밀도 있게",
    description: "정보가 많을수록 생성 품질이 안정적으로 올라갑니다.",
  },
];

const guideItems = [
  "필수 정보만 먼저 채워도 다음 단계로 이동할 수 있습니다.",
  "경력, 교육, 자격증은 최신순으로 정렬해두면 편집 단계에서 그대로 활용됩니다.",
  "블로그·깃허브·노션 링크를 넣어두면 이력서 말미 링크 섹션에 자연스럽게 반영됩니다.",
];

type SectionHeaderProps = {
  icon: React.ReactNode;
  step: string;
  title: string;
  description: string;
  required?: boolean;
  action?: React.ReactNode;
};

function SectionHeader({
  icon,
  step,
  title,
  description,
  required,
  action,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-950 text-white">
          {icon}
        </div>
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-700">
            {step}
            {required ? <span className="text-rose-500">Required</span> : null}
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
            {title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            {description}
          </p>
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

function EmptyState({ description }: { description: string }) {
  return (
    <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50/80 px-5 py-6 text-sm leading-6 text-slate-500">
      {description}
    </div>
  );
}

function ItemControls({
  index,
  length,
  onMoveUp,
  onMoveDown,
  onRemove,
}: {
  index: number;
  length: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={index === 0}
        className={cn(actionButtonClass, "h-10 w-10 rounded-full p-0")}
        onClick={onMoveUp}
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={index === length - 1}
        className={cn(actionButtonClass, "h-10 w-10 rounded-full p-0")}
        onClick={onMoveDown}
      >
        <ArrowDown className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn(
          actionButtonClass,
          "h-10 w-10 rounded-full p-0 text-rose-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600",
        )}
        onClick={onRemove}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default function Page() {
  const [imageFile, setImageFile] = useState<File>();
  const [preview, setPreview] = useState<string>();

  const form = useForm<z.infer<typeof OnboardingFormSchema>>({
    resolver: zodResolver(OnboardingFormSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      email: "",
      position: "",
    },
    mode: "onChange",
  });

  const { mutate, isPending } = useOnboardingUpdate();
  const { data: userProfile } = useProfileQuery();

  const {
    fields: experiencesFields,
    append: experiencesAppend,
    remove: experiencesRemove,
    move: experiencesMove,
  } = useFieldArray({
    control: form.control,
    name: "workExperiences",
  });
  const {
    fields: educationFields,
    append: educationAppend,
    remove: educationRemove,
    move: educationMove,
  } = useFieldArray({
    control: form.control,
    name: "educations",
  });
  const {
    fields: linksFields,
    append: linksAppend,
    remove: linksRemove,
    move: linksMove,
  } = useFieldArray({
    control: form.control,
    name: "links",
  });
  const {
    fields: certificationsFields,
    append: certificationsAppend,
    remove: certificationsRemove,
    move: certificationsMove,
  } = useFieldArray({
    control: form.control,
    name: "certificates",
  });

  const [iconTypes, setIconTypes] = useState(
    Array(linksFields.length).fill(<LinkIcon />),
  );

  useRepositoryQuery();

  useEffect(() => {
    setIconTypes((prev) => {
      if (prev.length === linksFields.length) {
        return prev;
      }

      return Array.from({ length: linksFields.length }, (_, index) => {
        return prev[index] ?? <LinkIcon key={`link-icon-${index}`} />;
      });
    });
  }, [linksFields.length]);

  function onSubmit(data: z.infer<typeof OnboardingFormSchema>) {
    const formData = new FormData();

    const memberUpdateRequestDTO = {
      name: data.name,
      phoneNumber: data.phoneNumber,
      email: data.email,
      position: data.position,
    };
    const memberAdditionalRequestDTO = {
      workExperiences: data.workExperiences,
      educations: data.educations,
      certificates: data.certificates,
      links: data.links,
    };

    formData.append("imageFile", imageFile as Blob);
    formData.append(
      "memberUpdateRequestDTO",
      new Blob([JSON.stringify(memberUpdateRequestDTO)], {
        type: "application/json",
      }),
    );
    formData.append(
      "memberAdditionalRequestDTO",
      new Blob([JSON.stringify(memberAdditionalRequestDTO)], {
        type: "application/json",
      }),
    );
    formData.append("imageFile", imageFile as Blob);

    mutate({ data: formData });
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setImageFile(file);
        setPreview(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleIconChange = (url: string, index: number) => {
    setIconTypes((prevIconTypes) => {
      const newIconTypes = [...prevIconTypes];
      if (url.includes("github.com")) {
        newIconTypes[index] = <Github />;
      } else if (url.includes("linkedin.com")) {
        newIconTypes[index] = <Linkedin />;
      } else if (url.includes("tistory.com")) {
        newIconTypes[index] = <Tistory />;
      } else if (url.includes("notion.site")) {
        newIconTypes[index] = <Notion />;
      } else {
        newIconTypes[index] = <LinkIcon />;
      }
      return newIconTypes;
    });
  };

  if (!userProfile) {
    return <OnboardingSkeleton />;
  }

  return (
    <div className="relative min-h-full overflow-hidden bg-[#f5f7fb] text-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.1),_transparent_26%),radial-gradient(circle_at_85%_15%,_rgba(148,163,184,0.14),_transparent_24%),linear-gradient(180deg,_rgba(255,255,255,0.96),_rgba(245,247,251,0.98))]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[linear-gradient(rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <aside>
            <div className={cn(surfaceClass, "overflow-hidden p-6 sm:p-8")}>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
                <Sparkles className="h-4 w-4" />
                Resume setup
              </div>
              <h1 className="mt-5 text-4xl font-semibold leading-[1.06] tracking-[-0.05em] text-slate-950 sm:text-5xl">
                첫 이력서 초안을
                <br />
                만드는 기본 정보 입력
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
                메인 페이지와 커뮤니티에서 보던 같은 톤을 유지하면서, 입력은
                더 차분하고 밀도 있게 구성했습니다. 필수 정보부터 채우고 선택
                정보를 덧붙이면 다음 단계에서 더 완성도 높은 초안을 만들 수
                있습니다.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                {summaryItems.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[24px] border border-slate-200/80 bg-white/90 px-5 py-5"
                  >
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                      {item.label}
                    </div>
                    <div className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                      {item.value}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-[28px] border border-slate-200/80 bg-slate-950 px-5 py-5 text-white">
                <div className="flex items-center gap-3">
                  <Image
                    className="h-14 w-14 rounded-2xl border border-white/10 object-cover"
                    width={56}
                    height={56}
                    src={preview || userProfile.result.avatarUrl}
                    priority
                    alt="profile preview"
                  />
                  <div>
                    <div className="text-sm text-slate-300">
                      현재 프로필 프리뷰
                    </div>
                    <div className="mt-1 text-lg font-semibold">
                      {form.watch("name") ||
                        userProfile.result.name ||
                        "이름을 입력해주세요"}
                    </div>
                    <div className="mt-1 text-sm text-slate-400">
                      {form.watch("position")
                        ? positionTypeMap[
                            form.watch("position") as keyof typeof positionTypeMap
                          ]
                        : "직군을 선택하면 여기 반영됩니다."}
                    </div>
                  </div>
                </div>
                <div className="mt-5 space-y-3 text-sm text-slate-300">
                  {guideItems.map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-300" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className={cn(surfaceClass, "p-4 sm:p-6 lg:p-8")}>
            <div className="mb-8 rounded-[28px] border border-slate-200/80 bg-white/90 px-5 py-5 sm:px-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
                    Step 1 of 3
                  </div>
                  <div className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                    기본 프로필과 이력 재료를 정리합니다
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    필수 정보는 즉시 검증되고, 선택 정보는 작성할수록 생성
                    품질이 좋아집니다.
                  </p>
                </div>
                <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-3 lg:min-w-[360px]">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="text-slate-400">필수</div>
                    <div className="mt-1 font-semibold text-slate-950">
                      이름 · 이메일 · 연락처 · 직군
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="text-slate-400">선택</div>
                    <div className="mt-1 font-semibold text-slate-950">
                      경력 · 교육 · 자격증 · 링크
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="text-slate-400">다음 단계</div>
                    <div className="mt-1 font-semibold text-slate-950">
                      레포지토리 선택
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <section className={sectionClass}>
                  <SectionHeader
                    icon={<UserRound className="h-5 w-5" />}
                    step="Step 01"
                    title="기본 정보"
                    description="이름, 이메일, 연락처, 직군과 프로필 이미지는 이후 이력서 상단과 커뮤니티 카드에 직접 반영됩니다. 가장 먼저 정확하게 정리해주세요."
                    required
                  />

                  <div className="mt-6 grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
                    <div className="rounded-[26px] border border-slate-200/80 bg-slate-50/80 p-5">
                      <div className="group relative mx-auto h-[148px] w-[148px] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_60px_-42px_rgba(15,23,42,0.4)]">
                        <Image
                          className="h-full w-full object-cover"
                          width={148}
                          height={148}
                          src={preview || userProfile.result.avatarUrl}
                          priority
                          alt="profile_url"
                        />
                        <div className="absolute inset-0 bg-slate-950/0 transition group-hover:bg-slate-950/45" />
                        <button
                          type="button"
                          className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white opacity-0 transition group-hover:opacity-100"
                          onClick={() =>
                            document.getElementById("file-input")?.click()
                          }
                        >
                          이미지 업로드
                        </button>
                      </div>
                      <Input
                        id="file-input"
                        className="hidden"
                        type="file"
                        onChange={(e) => {
                          handleFileChange(e);
                        }}
                      />
                      <div className="mt-4 text-center text-sm leading-6 text-slate-500">
                        사각형 썸네일 기준으로 미리보기됩니다. 밝은 배경보다
                        인물 구분이 되는 이미지가 잘 어울립니다.
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>본명</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="홍길동"
                                className="h-12 rounded-2xl border-slate-200 bg-slate-50/60"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>이메일</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="name@example.com"
                                className="h-12 rounded-2xl border-slate-200 bg-slate-50/60"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>전화번호</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="01012345678"
                                className="h-12 rounded-2xl border-slate-200 bg-slate-50/60"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="position"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>직군</FormLabel>
                            <Select
                              name={field.name}
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50/60">
                                <SelectValue placeholder="선택" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(positionTypeMap).map(
                                  ([key, label]) => (
                                    <SelectItem key={key} value={key}>
                                      {label}
                                    </SelectItem>
                                  ),
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </section>

                <section className={sectionClass}>
                  <SectionHeader
                    icon={<BriefcaseBusiness className="h-5 w-5" />}
                    step="Step 02"
                    title="경력"
                    description="경력이 있다면 최신 경험부터 정리해주세요. 회사명과 직무, 기간만 명확해도 생성된 프로젝트 서술의 신뢰도가 올라갑니다."
                    action={
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-11 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          experiencesAppend({
                            companyName: "",
                            departmentName: "",
                            role: "",
                            workType: "",
                            employmentStatus: "",
                            startedAt: "",
                            endedAt: "",
                          });
                        }}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        경력 추가
                      </Button>
                    }
                  />

                  <div className="mt-6 space-y-4">
                    {experiencesFields.length === 0 ? (
                      <EmptyState description="아직 추가된 경력이 없습니다. 인턴, 계약직, 프리랜서 경험도 모두 포함할 수 있습니다." />
                    ) : null}
                    {experiencesFields.map((field, index) => (
                      <Card key={field.id} className={nestedCardClass}>
                        <CardHeader className="px-0 pb-5 pt-0">
                          <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <CardTitle className="text-lg font-semibold tracking-[-0.03em] text-slate-950">
                                경력 {String(index + 1).padStart(2, "0")}
                              </CardTitle>
                              <p className="mt-1 text-sm text-slate-500">
                                회사, 직무, 고용 형태와 기간을 입력합니다.
                              </p>
                            </div>
                            <ItemControls
                              index={index}
                              length={experiencesFields.length}
                              onMoveUp={() => {
                                if (index > 0) {
                                  experiencesMove(index, index - 1);
                                }
                              }}
                              onMoveDown={() => {
                                if (index < experiencesFields.length - 1) {
                                  experiencesMove(index, index + 1);
                                }
                              }}
                              onRemove={() => {
                                experiencesRemove(index);
                              }}
                            />
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4 px-0 pb-0">
                          <div className="grid gap-4 md:grid-cols-3">
                            <FormField
                              control={form.control}
                              name={`workExperiences.${index}.companyName`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>회사명</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="회사명"
                                      className="h-12 rounded-2xl border-slate-200 bg-white"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`workExperiences.${index}.role`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>직책</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="프론트엔드 개발자"
                                      className="h-12 rounded-2xl border-slate-200 bg-white"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`workExperiences.${index}.departmentName`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>부서명</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="프로덕트팀"
                                      className="h-12 rounded-2xl border-slate-200 bg-white"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
                            <div className="grid gap-4 sm:grid-cols-2">
                              <FormField
                                control={form.control}
                                name={`workExperiences.${index}.workType`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>근무 형태</FormLabel>
                                    <Select
                                      name={field.name}
                                      value={field.value}
                                      onValueChange={field.onChange}
                                    >
                                      <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-white">
                                        <SelectValue placeholder="선택" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="INTERN">인턴</SelectItem>
                                        <SelectItem value="CONTRACT_WORKER">
                                          계약직
                                        </SelectItem>
                                        <SelectItem value="FULL_TIME">
                                          정규직
                                        </SelectItem>
                                        <SelectItem value="PRIVATE_BUSINESS">
                                          개인사업
                                        </SelectItem>
                                        <SelectItem value="FREELANCER">
                                          프리랜서
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`workExperiences.${index}.employmentStatus`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>재직 여부</FormLabel>
                                    <Select
                                      name={field.name}
                                      value={field.value}
                                      onValueChange={field.onChange}
                                    >
                                      <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-white">
                                        <SelectValue placeholder="선택" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="EMPLOYMENT">
                                          재직중
                                        </SelectItem>
                                        <SelectItem value="RESIGNATION">
                                          퇴사
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="rounded-[22px] border border-slate-200 bg-white px-4 py-3">
                              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                                <CalendarRange className="h-4 w-4" />
                                근무 기간
                              </div>
                              <CustomMonthRangePicker
                                value={"workExperiences"}
                                form={form}
                                index={index}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>

                <section className={sectionClass}>
                  <SectionHeader
                    icon={<GraduationCap className="h-5 w-5" />}
                    step="Step 03"
                    title="교육"
                    description="학위, 부트캠프, 사설 교육 모두 작성할 수 있습니다. 졸업 상태와 기간을 함께 적어두면 커뮤니티 카드와 상세 이력서 문맥이 안정적으로 정리됩니다."
                    action={
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-11 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          educationAppend({
                            schoolType: "",
                            schoolName: "",
                            major: "",
                            graduationStatus: "",
                            startedAt: "",
                            endedAt: "",
                          });
                        }}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        교육 추가
                      </Button>
                    }
                  />

                  <div className="mt-6 space-y-4">
                    {educationFields.length === 0 ? (
                      <EmptyState description="아직 추가된 교육 정보가 없습니다. 대학, 대학원뿐 아니라 부트캠프와 사설 교육도 포함해두면 좋습니다." />
                    ) : null}
                    {educationFields.map((field, index) => (
                      <Card key={field.id} className={nestedCardClass}>
                        <CardHeader className="px-0 pb-5 pt-0">
                          <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <CardTitle className="text-lg font-semibold tracking-[-0.03em] text-slate-950">
                                교육 {String(index + 1).padStart(2, "0")}
                              </CardTitle>
                              <p className="mt-1 text-sm text-slate-500">
                                기관, 전공, 재학 상태와 기간을 입력합니다.
                              </p>
                            </div>
                            <ItemControls
                              index={index}
                              length={educationFields.length}
                              onMoveUp={() => {
                                if (index > 0) {
                                  educationMove(index, index - 1);
                                }
                              }}
                              onMoveDown={() => {
                                if (index < educationFields.length - 1) {
                                  educationMove(index, index + 1);
                                }
                              }}
                              onRemove={() => {
                                educationRemove(index);
                              }}
                            />
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4 px-0 pb-0">
                          <div className="grid gap-4 md:grid-cols-3">
                            <FormField
                              control={form.control}
                              name={`educations.${index}.schoolType`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>종류</FormLabel>
                                  <Select
                                    name={field.name}
                                    value={field.value}
                                    onValueChange={field.onChange}
                                  >
                                    <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-white">
                                      <SelectValue placeholder="선택" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="PRIVATE_EDUCATION">
                                        사설교육
                                      </SelectItem>
                                      <SelectItem value="HIGH_SCHOOL">
                                        고등학교
                                      </SelectItem>
                                      <SelectItem value="UNIVERSITY_ASSOCIATE_DEGREE">
                                        대학교(전문학사)
                                      </SelectItem>
                                      <SelectItem value="UNIVERSITY_BACHELOR">
                                        대학교(학사)
                                      </SelectItem>
                                      <SelectItem value="GRADUATE_SCHOOL_MASTER">
                                        대학원(석사)
                                      </SelectItem>
                                      <SelectItem value="GRADUATE_SCHOOL_DOCTOR">
                                        대학원(박사)
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`educations.${index}.schoolName`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>소속/기관</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="학교 또는 교육 기관"
                                      className="h-12 rounded-2xl border-slate-200 bg-white"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`educations.${index}.major`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>전공명/전공 계열</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="컴퓨터공학"
                                      className="h-12 rounded-2xl border-slate-200 bg-white"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
                            <FormField
                              control={form.control}
                              name={`educations.${index}.graduationStatus`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>재학 상태</FormLabel>
                                  <Select
                                    name={field.name}
                                    value={field.value}
                                    onValueChange={field.onChange}
                                  >
                                    <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-white">
                                      <SelectValue placeholder="선택" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="GRADUATED">
                                        졸업
                                      </SelectItem>
                                      <SelectItem value="ATTENDING">
                                        재학중
                                      </SelectItem>
                                      <SelectItem value="DROP_OUT">중퇴</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="rounded-[22px] border border-slate-200 bg-white px-4 py-3">
                              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                                <CalendarRange className="h-4 w-4" />
                                재학 기간
                              </div>
                              <CustomMonthRangePicker
                                value={"educations"}
                                form={form}
                                index={index}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>

                <section className={sectionClass}>
                  <SectionHeader
                    icon={<ShieldCheck className="h-5 w-5" />}
                    step="Step 04"
                    title="자격증"
                    description="자격증명, 등급이나 점수, 취득 시점, 발급 기관을 정리해두면 성과와 신뢰를 보여주는 보조 근거로 사용됩니다."
                    action={
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-11 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          certificationsAppend({
                            certificateName: "",
                            certificateGrade: "",
                            certificateOrganization: "",
                            certificatedAt: "",
                          });
                        }}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        자격증 추가
                      </Button>
                    }
                  />

                  <div className="mt-6 space-y-4">
                    {certificationsFields.length === 0 ? (
                      <EmptyState description="아직 추가된 자격증이 없습니다. 점수형 인증, 언어 시험, 실무 자격증까지 함께 넣을 수 있습니다." />
                    ) : null}
                    {certificationsFields.map((field, index) => (
                      <Card key={field.id} className={nestedCardClass}>
                        <CardHeader className="px-0 pb-5 pt-0">
                          <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <CardTitle className="text-lg font-semibold tracking-[-0.03em] text-slate-950">
                                자격증 {String(index + 1).padStart(2, "0")}
                              </CardTitle>
                              <p className="mt-1 text-sm text-slate-500">
                                이름, 취득월, 발급 기관 정보를 입력합니다.
                              </p>
                            </div>
                            <ItemControls
                              index={index}
                              length={certificationsFields.length}
                              onMoveUp={() => {
                                if (index > 0) {
                                  certificationsMove(index, index - 1);
                                }
                              }}
                              onMoveDown={() => {
                                if (index < certificationsFields.length - 1) {
                                  certificationsMove(index, index + 1);
                                }
                              }}
                              onRemove={() => {
                                certificationsRemove(index);
                              }}
                            />
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4 px-0 pb-0">
                          <FormField
                            control={form.control}
                            name={`certificates.${index}.certificateName`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>자격증명</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="정보처리기사"
                                    className="h-12 rounded-2xl border-slate-200 bg-white"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="grid gap-4 md:grid-cols-3">
                            <FormField
                              control={form.control}
                              name={`certificates.${index}.certificateGrade`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>점수/급</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="1급 또는 890점"
                                      className="h-12 rounded-2xl border-slate-200 bg-white"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`certificates.${index}.certificatedAt`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>취득월</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="month"
                                      {...field}
                                      className="h-12 rounded-2xl border-slate-200 bg-white text-center"
                                      placeholder="YYYY-MM"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`certificates.${index}.certificateOrganization`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>발급 기관</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="한국산업인력공단"
                                      className="h-12 rounded-2xl border-slate-200 bg-white"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>

                <section className={sectionClass}>
                  <SectionHeader
                    icon={<LinkIcon className="h-5 w-5" />}
                    step="Step 05"
                    title="링크"
                    description="깃허브, 노션, 링크드인, 블로그 링크를 추가할 수 있습니다. 입력한 URL에 따라 아이콘이 자동으로 바뀌며, 최종 이력서의 외부 링크 영역에 사용됩니다."
                    action={
                      <Button
                        type="button"
                        className="h-11 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          linksAppend({
                            linkUrl: "",
                            linkTitle: "",
                          });
                        }}
                      >
                        <CirclePlus className="mr-2 h-4 w-4" />
                        링크 추가
                      </Button>
                    }
                  />

                  <div className="mt-6 space-y-4">
                    {linksFields.length === 0 ? (
                      <EmptyState description="아직 추가된 링크가 없습니다. 포트폴리오, GitHub, 블로그, 노션 링크를 넣어두면 최종 결과물이 더 풍부해집니다." />
                    ) : null}
                    {linksFields.map((field, index) => (
                      <div
                        className="flex flex-col gap-3 rounded-[24px] border border-slate-200/80 bg-slate-50/70 p-4 md:flex-row md:items-stretch"
                        key={field.id}
                      >
                        <div className="flex min-w-0 flex-1 items-stretch rounded-[22px] border border-slate-200 bg-white">
                          <div className="flex w-16 shrink-0 items-center justify-center rounded-l-[22px] border-r border-slate-200 bg-slate-50 text-slate-600">
                            {iconTypes[index]}
                          </div>
                          <div className="grid min-w-0 flex-1 gap-2 p-3">
                            <FormField
                              control={form.control}
                              name={`links.${index}.linkUrl`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <input
                                      {...field}
                                      className="flex h-10 w-full rounded-xl border border-transparent bg-transparent px-3 text-sm text-slate-700 placeholder:text-slate-400 focus-visible:outline-none"
                                      placeholder="https://"
                                      onBlur={() =>
                                        handleIconChange(field.value!, index)
                                      }
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`links.${index}.linkTitle`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <input
                                      className="flex h-10 w-full rounded-xl border border-transparent bg-transparent px-3 text-base font-semibold text-slate-950 placeholder:font-semibold placeholder:text-slate-400 focus-visible:outline-none"
                                      {...field}
                                      placeholder="URL 제목을 입력해주세요."
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 self-end md:self-stretch">
                          <ItemControls
                            index={index}
                            length={linksFields.length}
                            onMoveUp={() => {
                              if (index > 0) {
                                linksMove(index, index - 1);
                              }
                            }}
                            onMoveDown={() => {
                              if (index < linksFields.length - 1) {
                                linksMove(index, index + 1);
                              }
                            }}
                            onRemove={() => {
                              linksRemove(index);
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="flex flex-col gap-4 rounded-[28px] border border-slate-200/80 bg-slate-950 px-5 py-5 text-white sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  <div>
                    <div className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-300">
                      Ready for next step
                    </div>
                    <div className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                      레포지토리 선택 단계로 이동합니다
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      저장 후 다음 화면에서 공개 레포를 고르고, 템플릿과
                      요청사항을 설정해 초안을 생성합니다.
                    </p>
                  </div>
                  <LoadingButton
                    loading={isPending}
                    className="h-12 rounded-full bg-white px-8 text-base font-semibold text-slate-950 hover:bg-slate-100"
                  >
                    다음
                  </LoadingButton>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
