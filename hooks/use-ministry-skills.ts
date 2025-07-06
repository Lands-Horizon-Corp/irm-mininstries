import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { MinistrySkills } from "@/types/common"

async function fetchMinistrySkills(): Promise<MinistrySkills[]> {
  const response = await fetch("/api/ministry-skills")
  if (!response.ok) throw new Error("Failed to fetch ministry skills")
  return response.json()
}

async function createMinistrySkill(
  data: Omit<MinistrySkills, "id" | "createdAt" | "updatedAt">
): Promise<MinistrySkills> {
  const response = await fetch("/api/ministry-skills", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to create ministry skill")
  return response.json()
}

async function updateMinistrySkill(
  id: number,
  data: Omit<MinistrySkills, "id" | "createdAt" | "updatedAt">
): Promise<MinistrySkills> {
  const response = await fetch(`/api/ministry-skills/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to update ministry skill")
  return response.json()
}

async function deleteMinistrySkill(id: number): Promise<void> {
  const response = await fetch(`/api/ministry-skills/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) throw new Error("Failed to delete ministry skill")
}

export function useMinistrySkills() {
  const queryClient = useQueryClient()
  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["ministry-skills"],
    queryFn: fetchMinistrySkills,
    staleTime: 2 * 60 * 1000,
  })

  const createMutation = useMutation({
    mutationFn: createMinistrySkill,
    onSuccess: () => {
      toast.success("Ministry skill created!")
      queryClient.invalidateQueries({ queryKey: ["ministry-skills"] })
    },
    onError: () => toast.error("Failed to create ministry skill"),
  })

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: Omit<MinistrySkills, "id" | "createdAt" | "updatedAt">
    }) => updateMinistrySkill(id, data),
    onSuccess: () => {
      toast.success("Ministry skill updated!")
      queryClient.invalidateQueries({ queryKey: ["ministry-skills"] })
    },
    onError: () => toast.error("Failed to update ministry skill"),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteMinistrySkill,
    onSuccess: () => {
      toast.success("Ministry skill deleted!")
      queryClient.invalidateQueries({ queryKey: ["ministry-skills"] })
    },
    onError: () => toast.error("Failed to delete ministry skill"),
  })

  return {
    ministrySkills: data,
    isLoading,
    error,
    refetch,
    createMinistrySkill: createMutation.mutateAsync,
    updateMinistrySkill: updateMutation.mutateAsync,
    deleteMinistrySkill: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
