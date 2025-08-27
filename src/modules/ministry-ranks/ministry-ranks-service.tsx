import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { MinistryRank } from "./ministry-ranks-schema";
import type { MinistryRanksFormData } from "./ministry-ranks-validation";

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

interface GetMinistryRanksParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// API service functions

// Get all ministry ranks with pagination and search
const getMinistryRanks = async (
  params: GetMinistryRanksParams = {}
): Promise<PaginatedResponse<MinistryRank>> => {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set("page", params.page.toString());
  if (params.limit) searchParams.set("limit", params.limit.toString());
  if (params.search) searchParams.set("search", params.search);
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

  const response = await fetch(
    `/api/ministry-ranks?${searchParams.toString()}`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch ministry ranks");
  }

  return result;
};

// Get ministry rank by ID
const getMinistryRankById = async (
  id: number
): Promise<ApiResponse<MinistryRank>> => {
  const response = await fetch(`/api/ministry-ranks/${id}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch ministry rank");
  }

  return result;
};

// Create ministry rank
const createMinistryRank = async (
  data: MinistryRanksFormData
): Promise<ApiResponse<MinistryRank>> => {
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
    throw new Error(result.error || "Failed to create ministry rank");
  }

  return result;
};

// Update ministry rank
const updateMinistryRank = async (
  id: number,
  data: MinistryRanksFormData
): Promise<ApiResponse<MinistryRank>> => {
  const response = await fetch(`/api/ministry-ranks/${id}`, {
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
    throw new Error(result.error || "Failed to update ministry rank");
  }

  return result;
};

// Delete ministry rank
const deleteMinistryRank = async (id: number): Promise<ApiResponse> => {
  const response = await fetch(`/api/ministry-ranks/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to delete ministry rank");
  }

  return result;
};

// React Query hooks

// Get all ministry ranks with pagination and search
export const useMinistryRanks = (params: GetMinistryRanksParams = {}) => {
  return useQuery({
    queryKey: ["ministry-ranks", params],
    queryFn: () => getMinistryRanks(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get ministry rank by ID
export const useMinistryRank = (id: number) => {
  return useQuery({
    queryKey: ["ministry-rank", id],
    queryFn: () => getMinistryRankById(id),
    enabled: !!id,
  });
};

// Create ministry rank
export const useCreateMinistryRank = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMinistryRank,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ministry-ranks"] });
      toast.success("Ministry rank created successfully!", {
        description: "The ministry rank has been added to the database.",
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
            "A ministry rank with this name already exists. Please choose a different name.",
        });
      } else {
        toast.error("Failed to create ministry rank", {
          description: error.message || "Please try again later",
        });
      }
    },
  });
};

// Update ministry rank
export const useUpdateMinistryRank = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: MinistryRanksFormData }) =>
      updateMinistryRank(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["ministry-ranks"] });
      queryClient.invalidateQueries({ queryKey: ["ministry-rank", id] });
      toast.success("Ministry rank updated successfully!", {
        description: "The ministry rank has been updated.",
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
            "A ministry rank with this name already exists. Please choose a different name.",
        });
      } else {
        toast.error("Failed to update ministry rank", {
          description: error.message || "Please try again later",
        });
      }
    },
  });
};

// Delete ministry rank
export const useDeleteMinistryRank = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMinistryRank,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ministry-ranks"] });
      toast.success("Ministry rank deleted successfully!", {
        description: "The ministry rank has been removed from the database.",
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to delete ministry rank", {
        description: error.message || "Please try again later",
      });
    },
  });
};

// Legacy hook for backwards compatibility
export const useSubmitMinistryRank = useCreateMinistryRank;
