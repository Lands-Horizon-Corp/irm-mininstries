import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import type { MinistrySkillsFormData } from "./ministry-skills-validation";

interface SubmitMinistrySkillResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// API service function
const submitMinistrySkill = async (
  data: MinistrySkillsFormData
): Promise<SubmitMinistrySkillResponse> => {
  const response = await fetch("/api/ministry-skills", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to submit ministry skill");
  }

  return result;
};

// React Query hook
export const useSubmitMinistrySkill = () => {
  return useMutation({
    mutationFn: submitMinistrySkill,
    onSuccess: () => {
      toast.success("Ministry skill submitted successfully!", {
        description: "Your ministry skill has been added to our database.",
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to submit ministry skill", {
        description: error.message || "Please try again later",
      });
    },
  });
};
