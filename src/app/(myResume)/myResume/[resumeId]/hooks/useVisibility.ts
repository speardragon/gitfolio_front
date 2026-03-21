import { useState } from "react";
import { useMyResumeVisibilityMutation } from "../../_hooks/useMyResumeVisibilityMutation";

export const useVisibility = (resume: any, resumeId: string) => {
  const [visibilityOverride, setVisibilityOverride] = useState<boolean | null>(
    null,
  );
  const { mutate } = useMyResumeVisibilityMutation(resumeId);
  const visibility =
    visibilityOverride ?? (resume?.result.visibility === "PUBLIC");

  const handleToggleVisibility = () => {
    const newVisibility = !visibility;

    setVisibilityOverride(newVisibility);
    mutate(newVisibility ? "PUBLIC" : "PRIVATE", {
      onError: () => {
        setVisibilityOverride(null);
      },
      onSuccess: () => {
        setVisibilityOverride(null);
      },
    });
  };

  return {
    visibility,
    handleToggleVisibility,
  };
};
