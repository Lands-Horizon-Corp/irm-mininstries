import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { Member } from "./member-validation";

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

interface GetMembersParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Simplified Member type for list view
interface MemberSummary {
  id: number;
  churchId: number;
  firstName: string;
  lastName: string;
  middleName: string | null;
  gender: "male" | "female";
  email: string | null;
  mobileNumber: string | null;
  yearJoined: number;
  ministryInvolvement: string | null;
  occupation: string | null;
  profilePicture: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// API service functions

// Get all members with pagination and search
const getMembers = async (
  params: GetMembersParams = {}
): Promise<PaginatedResponse<MemberSummary>> => {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set("page", params.page.toString());
  if (params.limit) searchParams.set("limit", params.limit.toString());
  if (params.search) searchParams.set("search", params.search);
  if (params.isActive !== undefined)
    searchParams.set("isActive", params.isActive.toString());
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

  const response = await fetch(`/api/member?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch members");
  }

  return result;
};

// Get member by ID with full details
const getMemberById = async (id: number): Promise<ApiResponse<Member>> => {
  const response = await fetch(`/api/member/${id}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch member");
  }

  return result;
};

// Create new member
const createMember = async (
  memberData: Member
): Promise<ApiResponse<Member>> => {
  const response = await fetch("/api/member", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(memberData),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to create member");
  }

  return result;
};

// Update existing member
const updateMember = async (
  id: number,
  memberData: Partial<Member>
): Promise<ApiResponse<Member>> => {
  const response = await fetch(`/api/member/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(memberData),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to update member");
  }

  return result;
};

// Delete member
const deleteMember = async (id: number): Promise<ApiResponse<void>> => {
  const response = await fetch(`/api/member/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || "Failed to delete member");
  }

  return result;
};

// React Query hooks

// Hook to get paginated members
export const useMembers = (params: GetMembersParams = {}) => {
  return useQuery({
    queryKey: ["members", params],
    queryFn: () => getMembers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get single member
export const useMember = (id: number) => {
  return useQuery({
    queryKey: ["member", id],
    queryFn: () => getMemberById(id),
    enabled: !!id,
  });
};

// Hook to create member
export const useCreateMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMember,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast.success(data.message || "Member created successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create member");
    },
  });
};

// Hook to update member
export const useUpdateMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Member> }) =>
      updateMember(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["member", variables.id] });
      toast.success(data.message || "Member updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update member");
    },
  });
};

// Hook to delete member
export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMember,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast.success(data.message || "Member deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete member");
    },
  });
};
