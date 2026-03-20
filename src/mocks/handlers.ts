import { http, HttpResponse } from "msw";
import {
  createAvatarUrl,
  createResumeRecord,
  initialComments,
  initialNotifications,
  initialRepositories,
  initialResumeRecords,
  type ResumeComment,
  type ResumeProject,
  type ResumeRecord,
  type TemplateType,
  type Visibility,
} from "./data";

const now = () => new Date().toISOString();

const ok = <T,>(result: T, message = "성공") =>
  HttpResponse.json({
    time: now(),
    status: "OK",
    code: "200",
    message,
    result,
  });

const error = (status: number, code: string, message: string) =>
  HttpResponse.json(
    {
      time: now(),
      status: "ERROR",
      code,
      message,
      result: null,
    },
    { status },
  );

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

let resumeRecords = clone(initialResumeRecords);
let repositories = clone(initialRepositories);
let comments = clone(initialComments);
let notifications = clone(initialNotifications);

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

const getResumeById = (resumeId: string) =>
  resumeRecords.find((resume) => resume.resumeId === resumeId);

const getCurrentUserProfile = () => {
  const myResume =
    resumeRecords.find(
      (resume) => resume.memberId === 1 && resume.visibility === "PUBLIC",
    ) ?? resumeRecords.find((resume) => resume.memberId === 1);

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

const sortResumes = (items: ResumeRecord[], sortOrder: string) => {
  const sorted = [...items];

  if (sortOrder === "like") {
    sorted.sort((a, b) => b.likeCount - a.likeCount);
    return sorted;
  }

  if (sortOrder === "view") {
    sorted.sort((a, b) => b.viewCount - a.viewCount);
    return sorted;
  }

  if (sortOrder === "recent") {
    sorted.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
    return sorted;
  }

  return sorted.sort((a, b) => b.viewCount - a.viewCount);
};

const filterResumes = (request: Request) => {
  const url = new URL(request.url);
  const position = url.searchParams.get("position") ?? "";
  const techStack = (url.searchParams.get("techStack") ?? "")
    .trim()
    .toLowerCase();
  const schoolType = url.searchParams.get("schoolType") ?? "";
  const sortOrder = url.searchParams.get("sortOrder") ?? "";
  const liked = url.searchParams.get("liked") ?? "false";

  let filtered = resumeRecords.filter((resume) => resume.visibility === "PUBLIC");

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

const normalizeProject = (project: any, template: TemplateType): ResumeProject => {
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
    educations: Array.isArray(next?.educations) ? next.educations : current.educations,
    certificates: Array.isArray(next?.certificates)
      ? next.certificates
      : current.certificates,
    activities: Array.isArray(next?.activities) ? next.activities : current.activities,
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

const parseJsonSafely = async <T,>(request: Request): Promise<T | null> => {
  try {
    return (await request.clone().json()) as T;
  } catch {
    return null;
  }
};

const parseResumeFormData = async (request: Request) => {
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

const markNotificationAsRead = (notificationId: string) => {
  notifications = notifications.map((notification) =>
    String(notification.notificationId) === notificationId
      ? { ...notification, isRead: true }
      : notification,
  );
};

export const handlers = [
  http.get("https://api.example.com/user", () =>
    HttpResponse.json({
      id: "abc-123",
      firstName: "John",
      lastName: "Maverick",
    }),
  ),

  http.post("/api/auth/reissue", () => ok({ accessToken: "mock-access-token" })),
  http.post("/api/auth/logout", () => ok(null, "로그아웃 성공")),

  http.get("/api/members/me", () => ok(getCurrentUserProfile())),
  http.put("/api/members/me", () => ok(getCurrentUserProfile(), "회원 정보 수정 성공")),
  http.delete("/api/members/me", () => ok(null, "회원 탈퇴 성공")),
  http.get("/api/members/myRepo", () => ok(repositories)),

  http.get("/api/resumes", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? 0);
    const size = Number(url.searchParams.get("size") ?? 10);
    const filtered = filterResumes(request).map(toResumeCard);
    return ok(paginate(filtered, page, size));
  }),

  http.post("/api/resumes", async ({ request }) => {
    await new Promise((resolve) => setTimeout(resolve, 20000));

    const payload = await parseJsonSafely<{
      selectedRepo?: string[];
      requirements?: string;
      visibility?: string;
    }>(request);

    const nextId = `mine-${
      resumeRecords.filter((resume) => resume.memberId === 1).length + 1
    }`;
    const firstRepo = payload?.selectedRepo?.[0] ?? "new-resume";
    const nextRecord = createResumeRecord({
      resumeId: nextId,
      memberId: 1,
      memberName: "강창룡",
      username: "speardragon",
      position: "FRONTEND",
      schoolType: "UNIVERSITY_BACHELOR",
      template: "BASIC",
      visibility: payload?.visibility === "PRIVATE" ? "PRIVATE" : "PUBLIC",
      tags: ["신규", "TypeScript", "프로젝트"],
      techStack: ["Next.js", "TypeScript", "React Query"],
      aboutMe:
        payload?.requirements?.trim() ||
        "새로운 프로젝트 요구사항을 바탕으로 생성한 이력서입니다.",
      likeCount: 0,
      viewCount: 0,
      isLiked: false,
      updatedAt: now(),
      companyName: "구름",
      departmentName: "AIDT Squad",
      role: "프론트엔드 엔지니어",
      workType: "FULL_TIME",
      employmentStatus: "재직중",
      workStartedAt: "2025-02-01",
      workEndedAt: null,
      schoolName: "한빛대학교",
      major: "컴퓨터공학",
      educationStartedAt: "2018-03-01",
      educationEndedAt: "2024-02-20",
      projectName: `${firstRepo} 기반 신규 이력서`,
      projectDescription:
        "선택한 저장소와 요구사항을 바탕으로 생성한 신규 이력서 초안입니다.",
      projectStartedAt: "2026-03-01",
      projectEndedAt: "2026-03-19",
      repoName: firstRepo,
      roleAndTask: [
        "선택한 저장소의 핵심 기능을 이력서 프로젝트 문장으로 정리했습니다.",
        "요구사항에 맞춰 자기소개와 프로젝트 성과 문장을 조합했습니다.",
      ],
      situation:
        "백엔드 없이도 포트폴리오 화면을 검증할 수 있는 더미 데이터가 필요했습니다.",
      task: "실제처럼 보이면서도 수정 가능한 초안을 빠르게 생성해야 했습니다.",
      action: "선택 저장소와 요구사항을 기반으로 기본 이력서 구조를 만들었습니다.",
      result: "즉시 편집 가능한 신규 이력서가 생성되었습니다.",
      activityName: "포트폴리오 실험",
      activityYear: 2026,
      activityDescription: "신규 이력서 생성을 위한 실험 데이터를 구성했습니다.",
      activityOrganization: "개인 프로젝트",
    });

    resumeRecords = [nextRecord, ...resumeRecords];
    return ok(nextId, "이력서 생성 성공");
  }),

  http.get("/api/resumes/me", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? 0);
    const size = Number(url.searchParams.get("size") ?? 6);
    const mine = resumeRecords
      .filter((resume) => resume.memberId === 1)
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )
      .map(toResumeCard);

    return ok(paginate(mine, page, size));
  }),

  http.get("/api/resumes/:resumeId/community", ({ params }) => {
    const resume = getResumeById(String(params.resumeId));

    if (!resume) {
      return error(404, "RESUME_NOT_FOUND", "이력서를 찾을 수 없습니다.");
    }

    if (resume.visibility !== "PUBLIC") {
      return error(403, "FORBIDDEN", "비공개 이력서입니다.");
    }

    return ok(clone(resume));
  }),

  http.get("/api/resumes/:resumeId/myResume", ({ params }) => {
    const resume = getResumeById(String(params.resumeId));

    if (!resume || resume.memberId !== 1) {
      return error(404, "RESUME_NOT_FOUND", "내 이력서를 찾을 수 없습니다.");
    }

    return ok(clone(resume));
  }),

  http.post("/api/resumes/:resumeId", async ({ request, params }) => {
    const resume = getResumeById(String(params.resumeId));

    if (!resume) {
      return error(404, "RESUME_NOT_FOUND", "이력서를 찾을 수 없습니다.");
    }

    const payload = await parseJsonSafely<{
      selectedText?: string;
      requirement?: string;
    }>(request);

    return ok(buildAiUpdatedResume(resume, payload), "AI 수정 성공");
  }),

  http.put("/api/resumes/:resumeId", async ({ request, params }) => {
    const resumeId = String(params.resumeId);
    const current = getResumeById(resumeId);

    if (!current) {
      return error(404, "RESUME_NOT_FOUND", "이력서를 찾을 수 없습니다.");
    }

    const payload = await parseResumeFormData(request);
    const updated = mergeResumeRecord(current, payload ?? {});

    resumeRecords = resumeRecords.map((resume) =>
      resume.resumeId === resumeId ? updated : resume,
    );

    return ok(clone(updated), "이력서 수정 성공");
  }),

  http.delete("/api/resumes/:resumeId", ({ params }) => {
    const resumeId = String(params.resumeId);

    resumeRecords = resumeRecords.filter((resume) => resume.resumeId !== resumeId);
    comments = comments.filter((comment) => comment.resumeId !== resumeId);
    notifications = notifications.filter(
      (notification) => notification.resumeId !== resumeId,
    );

    return ok(null, "이력서 삭제 성공");
  }),

  http.patch("/api/resumes/:resumeId/visibility", async ({ request, params }) => {
    const resumeId = String(params.resumeId);
    const current = getResumeById(resumeId);

    if (!current) {
      return error(404, "RESUME_NOT_FOUND", "이력서를 찾을 수 없습니다.");
    }

    const payload = await parseJsonSafely<{ visibility?: Visibility }>(request);
    const visibility = payload?.visibility === "PRIVATE" ? "PRIVATE" : "PUBLIC";

    const updated: ResumeRecord = {
      ...current,
      visibility,
      updatedAt: now(),
    };

    resumeRecords = resumeRecords.map((resume) =>
      resume.resumeId === resumeId ? updated : resume,
    );

    return ok({ visibility }, "공개 여부 변경 성공");
  }),

  http.post("/api/resumes/:resumeId/likes", ({ params }) => {
    const resumeId = String(params.resumeId);
    const current = getResumeById(resumeId);

    if (!current) {
      return error(404, "RESUME_NOT_FOUND", "이력서를 찾을 수 없습니다.");
    }

    const nextLiked = !current.isLiked;
    const updated = {
      ...current,
      isLiked: nextLiked,
      liked: nextLiked,
      likeCount: current.likeCount + (nextLiked ? 1 : -1),
      updatedAt: now(),
    };

    resumeRecords = resumeRecords.map((resume) =>
      resume.resumeId === resumeId ? updated : resume,
    );

    return ok(
      { resumeId, liked: nextLiked, likeCount: updated.likeCount },
      nextLiked ? "좋아요 성공" : "좋아요 취소 성공",
    );
  }),

  http.get("/api/resumes/:resumeId/comments", ({ params }) =>
    ok(
      comments
        .filter((comment) => comment.resumeId === String(params.resumeId))
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        ),
    ),
  ),

  http.post("/api/resumes/:resumeId/comments", async ({ request, params }) => {
    const body = await parseJsonSafely<{
      data?: { content?: string };
      content?: string;
    }>(request);
    const content = body?.data?.content ?? body?.content ?? "";

    if (!content.trim() || content.trim().length > 100) {
      return error(
        400,
        "VALIDATION_ERROR",
        "댓글은 1자 이상 100자 이하로 작성해주세요.",
      );
    }

    const nextComment: ResumeComment = {
      id: comments.length + 1,
      resumeId: String(params.resumeId),
      memberId: 1,
      nickname: "강창룡",
      avatarUrl: createAvatarUrl(1),
      content: content.trim(),
      createdAt: now(),
      updatedAt: now(),
    };

    comments = [...comments, nextComment];
    return ok(nextComment, "댓글 생성 성공");
  }),

  http.delete("/api/resumes/comments/:commentId", ({ params }) => {
    const commentId = String(params.commentId);
    comments = comments.filter((comment) => String(comment.id) !== commentId);
    return ok(null, "댓글 삭제 성공");
  }),

  http.get("/api/notifications/me", () =>
    ok([...notifications].sort((a, b) => Number(a.isRead) - Number(b.isRead))),
  ),

  http.get("/api/notifications/:notificationId", ({ params }) => {
    markNotificationAsRead(String(params.notificationId));
    return ok(null, "알림 읽음 처리 성공");
  }),

  http.patch("/api/notifications/:notificationId", ({ params }) => {
    markNotificationAsRead(String(params.notificationId));
    return ok(null, "알림 읽음 처리 성공");
  }),

  http.post("/api/payments/ready", () =>
    ok({
      tid: "mock-tid",
      next_redirect_app_url: "/plan?mockPayment=done",
      next_redirect_mobile_url: "/plan?mockPayment=done",
      next_redirect_pc_url: "/plan?mockPayment=done",
      android_app_scheme: "",
      ios_app_scheme: "",
      created_at: now(),
    }),
  ),

  http.post("/api/payments/terminate", () => ok(null, "구독 해지 성공")),
  http.patch("/api/payments/terminate", () => ok(null, "구독 해지 성공")),

  http.get("/api/sentry-example-api", () =>
    HttpResponse.json({ name: "Sentry Example", ok: true }),
  ),
];
