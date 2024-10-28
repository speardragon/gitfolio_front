import { useQuery } from "@tanstack/react-query";

interface Result {
  repoId: number;
  repoName: string;
  repoUrl: string;
  topLanguage: string;
  updatedAt: string;
}

interface ApiResponse {
  time: string;
  status: string;
  code: string;
  message: string;
  result: Result[];
}

const getMyRepositories = async (accessToken: string) => {
  const response = await fetch(`/api2/members/myRepo`, {
    method: "GET",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data: ApiResponse = await response.json();
  return data || "";
};
export const useRepositoryQuery = (accessToken: string) => {
  return useQuery<ApiResponse>({
    queryKey: ["repositories"],
    queryFn: () => getMyRepositories(accessToken),
    enabled: !!accessToken,
  });
};
