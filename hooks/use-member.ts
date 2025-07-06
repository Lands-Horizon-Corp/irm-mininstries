import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { Member } from "@/lib/member-schema"

async function fetchMembers(): Promise<Member[]> {
  const response = await fetch("/api/members")
  if (!response.ok) throw new Error("Failed to fetch members")
  return response.json()
}

async function createMember(
  data: Omit<Member, "id" | "createdAt" | "updatedAt">
): Promise<Member> {
  const response = await fetch("/api/members", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to create member")
  return response.json()
}

async function updateMember(
  id: number,
  data: Omit<Member, "id" | "createdAt" | "updatedAt">
): Promise<Member> {
  const response = await fetch(`/api/members/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to update member")
  return response.json()
}

async function deleteMember(id: number): Promise<void> {
  const response = await fetch(`/api/members/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) throw new Error("Failed to delete member")
}

export function useMembers() {
  const queryClient = useQueryClient()
  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["members"],
    queryFn: fetchMembers,
    staleTime: 2 * 60 * 1000,
  })

  const createMutation = useMutation({
    mutationFn: createMember,
    onSuccess: () => {
      toast.success("Member created!")
      queryClient.invalidateQueries({ queryKey: ["members"] })
    },
    onError: () => toast.error("Failed to create member"),
  })

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: Omit<Member, "id" | "createdAt" | "updatedAt">
    }) => updateMember(id, data),
    onSuccess: () => {
      toast.success("Member updated!")
      queryClient.invalidateQueries({ queryKey: ["members"] })
    },
    onError: () => toast.error("Failed to update member"),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteMember,
    onSuccess: () => {
      toast.success("Member deleted!")
      queryClient.invalidateQueries({ queryKey: ["members"] })
    },
    onError: () => toast.error("Failed to delete member"),
  })

  return {
    members: data,
    isLoading,
    error,
    refetch,
    createMember: createMutation.mutateAsync,
    updateMember: updateMutation.mutateAsync,
    deleteMember: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
