import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ContactSubmission } from "./contact-us-schema";
import type {
  ContactFormData,
  UpdateContactFormData,
} from "./contact-us-validation";

// Types
interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  search: string | null;
  sort: {
    by: string;
    order: string;
  };
}

interface GetContactSubmissionsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// API service functions

// Get all contact submissions with pagination and search
const getContactSubmissions = async (
  params: GetContactSubmissionsParams = {}
): Promise<PaginatedResponse<ContactSubmission>> => {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set("page", params.page.toString());
  if (params.limit) searchParams.set("limit", params.limit.toString());
  if (params.search) searchParams.set("search", params.search);
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

  const response = await fetch(`/api/contact?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch contact submissions");
  }

  return result;
};

// Get contact submission by ID
const getContactSubmissionById = async (
  id: number
): Promise<ApiResponse<ContactSubmission>> => {
  const response = await fetch(`/api/contact/${id}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch contact submission");
  }

  return result;
};

// Create contact submission
const createContactSubmission = async (
  data: ContactFormData
): Promise<ApiResponse<ContactSubmission>> => {
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
    throw new Error(result.error || "Failed to create contact submission");
  }

  return result;
};

// Update contact submission
const updateContactSubmission = async (
  id: number,
  data: UpdateContactFormData
): Promise<ApiResponse<ContactSubmission>> => {
  const response = await fetch(`/api/contact/${id}`, {
    method: "PUT",
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
    throw new Error(result.error || "Failed to update contact submission");
  }

  return result;
};

// Delete contact submission
const deleteContactSubmission = async (id: number): Promise<ApiResponse> => {
  const response = await fetch(`/api/contact/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to delete contact submission");
  }

  return result;
};

// React Query hooks

// Get all contact submissions with pagination and search
export const useContactSubmissions = (
  params: GetContactSubmissionsParams = {}
) => {
  return useQuery({
    queryKey: ["contact-submissions", params],
    queryFn: () => getContactSubmissions(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get contact submission by ID
export const useContactSubmission = (id: number) => {
  return useQuery({
    queryKey: ["contact-submission", id],
    queryFn: () => getContactSubmissionById(id),
    enabled: !!id,
  });
};

// Create contact submission
export const useCreateContactSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createContactSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-submissions"] });
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

// Update contact submission
export const useUpdateContactSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateContactFormData }) =>
      updateContactSubmission(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["contact-submissions"] });
      queryClient.invalidateQueries({ queryKey: ["contact-submission", id] });
      toast.success("Contact submission updated successfully!", {
        description: "The contact submission has been updated.",
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to update contact submission", {
        description: error.message || "Please try again later",
      });
    },
  });
};

// Delete contact submission
export const useDeleteContactSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteContactSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-submissions"] });
      toast.success("Contact submission deleted successfully!", {
        description:
          "The contact submission has been removed from the database.",
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to delete contact submission", {
        description: error.message || "Please try again later",
      });
    },
  });
};

// Legacy hook for backwards compatibility
export const useSubmitContactForm = useCreateContactSubmission;
