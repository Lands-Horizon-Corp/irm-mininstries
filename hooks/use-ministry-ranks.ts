import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { MinistryRanks } from "@/types/common"

async function fetchMinistryRanks(): Promise<MinistryRanks[]> {
  const response = await fetch("/api/ministry-ranks")
  if (!response.ok) throw new Error("Failed to fetch ministry ranks")
  return response.json()
}

async function createMinistryRank(
  data: Omit<MinistryRanks, "id" | "createdAt" | "updatedAt">
): Promise<MinistryRanks> {
  const response = await fetch("/api/ministry-ranks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to create ministry rank")
  return response.json()
}

async function updateMinistryRank(
  id: number,
  data: Omit<MinistryRanks, "id" | "createdAt" | "updatedAt">
): Promise<MinistryRanks> {
  const response = await fetch(`/api/ministry-ranks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to update ministry rank")
  return response.json()
}

async function deleteMinistryRank(id: number): Promise<void> {
  const response = await fetch(`/api/ministry-ranks/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) throw new Error("Failed to delete ministry rank")
}

export function useMinistryRanks() {
  const queryClient = useQueryClient()
  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["ministry-ranks"],
    queryFn: fetchMinistryRanks,
    staleTime: 2 * 60 * 1000,
  })

  const createMutation = useMutation({
    mutationFn: createMinistryRank,
    onSuccess: () => {
      toast.success("Ministry rank created!")
      queryClient.invalidateQueries({ queryKey: ["ministry-ranks"] })
    },
    onError: () => toast.error("Failed to create ministry rank"),
  })

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: Omit<MinistryRanks, "id" | "createdAt" | "updatedAt">
    }) => updateMinistryRank(id, data),
    onSuccess: () => {
      toast.success("Ministry rank updated!")
      queryClient.invalidateQueries({ queryKey: ["ministry-ranks"] })
    },
    onError: () => toast.error("Failed to update ministry rank"),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteMinistryRank,
    onSuccess: () => {
      toast.success("Ministry rank deleted!")
      queryClient.invalidateQueries({ queryKey: ["ministry-ranks"] })
    },
    onError: () => toast.error("Failed to delete ministry rank"),
  })

  return {
    ministryRanks: data,
    isLoading,
    error,
    refetch,
    createMinistryRank: createMutation.mutateAsync,
    updateMinistryRank: updateMutation.mutateAsync,
    deleteMinistryRank: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
