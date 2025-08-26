import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ContactFormData } from "./contact-us-validation";

interface SubmitContactResponse {
  success: boolean;
  message?: string;
  error?: string;
}

const submitContactForm = async (
  data: ContactFormData
): Promise<SubmitContactResponse> => {
  const response = await fetch("/api/contact", {
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
    throw new Error(result.error || "Failed to submit form");
  }
  return result;
};

// React Query hook
export const useSubmitContactForm = () => {
  return useMutation({
    mutationFn: submitContactForm,
    onSuccess: () => {
      toast.success("Message sent successfully!", {
        description: "Our ministry team will get back to you soon. God bless!",
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to send message", {
        description: error.message || "Please try again later",
      });
    },
  });
};
