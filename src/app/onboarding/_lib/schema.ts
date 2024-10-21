import { z } from "zod";

export const OnboardingFormSchema = z.object({
  name: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().optional(),
  position: z.string().optional(),

  // avatarUrl: z.string().optional().default("/images/gitfolio-logo.png"), // 프로필 사진 기본값 설정

  workExperiences: z
    .array(
      z.object({
        companyName: z.string().optional(),
        role: z.string().optional(),
        departmentName: z.string().optional(),
        workTime: z.string().optional(),
        employmentStatus: z.string().optional(),
        workStartedAt: z.string().optional(),
        workEndedAt: z.string().optional(),
      })
    )
    .optional(),

  educations: z
    .array(
      z.object({
        schoolType: z.string().optional(),
        schoolName: z.string().optional(),
        major: z.string().optional(),
        graduationStatus: z.string().optional(),
        enrollmentStartAt: z.string().optional(),
        enrollmentEndedAt: z.string().optional(),
      })
    )
    .optional(),

  links: z
    .array(
      z.object({
        linkUrl: z.string().optional(),
        linkTitle: z.string().optional(),
      })
    )
    .optional(),

  certificates: z
    .array(
      z.object({
        certificateName: z.string().optional(),
        certificateGrade: z.string().optional(),
        certificateOrganization: z.string().optional(),
        certificatedAt: z.string().optional(),
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
