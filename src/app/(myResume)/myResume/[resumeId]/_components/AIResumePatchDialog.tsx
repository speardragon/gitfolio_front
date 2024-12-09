import {
  ResumeDetail,
  useMyResumeDetailQuery,
} from "@/app/(home)/community/_hooks/useResumeQuery";
import { handleIconChange } from "@/app/_lib/util";
import {
  GraduationStatus,
  graduationStatusMap,
  PositionType,
  positionTypeMap,
  SchoolType,
  schoolTypeMap,
  WorkType,
  workTypeMap,
} from "@/app/types/type";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import Markdown from "react-markdown";
import { useMyResumePatchMutation } from "../hooks/useMyResumePatchMutation";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Props = {
  open: boolean;
  setOpen: (item: boolean) => void;
  // resumed: any;
  resume: ResumeDetail;
};

export default function AIResumePatchDialog({ open, setOpen, resume }: Props) {
  const handleSubmit = async () => {
    const formData = new FormData();

    const updateResumeRequestDTO = resume;

    formData.append(
      "updateResumeRequestDTO",
      new Blob([JSON.stringify(updateResumeRequestDTO)], {
        type: "application/json",
      }),
    );

    mutate({ data: formData });
  };

  const { mutate } = useMyResumePatchMutation(resume?.resumeId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="min-w-[60%] max-h-[600px] overflow-y-auto p-0">
        <DialogHeader className="relative flex flex-col items-center justify-center w-full p-2">
          <DialogTitle className="text-2xl text-gray-800">
            AI 수정 결과
          </DialogTitle>
          <DialogDescription>
            AI가 수정한 이력서 내용입니다. 아래 내용을 확인하세요.
          </DialogDescription>
          <div className="flex w-full justify-evenly">
            <Button
              onClick={() => setOpen(false)}
              className="text-red-500 bg-white border border-red-500 hover:bg-gray-100"
            >
              취소하기
            </Button>
            <Button
              onClick={() => {
                handleSubmit();
              }}
              className="bg-blue-500 hover:bg-blue-700"
            >
              변경하기
            </Button>
          </div>
        </DialogHeader>
        <div className="p-10 bg-gray-100">
          {resume ? (
            <div className="px-20 bg-white space-y-10 rounded-lg p-14 max-w-[982px] w-full">
              <div className="flex flex-row">
                <div className="flex flex-col flex-grow">
                  <div className="mb-4 text-3xl font-semibold">
                    {resume.memberName}
                  </div>
                  <div className="text-xl">
                    {positionTypeMap[resume.position as PositionType]} 개발자
                  </div>
                </div>
                <div className="relative w-[128px] h-[128px] md:w-[180px] md:h-[180px] border border-gray-100 rounded-lg">
                  <Image
                    src={resume.avatarUrl}
                    alt="프로필 이미지"
                    priority
                    fill
                    className="object-cover rounded-lg "
                  />
                </div>
              </div>

              {/* 자기소개 */}
              <Separator className="bg-black" />
              <div className="space-y-4">
                <div className="text-2xl font-semibold">자기소개</div>
                {/* <div className="whitespace-pre-line">{resume.result.aboutMe}</div> */}
                <Markdown className="prose break-words prose-p:leading-relaxed prose-pre:p-0">
                  {resume.aboutMe}
                </Markdown>
              </div>

              {/* 경력 */}
              {resume.workExperiences.length > 0 && (
                <>
                  <Separator className="bg-black" />
                  <div className="space-y-4">
                    <div className="text-2xl font-semibold">경력</div>
                    {resume.workExperiences.map((experience, index) => (
                      <div key={index}>
                        <div className="text-lg font-semibold">
                          {experience.companyName}
                        </div>
                        <div className="text-sm text-gray-400">
                          <div>
                            {experience.departmentName} | {experience.role} |{" "}
                            {workTypeMap[experience.workType as WorkType]}
                          </div>
                          <div>
                            {experience.startedAt} ~ {experience.endedAt}
                          </div>
                        </div>
                        {index < resume.workExperiences.length - 1 && (
                          <Separator className="my-4 bg-black" />
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
              {/* 프로젝트 */}
              {resume.projects.length > 0 && (
                <>
                  <Separator className="bg-black" />
                  <div className="space-y-4">
                    <div className="text-2xl font-semibold">프로젝트</div>
                    {resume.projects.map((project, index) => (
                      <div className="space-y-4" key={index}>
                        <div className="text-xl font-semibold">
                          {project.projectName}
                        </div>
                        <div className="text-sm text-gray-400">
                          <a
                            href={project.repoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {project.repoLink}
                          </a>
                          <div>
                            {project.projectStartedAt} ~{" "}
                            {project.projectEndedAt}
                          </div>
                          <div>{project.skillSet}</div>
                        </div>
                        <Markdown className="prose break-words prose-p:leading-relaxed prose-pre:p-0">
                          {project.projectDescription}
                        </Markdown>
                        {/* <div>{project.projectDescription}</div> */}
                        {index < resume.projects.length - 1 && (
                          <Separator className="my-4 bg-gray-300" />
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* 교육 */}
              {resume.educations.length > 0 && (
                <>
                  <Separator className="bg-black" />
                  <div className="space-y-4">
                    <div className="text-2xl font-semibold">교육</div>
                    {resume.educations.map((education, index) => (
                      <div className="space-y-4" key={index}>
                        <div className="text-xl font-semibold">
                          {education.schoolName}
                        </div>
                        <div className="text-sm text-gray-400">
                          <div>
                            {schoolTypeMap[education.schoolType as SchoolType]}{" "}
                            | {education.major}
                          </div>
                          <div>
                            {education.startedAt} ~ {education.endedAt} |{" "}
                            {
                              graduationStatusMap[
                                education.graduationStatus as GraduationStatus
                              ]
                            }
                          </div>
                        </div>
                        {index < resume.educations.length - 1 && (
                          <Separator className="my-4 bg-black" />
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* 자격증 */}
              {resume.certificates.length > 0 && (
                <>
                  <Separator className="bg-black" />
                  <div className="space-y-4">
                    <div className="text-2xl font-semibold">자격증</div>
                    {resume.certificates.map((certificate, index) => (
                      <div className="space-y-4" key={index}>
                        <div className="text-xl font-semibold">
                          {certificate.certificateName}
                        </div>
                        <div className="text-sm text-gray-400">
                          <div>
                            {certificate.certificateGrade} |{" "}
                            {certificate.certificateOrganization}
                          </div>
                          <div>{certificate.certificatedAt}</div>
                        </div>
                        {index < resume.certificates.length - 1 && (
                          <Separator className="my-4 bg-black" />
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* 기술스택 */}
              {resume.techStack.length > 0 && (
                <>
                  <Separator className="bg-black" />
                  <div className="space-y-4">
                    <div className="text-2xl font-semibold">기술스택</div>
                    <div>{resume.techStack.join(", ")}</div>
                  </div>
                </>
              )}

              {/* 개인 링크 */}
              {resume.links.length > 0 && (
                <>
                  <Separator className="bg-black" />
                  <div className="space-y-4">
                    <div className="text-2xl font-semibold">개인 링크</div>
                    {resume.links.map((link, index) => (
                      <a
                        key={index}
                        href={link.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center w-full p-2 space-x-2 border border-gray-400 rounded-md cursor-pointer bg-gray-50"
                      >
                        <div className="flex items-center justify-center p-4 border-r border-gray-200 aspect-square w-14 h-14">
                          {handleIconChange(link.linkUrl)}
                        </div>
                        <div className="flex flex-col flex-1 space-y-1">
                          <div className="text-sm font-semibold text-gray-600">
                            {link.linkUrl}
                          </div>
                          <div className="font-semibold">{link.linkTitle}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="text-gray-500">
              로딩 중이거나 데이터가 없습니다.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
