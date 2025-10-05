import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { Member } from "@/modules/member/member-schema";
import type { ministers } from "@/modules/ministry/ministry-schema";

import type { Church } from "./church-schema";
import type { ChurchFormData } from "./church-validation";

type Minister = typeof ministers.$inferSelect;

// Types
interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

interface ChurchStats {
  churchId: number;
  memberCount: number;
  ministerCount: number;
  totalPeople: number;
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

interface GetChurchesParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface GetChurchPeopleParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// API service functions

// Get all churches with pagination and search
const getChurches = async (
  params: GetChurchesParams = {}
): Promise<PaginatedResponse<Church>> => {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set("page", params.page.toString());
  if (params.limit) searchParams.set("limit", params.limit.toString());
  if (params.search) searchParams.set("search", params.search);
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

  const response = await fetch(`/api/churches?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch churches");
  }

  return result;
};

// Get all churches without pagination (with optional search)
const getAllChurches = async (
  search?: string
): Promise<ApiResponse<Church[]>> => {
  const searchParams = new URLSearchParams();

  if (search) searchParams.set("search", search);
  searchParams.set("all", "true"); // Flag to indicate we want all results

  const response = await fetch(`/api/churches?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch churches");
  }

  return result;
};

// Get church by ID
const getChurchById = async (id: number): Promise<ApiResponse<Church>> => {
  const response = await fetch(`/api/churches/${id}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch church");
  }

  return result;
};

// Get church statistics (member and minister counts)
const getChurchStats = async (
  id: number
): Promise<ApiResponse<ChurchStats>> => {
  const response = await fetch(`/api/churches/${id}/stats`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch church statistics");
  }

  return result;
};

// Get church members
const getChurchMembers = async (
  churchId: number,
  params: GetChurchPeopleParams = {}
): Promise<{ data: Member[]; pagination: PaginationInfo }> => {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set("page", params.page.toString());
  if (params.limit) searchParams.set("limit", params.limit.toString());
  if (params.search) searchParams.set("search", params.search);
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

  const response = await fetch(
    `/api/churches/${churchId}/members?${searchParams.toString()}`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Get church ministers
const getChurchMinisters = async (
  churchId: number,
  params: GetChurchPeopleParams = {}
): Promise<{ data: Minister[]; pagination: PaginationInfo }> => {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set("page", params.page.toString());
  if (params.limit) searchParams.set("limit", params.limit.toString());
  if (params.search) searchParams.set("search", params.search);
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

  const response = await fetch(
    `/api/churches/${churchId}/ministers?${searchParams.toString()}`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Get all church members without pagination (with optional search)
const getAllChurchMembers = async (
  churchId: number,
  search?: string
): Promise<ApiResponse<Member[]>> => {
  const searchParams = new URLSearchParams();

  if (search) searchParams.set("search", search);
  searchParams.set("all", "true"); // Flag to indicate we want all results

  const response = await fetch(
    `/api/churches/${churchId}/members?${searchParams.toString()}`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch church members");
  }

  return result;
};

// Get all church ministers without pagination (with optional search)
const getAllChurchMinisters = async (
  churchId: number,
  search?: string
): Promise<ApiResponse<Minister[]>> => {
  const searchParams = new URLSearchParams();

  if (search) searchParams.set("search", search);
  searchParams.set("all", "true"); // Flag to indicate we want all results

  const response = await fetch(
    `/api/churches/${churchId}/ministers?${searchParams.toString()}`
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch church ministers");
  }

  return result;
};

// Create church
const createChurch = async (
  data: ChurchFormData
): Promise<ApiResponse<Church>> => {
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
    throw new Error(result.error || "Failed to create church");
  }

  return result;
};

// Update church
const updateChurch = async (
  id: number,
  data: ChurchFormData
): Promise<ApiResponse<Church>> => {
  const response = await fetch(`/api/churches/${id}`, {
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
    throw new Error(result.error || "Failed to update church");
  }

  return result;
};

// Delete church
const deleteChurch = async (id: number): Promise<ApiResponse> => {
  const response = await fetch(`/api/churches/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to delete church");
  }

  return result;
};

// React Query hooks

// Get all churches with pagination and search
export const useChurches = (params: GetChurchesParams = {}) => {
  return useQuery({
    queryKey: ["churches", params],
    queryFn: () => getChurches(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get all churches without pagination (with optional search)
export const useAllChurches = (search?: string) => {
  return useQuery({
    queryKey: ["all-churches", search],
    queryFn: () => getAllChurches(search),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get church by ID
export const useChurch = (id: number) => {
  return useQuery({
    queryKey: ["church", id],
    queryFn: () => getChurchById(id),
    enabled: !!id,
  });
};

// Get church statistics
export const useChurchStats = (id: number) => {
  return useQuery({
    queryKey: ["church-stats", id],
    queryFn: () => getChurchStats(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get church members
export const useChurchMembers = (
  churchId: number,
  params: GetChurchPeopleParams = {}
) => {
  return useQuery({
    queryKey: ["church-members", churchId, params],
    queryFn: () => getChurchMembers(churchId, params),
    enabled: !!churchId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get church ministers
export const useChurchMinisters = (
  churchId: number,
  params: GetChurchPeopleParams = {}
) => {
  return useQuery({
    queryKey: ["church-ministers", churchId, params],
    queryFn: () => getChurchMinisters(churchId, params),
    enabled: !!churchId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get all church members without pagination (with optional search)
export const useAllChurchMembers = (churchId: number, search?: string) => {
  return useQuery({
    queryKey: ["all-church-members", churchId, search],
    queryFn: () => getAllChurchMembers(churchId, search),
    enabled: !!churchId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get all church ministers without pagination (with optional search)
export const useAllChurchMinisters = (churchId: number, search?: string) => {
  return useQuery({
    queryKey: ["all-church-ministers", churchId, search],
    queryFn: () => getAllChurchMinisters(churchId, search),
    enabled: !!churchId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Create church
export const useCreateChurch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createChurch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["churches"] });
      toast.success("Church created successfully!", {
        description: "The church has been added to the database.",
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to create church", {
        description: error.message || "Please try again later",
      });
    },
  });
};

// Update church
export const useUpdateChurch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ChurchFormData }) =>
      updateChurch(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["churches"] });
      queryClient.invalidateQueries({ queryKey: ["church", id] });
      toast.success("Church updated successfully!", {
        description: "The church has been updated.",
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to update church", {
        description: error.message || "Please try again later",
      });
    },
  });
};

// Delete church
export const useDeleteChurch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteChurch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["churches"] });
      toast.success("Church deleted successfully!", {
        description: "The church has been removed from the database.",
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to delete church", {
        description: error.message || "Please try again later",
      });
    },
  });
};

// Legacy hook for backwards compatibility
export const useSubmitChurch = useCreateChurch;
