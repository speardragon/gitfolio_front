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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { repositories } from "./dummy";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export default function Page() {
  const [repoList, setRepoList] = useState(repositories);

  const FormSchema = z.object({
    fullName: z.string().optional(),
    email: z.string().optional(),
    phoneNumber: z.string().optional(),
    appliedPosition: z.string().optional(),
    profile_url: z.string().optional().default("default_profile_image_url"), // 프로필 사진 기본값 설정

    experiences: z
      .array(
        z.object({
          companyName: z.string().optional(),
          position: z.string().optional(),
          department: z.string().optional(),
          employmentType: z.string().optional(),
          isCurrent: z.boolean().optional(),
          employmentPeriod: z.string().optional(),
        })
      )
      .optional(),

    education: z
      .array(
        z.object({
          type: z.string().optional(),
          institution: z.string().optional(),
          major: z.string().optional(),
          enrollmentStatus: z.boolean().optional(),
          enrollmentPeriod: z.string().optional(),
        })
      )
      .optional(),

    links: z
      .array(
        z.object({
          url: z.string().url().optional(),
          title: z.string().optional(),
        })
      )
      .optional(),

    certifications: z
      .array(
        z.object({
          certificationName: z.string().optional(),
          gradeOrScore: z.string().optional(),
          issuingInstitution: z.string().optional(),
          certificationPeriod: z.string().optional(),
        })
      )
      .optional(),

    githubRepositories: z
      .array(
        z.object({
          repositoryName: z.string().optional(),
          language: z.string().optional(),
          isPrivate: z.boolean().optional(),
          lastCommitDate: z.string().optional(),
        })
      )
      .optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      profile_url: "default_profile_image_url",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast.message("You submitted the following values:", {
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">GITFOLIO</h1>
      </header>
      <div className="space-y-6 max-w-3xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name={`experiences`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-bold">
                    강의 제목 <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      {...form.register(`lectures.${index}.title`)}
                      // onChange={handleFileChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center justify-between">
                  경력
                  <Button variant="ghost" size="sm">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    추가
                  </Button>
                </CardTitle>
                <Separator className="bg-black" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input placeholder="회사명" />
                  <div className="grid grid-cols-3 gap-4">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="근무 형태" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">정규직</SelectItem>
                        <SelectItem value="part-time">계약직</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="재직 여부" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="current">재직중</SelectItem>
                        <SelectItem value="previous">퇴사</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input type="text" placeholder="YYYY.MM - YYYY.MM" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center justify-between">
                  교육
                  <Button variant="ghost" size="sm">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    추가
                  </Button>
                </CardTitle>
                <Separator className="bg-black" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input placeholder="학교" />
                  <div className="grid grid-cols-3 gap-4">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="학위/전공" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bachelor">학사</SelectItem>
                        <SelectItem value="master">석사</SelectItem>
                        <SelectItem value="phd">박사</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input type="text" placeholder="전공명을 입력하세요" />
                    <Input type="text" placeholder="YYYY.MM - YYYY.MM" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">링크</CardTitle>
                <Separator className="bg-black" />
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full justify-start">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  링크 추가
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center justify-between">
                  자격증
                  <Button variant="ghost" size="sm">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    추가
                  </Button>
                </CardTitle>
                <Separator className="bg-black" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input placeholder="자격증명" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input type="text" placeholder="발행 기관" />
                    <Input type="text" placeholder="취득 기간" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">
                  깃허브 레파지토리
                </CardTitle>
                <Separator className="bg-black" />
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 h-24 rounded-md flex items-center justify-center text-gray-500">
                  GitHub 레파지토리 연동 영역
                </div>
              </CardContent>
            </Card>
            <FormField
              control={form.control}
              name="items"
              render={({ field }) => (
                <>
                  {/* 모두 선택 버튼 추가 */}
                  <FormItem className="cursor-pointer hover:bg-orange-50">
                    <div className="flex flex-row items-center w-full space-x-3">
                      <FormControl>
                        <Checkbox
                          checked={false}
                          onCheckedChange={(checked) => {
                            return !checked;
                          }}
                        />
                      </FormControl>
                      <FormLabel className="flex w-full h-full p-2 space-x-3 text-sm font-normal">
                        모두 선택
                      </FormLabel>
                    </div>
                  </FormItem>
                  {/* 개별 책 항목 */}
                  {repoList.map((item, index) => (
                    <FormItem
                      key={index}
                      className="cursor-pointer hover:bg-orange-50"
                    >
                      <div className="flex flex-row items-center w-full space-x-3">
                        <FormControl>
                          <Checkbox
                            checked={false}
                            onCheckedChange={(checked) => {
                              return !checked;
                            }}
                          />
                        </FormControl>
                        <FormLabel className="flex w-full h-full p-2 space-x-3 text-sm font-normal">
                          {/* <Image
                            alt="Book cover"
                            className="object-cover w-10 h-15 aspect-[40/60]"
                            height="60"
                            src={item.titleUrl || "/images/logo.png"}
                            width="40"
                            style={{ width: "auto", height: "100%" }}
                          /> */}
                          <div className="flex flex-col justify-center space-y-1">
                            sdf
                          </div>
                        </FormLabel>
                      </div>
                    </FormItem>
                  ))}
                </>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>

        <div className="flex justify-end">
          <Button className="px-8">이력서 만들러 가기</Button>
        </div>
      </div>
    </div>
  );
}
