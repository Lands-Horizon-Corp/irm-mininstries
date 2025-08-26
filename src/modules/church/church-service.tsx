import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ChurchFormData } from "./church-validation";

interface SubmitChurchResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    id: string;
    timestamp: string;
  };
}

// API service function
const submitChurch = async (
  data: ChurchFormData
): Promise<SubmitChurchResponse> => {
  const response = await fetch("/api/churches", {
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
    throw new Error(result.error || "Failed to submit church");
  }

  return result;
};

// React Query hook
export const useSubmitChurch = () => {
  return useMutation({
    mutationFn: submitChurch,
    onSuccess: () => {
      toast.success("Church added successfully!", {
        description: "The church has been added to our database.",
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to add church", {
        description: error.message || "Please try again later",
      });
    },
  });
};
