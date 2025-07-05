import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { ChurchLocation } from "@/types/common"

// API functions
async function fetchChurchLocations(): Promise<ChurchLocation[]> {
  const response = await fetch("/api/church-locations")
  if (!response.ok) {
    throw new Error("Failed to fetch church locations")
  }
  return response.json()
}

async function createChurchLocation(
  location: Omit<ChurchLocation, "id" | "createdAt" | "updatedAt">
): Promise<ChurchLocation> {
  const response = await fetch("/api/church-locations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(location),
  })
  if (!response.ok) {
    throw new Error("Failed to create church location")
  }
  return response.json()
}

async function updateChurchLocation(
  id: number,
  location: Omit<ChurchLocation, "id" | "createdAt" | "updatedAt">
): Promise<ChurchLocation> {
  const response = await fetch(`/api/church-locations/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(location),
  })
  if (!response.ok) {
    throw new Error("Failed to update church location")
  }
  return response.json()
}

async function deleteChurchLocation(id: number): Promise<void> {
  const response = await fetch(`/api/church-locations/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("Failed to delete church location")
  }
}

// React Query keys
const churchLocationKeys = {
  all: ["church-locations"] as const,
  lists: () => [...churchLocationKeys.all, "list"] as const,
  list: (filters: string) =>
    [...churchLocationKeys.lists(), { filters }] as const,
  details: () => [...churchLocationKeys.all, "detail"] as const,
  detail: (id: number) => [...churchLocationKeys.details(), id] as const,
}

export function useChurchLocations() {
  const queryClient = useQueryClient()

  // Query for church locations
  const {
    data: locations = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: churchLocationKeys.lists(),
    queryFn: fetchChurchLocations,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createChurchLocation,
    onSuccess: newLocation => {
      queryClient.setQueryData(
        churchLocationKeys.lists(),
        (old: ChurchLocation[] = []) => [...old, newLocation]
      )
      toast.success("Church location created successfully!")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create church location")
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      location,
    }: {
      id: number
      location: Omit<ChurchLocation, "id" | "createdAt" | "updatedAt">
    }) => updateChurchLocation(id, location),
    onSuccess: updatedLocation => {
      queryClient.setQueryData(
        churchLocationKeys.lists(),
        (old: ChurchLocation[] = []) =>
          old.map(location =>
            location.id === updatedLocation.id ? updatedLocation : location
          )
      )
      toast.success("Church location updated successfully!")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update church location")
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteChurchLocation,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(
        churchLocationKeys.lists(),
        (old: ChurchLocation[] = []) =>
          old.filter(location => location.id !== deletedId)
      )
      toast.success("Church location deleted successfully!")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete church location")
    },
  })

  const createLocation = async (
    location: Omit<ChurchLocation, "id" | "createdAt" | "updatedAt">
  ): Promise<ChurchLocation> => {
    return createMutation.mutateAsync(location)
  }

  const updateLocation = async (
    id: number,
    location: Omit<ChurchLocation, "id" | "createdAt" | "updatedAt">
  ): Promise<ChurchLocation> => {
    return updateMutation.mutateAsync({ id, location })
  }

  const deleteLocation = async (id: number): Promise<void> => {
    return deleteMutation.mutateAsync(id)
  }

  return {
    locations,
    isLoading:
      isLoading ||
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
    error: error?.message || null,
    createLocation,
    updateLocation,
    deleteLocation,
    refetch,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}

export function useChurchLocation(id: number | null) {
  return useQuery({
    queryKey: churchLocationKeys.detail(id!),
    queryFn: async () => {
      if (!id) throw new Error("No ID provided")
      const response = await fetch(`/api/church-locations/${id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch church location")
      }
      return response.json() as Promise<ChurchLocation>
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export function usePrefetchChurchLocation() {
  const queryClient = useQueryClient()

  return (id: number) => {
    queryClient.prefetchQuery({
      queryKey: churchLocationKeys.detail(id),
      queryFn: async () => {
        const response = await fetch(`/api/church-locations/${id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch church location")
        }
        return response.json() as Promise<ChurchLocation>
      },
      staleTime: 5 * 60 * 1000,
    })
  }
}
