import { NextRequest, NextResponse } from "next/server";
import {
  createAvatarUrl,
  initialComments,
  initialNotifications,
  initialRepositories,
  initialResumeRecords,
  type Notification,
  type ResumeComment,
  type ResumeProject,
  type ResumeRecord,
  type TemplateType,
  type Visibility,
} from "./data";

type ApiSuccess<T> = {
  time: string;
  status: "OK";
  code: string;
  message: string;
  result: T;
};

type ApiError = {
  time: string;
  status: "ERROR";
  code: string;
  message: string;
  result: null;
};

type DelayRange = {
  min: number;
  max: number;
};

const DELAY = {
  fastRead: { min: 150, max: 300 },
  read: { min: 300, max: 600 },
  write: { min: 500, max: 900 },
  createResume: { min: 10000, max: 10000 },
  heavyWrite: { min: 1200, max: 2000 },
} satisfies Record<string, DelayRange>;

const now = () => new Date().toISOString();

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const randomBetween = ({ min, max }: DelayRange) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const delay = async (range: DelayRange) => {
  await new Promise((resolve) => setTimeout(resolve, randomBetween(range)));
};

const json = <T,>(body: T, status = 200) =>
  NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });

const ok = <T,>(result: T, message = "성공") =>
  json<ApiSuccess<T>>({
    time: now(),
    status: "OK",
    code: "200",
    message,
    result,
  });

const error = (status: number, code: string, message: string) =>
  json<ApiError>(
    {
      time: now(),
      status: "ERROR",
      code,
      message,
      result: null,
    },
    status,
  );

const paginate = <T,>(items: T[], page: number, size: number) => ({
  currentPage: page,
  totalPages: Math.max(1, Math.ceil(items.length / size)),
  totalElements: items.length,
  size,
  content: items.slice(page * size, page * size + size),
});

const toResumeCard = (resume: ResumeRecord) => ({
  resumeId: resume.resumeId,
  memberId: resume.memberId,
  avatarUrl: resume.avatarUrl,
  position: resume.position,
  aboutMe: resume.aboutMe,
  tags: resume.tags,
  likeCount: resume.likeCount,
  viewCount: resume.viewCount,
  liked: resume.isLiked,
  isLiked: resume.isLiked,
  visibility: resume.visibility,
  updatedAt: resume.updatedAt,
});

const sortResumes = (items: ResumeRecord[], sortOrder: string) => {
  const sorted = [...items];

  if (sortOrder === "like") {
    return sorted.sort((a, b) => b.likeCount - a.likeCount);
  }

  if (sortOrder === "view") {
    return sorted.sort((a, b) => b.viewCount - a.viewCount);
  }

  if (sortOrder === "recent") {
    return sorted.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }

  return sorted.sort((a, b) => b.viewCount - a.viewCount);
};

const filterResumes = (request: NextRequest) => {
  const position = request.nextUrl.searchParams.get("position") ?? "";
  const techStack = (request.nextUrl.searchParams.get("techStack") ?? "")
    .trim()
    .toLowerCase();
  const schoolType = request.nextUrl.searchParams.get("schoolType") ?? "";
  const sortOrder = request.nextUrl.searchParams.get("sortOrder") ?? "";
  const liked = request.nextUrl.searchParams.get("liked") ?? "false";

  let filtered = initialResumeRecords.filter(
    (resume) => resume.visibility === "PUBLIC",
  );

  if (position) {
    filtered = filtered.filter((resume) => resume.position === position);
  }

  if (schoolType) {
    filtered = filtered.filter((resume) =>
      resume.educations.some((education) => education.schoolType === schoolType),
    );
  }

  if (techStack) {
    filtered = filtered.filter((resume) =>
      resume.techStack.some((stack) => stack.toLowerCase().includes(techStack)),
    );
  }

  if (liked === "true") {
    filtered = filtered.filter((resume) => resume.isLiked);
  }

  return sortResumes(filtered, sortOrder);
};

const getResumeById = (resumeId: string) =>
  initialResumeRecords.find((resume) => resume.resumeId === resumeId);

const getCurrentUserProfile = () => {
  const myResume =
    initialResumeRecords.find(
      (resume) => resume.memberId === 1 && resume.visibility === "PUBLIC",
    ) ?? initialResumeRecords.find((resume) => resume.memberId === 1);

  if (!myResume) {
    return {
      memberId: 1,
      memberAdditionalInfoId: "member-info-1",
      nickname: "창룡",
      name: "강창룡",
      username: "speardragon",
      avatarUrl: createAvatarUrl(1),
      phoneNumber: "010-1234-5678",
      email: "speardragon@example.com",
      position: "FRONTEND",
      workExperiences: [],
      educations: [],
      certificates: [],
      activities: [],
      links: [],
      paidPlan: "PRO",
      remainingCount: 12,
    };
  }

  return {
    memberId: 1,
    memberAdditionalInfoId: "member-info-1",
    nickname: "창룡",
    name: myResume.memberName,
    username: myResume.username,
    avatarUrl: myResume.avatarUrl,
    phoneNumber: myResume.phoneNumber,
    email: myResume.email,
    position: myResume.position,
    workExperiences: clone(myResume.workExperiences),
    educations: clone(myResume.educations),
    certificates: clone(myResume.certificates),
    activities: clone(myResume.activities),
    links: clone(myResume.links),
    paidPlan: "PRO",
    remainingCount: 12,
  };
};

const normalizeProject = (
  project: any,
  template: TemplateType,
): ResumeProject => {
  const troubleShooting = project?.troubleShooting
    ? {
        problem: project.troubleShooting.problem ?? "",
        hypothesis: project.troubleShooting.hypothesis ?? "",
        try: project.troubleShooting.try ?? project.troubleShooting.tring ?? "",
        tring:
          project.troubleShooting.tring ?? project.troubleShooting.try ?? "",
        result: project.troubleShooting.result ?? "",
      }
    : undefined;

  return {
    template,
    projectName: project?.projectName ?? "",
    projectStartedAt: project?.projectStartedAt ?? "",
    projectEndedAt: project?.projectEndedAt ?? "",
    skillSet: project?.skillSet ?? "",
    repoLink: project?.repoLink ?? "",
    roleAndTask: Array.isArray(project?.roleAndTask) ? project.roleAndTask : [],
    projectDescription: project?.projectDescription ?? "",
    star: project?.star,
    troubleShooting,
  };
};

const mergeResumeRecord = (current: ResumeRecord, next: any): ResumeRecord => {
  const nextTemplate =
    typeof next?.template === "string"
      ? (next.template.toUpperCase() as TemplateType)
      : current.template;

  return {
    ...current,
    aboutMe: typeof next?.aboutMe === "string" ? next.aboutMe : current.aboutMe,
    techStack: Array.isArray(next?.techStack) ? next.techStack : current.techStack,
    tags: Array.isArray(next?.tags) ? next.tags : current.tags,
    workExperiences: Array.isArray(next?.workExperiences)
      ? next.workExperiences
      : current.workExperiences,
    educations: Array.isArray(next?.educations)
      ? next.educations
      : current.educations,
    certificates: Array.isArray(next?.certificates)
      ? next.certificates
      : current.certificates,
    activities: Array.isArray(next?.activities)
      ? next.activities
      : current.activities,
    links: Array.isArray(next?.links) ? next.links : current.links,
    projects: Array.isArray(next?.projects)
      ? next.projects.map((project: any) => normalizeProject(project, nextTemplate))
      : current.projects,
    template: nextTemplate,
    visibility:
      next?.visibility === "PUBLIC" || next?.visibility === "PRIVATE"
        ? next.visibility
        : current.visibility,
    updatedAt: now(),
  };
};

const buildAiUpdatedResume = (
  resume: ResumeRecord,
  payload: { selectedText?: string; requirement?: string } | null,
) => {
  const selectedText = payload?.selectedText?.trim();
  const requirement = payload?.requirement?.trim();

  const revisedAboutMe = selectedText
    ? resume.aboutMe.replace(
        selectedText,
        `${selectedText}\n\n- AI 개선 포인트: ${requirement || "성과 중심으로 문장을 보강했습니다."}`,
      )
    : `${resume.aboutMe}\n\n- AI 개선 포인트: ${
        requirement || "핵심 문장을 더 구체적인 결과 중심 서술로 다듬었습니다."
      }`;

  const [firstProject, ...restProjects] = resume.projects;

  return {
    ...clone(resume),
    aboutMe: revisedAboutMe,
    projects: firstProject
      ? [
          {
            ...firstProject,
            roleAndTask: [
              ...firstProject.roleAndTask,
              `AI 제안 반영: ${
                requirement ||
                "핵심 성과 문장을 구체적인 수치와 맥락으로 보완했습니다."
              }`,
            ],
          },
          ...restProjects,
        ]
      : clone(resume.projects),
    updatedAt: now(),
  };
};

const createMockComment = (resumeId: string, content: string): ResumeComment => ({
  id: initialComments.length + 1,
  resumeId,
  memberId: 1,
  nickname: "강창룡",
  avatarUrl: createAvatarUrl(1),
  content: content.trim() || "좋은 이력서네요!",
  createdAt: now(),
  updatedAt: now(),
});

const sortedNotifications = (notifications: Notification[]) =>
  [...notifications].sort((a, b) => Number(a.isRead) - Number(b.isRead));

const parseJsonSafely = async <T,>(request: NextRequest): Promise<T | null> => {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
};

const parseResumeFormData = async (request: NextRequest) => {
  try {
    const formData = await request.formData();
    const payload = formData.get("updateResumeRequestDTO");

    if (typeof payload === "string") {
      return JSON.parse(payload);
    }

    if (payload instanceof Blob) {
      return JSON.parse(await payload.text());
    }
  } catch {
    return null;
  }

  return null;
};

const isPath = (segments: string[], ...target: string[]) =>
  segments.length === target.length &&
  target.every((part, index) => segments[index] === part);

const isResumeResource = (segments: string[], suffix: string) =>
  segments.length === 3 && segments[0] === "resumes" && segments[2] === suffix;

const isNestedResumeResource = (segments: string[], ...suffix: string[]) =>
  segments.length === 2 + suffix.length &&
  segments[0] === "resumes" &&
  suffix.every((part, index) => segments[index + 2] === part);

const withDelay = async (
  range: DelayRange,
  action: () => Promise<NextResponse> | NextResponse,
) => {
  await delay(range);
  return action();
};

export async function handleMockApi(
  request: NextRequest,
  segments: string[],
) {
  const method = request.method.toUpperCase();

  if (segments.length === 0) {
    return error(404, "NOT_FOUND", "요청한 API를 찾을 수 없습니다.");
  }

  if (isPath(segments, "auth", "reissue") && method === "POST") {
    return withDelay(DELAY.fastRead, () =>
      ok({ accessToken: "mock-access-token" }, "토큰 재발급 성공"),
    );
  }

  if (isPath(segments, "auth", "logout") && method === "POST") {
    return withDelay(DELAY.write, () => ok(null, "로그아웃 성공"));
  }

  if (isPath(segments, "members", "me")) {
    if (method === "GET") {
      return withDelay(DELAY.read, () => ok(getCurrentUserProfile()));
    }

    if (method === "PUT") {
      return withDelay(DELAY.write, async () => {
        const payload = await parseResumeFormData(request);
        const currentProfile = getCurrentUserProfile();
        const nextProfile = payload
          ? {
              ...currentProfile,
              ...payload,
              workExperiences:
                payload.workExperiences ?? currentProfile.workExperiences,
              educations: payload.educations ?? currentProfile.educations,
              certificates: payload.certificates ?? currentProfile.certificates,
              activities: payload.activities ?? currentProfile.activities,
              links: payload.links ?? currentProfile.links,
            }
          : currentProfile;

        return ok(nextProfile, "회원 정보 수정 성공");
      });
    }

    if (method === "DELETE") {
      return withDelay(DELAY.write, () => ok(null, "회원 탈퇴 성공"));
    }
  }

  if (isPath(segments, "members", "myRepo") && method === "GET") {
    return withDelay(DELAY.read, () => ok(clone(initialRepositories)));
  }

  if (isPath(segments, "resumes") && method === "GET") {
    return withDelay(DELAY.read, () => {
      const page = Number(request.nextUrl.searchParams.get("page") ?? 0);
      const size = Number(request.nextUrl.searchParams.get("size") ?? 10);
      const filtered = filterResumes(request).map(toResumeCard);
      return ok(paginate(filtered, page, size));
    });
  }

  if (isPath(segments, "resumes") && method === "POST") {
    return withDelay(DELAY.createResume, () =>
      ok("mine-1", "이력서 생성 성공"),
    );
  }

  if (isPath(segments, "resumes", "me") && method === "GET") {
    return withDelay(DELAY.read, () => {
      const page = Number(request.nextUrl.searchParams.get("page") ?? 0);
      const size = Number(request.nextUrl.searchParams.get("size") ?? 6);
      const mine = initialResumeRecords
        .filter((resume) => resume.memberId === 1)
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        )
        .map(toResumeCard);

      return ok(paginate(mine, page, size));
    });
  }

  if (isResumeResource(segments, "community") && method === "GET") {
    return withDelay(DELAY.read, () => {
      const resume = getResumeById(segments[1]);

      if (!resume) {
        return error(404, "RESUME_NOT_FOUND", "이력서를 찾을 수 없습니다.");
      }

      if (resume.visibility !== "PUBLIC") {
        return error(403, "FORBIDDEN", "비공개 이력서입니다.");
      }

      return ok(clone(resume));
    });
  }

  if (isResumeResource(segments, "myResume") && method === "GET") {
    return withDelay(DELAY.read, () => {
      const resume = getResumeById(segments[1]);

      if (!resume || resume.memberId !== 1) {
        return error(404, "RESUME_NOT_FOUND", "내 이력서를 찾을 수 없습니다.");
      }

      return ok(clone(resume));
    });
  }

  if (isNestedResumeResource(segments, "visibility") && method === "PATCH") {
    return withDelay(DELAY.write, async () => {
      const current = getResumeById(segments[1]);
      const payload = await parseJsonSafely<{ visibility?: Visibility }>(request);
      const visibility =
        payload?.visibility === "PRIVATE" ? "PRIVATE" : "PUBLIC";

      return ok(
        {
          visibility,
          resumeId: segments[1],
          previousVisibility: current?.visibility ?? "PUBLIC",
        },
        "공개 여부 변경 성공",
      );
    });
  }

  if (isNestedResumeResource(segments, "likes") && method === "POST") {
    return withDelay(DELAY.write, () => {
      const current = getResumeById(segments[1]);

      if (!current) {
        return error(404, "RESUME_NOT_FOUND", "이력서를 찾을 수 없습니다.");
      }

      const liked = !current.isLiked;
      const likeCount = current.likeCount + (liked ? 1 : -1);

      return ok(
        { resumeId: segments[1], liked, likeCount },
        liked ? "좋아요 성공" : "좋아요 취소 성공",
      );
    });
  }

  if (isNestedResumeResource(segments, "comments")) {
    const resumeId = segments[1];

    if (method === "GET") {
      return withDelay(DELAY.read, () =>
        ok(
          initialComments
            .filter((comment) => comment.resumeId === resumeId)
            .sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime(),
            ),
        ),
      );
    }

    if (method === "POST") {
      return withDelay(DELAY.write, async () => {
        const body = await parseJsonSafely<{
          data?: { content?: string };
          content?: string;
        }>(request);
        const content = body?.data?.content ?? body?.content ?? "";
        return ok(createMockComment(resumeId, content), "댓글 생성 성공");
      });
    }
  }

  if (
    segments.length === 3 &&
    segments[0] === "resumes" &&
    segments[1] === "comments" &&
    method === "DELETE"
  ) {
    return withDelay(DELAY.write, () => ok(null, "댓글 삭제 성공"));
  }

  if (segments.length === 2 && segments[0] === "resumes") {
    const resumeId = segments[1];
    const resume = getResumeById(resumeId);

    if (method === "POST") {
      return withDelay(DELAY.heavyWrite, async () => {
        if (!resume) {
          return error(404, "RESUME_NOT_FOUND", "이력서를 찾을 수 없습니다.");
        }

        const payload = await parseJsonSafely<{
          selectedText?: string;
          requirement?: string;
        }>(request);

        return ok(buildAiUpdatedResume(resume, payload), "AI 수정 성공");
      });
    }

    if (method === "PUT") {
      return withDelay(DELAY.write, async () => {
        if (!resume) {
          return error(404, "RESUME_NOT_FOUND", "이력서를 찾을 수 없습니다.");
        }

        const payload = await parseResumeFormData(request);
        return ok(
          clone(mergeResumeRecord(resume, payload ?? {})),
          "이력서 수정 성공",
        );
      });
    }

    if (method === "DELETE") {
      return withDelay(DELAY.write, () => ok(null, "이력서 삭제 성공"));
    }
  }

  if (isPath(segments, "notifications", "me") && method === "GET") {
    return withDelay(DELAY.fastRead, () =>
      ok(sortedNotifications(clone(initialNotifications))),
    );
  }

  if (segments.length === 2 && segments[0] === "notifications") {
    if (method === "GET" || method === "PATCH") {
      return withDelay(DELAY.write, () => ok(null, "알림 읽음 처리 성공"));
    }
  }

  if (isPath(segments, "payments", "ready") && method === "POST") {
    return withDelay(DELAY.write, () =>
      ok(
        {
          tid: "mock-tid",
          next_redirect_app_url: "/plan?mockPayment=done",
          next_redirect_mobile_url: "/plan?mockPayment=done",
          next_redirect_pc_url: "/plan?mockPayment=done",
          android_app_scheme: "",
          ios_app_scheme: "",
          created_at: now(),
        },
        "결제 준비 성공",
      ),
    );
  }

  if (isPath(segments, "payments", "terminate")) {
    if (method === "POST" || method === "PATCH") {
      return withDelay(DELAY.write, () => ok(null, "구독 해지 성공"));
    }
  }

  return error(404, "NOT_FOUND", "요청한 API를 찾을 수 없습니다.");
}
