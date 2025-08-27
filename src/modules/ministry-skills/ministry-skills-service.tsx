import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { MinistrySkill } from "./ministry-skills-schema";
import type { MinistrySkillsFormData } from "./ministry-skills-validation";

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

interface GetMinistrySkillsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// API service functions

// Get all ministry skills with pagination and search
const getMinistrySkills = async (
  params: GetMinistrySkillsParams = {}
): Promise<PaginatedResponse<MinistrySkill>> => {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set("page", params.page.toString());
  if (params.limit) searchParams.set("limit", params.limit.toString());
  if (params.search) searchParams.set("search", params.search);
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

  const response = await fetch(
    `/api/ministry-skills?${searchParams.toString()}`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch ministry skills");
  }

  return result;
};

// Get ministry skill by ID
const getMinistrySkillById = async (
  id: number
): Promise<ApiResponse<MinistrySkill>> => {
  const response = await fetch(`/api/ministry-skills/${id}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch ministry skill");
  }

  return result;
};

// Create ministry skill
const createMinistrySkill = async (
  data: MinistrySkillsFormData
): Promise<ApiResponse<MinistrySkill>> => {
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
    throw new Error(result.error || "Failed to create ministry skill");
  }

  return result;
};

// Update ministry skill
const updateMinistrySkill = async (
  id: number,
  data: MinistrySkillsFormData
): Promise<ApiResponse<MinistrySkill>> => {
  const response = await fetch(`/api/ministry-skills/${id}`, {
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
    throw new Error(result.error || "Failed to update ministry skill");
  }

  return result;
};

// Delete ministry skill
const deleteMinistrySkill = async (id: number): Promise<ApiResponse> => {
  const response = await fetch(`/api/ministry-skills/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to delete ministry skill");
  }

  return result;
};

// React Query hooks

// Get all ministry skills with pagination and search
export const useMinistrySkills = (params: GetMinistrySkillsParams = {}) => {
  return useQuery({
    queryKey: ["ministry-skills", params],
    queryFn: () => getMinistrySkills(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get ministry skill by ID
export const useMinistrySkill = (id: number) => {
  return useQuery({
    queryKey: ["ministry-skill", id],
    queryFn: () => getMinistrySkillById(id),
    enabled: !!id,
  });
};

// Create ministry skill
export const useCreateMinistrySkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMinistrySkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ministry-skills"] });
      toast.success("Ministry skill created successfully!", {
        description: "The ministry skill has been added to the database.",
      });
    },
    onError: (error: Error) => {
      // Handle unique constraint violation
      if (
        error.message.includes("duplicate key") ||
        error.message.includes("already exists")
      ) {
        toast.error("Name already exists", {
          description:
            "A ministry skill with this name already exists. Please choose a different name.",
        });
      } else {
        toast.error("Failed to create ministry skill", {
          description: error.message || "Please try again later",
        });
      }
    },
  });
};

// Update ministry skill
export const useUpdateMinistrySkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: MinistrySkillsFormData }) =>
      updateMinistrySkill(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["ministry-skills"] });
      queryClient.invalidateQueries({ queryKey: ["ministry-skill", id] });
      toast.success("Ministry skill updated successfully!", {
        description: "The ministry skill has been updated.",
      });
    },
    onError: (error: Error) => {
      // Handle unique constraint violation
      if (
        error.message.includes("duplicate key") ||
        error.message.includes("already exists")
      ) {
        toast.error("Name already exists", {
          description:
            "A ministry skill with this name already exists. Please choose a different name.",
        });
      } else {
        toast.error("Failed to update ministry skill", {
          description: error.message || "Please try again later",
        });
      }
    },
  });
};

// Delete ministry skill
export const useDeleteMinistrySkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMinistrySkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ministry-skills"] });
      toast.success("Ministry skill deleted successfully!", {
        description: "The ministry skill has been removed from the database.",
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to delete ministry skill", {
        description: error.message || "Please try again later",
      });
    },
  });
};

// Legacy hook for backwards compatibility
export const useSubmitMinistrySkill = useCreateMinistrySkill;
