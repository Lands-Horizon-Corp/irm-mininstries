import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import type { Minister } from "./ministry-validation";

interface SubmitMinisterResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    id: string;
    timestamp: string;
  };
}

// API service function
const submitMinister = async (
  data: Minister
): Promise<SubmitMinisterResponse> => {
  const response = await fetch("/api/minister", {
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
    throw new Error(result.error || "Failed to submit minister");
  }

  return result;
};

// React Query hook
export const useSubmitMinister = () => {
  return useMutation({
    mutationFn: submitMinister,
    onSuccess: () => {
      toast.success("Minister added successfully!", {
        description: "The minister has been added to our ministry database.",
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to add minister", {
        description: error.message || "Please try again later",
      });
    },
  });
};
