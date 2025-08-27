import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { generateMinisterPDF } from "./ministry-pdf";
import type { Minister } from "./ministry-validation";

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

interface GetMinistersParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Simplified Minister type for list view
interface MinisterSummary {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string | null;
  email: string | null;
  telephone: string | null;
  gender: "male" | "female";
  civilStatus: "single" | "married" | "widowed" | "separated" | "divorced";
  address: string;
  presentAddress: string;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// API service functions

// Get all ministers with pagination and search
const getMinisters = async (
  params: GetMinistersParams = {}
): Promise<PaginatedResponse<MinisterSummary>> => {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set("page", params.page.toString());
  if (params.limit) searchParams.set("limit", params.limit.toString());
  if (params.search) searchParams.set("search", params.search);
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

  const response = await fetch(`/api/minister?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch ministers");
  }

  return result;
};

// Get minister by ID with full details
const getMinisterById = async (id: number): Promise<ApiResponse<Minister>> => {
  const response = await fetch(`/api/minister/${id}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch minister");
  }

  return result;
};

// Create minister
const createMinister = async (
  data: Minister
): Promise<ApiResponse<Minister>> => {
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
    throw new Error(result.error || "Failed to create minister");
  }

  return result;
};

// Update minister
const updateMinister = async (
  id: number,
  data: Minister
): Promise<ApiResponse<Minister>> => {
  const response = await fetch(`/api/minister/${id}`, {
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
    throw new Error(result.error || "Failed to update minister");
  }

  return result;
};

// Delete minister
const deleteMinister = async (id: number): Promise<ApiResponse> => {
  const response = await fetch(`/api/minister/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to delete minister");
  }

  return result;
};

// React Query hooks

// Get all ministers with pagination and search
export const useMinisters = (params: GetMinistersParams = {}) => {
  return useQuery({
    queryKey: ["ministers", params],
    queryFn: () => getMinisters(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get minister by ID with full details
export const useMinister = (id: number) => {
  return useQuery({
    queryKey: ["minister", id],
    queryFn: () => getMinisterById(id),
    enabled: !!id,
  });
};

// Create minister
export const useCreateMinister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMinister,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ministers"] });
      toast.success("Minister created successfully!", {
        description: "The minister has been added to the ministry database.",
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to create minister", {
        description: error.message || "Please try again later",
      });
    },
  });
};

// Update minister
export const useUpdateMinister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Minister }) =>
      updateMinister(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["ministers"] });
      queryClient.invalidateQueries({ queryKey: ["minister", id] });
      toast.success("Minister updated successfully!", {
        description: "The minister information has been updated.",
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to update minister", {
        description: error.message || "Please try again later",
      });
    },
  });
};

// Delete minister
export const useDeleteMinister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMinister,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ministers"] });
      toast.success("Minister deleted successfully!", {
        description: "The minister has been removed from the database.",
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to delete minister", {
        description: error.message || "Please try again later",
      });
    },
  });
};

// Legacy hook for backwards compatibility
export const useSubmitMinister = useCreateMinister;

// PDF Download functionality
export const downloadMinisterPDF = async (ministerId: number) => {
  try {
    // Fetch minister data with full details
    const ministerResponse = await getMinisterById(ministerId);

    if (!ministerResponse.success || !ministerResponse.data) {
      throw new Error("Failed to fetch minister data");
    }

    const ministerData = ministerResponse.data;

    // Fetch lookup data for churches, ministry ranks, and skills
    const [churchesResponse, ranksResponse, skillsResponse] = await Promise.all(
      [
        fetch("/api/churches?limit=100").then((res) => res.json()),
        fetch("/api/ministry-ranks?limit=100").then((res) => res.json()),
        fetch("/api/ministry-skills?limit=200").then((res) => res.json()),
      ]
    );

    const lookupData = {
      churches: churchesResponse.success ? churchesResponse.data : [],
      ministryRanks: ranksResponse.success ? ranksResponse.data : [],
      ministrySkills: skillsResponse.success ? skillsResponse.data : [],
    };

    // Generate and download PDF
    await generateMinisterPDF(ministerData, lookupData);

    toast.success("PDF downloaded successfully");
  } catch (error) {
    console.error("Error downloading PDF:", error);
    toast.error("Failed to download PDF");
    throw error;
  }
};
