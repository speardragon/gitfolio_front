import customFetch from "@/app/api/customFetch";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

interface WorkExperience {
  companyName: string;
  departmentName: string;
  role: string;
  workType: string;
  employmentStatus: string;
  startedAt: string | null;
  endedAt: string | null;
}

interface Education {
  schoolType: string;
  schoolName: string;
  major: string;
  graduationStatus: string;
  startedAt: string | null;
  endedAt: string | null;
}

interface Certificate {
  certificateName: string;
  certificateGrade: string;
  certificatedAt: string;
  certificateOrganization: string;
}

interface Activity {
  activityName: string;
  activityYear: number;
  activityDescription: string;
  activityOrganization: string;
}

interface Link {
  linkTitle: string;
  linkUrl: string;
}

export interface ProfileResult {
  memberId: number;
  memberAdditionalInfoId: string;
  nickname: string;
  name: string;
  username: string;
  avatarUrl: string;
  phoneNumber: string;
  email: string;
  position: string;
  workExperiences: WorkExperience[];
  educations: Education[];
  certificates: Certificate[];
  activities: Activity[];
  links: Link[];
  paidPlan: string;
  remainingCount: number;
}

interface ProfileApiResponse {
  time: string;
  status: string;
  code: string;
  message: string;
  result: ProfileResult;
}

const getUserProfile = async () => {
  const response = await customFetch(
    `/api/members/me`,
    // `${process.env.NEXT_PUBLIC_MEMBERS_SERVER_URL}/api/members/me`,
    {
      method: "GET",
      credentials: "include",
    },
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data: ProfileApiResponse = await response.json();
  return data || "";
};
export const useProfileQuery = () => {
  const authenticated = useAuthStore((state) => state.authenticated);
  const accessToken = useAuthStore((state) => state.accessToken);
  const setUser = useAuthStore((state) => state.setUser);

  const query = useQuery<ProfileApiResponse>({
    queryKey: ["profile"],
    queryFn: () => getUserProfile(),
    enabled: authenticated || Boolean(accessToken),
  });

  useEffect(() => {
    if (query.data?.result) {
      setUser(query.data.result);
    }
  }, [query.data, setUser]);

  return query;
};
