export type PositionType = "BACKEND" | "FRONTEND" | "INFRA" | "AI" | "GAME";
export type SchoolType =
  | "PRIVATE_EDUCATION"
  | "HIGH_SCHOOL"
  | "UNIVERSITY_ASSOCIATE_DEGREE"
  | "UNIVERSITY_BACHELOR"
  | "GRADUATE_SCHOOL_MASTER"
  | "GRADUATE_SCHOOL_DOCTOR";
export type GraduationStatus = "GRADUATED" | "ATTENDING" | "DROP_OUT";
export type WorkType =
  | "INTERN"
  | "CONTRACT_WORKER"
  | "FULL_TIME"
  | "PRIVATE_BUSINESS"
  | "FREELANCER";
export type Visibility = "PUBLIC" | "PRIVATE";
export type TemplateType = "BASIC" | "STAR" | "GITFOLIO";

type WorkExperience = {
  companyName: string;
  departmentName: string;
  role: string;
  workType: WorkType;
  employmentStatus: string;
  startedAt: string | null;
  endedAt: string | null;
};

type Education = {
  schoolType: SchoolType;
  schoolName: string;
  major: string;
  graduationStatus: GraduationStatus;
  startedAt: string | null;
  endedAt: string | null;
};

type Certificate = {
  certificateName: string;
  certificateGrade: string;
  certificatedAt: string;
  certificateOrganization: string;
};

type Activity = {
  activityName: string;
  activityYear: number;
  activityDescription: string;
  activityOrganization: string;
};

type Link = {
  linkTitle: string;
  linkUrl: string;
};

export type ResumeProject = {
  template?: TemplateType;
  projectName: string;
  projectStartedAt: string;
  projectEndedAt: string;
  skillSet: string;
  repoLink: string;
  roleAndTask: string[];
  projectDescription?: string;
  star?: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  troubleShooting?: {
    problem: string;
    hypothesis: string;
    try?: string;
    tring?: string;
    result: string;
  };
};

export type ResumeRecord = {
  resumeId: string;
  memberId: number;
  memberName: string;
  name: string;
  username: string;
  avatarUrl: string;
  phoneNumber: string;
  email: string;
  position: PositionType;
  techStack: string[];
  aboutMe: string;
  template: TemplateType;
  tags: string[];
  workExperiences: WorkExperience[];
  educations: Education[];
  projects: ResumeProject[];
  certificates: Certificate[];
  activities: Activity[];
  links: Link[];
  visibility: Visibility;
  likeCount: number;
  viewCount: number;
  isLiked: boolean;
  liked: boolean;
  updatedAt: string;
  paidPlan: string;
  remainingCount: number;
};

type ResumeSeed = {
  resumeId: string;
  memberId: number;
  memberName: string;
  username: string;
  position: PositionType;
  schoolType: SchoolType;
  graduationStatus?: GraduationStatus;
  template: TemplateType;
  visibility: Visibility;
  tags: string[];
  techStack: string[];
  aboutMe: string;
  likeCount: number;
  viewCount: number;
  isLiked: boolean;
  updatedAt: string;
  companyName: string;
  departmentName: string;
  role: string;
  workType: WorkType;
  employmentStatus: string;
  workStartedAt: string;
  workEndedAt: string | null;
  schoolName: string;
  major: string;
  educationStartedAt: string;
  educationEndedAt: string | null;
  projectName: string;
  projectDescription: string;
  projectStartedAt: string;
  projectEndedAt: string;
  repoName: string;
  roleAndTask: string[];
  situation: string;
  task: string;
  action: string;
  result: string;
  activityName: string;
  activityYear: number;
  activityDescription: string;
  activityOrganization: string;
  certificateName?: string;
  certificateGrade?: string;
  certificatedAt?: string;
  certificateOrganization?: string;
  links?: Link[];
  extraProjects?: Array<{
    projectName: string;
    projectDescription: string;
    projectStartedAt: string;
    projectEndedAt: string;
    repoName: string;
    skillSet: string[];
    roleAndTask: string[];
    situation: string;
    task: string;
    action: string;
    result: string;
  }>;
};

export type Notification = {
  notificationId: number;
  resumeId: string;
  senderId: number;
  senderNickname: string;
  receiverId: number;
  type: "COMMENT" | "LIKE";
  isRead: boolean;
};

export type ResumeComment = {
  id: number;
  resumeId: string;
  memberId: number;
  nickname: string;
  avatarUrl: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export const createAvatarUrl = (memberId: number) =>
  `https://avatars.githubusercontent.com/u/${1000 + memberId * 17}?v=4`;

const createDefaultLinks = (seed: ResumeSeed): Link[] => [
  {
    linkTitle: "GitHub",
    linkUrl: `https://github.com/${seed.username}`,
  },
  {
    linkTitle: "Portfolio",
    linkUrl: `https://${seed.username}.dev`,
  },
  {
    linkTitle: "LinkedIn",
    linkUrl: `https://www.linkedin.com/in/${seed.username}`,
  },
];

const createProject = (
  seed: ResumeSeed,
  project?: NonNullable<ResumeSeed["extraProjects"]>[number],
): ResumeProject => {
  const source = project ?? {
    projectName: seed.projectName,
    projectDescription: seed.projectDescription,
    projectStartedAt: seed.projectStartedAt,
    projectEndedAt: seed.projectEndedAt,
    repoName: seed.repoName,
    skillSet: seed.techStack,
    roleAndTask: seed.roleAndTask,
    situation: seed.situation,
    task: seed.task,
    action: seed.action,
    result: seed.result,
  };

  const baseProject: ResumeProject = {
    template: seed.template,
    projectName: source.projectName,
    projectStartedAt: source.projectStartedAt,
    projectEndedAt: source.projectEndedAt,
    skillSet: source.skillSet.join(", "),
    repoLink: `https://github.com/${seed.username}/${source.repoName}`,
    roleAndTask: source.roleAndTask,
    projectDescription: source.projectDescription,
  };

  if (seed.template === "STAR") {
    baseProject.star = {
      situation: source.situation,
      task: source.task,
      action: source.action,
      result: source.result,
    };
  }

  if (seed.template === "GITFOLIO") {
    baseProject.troubleShooting = {
      problem: source.situation,
      hypothesis: source.task,
      try: source.action,
      tring: source.action,
      result: source.result,
    };
  }

  return baseProject;
};

export const createResumeRecord = (seed: ResumeSeed): ResumeRecord => ({
  resumeId: seed.resumeId,
  memberId: seed.memberId,
  memberName: seed.memberName,
  name: seed.memberName,
  username: seed.username,
  avatarUrl: createAvatarUrl(seed.memberId),
  phoneNumber: `010-${String(1100 + seed.memberId).padStart(4, "0")}-${String(2200 + seed.memberId).padStart(4, "0")}`,
  email: `${seed.username}@example.com`,
  position: seed.position,
  techStack: seed.techStack,
  aboutMe: seed.aboutMe,
  template: seed.template,
  tags: seed.tags,
  workExperiences: [
    {
      companyName: seed.companyName,
      departmentName: seed.departmentName,
      role: seed.role,
      workType: seed.workType,
      employmentStatus: seed.employmentStatus,
      startedAt: seed.workStartedAt,
      endedAt: seed.workEndedAt,
    },
  ],
  educations: [
    {
      schoolType: seed.schoolType,
      schoolName: seed.schoolName,
      major: seed.major,
      graduationStatus: seed.graduationStatus ?? "GRADUATED",
      startedAt: seed.educationStartedAt,
      endedAt: seed.educationEndedAt,
    },
  ],
  projects: [
    createProject(seed),
    ...(seed.extraProjects?.map((project) => createProject(seed, project)) ??
      []),
  ],
  certificates:
    seed.certificateName && seed.certificateGrade && seed.certificatedAt
      ? [
          {
            certificateName: seed.certificateName,
            certificateGrade: seed.certificateGrade,
            certificatedAt: seed.certificatedAt,
            certificateOrganization:
              seed.certificateOrganization ?? "한국산업인력공단",
          },
        ]
      : [],
  activities: [
    {
      activityName: seed.activityName,
      activityYear: seed.activityYear,
      activityDescription: seed.activityDescription,
      activityOrganization: seed.activityOrganization,
    },
  ],
  links: seed.links ?? createDefaultLinks(seed),
  visibility: seed.visibility,
  likeCount: seed.likeCount,
  viewCount: seed.viewCount,
  isLiked: seed.isLiked,
  liked: seed.isLiked,
  updatedAt: seed.updatedAt,
  paidPlan: seed.memberId === 1 ? "PRO" : "FREE",
  remainingCount: seed.memberId === 1 ? 12 : 3,
});

const resumeSeeds: ResumeSeed[] = [
  {
    resumeId: "mine-1",
    memberId: 1,
    memberName: "강창룡",
    username: "speardragon",
    position: "FRONTEND",
    schoolType: "UNIVERSITY_BACHELOR",
    template: "GITFOLIO",
    visibility: "PUBLIC",
    tags: ["Next.js", "운영도구", "TypeScript"],
    techStack: ["Next.js", "TypeScript", "React Query", "Zustand", "Supabase"],
    aboutMe:
      "문제가 생기면 화면만 고치지 않고 운영 플로우까지 같이 정리하는 프론트엔드 개발자입니다.\n\n- 운영자가 매일 쓰는 화면의 병목을 찾고\n- 데이터 흐름을 정리해서 배포 리스크를 줄이고\n- 작은 개선이 반복 가능한 프로세스로 남도록 만드는 일에 강점이 있습니다.",
    likeCount: 74,
    viewCount: 1520,
    isLiked: true,
    updatedAt: "2026-03-18T09:20:00.000Z",
    companyName: "구름",
    departmentName: "AIDT Squad",
    role: "프론트엔드 엔지니어",
    workType: "FULL_TIME",
    employmentStatus: "재직중",
    workStartedAt: "2025-02-01",
    workEndedAt: null,
    schoolName: "광운대학교",
    major: "전자통신공학과",
    educationStartedAt: "2019-03-01",
    educationEndedAt: "2024-02-20",
    projectName: "심사 운영 플랫폼",
    projectDescription:
      "수기 심사와 결과 보고 프로세스를 운영 툴로 전환해 의사결정 속도를 높인 프로젝트입니다.",
    projectStartedAt: "2025-02-01",
    projectEndedAt: "2025-03-14",
    repoName: "handpartners",
    roleAndTask: [
      "운영자가 자주 쓰는 심사 대시보드를 설계하고 화면 단위 캐시 전략을 정리했습니다.",
      "서버 응답 속도 편차가 큰 화면에 단계적 로딩을 적용해 체감 성능을 끌어올렸습니다.",
      "배포 후 장애 추적을 위해 에러 포인트와 사용자 흐름을 함께 로깅했습니다.",
    ],
    situation: "심사 건수가 늘면서 수기 보고와 엑셀 정리가 병목이 되었습니다.",
    task: "운영자가 같은 데이터를 여러 번 옮기지 않도록 화면과 데이터 흐름을 재설계해야 했습니다.",
    action:
      "심사 단계별 상태를 표준화하고 핵심 지표를 카드형으로 재배치해 빠르게 판단할 수 있게 만들었습니다.",
    result:
      "운영 보고 작성 시간이 기존 대비 크게 줄었고, 반복 문의가 감소했습니다.",
    activityName: "카카오테크 부트캠프",
    activityYear: 2024,
    activityDescription: "실서비스 관점의 풀스택 협업 프로젝트를 수행했습니다.",
    activityOrganization: "Kakao",
    certificateName: "SQLD",
    certificateGrade: "취득",
    certificatedAt: "2024-09-21",
    certificateOrganization: "한국데이터산업진흥원",
    extraProjects: [
      {
        projectName: "파트너 추천 어드민",
        projectDescription:
          "후보 추천과 상태 관리를 한 화면에서 처리할 수 있도록 구성한 운영 대시보드입니다.",
        projectStartedAt: "2025-03-20",
        projectEndedAt: "2025-05-05",
        repoName: "startup-partners",
        skillSet: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS"],
        roleAndTask: [
          "지원자 상태 전이를 추적할 수 있도록 활동 로그를 설계했습니다.",
          "조건별 필터 조합을 URL 파라미터와 동기화해 운영자가 링크를 공유할 수 있게 했습니다.",
        ],
        situation: "운영자가 후보 상태를 수기로 관리해 누락이 잦았습니다.",
        task: "여러 상태를 한 번에 파악할 수 있는 대시보드가 필요했습니다.",
        action:
          "카드형 요약, 필터 고정, 상세 패널을 조합한 운영 흐름을 설계했습니다.",
        result: "후보 추적 누락이 줄고 커뮤니케이션 비용이 감소했습니다.",
      },
    ],
  },
  {
    resumeId: "mine-2",
    memberId: 1,
    memberName: "강창룡",
    username: "speardragon",
    position: "FRONTEND",
    schoolType: "UNIVERSITY_BACHELOR",
    template: "BASIC",
    visibility: "PRIVATE",
    tags: ["Design System", "React", "DX"],
    techStack: ["React", "TypeScript", "Storybook", "Zod", "Figma"],
    aboutMe:
      "컴포넌트의 일관성과 문서화를 중시하는 프론트엔드 개발자입니다.\n제품 속도와 유지보수성을 동시에 챙기는 구조를 선호합니다.",
    likeCount: 19,
    viewCount: 260,
    isLiked: false,
    updatedAt: "2026-03-15T16:20:00.000Z",
    companyName: "오픈클로우",
    departmentName: "Frontend Platform",
    role: "프론트엔드 개발자",
    workType: "FULL_TIME",
    employmentStatus: "재직중",
    workStartedAt: "2024-08-01",
    workEndedAt: null,
    schoolName: "한빛대학교",
    major: "컴퓨터공학",
    educationStartedAt: "2018-03-01",
    educationEndedAt: "2024-02-20",
    projectName: "디자인 시스템 재정비",
    projectDescription:
      "중복된 UI 패턴을 정리하고 폼 컴포넌트의 사용성을 통일한 프로젝트입니다.",
    projectStartedAt: "2025-06-01",
    projectEndedAt: "2025-08-12",
    repoName: "frontend-utils",
    roleAndTask: [
      "폼 요소별 validation 패턴을 공통화했습니다.",
      "Storybook 기반 문서와 예시 코드를 정리해 신규 기능 개발 속도를 높였습니다.",
    ],
    situation: "팀마다 다른 입력 컴포넌트를 사용해 유지보수 비용이 높았습니다.",
    task: "중복을 줄이고 접근성 기준을 공통화해야 했습니다.",
    action:
      "입력, 선택, 에러 상태를 하나의 규칙으로 맞춘 디자인 시스템을 구성했습니다.",
    result: "신규 화면 구현 시간이 단축되고 QA 이슈가 줄었습니다.",
    activityName: "디자인 시스템 스터디",
    activityYear: 2025,
    activityDescription: "실무 컴포넌트 패턴과 접근성 기준을 정리했습니다.",
    activityOrganization: "사내 스터디",
  },
  {
    resumeId: "mine-3",
    memberId: 1,
    memberName: "강창룡",
    username: "speardragon",
    position: "FRONTEND",
    schoolType: "UNIVERSITY_BACHELOR",
    template: "STAR",
    visibility: "PUBLIC",
    tags: ["커뮤니티", "SEO", "Next.js"],
    techStack: ["Next.js", "TypeScript", "React Query", "Vercel", "Sentry"],
    aboutMe:
      "유입부터 전환까지 사용자 흐름을 끊기지 않게 만드는 프론트엔드 개발을 선호합니다.\n실험과 측정을 반복해 제품 지표를 개선해왔습니다.",
    likeCount: 61,
    viewCount: 1180,
    isLiked: true,
    updatedAt: "2026-03-17T14:10:00.000Z",
    companyName: "리프랩",
    departmentName: "Growth Product",
    role: "프론트엔드 개발자",
    workType: "FULL_TIME",
    employmentStatus: "재직중",
    workStartedAt: "2024-03-01",
    workEndedAt: null,
    schoolName: "한빛대학교",
    major: "컴퓨터공학",
    educationStartedAt: "2018-03-01",
    educationEndedAt: "2024-02-20",
    projectName: "개발자 커뮤니티 리뉴얼",
    projectDescription:
      "랜딩, 목록, 상세 흐름을 재정비해 체류시간과 조회수를 함께 끌어올린 프로젝트입니다.",
    projectStartedAt: "2025-09-01",
    projectEndedAt: "2025-11-30",
    repoName: "gitfolio-front",
    roleAndTask: [
      "검색과 필터 상태를 URL 기반으로 관리해 공유 가능한 탐색 경험을 만들었습니다.",
      "Sentry와 사용자 이벤트 로그를 연결해 이탈 구간을 추적했습니다.",
      "이미지 로딩과 skeleton 전략을 손봐 리스트 탐색 피로를 줄였습니다.",
    ],
    situation:
      "커뮤니티 리스트에서 원하는 이력서를 찾기 어렵다는 피드백이 많았습니다.",
    task: "탐색 흐름을 단순화하면서도 세부 조건 필터를 유지해야 했습니다.",
    action:
      "포지션, 학력, 정렬, 좋아요 필터를 조합하고 URL과 상태를 동기화했습니다.",
    result: "상세 페이지 유입과 평균 체류시간이 함께 증가했습니다.",
    activityName: "서비스 지표 분석 세미나",
    activityYear: 2025,
    activityDescription:
      "제품 지표와 프론트엔드 개선 포인트를 연결하는 발표를 진행했습니다.",
    activityOrganization: "사내 Tech Talk",
  },
  {
    resumeId: "mine-4",
    memberId: 1,
    memberName: "강창룡",
    username: "speardragon",
    position: "FRONTEND",
    schoolType: "UNIVERSITY_BACHELOR",
    template: "BASIC",
    visibility: "PRIVATE",
    tags: ["B2B", "Dashboard", "React"],
    techStack: ["React", "TypeScript", "Recharts", "TanStack Query", "Jotai"],
    aboutMe:
      "수치를 보여주는 화면일수록 정보 구조와 우선순위를 명확하게 설계해야 한다고 생각합니다.",
    likeCount: 11,
    viewCount: 190,
    isLiked: false,
    updatedAt: "2026-03-11T10:05:00.000Z",
    companyName: "데이터브릿지",
    departmentName: "B2B SaaS",
    role: "프론트엔드 개발자",
    workType: "CONTRACT_WORKER",
    employmentStatus: "프로젝트 종료",
    workStartedAt: "2024-01-15",
    workEndedAt: "2024-12-31",
    schoolName: "한빛대학교",
    major: "컴퓨터공학",
    educationStartedAt: "2018-03-01",
    educationEndedAt: "2024-02-20",
    projectName: "매출 분석 대시보드",
    projectDescription:
      "리포트 다운로드와 기간 비교가 핵심인 분석 대시보드입니다.",
    projectStartedAt: "2024-05-01",
    projectEndedAt: "2024-08-30",
    repoName: "sales-dashboard",
    roleAndTask: [
      "복수 차트를 한 화면에 배치하면서 핵심 KPI를 먼저 보이도록 구조를 조정했습니다.",
      "엑셀 다운로드와 필터 상태를 분리해 대량 데이터 처리 시 UX를 안정화했습니다.",
    ],
    situation: "지표는 많지만 중요한 수치가 묻혀 의사결정에 시간이 걸렸습니다.",
    task: "복잡한 데이터를 운영자가 빠르게 읽을 수 있도록 정리해야 했습니다.",
    action: "카드형 핵심 지표와 비교 차트 레이아웃을 재설계했습니다.",
    result: "정기 보고 준비 시간이 줄고 사용 빈도가 높아졌습니다.",
    activityName: "데이터 시각화 스터디",
    activityYear: 2024,
    activityDescription: "차트 선택과 인사이트 전달 방식을 연구했습니다.",
    activityOrganization: "개발자 커뮤니티",
  },
  {
    resumeId: "mine-5",
    memberId: 1,
    memberName: "강창룡",
    username: "speardragon",
    position: "FRONTEND",
    schoolType: "UNIVERSITY_BACHELOR",
    template: "GITFOLIO",
    visibility: "PUBLIC",
    tags: ["AI", "Editor", "TypeScript"],
    techStack: ["Next.js", "TypeScript", "OpenAI", "Lexical", "Edge Runtime"],
    aboutMe:
      "생성형 AI 기능은 결과물보다도 사용자가 수정하고 신뢰할 수 있는 흐름이 더 중요하다고 봅니다.",
    likeCount: 38,
    viewCount: 780,
    isLiked: false,
    updatedAt: "2026-03-19T01:30:00.000Z",
    companyName: "레주메이커",
    departmentName: "AI Product",
    role: "프론트엔드 개발자",
    workType: "FULL_TIME",
    employmentStatus: "재직중",
    workStartedAt: "2025-01-01",
    workEndedAt: null,
    schoolName: "한빛대학교",
    major: "컴퓨터공학",
    educationStartedAt: "2018-03-01",
    educationEndedAt: "2024-02-20",
    projectName: "AI 이력서 에디터",
    projectDescription:
      "선택 영역 기반 수정 요청과 결과 비교가 가능한 AI 이력서 편집기입니다.",
    projectStartedAt: "2026-01-04",
    projectEndedAt: "2026-03-01",
    repoName: "resume-lab",
    roleAndTask: [
      "문장 선택 영역을 기준으로 AI 수정 요청 UX를 설계했습니다.",
      "수정 전후 비교 다이얼로그를 구현해 바로 반영 여부를 선택할 수 있게 했습니다.",
      "실패 케이스를 확인하기 쉽도록 요청 상태와 에러 메시지를 구조화했습니다.",
    ],
    situation:
      "AI가 전체 문서를 한 번에 바꿔 사용자가 결과를 신뢰하기 어려웠습니다.",
    task: "부분 수정 단위로 결과를 확인하고 선택 반영할 수 있는 흐름이 필요했습니다.",
    action: "선택 영역, 요구사항, 미리보기, 최종 반영의 4단계를 분리했습니다.",
    result: "수정 결과 수용률이 높아지고 재시도 비율이 줄었습니다.",
    activityName: "프롬프트 엔지니어링 워크숍",
    activityYear: 2026,
    activityDescription: "편집형 AI UX에 맞는 프롬프트 패턴을 실험했습니다.",
    activityOrganization: "사내 AI Guild",
  },
  {
    resumeId: "mine-6",
    memberId: 1,
    memberName: "강창룡",
    username: "speardragon",
    position: "FRONTEND",
    schoolType: "UNIVERSITY_BACHELOR",
    template: "STAR",
    visibility: "PUBLIC",
    tags: ["Mobile Web", "Performance", "PWA"],
    techStack: ["React", "TypeScript", "Vite", "Workbox", "SWR"],
    aboutMe:
      "모바일 환경에서는 첫 화면 체감 속도와 상호작용 지연을 가장 먼저 봅니다.\n사용자 불편을 수치화하고 개선하는 작업에 익숙합니다.",
    likeCount: 43,
    viewCount: 960,
    isLiked: true,
    updatedAt: "2026-03-13T07:40:00.000Z",
    companyName: "모빌랩",
    departmentName: "Web Platform",
    role: "프론트엔드 개발자",
    workType: "FULL_TIME",
    employmentStatus: "프로젝트 참여",
    workStartedAt: "2024-11-01",
    workEndedAt: null,
    schoolName: "한빛대학교",
    major: "컴퓨터공학",
    educationStartedAt: "2018-03-01",
    educationEndedAt: "2024-02-20",
    projectName: "현장 기사 모바일 웹",
    projectDescription:
      "네트워크가 불안정한 환경에서도 안정적으로 동작해야 하는 PWA 프로젝트입니다.",
    projectStartedAt: "2025-07-01",
    projectEndedAt: "2025-10-15",
    repoName: "field-service-pwa",
    roleAndTask: [
      "오프라인 캐시와 재시도 전략을 적용해 현장 입력 누락을 줄였습니다.",
      "초기 진입 시 필요한 데이터만 우선 로딩해 작업 준비 시간을 단축했습니다.",
    ],
    situation: "현장 네트워크가 불안정해 입력 유실과 재로딩 이슈가 잦았습니다.",
    task: "불안정한 환경에서도 핵심 작업이 끊기지 않도록 만들어야 했습니다.",
    action: "PWA 캐시와 요청 재시도 큐를 설계하고 초기 번들 크기를 줄였습니다.",
    result: "현장 기사들의 재로그인과 재입력 빈도가 크게 줄었습니다.",
    activityName: "모바일 웹 성능 밋업",
    activityYear: 2025,
    activityDescription:
      "모바일 네트워크 환경에서의 성능 최적화 사례를 공유했습니다.",
    activityOrganization: "FEConf",
  },
  {
    resumeId: "resume-101",
    memberId: 2,
    memberName: "김서윤",
    username: "seoyun-dev",
    position: "FRONTEND",
    schoolType: "UNIVERSITY_BACHELOR",
    template: "BASIC",
    visibility: "PUBLIC",
    tags: ["SaaS", "Design System", "React"],
    techStack: ["React", "TypeScript", "Storybook", "Emotion", "Vite"],
    aboutMe:
      "B2B SaaS에서 반복되는 관리 화면을 제품 경험으로 바꾸는 일을 해왔습니다.",
    likeCount: 58,
    viewCount: 1094,
    isLiked: true,
    updatedAt: "2026-03-16T12:45:00.000Z",
    companyName: "플로우메이트",
    departmentName: "Product Frontend",
    role: "프론트엔드 개발자",
    workType: "FULL_TIME",
    employmentStatus: "재직중",
    workStartedAt: "2023-07-01",
    workEndedAt: null,
    schoolName: "서울시립대학교",
    major: "소프트웨어학과",
    educationStartedAt: "2017-03-01",
    educationEndedAt: "2023-02-15",
    projectName: "협업 도구 관리자 콘솔",
    projectDescription:
      "조직 관리, 권한 제어, 결제 설정을 담당하는 관리자 콘솔입니다.",
    projectStartedAt: "2025-04-01",
    projectEndedAt: "2025-09-30",
    repoName: "admin-console",
    roleAndTask: [
      "권한별 메뉴 노출 규칙을 정리하고 접근 제어 로직을 프론트에서 일관되게 적용했습니다.",
      "중복된 설정 폼을 통합해 신규 설정 화면 추가 비용을 줄였습니다.",
    ],
    situation: "기능이 늘어날수록 관리자 콘솔 화면 구조가 복잡해졌습니다.",
    task: "정보 구조를 재정리해 운영자가 헤매지 않도록 해야 했습니다.",
    action: "메뉴 구조와 설정 폼 패턴을 표준화했습니다.",
    result: "운영 문의가 줄고 신규 설정 기능 배포 속도가 개선되었습니다.",
    activityName: "Storybook 사내 도입",
    activityYear: 2024,
    activityDescription: "디자인 시스템 문서화와 배포 프로세스를 구축했습니다.",
    activityOrganization: "사내 플랫폼 팀",
  },
  {
    resumeId: "resume-102",
    memberId: 3,
    memberName: "박도현",
    username: "dohyeon-api",
    position: "BACKEND",
    schoolType: "GRADUATE_SCHOOL_MASTER",
    template: "STAR",
    visibility: "PUBLIC",
    tags: ["Java", "Spring", "MSA"],
    techStack: ["Java", "Spring Boot", "Kafka", "MySQL", "Redis"],
    aboutMe:
      "거래량이 많은 서비스에서 API 안정성과 운영 관측성을 함께 다뤄온 백엔드 개발자입니다.",
    likeCount: 81,
    viewCount: 1640,
    isLiked: false,
    updatedAt: "2026-03-19T03:10:00.000Z",
    companyName: "페이웨이브",
    departmentName: "Core Platform",
    role: "백엔드 개발자",
    workType: "FULL_TIME",
    employmentStatus: "재직중",
    workStartedAt: "2022-06-01",
    workEndedAt: null,
    schoolName: "고려대학교 대학원",
    major: "컴퓨터학과",
    educationStartedAt: "2020-03-01",
    educationEndedAt: "2022-02-20",
    projectName: "실시간 정산 API",
    projectDescription:
      "결제, 환불, 정산 데이터를 이벤트 기반으로 처리하는 핵심 API 프로젝트입니다.",
    projectStartedAt: "2025-02-10",
    projectEndedAt: "2025-12-20",
    repoName: "settlement-api",
    roleAndTask: [
      "이벤트 소비 지연을 줄이기 위해 메시지 처리 구조를 조정했습니다.",
      "정산 실패 재처리 흐름을 운영툴과 연동해 복구 시간을 단축했습니다.",
      "핵심 API에 대한 부하 테스트와 알람 체계를 정비했습니다.",
    ],
    situation: "거래량이 급증하면서 정산 지연과 장애 대응 시간이 길어졌습니다.",
    task: "실시간성은 유지하면서 운영 복구 가능성을 높여야 했습니다.",
    action: "Kafka 파티션 전략과 재처리 워커를 재설계했습니다.",
    result: "지연 건수가 줄고 장애 감지 시간이 단축되었습니다.",
    activityName: "대용량 트래픽 스터디",
    activityYear: 2025,
    activityDescription: "분산 시스템 운영 경험을 공유하고 실험했습니다.",
    activityOrganization: "백엔드 챕터",
    certificateName: "정보처리기사",
    certificateGrade: "합격",
    certificatedAt: "2021-06-18",
    certificateOrganization: "한국산업인력공단",
  },
  {
    resumeId: "resume-103",
    memberId: 4,
    memberName: "최유진",
    username: "yujin-infra",
    position: "INFRA",
    schoolType: "UNIVERSITY_BACHELOR",
    template: "GITFOLIO",
    visibility: "PUBLIC",
    tags: ["AWS", "IaC", "Observability"],
    techStack: ["AWS", "Terraform", "Kubernetes", "Grafana", "Argo CD"],
    aboutMe:
      "배포 자동화와 장애 복구 흐름을 같이 설계하는 인프라 엔지니어입니다.",
    likeCount: 47,
    viewCount: 930,
    isLiked: true,
    updatedAt: "2026-03-12T23:30:00.000Z",
    companyName: "클라우드브릿지",
    departmentName: "SRE",
    role: "인프라 엔지니어",
    workType: "FULL_TIME",
    employmentStatus: "재직중",
    workStartedAt: "2021-11-01",
    workEndedAt: null,
    schoolName: "부산대학교",
    major: "정보컴퓨터공학부",
    educationStartedAt: "2015-03-01",
    educationEndedAt: "2021-02-20",
    projectName: "멀티 서비스 배포 파이프라인",
    projectDescription:
      "다수의 마이크로서비스를 안전하게 배포하기 위한 GitOps 기반 파이프라인입니다.",
    projectStartedAt: "2024-09-01",
    projectEndedAt: "2025-01-31",
    repoName: "platform-delivery",
    roleAndTask: [
      "Terraform 모듈을 재구성해 환경별 편차를 줄였습니다.",
      "배포 이력과 롤백 흐름을 표준화해 대응 속도를 높였습니다.",
    ],
    situation:
      "서비스가 늘면서 배포 절차가 팀마다 달라 장애 대응이 어려웠습니다.",
    task: "배포 자동화와 가시성을 함께 확보해야 했습니다.",
    action: "GitOps 파이프라인과 표준 운영 대시보드를 구축했습니다.",
    result: "배포 실패 원인 파악이 쉬워지고 롤백 시간이 짧아졌습니다.",
    activityName: "쿠버네티스 운영 세미나",
    activityYear: 2025,
    activityDescription: "운영 환경에서의 배포 전략과 관측성을 발표했습니다.",
    activityOrganization: "Cloud Native Seoul",
  },
  {
    resumeId: "resume-104",
    memberId: 5,
    memberName: "이하린",
    username: "harin-ai",
    position: "AI",
    schoolType: "GRADUATE_SCHOOL_MASTER",
    template: "STAR",
    visibility: "PUBLIC",
    tags: ["LLM", "RAG", "MLOps"],
    techStack: ["Python", "PyTorch", "FastAPI", "LangChain", "Vertex AI"],
    aboutMe:
      "모델 성능만이 아니라 실제 서비스에 녹아드는 AI 경험을 만드는 데 집중하고 있습니다.",
    likeCount: 69,
    viewCount: 1460,
    isLiked: false,
    updatedAt: "2026-03-18T06:50:00.000Z",
    companyName: "인사이트랩",
    departmentName: "AI Product",
    role: "ML 엔지니어",
    workType: "FULL_TIME",
    employmentStatus: "재직중",
    workStartedAt: "2022-09-01",
    workEndedAt: null,
    schoolName: "연세대학교 대학원",
    major: "인공지능학과",
    educationStartedAt: "2020-03-01",
    educationEndedAt: "2022-02-20",
    projectName: "사내 지식 검색 챗봇",
    projectDescription:
      "문서 검색과 답변 생성 정확도를 높이기 위한 RAG 기반 챗봇 프로젝트입니다.",
    projectStartedAt: "2025-03-01",
    projectEndedAt: "2025-08-31",
    repoName: "knowledge-assistant",
    roleAndTask: [
      "문서 chunking과 reranking 전략을 조정해 검색 품질을 개선했습니다.",
      "운영 데이터셋을 기반으로 답변 품질을 주기적으로 평가하는 파이프라인을 구축했습니다.",
    ],
    situation:
      "초기 챗봇은 답변이 그럴듯하지만 실제 문맥과 어긋나는 경우가 많았습니다.",
    task: "정확도와 근거 제시를 동시에 높여야 했습니다.",
    action: "검색 품질 평가와 프롬프트 가드레일을 함께 설계했습니다.",
    result: "실사용 부서의 재질문 비율이 감소하고 만족도가 높아졌습니다.",
    activityName: "RAG 실무 세션",
    activityYear: 2025,
    activityDescription: "실서비스 RAG 평가 체계를 발표했습니다.",
    activityOrganization: "MLOps Community",
  },
  {
    resumeId: "resume-105",
    memberId: 6,
    memberName: "정태민",
    username: "taemin-game",
    position: "GAME",
    schoolType: "PRIVATE_EDUCATION",
    template: "BASIC",
    visibility: "PUBLIC",
    tags: ["Unity", "Gameplay", "LiveOps"],
    techStack: ["Unity", "C#", "Addressables", "Jenkins", "Firebase"],
    aboutMe:
      "라이브 서비스를 운영하면서 유저 반응에 따라 빠르게 실험하고 개선하는 게임 개발을 해왔습니다.",
    likeCount: 34,
    viewCount: 712,
    isLiked: false,
    updatedAt: "2026-03-10T21:25:00.000Z",
    companyName: "스파클게임즈",
    departmentName: "LiveOps",
    role: "클라이언트 개발자",
    workType: "FULL_TIME",
    employmentStatus: "재직중",
    workStartedAt: "2021-05-10",
    workEndedAt: null,
    schoolName: "게임개발 아카데미",
    major: "게임프로그래밍",
    educationStartedAt: "2019-01-01",
    educationEndedAt: "2019-12-31",
    projectName: "모바일 수집형 RPG 시즌 운영",
    projectDescription:
      "이벤트와 패치를 빠르게 반영해야 하는 라이브 게임 운영 프로젝트입니다.",
    projectStartedAt: "2025-01-01",
    projectEndedAt: "2025-12-31",
    repoName: "liveops-rpg",
    roleAndTask: [
      "이벤트 데이터를 원격 설정으로 분리해 배포 없는 운영이 가능하도록 했습니다.",
      "클라이언트 크래시 로그를 정리해 우선순위별 대응 체계를 만들었습니다.",
    ],
    situation: "이벤트 대응 속도가 느려 운영 실험 주기가 길었습니다.",
    task: "배포 없이 조정 가능한 운영 구조가 필요했습니다.",
    action: "원격 설정과 빌드 파이프라인 자동화를 도입했습니다.",
    result: "이벤트 준비 시간이 줄고 운영 실험 빈도가 높아졌습니다.",
    activityName: "게임 라이브옵스 세션",
    activityYear: 2024,
    activityDescription: "운영 자동화 사례를 공유했습니다.",
    activityOrganization: "게임개발자모임",
  },
  {
    resumeId: "resume-106",
    memberId: 7,
    memberName: "오민지",
    username: "minji-web",
    position: "FRONTEND",
    schoolType: "UNIVERSITY_ASSOCIATE_DEGREE",
    template: "STAR",
    visibility: "PUBLIC",
    tags: ["Commerce", "A/B Test", "React"],
    techStack: ["React", "TypeScript", "Next.js", "Amplitude", "Tailwind CSS"],
    aboutMe:
      "구매 전환에 영향을 주는 프론트엔드 실험을 빠르게 설계하고 검증하는 데 익숙합니다.",
    likeCount: 55,
    viewCount: 1015,
    isLiked: true,
    updatedAt: "2026-03-17T20:05:00.000Z",
    companyName: "샵스프린트",
    departmentName: "Growth Frontend",
    role: "프론트엔드 개발자",
    workType: "FULL_TIME",
    employmentStatus: "재직중",
    workStartedAt: "2022-04-01",
    workEndedAt: null,
    schoolName: "서울여자간호전문대학",
    major: "인터랙티브미디어",
    educationStartedAt: "2018-03-01",
    educationEndedAt: "2020-02-20",
    projectName: "상세페이지 전환 개선",
    projectDescription:
      "상품 상세페이지에서 구매 전환을 높이기 위한 실험 중심 프로젝트입니다.",
    projectStartedAt: "2025-06-01",
    projectEndedAt: "2025-09-15",
    repoName: "commerce-growth",
    roleAndTask: [
      "상세페이지 주요 CTA와 리뷰 영역의 배치 실험을 설계했습니다.",
      "실험 지표를 대시보드와 연결해 의사결정 속도를 높였습니다.",
    ],
    situation: "상품 상세페이지 이탈률이 높아 전환 개선이 필요했습니다.",
    task: "실험 비용은 낮추면서 핵심 구간 개선 효과를 검증해야 했습니다.",
    action: "A/B 테스트 환경과 이벤트 측정 구조를 정비했습니다.",
    result: "구매 전환이 개선되고 실험 회전율이 높아졌습니다.",
    activityName: "A/B 테스트 사내 세션",
    activityYear: 2025,
    activityDescription: "실험 설계와 이벤트 측정 기준을 공유했습니다.",
    activityOrganization: "Growth Guild",
  },
  {
    resumeId: "resume-107",
    memberId: 8,
    memberName: "한준혁",
    username: "junhyeok-be",
    position: "BACKEND",
    schoolType: "UNIVERSITY_BACHELOR",
    template: "BASIC",
    visibility: "PUBLIC",
    tags: ["Node.js", "NestJS", "PostgreSQL"],
    techStack: ["Node.js", "NestJS", "PostgreSQL", "Prisma", "Docker"],
    aboutMe:
      "복잡한 비즈니스 규칙을 읽기 쉬운 API와 데이터 모델로 정리하는 백엔드 개발자입니다.",
    likeCount: 44,
    viewCount: 845,
    isLiked: false,
    updatedAt: "2026-03-14T08:10:00.000Z",
    companyName: "오더베이스",
    departmentName: "Platform API",
    role: "백엔드 개발자",
    workType: "FULL_TIME",
    employmentStatus: "재직중",
    workStartedAt: "2023-02-01",
    workEndedAt: null,
    schoolName: "광운대학교",
    major: "컴퓨터공학과",
    educationStartedAt: "2016-03-01",
    educationEndedAt: "2022-02-20",
    projectName: "주문 정합성 검증 서비스",
    projectDescription:
      "여러 판매 채널에서 들어오는 주문 데이터를 정규화하고 검증하는 서비스입니다.",
    projectStartedAt: "2025-05-01",
    projectEndedAt: "2025-10-31",
    repoName: "order-validator",
    roleAndTask: [
      "채널별 주문 포맷을 표준 스키마로 정리했습니다.",
      "정합성 오류를 운영 화면에서 바로 확인할 수 있도록 에러 분류 체계를 만들었습니다.",
    ],
    situation: "채널마다 주문 포맷이 달라 운영 오류가 잦았습니다.",
    task: "입력 구조를 표준화하고 오류를 추적 가능하게 만들어야 했습니다.",
    action: "스키마 검증과 예외 분류를 서비스 계층에 정리했습니다.",
    result: "주문 오류 대응 시간이 짧아지고 운영 혼선이 줄었습니다.",
    activityName: "도메인 모델링 세미나",
    activityYear: 2024,
    activityDescription:
      "복잡한 비즈니스 로직을 서비스 구조에 반영하는 방법을 발표했습니다.",
    activityOrganization: "Backend Circle",
  },
  {
    resumeId: "resume-108",
    memberId: 9,
    memberName: "윤소라",
    username: "sora-ml",
    position: "AI",
    schoolType: "GRADUATE_SCHOOL_DOCTOR",
    template: "GITFOLIO",
    visibility: "PUBLIC",
    tags: ["추천시스템", "Python", "Experimentation"],
    techStack: ["Python", "TensorFlow", "Airflow", "BigQuery", "Docker"],
    aboutMe:
      "연구 결과를 논문으로 끝내지 않고 실험 가능한 제품 기능으로 연결하는 데 관심이 많습니다.",
    likeCount: 63,
    viewCount: 1330,
    isLiked: true,
    updatedAt: "2026-03-09T18:10:00.000Z",
    companyName: "픽셀리",
    departmentName: "Recommendation Lab",
    role: "리서치 엔지니어",
    workType: "FULL_TIME",
    employmentStatus: "재직중",
    workStartedAt: "2020-08-01",
    workEndedAt: null,
    schoolName: "KAIST 대학원",
    major: "전산학부",
    educationStartedAt: "2016-03-01",
    educationEndedAt: "2020-08-20",
    projectName: "콘텐츠 추천 모델 실험 플랫폼",
    projectDescription:
      "모델 변경 효과를 오프라인과 온라인에서 함께 검증하는 추천 실험 플랫폼입니다.",
    projectStartedAt: "2024-10-01",
    projectEndedAt: "2025-07-31",
    repoName: "ranking-lab",
    roleAndTask: [
      "피처 파이프라인과 평가 지표를 표준화했습니다.",
      "실험 결과를 제품 팀이 읽기 쉬운 리포트로 자동 생성했습니다.",
    ],
    situation: "실험 결과가 팀마다 다르게 해석되어 적용 판단이 늦었습니다.",
    task: "실험 기준과 공유 방식을 표준화해야 했습니다.",
    action: "공통 평가 지표와 자동 리포트 파이프라인을 만들었습니다.",
    result: "모델 적용 의사결정 속도가 빨라지고 실험 재현성이 높아졌습니다.",
    activityName: "추천 시스템 워크숍",
    activityYear: 2025,
    activityDescription: "실험 설계와 지표 해석 기준을 공유했습니다.",
    activityOrganization: "RecoSys Korea",
  },
  {
    resumeId: "resume-109",
    memberId: 10,
    memberName: "임다온",
    username: "daon-platform",
    position: "INFRA",
    schoolType: "UNIVERSITY_BACHELOR",
    template: "BASIC",
    visibility: "PUBLIC",
    tags: ["Platform", "CI/CD", "AWS"],
    techStack: ["AWS", "GitHub Actions", "Terraform", "ECS", "Datadog"],
    aboutMe:
      "서비스 팀이 배포를 두려워하지 않도록 플랫폼과 운영 경험을 정리하는 일을 해왔습니다.",
    likeCount: 39,
    viewCount: 804,
    isLiked: false,
    updatedAt: "2026-03-08T09:00:00.000Z",
    companyName: "딜리버리허브",
    departmentName: "Platform Engineering",
    role: "플랫폼 엔지니어",
    workType: "FULL_TIME",
    employmentStatus: "재직중",
    workStartedAt: "2022-01-03",
    workEndedAt: null,
    schoolName: "경북대학교",
    major: "컴퓨터학부",
    educationStartedAt: "2015-03-01",
    educationEndedAt: "2021-02-20",
    projectName: "서비스 표준 배포 템플릿",
    projectDescription:
      "여러 팀이 공통 배포 규칙을 사용할 수 있도록 템플릿화한 플랫폼 프로젝트입니다.",
    projectStartedAt: "2025-03-01",
    projectEndedAt: "2025-06-30",
    repoName: "delivery-template",
    roleAndTask: [
      "서비스별 설정 차이를 흡수하는 템플릿 구조를 설계했습니다.",
      "배포 체크리스트와 모니터링 대시보드 생성 자동화를 구축했습니다.",
    ],
    situation: "팀마다 배포 방식이 달라 문제 원인 파악이 느렸습니다.",
    task: "공통 규칙을 만들되 서비스 특성은 유지해야 했습니다.",
    action: "템플릿 기반 배포와 환경별 변수 관리 체계를 만들었습니다.",
    result: "배포 편차가 줄고 신규 서비스 온보딩 속도가 개선되었습니다.",
    activityName: "플랫폼 엔지니어링 밋업",
    activityYear: 2025,
    activityDescription: "공통 배포 파이프라인 설계 경험을 공유했습니다.",
    activityOrganization: "Platformer",
  },
  {
    resumeId: "resume-110",
    memberId: 11,
    memberName: "배지훈",
    username: "jihoon-fe",
    position: "FRONTEND",
    schoolType: "HIGH_SCHOOL",
    template: "GITFOLIO",
    visibility: "PUBLIC",
    tags: ["Accessibility", "React", "Public Service"],
    techStack: ["React", "TypeScript", "Next.js", "MSW", "Jest"],
    aboutMe:
      "누구나 사용할 수 있는 공공 서비스 화면을 만드는 데 보람을 느끼는 프론트엔드 개발자입니다.",
    likeCount: 51,
    viewCount: 980,
    isLiked: true,
    updatedAt: "2026-03-07T11:55:00.000Z",
    companyName: "시민서비스랩",
    departmentName: "Digital Service",
    role: "프론트엔드 개발자",
    workType: "FREELANCER",
    employmentStatus: "프로젝트 계약",
    workStartedAt: "2025-01-10",
    workEndedAt: "2025-12-31",
    schoolName: "대구소프트웨어마이스터고",
    major: "소프트웨어개발",
    educationStartedAt: "2017-03-01",
    educationEndedAt: "2020-02-20",
    projectName: "민원 신청 통합 화면",
    projectDescription:
      "접근성과 입력 오류 안내를 강화한 민원 신청 통합 화면 프로젝트입니다.",
    projectStartedAt: "2025-02-01",
    projectEndedAt: "2025-08-31",
    repoName: "civil-service-ui",
    roleAndTask: [
      "폼 오류 메시지를 단계별로 정리해 제출 실패율을 줄였습니다.",
      "키보드 탐색과 스크린리더 대응을 개선했습니다.",
      "MSW 기반 개발 환경을 구성해 백엔드 지연 없이 화면 개발을 진행했습니다.",
    ],
    situation: "신청 단계가 길고 오류 안내가 부족해 이탈이 많았습니다.",
    task: "접근성을 해치지 않으면서 입력 흐름을 단순화해야 했습니다.",
    action: "입력 단계 구조를 줄이고 상태별 안내 문구를 새로 설계했습니다.",
    result: "완료율이 높아지고 사용자 문의가 감소했습니다.",
    activityName: "웹 접근성 세미나",
    activityYear: 2025,
    activityDescription: "실서비스 접근성 개선 사례를 발표했습니다.",
    activityOrganization: "NULI",
  },
  {
    resumeId: "resume-111",
    memberId: 12,
    memberName: "송가은",
    username: "gaeun-aiops",
    position: "AI",
    schoolType: "UNIVERSITY_BACHELOR",
    template: "BASIC",
    visibility: "PUBLIC",
    tags: ["Vision", "MLOps", "FastAPI"],
    techStack: ["Python", "OpenCV", "PyTorch", "FastAPI", "MLflow"],
    aboutMe:
      "모델 학습부터 배포, 모니터링까지 한 흐름으로 다루는 AI 엔지니어입니다.",
    likeCount: 42,
    viewCount: 889,
    isLiked: false,
    updatedAt: "2026-03-06T05:20:00.000Z",
    companyName: "비전트랙",
    departmentName: "AI Platform",
    role: "AI 엔지니어",
    workType: "FULL_TIME",
    employmentStatus: "재직중",
    workStartedAt: "2023-03-01",
    workEndedAt: null,
    schoolName: "인하대학교",
    major: "컴퓨터공학과",
    educationStartedAt: "2017-03-01",
    educationEndedAt: "2023-02-20",
    projectName: "생산 라인 비전 검사",
    projectDescription:
      "비전 모델의 추론 결과를 운영 현장에서 바로 검증할 수 있도록 만든 프로젝트입니다.",
    projectStartedAt: "2025-01-15",
    projectEndedAt: "2025-07-20",
    repoName: "factory-vision",
    roleAndTask: [
      "모델 성능 로그와 현장 피드백을 함께 수집하는 구조를 만들었습니다.",
      "배포 버전별 성능 추적 대시보드를 구축했습니다.",
    ],
    situation:
      "현장에서는 모델 결과를 신뢰하기 어려워 수작업 검수가 많았습니다.",
    task: "모델 성능 추적과 검증 흐름을 운영에 녹여야 했습니다.",
    action: "예측 결과와 피드백을 함께 저장하는 운영 구조를 설계했습니다.",
    result: "모델 개선 주기가 짧아지고 수작업 검수가 감소했습니다.",
    activityName: "MLOps 사내 세션",
    activityYear: 2025,
    activityDescription: "모델 배포와 추적 구조를 정리해 공유했습니다.",
    activityOrganization: "AI Platform Team",
  },
];

const uniqueLinks = (links: Link[]) => {
  const seen = new Set<string>();
  return links.filter((link) => {
    const key = `${link.linkTitle}:${link.linkUrl}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

const createSupplementalProject = (
  resume: ResumeRecord,
  index: number,
): ResumeProject => {
  const baseNameByPosition: Record<PositionType, string> = {
    FRONTEND: "사용자 경험 개선 실험",
    BACKEND: "운영 자동화 API 고도화",
    INFRA: "배포 안정화 플랫폼 개선",
    AI: "모델 평가 파이프라인 고도화",
    GAME: "라이브 운영 효율화 시스템",
  };

  const detailByPosition: Record<PositionType, string> = {
    FRONTEND:
      "핵심 화면의 탐색 흐름을 짧게 만들고 UI 상태를 더 명확하게 다듬은 후속 프로젝트입니다.",
    BACKEND:
      "운영자가 장애와 예외를 더 빠르게 인지할 수 있도록 관측성과 복구 흐름을 강화한 프로젝트입니다.",
    INFRA:
      "배포 실패 원인을 더 빠르게 확인하고 복구 절차를 짧게 가져가기 위해 운영 기준을 정리한 프로젝트입니다.",
    AI: "평가 데이터셋과 실험 이력을 연결해 모델 품질 변화를 추적할 수 있게 만든 프로젝트입니다.",
    GAME: "이벤트 운영 속도와 장애 대응력을 높이기 위해 라이브옵스 도구를 보강한 프로젝트입니다.",
  };

  const taskByPosition: Record<PositionType, string[]> = {
    FRONTEND: [
      "화면별 병목 구간을 측정하고 사용자 탐색 흐름을 단순화했습니다.",
      "재사용 가능한 UI 패턴을 분리해 신규 화면 확장 비용을 낮췄습니다.",
      "운영 로그와 사용자 이벤트를 연결해 개선 우선순위를 정리했습니다.",
    ],
    BACKEND: [
      "예외 분류 체계를 세분화해 운영자가 실패 원인을 바로 파악할 수 있게 했습니다.",
      "재처리와 복구 흐름을 서비스 로직에서 명확히 분리했습니다.",
      "알람 기준과 운영 문서를 함께 정리해 장애 대응 속도를 높였습니다.",
    ],
    INFRA: [
      "환경별 설정 차이를 줄이고 공통 배포 규칙을 문서화했습니다.",
      "모니터링 지표와 배포 이력을 연계해 문제 구간을 빠르게 추적했습니다.",
      "운영 체크리스트를 자동화해 사람 의존도를 줄였습니다.",
    ],
    AI: [
      "실험 결과와 평가 기준을 한 화면에서 비교할 수 있게 정리했습니다.",
      "프롬프트나 모델 버전 변경 이력을 추적할 수 있는 구조를 만들었습니다.",
      "운영 데이터셋을 기반으로 품질 저하를 더 빨리 탐지하도록 개선했습니다.",
    ],
    GAME: [
      "라이브 이벤트 설정을 배포 없이 조정할 수 있게 운영 도구를 정비했습니다.",
      "장애 로그와 사용자 반응을 묶어서 볼 수 있게 지표를 재구성했습니다.",
      "패치 이후 이슈 재현을 돕는 운영 도구를 추가했습니다.",
    ],
  };

  const summaryByPosition: Record<PositionType, string> = {
    FRONTEND: "핵심 화면의 체감 속도와 사용성을 함께 끌어올렸습니다.",
    BACKEND: "운영 대응 시간을 줄이고 안정적인 재처리 흐름을 만들었습니다.",
    INFRA: "배포 실패 원인 파악과 롤백 흐름이 더 명확해졌습니다.",
    AI: "실험 회전율과 품질 추적성이 함께 좋아졌습니다.",
    GAME: "운영 대응 속도와 실험 빈도가 함께 개선되었습니다.",
  };

  const projectName = `${baseNameByPosition[resume.position]} ${index + 1}`;
  const projectStartedAt = `2025-${String((index % 9) + 1).padStart(2, "0")}-01`;
  const projectEndedAt = `2025-${String((index % 9) + 2).padStart(2, "0")}-28`;
  const roleAndTask = taskByPosition[resume.position];

  const project: ResumeProject = {
    template: resume.template,
    projectName,
    projectStartedAt,
    projectEndedAt,
    skillSet: resume.techStack.join(", "),
    repoLink: `https://github.com/${resume.username}/${resume.resumeId}-lab`,
    roleAndTask,
    projectDescription: detailByPosition[resume.position],
  };

  if (resume.template === "STAR") {
    project.star = {
      situation: detailByPosition[resume.position],
      task: "운영과 제품 개선이 동시에 가능하도록 구조를 정리해야 했습니다.",
      action: roleAndTask[0],
      result: summaryByPosition[resume.position],
    };
  }

  if (resume.template === "GITFOLIO") {
    project.troubleShooting = {
      problem: detailByPosition[resume.position],
      hypothesis:
        "원인이 흩어진 상태에서는 개선 반복 속도가 느려진다고 판단했습니다.",
      try: roleAndTask[1],
      tring: roleAndTask[1],
      result: summaryByPosition[resume.position],
    };
  }

  return project;
};

const createSupplementalCertificate = (
  resume: ResumeRecord,
  index: number,
) => ({
  certificateName:
    {
      FRONTEND: "웹 접근성 인증 이해",
      BACKEND: "SQLD",
      INFRA: "AWS Certified Cloud Practitioner",
      AI: "TensorFlow Developer Certificate",
      GAME: "Unity Certified User",
    }[resume.position] ?? `실무 인증 ${index + 1}`,
  certificateGrade: "취득",
  certificatedAt: `2025-${String((index % 9) + 1).padStart(2, "0")}-15`,
  certificateOrganization:
    {
      FRONTEND: "민간 교육 기관",
      BACKEND: "한국데이터산업진흥원",
      INFRA: "Amazon Web Services",
      AI: "Google",
      GAME: "Unity",
    }[resume.position] ?? "민간 기관",
});

const createSupplementalActivity = (resume: ResumeRecord, index: number) => ({
  activityName: `${resume.memberName} 실무 발표`,
  activityYear: 2024 + (index % 2),
  activityDescription:
    "프로젝트 회고와 개선 포인트를 정리해 팀 또는 커뮤니티에 공유했습니다.",
  activityOrganization:
    {
      FRONTEND: "Frontend Chapter",
      BACKEND: "Backend Circle",
      INFRA: "Platform Guild",
      AI: "AI Guild",
      GAME: "Game Dev Meetup",
    }[resume.position] ?? "Tech Community",
});

const enrichResumeRecord = (
  resume: ResumeRecord,
  index: number,
): ResumeRecord => {
  const links = uniqueLinks([
    ...resume.links,
    {
      linkTitle: "Tech Blog",
      linkUrl: `https://blog.${resume.username}.dev`,
    },
    {
      linkTitle: "Notion",
      linkUrl: `https://www.notion.so/${resume.username}-${resume.resumeId}`,
    },
  ]);

  const projects =
    resume.projects.length >= 2
      ? resume.projects
      : [...resume.projects, createSupplementalProject(resume, index)];

  const certificates =
    resume.certificates.length >= 2
      ? resume.certificates
      : [...resume.certificates, createSupplementalCertificate(resume, index)];

  const activities =
    resume.activities.length >= 2
      ? resume.activities
      : [...resume.activities, createSupplementalActivity(resume, index)];

  return {
    ...resume,
    aboutMe: `${resume.aboutMe}\n\n- 협업 과정에서 문제를 문서화하고 우선순위를 정리하는 편입니다.\n- 운영 상황까지 고려한 구조를 만들고, 배포 이후 관측 가능한 상태를 선호합니다.`,
    projects,
    certificates,
    activities,
    links,
  };
};

const createTroubleShooting = (
  problem: string,
  hypothesis: string,
  attempt: string,
  result: string,
) => ({
  problem,
  hypothesis,
  try: attempt,
  tring: attempt,
  result,
});

const overrideSpeardragonResume = (resume: ResumeRecord): ResumeRecord => {
  if (resume.resumeId !== "mine-1") {
    return resume;
  }

  return {
    ...resume,
    avatarUrl: "/images/cdragon_image.png",
    phoneNumber: "(+82) 010-4501-6090",
    email: "iopp6090@gmail.com",
    tags: ["Frontend", "Product", "LLM", "Accessibility"],
    techStack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Zustand",
      "TanStack Query",
      "react-hook-form",
      "NestJS",
      "TypeORM",
      "Redis",
      "MySQL",
      "MongoDB",
      "Docker",
      "Nginx",
      "AWS",
    ],
    aboutMe:
      "사용자 경험의 사소한 불편함도 놓치지 않고, 비즈니스 목표와 연결하여 기술적 해결책을 제시하는 프론트엔드 개발자입니다. 창업 경험을 통해 얻은 제품 오너십을 바탕으로, 동료들과의 건강한 토론을 통해 더 나은 제품을 만들어나가길 희망합니다.",
    workExperiences: [
      {
        companyName: "(주) 구름",
        departmentName: "AI 디지털 교과서 프로젝트",
        role: "프론트엔드 엔지니어",
        workType: "INTERN",
        employmentStatus: "재직중",
        startedAt: "2025-02-01",
        endedAt: "2025-08-31",
      },
      {
        companyName: "공유책장",
        departmentName: "2인 창업",
        role: "기술 총괄 / 풀스택 애플리케이션 개발",
        workType: "PRIVATE_BUSINESS",
        employmentStatus: "프로젝트 종료",
        startedAt: "2023-07-01",
        endedAt: "2024-12-31",
      },
    ],
    projects: [
      {
        template: "GITFOLIO",
        projectName: "꽃동산 아카데미",
        projectStartedAt: "2024-02-01",
        projectEndedAt: "2026-03-20",
        skillSet:
          "TypeScript, Next.js 14 App Router, Tailwind CSS, Zustand, TanStack Query v5, Jenkins",
        repoLink: "https://fgcacademy.co.kr/",
        roleAndTask: [
          "특정 페이지의 로딩 시간이 12초까지 늘어나는 문제를 분석했습니다.",
          "과도한 join 쿼리를 단순화하고, 초기에는 리스트만 로드한 뒤 상세 정보는 사용자 인터랙션 시점에 fetch 하도록 바꿨습니다.",
          "클라이언트에서 처리하던 정렬·검색 로직을 서버 사이드로 옮겨 데이터 증가 시에도 일관된 성능을 유지했습니다.",
          "Jenkins 빌드로 인한 메모리 부족 문제를 Swap memory와 인스턴스 운영 전략 조정으로 해결했습니다.",
        ],
        projectDescription:
          "교사 자격 인증을 위한 온라인 강의 수강 플랫폼입니다. 500명 규모 트래픽을 수용하며 프론트엔드, 백엔드, 클라우드 환경 구축을 함께 담당했습니다.",
        troubleShooting: createTroubleShooting(
          "특정 페이지가 12초 이상 걸려 사용자 불만이 발생했습니다.",
          "불필요한 join 쿼리와 초기에 과도한 상세 데이터를 불러오는 방식이 병목이라고 판단했습니다.",
          "쿼리를 단순화하고, 리스트 우선 로드 후 상세 정보는 사용자 액션 시점으로 미뤘습니다.",
          "로딩 시간을 2.4초 수준으로 줄여 약 80% 개선했습니다.",
        ),
      },
      {
        template: "GITFOLIO",
        projectName: "깃트폴리오(Gitfolio)",
        projectStartedAt: "2024-09-01",
        projectEndedAt: "2024-12-31",
        skillSet:
          "TypeScript, Next.js 14 App Router, Tailwind CSS, Zustand, TanStack Query v5, Sentry",
        repoLink: "https://github.com/KTB-Sixmen/gitfolio_front",
        roleAndTask: [
          "좋아요 요청에 낙관적 업데이트를 적용해 평균 200ms 응답 대기를 체감상 즉시 반영으로 바꿨습니다.",
          "@react-pdf/renderer 기반의 이력서 PDF 저장 기능을 구현했습니다.",
          "Web API와 mouseup 이벤트를 활용해 텍스트 드래그 기반 이력서 수정 UI/UX를 라이브러리 없이 구현했습니다.",
          "이력서 생성 40~60초 대기 UX를 개선하기 위해 promise 상태 기반 toast로 진행 상태를 시각화했습니다.",
          "Sentry를 활용한 에러 추적 시스템을 구축했습니다.",
        ],
        projectDescription:
          "Github 데이터와 LLM 분석을 활용한 이력서 자동 생성 서비스입니다. 6인 팀 프로젝트에서 기획, 프론트엔드 개발, 팀장을 담당했습니다.",
        troubleShooting: createTroubleShooting(
          "생성 시간이 길어 사용자가 한 화면에서 대기해야 하는 UX가 좋지 않았습니다.",
          "로딩 상태를 단순 스피너로만 보여주면 이탈 가능성이 높다고 봤습니다.",
          "비동기 요청 상태를 추적하면서 toast를 promise 단계에 맞춰 구성해 진행 상태를 계속 보여줬습니다.",
          "긴 생성 시간에도 사용자가 현재 진행 상태를 이해할 수 있게 되어 UX 불만을 줄였습니다.",
        ),
      },
      {
        template: "GITFOLIO",
        projectName: "피카부",
        projectStartedAt: "2024-07-01",
        projectEndedAt: "2024-10-31",
        skillSet:
          "TypeScript, Next.js 14 App Router, Tailwind CSS, Zustand, TanStack Query v5, RAG",
        repoLink:
          "https://github.com/kakaotech-bootcamp-11/ktb-11-project-1-chatbot-fe",
        roleAndTask: [
          "ReadableStream의 reader를 활용해 text/event-stream 응답을 실시간 스트리밍 처리했습니다.",
          "TanStack Query와 Zustand 조합으로 비동기 상태를 최적화해 첫 AI 응답 시간을 평균 5초에서 1초 수준으로 줄였습니다.",
          "페이지 우측 정보 위젯들을 구현하고, 드래그 앤 드롭으로 순서를 변경할 수 있도록 설계했습니다.",
          "반응형 웹 디자인을 통해 다양한 디바이스에서 최적의 컴포넌트 배치를 적용했습니다.",
          "RAG 기반 LLM 모델 파이프라인 구축에도 참여했습니다.",
        ],
        projectDescription:
          "카카오테크 부트캠프 관련 공지와 일정을 빠르게 찾고 답변받을 수 있게 만든 AI 챗봇 서비스입니다.",
        troubleShooting: createTroubleShooting(
          "사용자가 첫 AI 응답을 받기까지 평균 5초 정도가 걸려 답답함을 느꼈습니다.",
          "응답 스트리밍과 상태 관리 구조를 개선하면 체감 대기 시간을 크게 줄일 수 있다고 판단했습니다.",
          "스트리밍 처리를 도입하고 비동기 상태 관리를 재구성했습니다.",
          "첫 응답 체감 시간을 약 80% 단축했습니다.",
        ),
      },
    ],
    activities: [
      {
        activityName: "카카오테크 부트캠프 1기 - 풀스택 과정",
        activityYear: 2024,
        activityDescription: "2024.07 ~ 2024.12",
        activityOrganization: "카카오테크 부트캠프",
      },
      {
        activityName: "예비창업패키지",
        activityYear: 2023,
        activityDescription: "2023.04 ~ 2023.12",
        activityOrganization: "창업 지원 프로그램",
      },
      {
        activityName: "패스트캠퍼스 국비지원 교육",
        activityYear: 2023,
        activityDescription: "2023.02 ~ 2023.04",
        activityOrganization: "패스트캠퍼스",
      },
      {
        activityName: "교내 창업동아리",
        activityYear: 2022,
        activityDescription:
          "기획 및 MVP 단계의 앱을 React Native와 Express.js로 제작했고, 혁신창업스쿨 2기 이수 및 다수의 창업 관련 수상을 경험했습니다.",
        activityOrganization: "혁신창업스쿨 / 창업동아리",
      },
      {
        activityName: "2022 한이음 공모전",
        activityYear: 2022,
        activityDescription:
          "AI 음성 기반 챗봇 주문·예약·예매 시스템 모바일 앱을 설계 및 제작하며 React Native와 Express.js를 담당했습니다.",
        activityOrganization: "과학기술정보통신부 / 한국정보산업연합회",
      },
    ],
    links: [
      {
        linkTitle: "GitHub",
        linkUrl: "https://github.com/speardragon",
      },
      {
        linkTitle: "Portfolio",
        linkUrl:
          "https://www.notion.so/ChangRyong-s-Profile-138c33a8915b806593ebc4fb1b29d727",
      },
      {
        linkTitle: "Email",
        linkUrl: "mailto:iopp6090@gmail.com",
      },
    ],
    updatedAt: "2026-03-20T09:00:00.000Z",
  };
};

export const initialResumeRecords = resumeSeeds
  .map(createResumeRecord)
  .map(enrichResumeRecord)
  .map(overrideSpeardragonResume);

export const initialRepositories = [
  "startup-partners",
  "gitfolio-front",
  "resume-lab",
  "openclaw-playground",
  "admin-console",
  "knowledge-assistant",
  "platform-delivery",
  "commerce-growth",
  "field-service-pwa",
  "delivery-template",
  "frontend-utils",
  "factory-vision",
].map((repoName, index) => ({
  repoId: index + 1,
  repoName,
  repoUrl: `https://github.com/speardragon/${repoName}`,
  topLanguage:
    [
      "TypeScript",
      "TypeScript",
      "TypeScript",
      "TypeScript",
      "TypeScript",
      "Python",
      "HCL",
      "TypeScript",
      "TypeScript",
      "HCL",
      "TypeScript",
      "Python",
    ][index] ?? "TypeScript",
  updatedAt: new Date(Date.UTC(2026, 2, 1 + index, 9, 0, 0)).toISOString(),
}));

const baseComments: ResumeComment[] = [
  {
    id: 1,
    resumeId: "mine-1",
    memberId: 2,
    nickname: "김서윤",
    avatarUrl: createAvatarUrl(2),
    content: "운영 문제를 제품 경험으로 풀어낸 과정이 선명해서 인상적이네요.",
    createdAt: "2026-03-15T08:10:00.000Z",
    updatedAt: "2026-03-15T08:10:00.000Z",
  },
  {
    id: 2,
    resumeId: "resume-102",
    memberId: 1,
    nickname: "강창룡",
    avatarUrl: createAvatarUrl(1),
    content: "부하 테스트와 재처리 전략을 같이 적어둔 점이 좋았습니다.",
    createdAt: "2026-03-16T11:20:00.000Z",
    updatedAt: "2026-03-16T11:20:00.000Z",
  },
  {
    id: 3,
    resumeId: "resume-110",
    memberId: 3,
    nickname: "박도현",
    avatarUrl: createAvatarUrl(3),
    content: "접근성 개선을 실제 완료율과 연결한 부분이 설득력 있습니다.",
    createdAt: "2026-03-17T15:45:00.000Z",
    updatedAt: "2026-03-17T15:45:00.000Z",
  },
];

const generatedComments: ResumeComment[] = initialResumeRecords.flatMap(
  (resume, index) => {
    const authors = [
      { memberId: 21, nickname: "리크루터수진" },
      { memberId: 22, nickname: "프론트엔드짱" },
      { memberId: 23, nickname: "백엔드메이트" },
    ];

    return authors.map((author, authorIndex) => ({
      id: baseComments.length + index * authors.length + authorIndex + 1,
      resumeId: resume.resumeId,
      memberId: author.memberId,
      nickname: author.nickname,
      avatarUrl: createAvatarUrl(author.memberId),
      content: [
        `${resume.memberName}님의 ${resume.projects[0]?.projectName ?? "프로젝트"} 설명이 구체적이라 이해가 잘 됩니다.`,
        `문제 정의와 해결 흐름이 자연스럽게 이어져서 읽기 좋았습니다. 특히 ${resume.techStack[0]} 경험이 잘 보입니다.`,
        `성과를 숫자와 운영 맥락으로 더 적어둔 부분이 좋아요. ${resume.position} 포지션 강점이 잘 드러납니다.`,
      ][authorIndex],
      createdAt: `2026-03-${String((index % 18) + authorIndex + 1).padStart(2, "0")}T${String(authorIndex + 8).padStart(2, "0")}:15:00.000Z`,
      updatedAt: `2026-03-${String((index % 18) + authorIndex + 1).padStart(2, "0")}T${String(authorIndex + 8).padStart(2, "0")}:15:00.000Z`,
    }));
  },
);

export const initialComments: ResumeComment[] = [
  ...baseComments,
  ...generatedComments,
];

export const initialNotifications: Notification[] = [
  {
    notificationId: 1,
    resumeId: "mine-1",
    senderId: 2,
    senderNickname: "김서윤",
    receiverId: 1,
    type: "COMMENT",
    isRead: false,
  },
  {
    notificationId: 2,
    resumeId: "mine-3",
    senderId: 3,
    senderNickname: "박도현",
    receiverId: 1,
    type: "LIKE",
    isRead: false,
  },
  {
    notificationId: 3,
    resumeId: "mine-5",
    senderId: 4,
    senderNickname: "최유진",
    receiverId: 1,
    type: "COMMENT",
    isRead: true,
  },
];
