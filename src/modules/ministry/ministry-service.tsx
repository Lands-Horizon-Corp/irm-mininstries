import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import type { Member } from "./ministry-validation";

interface SubmitMemberResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    id: string;
    timestamp: string;
  };
}

// API service function
const submitMember = async (data: Member): Promise<SubmitMemberResponse> => {
  const response = await fetch("/api/members", {
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
    throw new Error(result.error || "Failed to submit member");
  }

  return result;
};

// React Query hook
export const useSubmitMember = () => {
  return useMutation({
    mutationFn: submitMember,
    onSuccess: () => {
      toast.success("Member added successfully!", {
        description: "The member has been added to our ministry database.",
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to add member", {
        description: error.message || "Please try again later",
      });
    },
  });
};
