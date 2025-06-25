import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { ChurchCoverPhoto } from "@/types/common"

// API functions
async function fetchChurchCovers(): Promise<ChurchCoverPhoto[]> {
  const response = await fetch("/api/church-covers")
  if (!response.ok) {
    throw new Error("Failed to fetch church covers")
  }
  return response.json()
}

async function createChurchCover(
  cover: Omit<ChurchCoverPhoto, "id" | "createdAt" | "updatedAt">
): Promise<ChurchCoverPhoto> {
  const response = await fetch("/api/church-covers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cover),
  })
  if (!response.ok) {
    throw new Error("Failed to create church cover")
  }
  return response.json()
}

async function updateChurchCover(
  id: number,
  cover: Omit<ChurchCoverPhoto, "id" | "createdAt" | "updatedAt">
): Promise<ChurchCoverPhoto> {
  const response = await fetch(`/api/church-covers/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cover),
  })
  if (!response.ok) {
    throw new Error("Failed to update church cover")
  }
  return response.json()
}

async function deleteChurchCover(id: number): Promise<void> {
  const response = await fetch(`/api/church-covers/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("Failed to delete church cover")
  }
}

// React Query keys
const churchCoverKeys = {
  all: ["church-covers"] as const,
  lists: () => [...churchCoverKeys.all, "list"] as const,
  list: (filters: string) => [...churchCoverKeys.lists(), { filters }] as const,
  details: () => [...churchCoverKeys.all, "detail"] as const,
  detail: (id: number) => [...churchCoverKeys.details(), id] as const,
}

export function useChurchCovers() {
  const queryClient = useQueryClient()

  // Query for church covers
  const {
    data: covers = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: churchCoverKeys.lists(),
    queryFn: fetchChurchCovers,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createChurchCover,
    onSuccess: newCover => {
      // Update the covers list in cache
      queryClient.setQueryData(
        churchCoverKeys.lists(),
        (old: ChurchCoverPhoto[] = []) => [...old, newCover]
      )
      toast.success("Church cover created successfully!")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create church cover")
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      cover,
    }: {
      id: number
      cover: Omit<ChurchCoverPhoto, "id" | "createdAt" | "updatedAt">
    }) => updateChurchCover(id, cover),
    onSuccess: updatedCover => {
      // Update the covers list in cache
      queryClient.setQueryData(
        churchCoverKeys.lists(),
        (old: ChurchCoverPhoto[] = []) =>
          old.map(cover =>
            cover.id === updatedCover.id ? updatedCover : cover
          )
      )
      toast.success("Church cover updated successfully!")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update church cover")
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteChurchCover,
    onSuccess: (_, deletedId) => {
      // Remove from the covers list in cache
      queryClient.setQueryData(
        churchCoverKeys.lists(),
        (old: ChurchCoverPhoto[] = []) =>
          old.filter(cover => cover.id !== deletedId)
      )
      toast.success("Church cover deleted successfully!")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete church cover")
    },
  })

  // Helper functions
  const createCover = async (
    cover: Omit<ChurchCoverPhoto, "id" | "createdAt" | "updatedAt">
  ): Promise<ChurchCoverPhoto> => {
    return createMutation.mutateAsync(cover)
  }

  const updateCover = async (
    id: number,
    cover: Omit<ChurchCoverPhoto, "id" | "createdAt" | "updatedAt">
  ): Promise<ChurchCoverPhoto> => {
    return updateMutation.mutateAsync({ id, cover })
  }

  const deleteCover = async (id: number): Promise<void> => {
    return deleteMutation.mutateAsync(id)
  }

  return {
    covers,
    isLoading:
      isLoading ||
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
    error: error?.message || null,
    createCover,
    updateCover,
    deleteCover,
    refetch,
    // Additional useful states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}

// Hook for fetching a single church cover
export function useChurchCover(id: number | null) {
  return useQuery({
    queryKey: churchCoverKeys.detail(id!),
    queryFn: async () => {
      if (!id) throw new Error("No ID provided")
      const response = await fetch(`/api/church-covers/${id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch church cover")
      }
      return response.json() as Promise<ChurchCoverPhoto>
    },
    enabled: !!id, // Only run query if ID is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Helper hook for prefetching church covers (useful for hover effects, etc.)
export function usePrefetchChurchCover() {
  const queryClient = useQueryClient()

  return (id: number) => {
    queryClient.prefetchQuery({
      queryKey: churchCoverKeys.detail(id),
      queryFn: async () => {
        const response = await fetch(`/api/church-covers/${id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch church cover")
        }
        return response.json() as Promise<ChurchCoverPhoto>
      },
      staleTime: 5 * 60 * 1000,
    })
  }
}
