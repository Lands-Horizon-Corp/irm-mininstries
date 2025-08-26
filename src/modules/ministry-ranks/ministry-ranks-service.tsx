import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import type { MinistryRanksFormData } from "./ministry-ranks-validation";

interface SubmitMinistryRankResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// API service function
const submitMinistryRank = async (
  data: MinistryRanksFormData
): Promise<SubmitMinistryRankResponse> => {
  const response = await fetch("/api/ministry-ranks", {
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
    throw new Error(result.error || "Failed to submit ministry rank");
  }

  return result;
};

// React Query hook
export const useSubmitMinistryRank = () => {
  return useMutation({
    mutationFn: submitMinistryRank,
    onSuccess: () => {
      toast.success("Ministry rank submitted successfully!", {
        description: "Your ministry rank has been added to our database.",
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to submit ministry rank", {
        description: error.message || "Please try again later",
      });
    },
  });
};
