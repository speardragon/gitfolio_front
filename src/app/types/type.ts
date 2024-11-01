/** 교육 */
export const schoolTypeMap = {
  PRIVATE_EDUCATION: "사설 교육",
  HIGH_SCHOOL: "고등학교",
  UNIVERSITY_ASSOCIATE_DEGREE: "대학교(전문학사)",
  UNIVERSITY_BACHELOR: "대학교(학사)",
  GRADUATE_SCHOOL_MASTER: "대학원(석사)",
  GRADUATE_SCHOOL_DOCTOR: "대학원(박사)",
} as const;

export const graduationStatusMap = {
  GRADUATED: "졸업",
  ATTENDING: "재학중",
  DROP_OUT: "중퇴",
} as const;

export type SchoolType = keyof typeof schoolTypeMap;
export type GraduationStatus = keyof typeof graduationStatusMap;

/** 경력 */
export const workTypeMap = {
  INTERN: "인턴",
  CONTRACT_WORKER: "계약직",
  FULL_TIME: "정규직",
  PRIVATE_BUSINESS: "개인사업",
  FREELANCER: "프리랜서",
} as const;

export type WorkType = keyof typeof workTypeMap;

/** 직군 */
export const positionTypeMap = {
  BACKEND: "백엔드",
  FRONTEND: "프론트엔드",
  INFRA: "인프라",
  AI: "인공지능",
  GAME: "게임",
} as const;

export type PositionType = keyof typeof positionTypeMap;
