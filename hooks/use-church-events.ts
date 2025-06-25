import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { ChurchEvent } from "@/types/common"

// API functions
async function fetchChurchEvents(): Promise<ChurchEvent[]> {
  const response = await fetch("/api/church-events")
  if (!response.ok) {
    throw new Error("Failed to fetch church events")
  }
  return response.json()
}

async function createChurchEvent(
  event: Omit<ChurchEvent, "id" | "createdAt" | "updatedAt">
): Promise<ChurchEvent> {
  const response = await fetch("/api/church-events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  })
  if (!response.ok) {
    throw new Error("Failed to create church event")
  }
  return response.json()
}

async function updateChurchEvent(
  id: number,
  event: Omit<ChurchEvent, "id" | "createdAt" | "updatedAt">
): Promise<ChurchEvent> {
  const response = await fetch(`/api/church-events/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  })
  if (!response.ok) {
    throw new Error("Failed to update church event")
  }
  return response.json()
}

async function deleteChurchEvent(id: number): Promise<void> {
  const response = await fetch(`/api/church-events/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("Failed to delete church event")
  }
}

// React Query keys
const churchEventKeys = {
  all: ["church-events"] as const,
  lists: () => [...churchEventKeys.all, "list"] as const,
  list: (filters: string) => [...churchEventKeys.lists(), { filters }] as const,
  details: () => [...churchEventKeys.all, "detail"] as const,
  detail: (id: number) => [...churchEventKeys.details(), id] as const,
}

export function useChurchEvents() {
  const queryClient = useQueryClient()

  // Query for church events
  const {
    data: events = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: churchEventKeys.lists(),
    queryFn: fetchChurchEvents,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createChurchEvent,
    onSuccess: newEvent => {
      // Update the events list in cache
      queryClient.setQueryData(
        churchEventKeys.lists(),
        (old: ChurchEvent[] = []) => [...old, newEvent]
      )
      toast.success("Church event created successfully!")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create church event")
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      event,
    }: {
      id: number
      event: Omit<ChurchEvent, "id" | "createdAt" | "updatedAt">
    }) => updateChurchEvent(id, event),
    onSuccess: updatedEvent => {
      // Update the events list in cache
      queryClient.setQueryData(
        churchEventKeys.lists(),
        (old: ChurchEvent[] = []) =>
          old.map(event =>
            event.id === updatedEvent.id ? updatedEvent : event
          )
      )
      toast.success("Church event updated successfully!")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update church event")
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteChurchEvent,
    onSuccess: (_, deletedId) => {
      // Remove from the events list in cache
      queryClient.setQueryData(
        churchEventKeys.lists(),
        (old: ChurchEvent[] = []) => old.filter(event => event.id !== deletedId)
      )
      toast.success("Church event deleted successfully!")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete church event")
    },
  })

  // Helper functions
  const createEvent = async (
    event: Omit<ChurchEvent, "id" | "createdAt" | "updatedAt">
  ): Promise<ChurchEvent> => {
    return createMutation.mutateAsync(event)
  }

  const updateEvent = async (
    id: number,
    event: Omit<ChurchEvent, "id" | "createdAt" | "updatedAt">
  ): Promise<ChurchEvent> => {
    return updateMutation.mutateAsync({ id, event })
  }

  const deleteEvent = async (id: number): Promise<void> => {
    return deleteMutation.mutateAsync(id)
  }

  return {
    events,
    isLoading:
      isLoading ||
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
    error: error?.message || null,
    createEvent,
    updateEvent,
    deleteEvent,
    refetch,
    // Additional useful states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}

// Hook for fetching a single church event
export function useChurchEvent(id: number | null) {
  return useQuery({
    queryKey: churchEventKeys.detail(id!),
    queryFn: async () => {
      if (!id) throw new Error("No ID provided")
      const response = await fetch(`/api/church-events/${id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch church event")
      }
      return response.json() as Promise<ChurchEvent>
    },
    enabled: !!id, // Only run query if ID is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Helper hook for prefetching church events (useful for hover effects, etc.)
export function usePrefetchChurchEvent() {
  const queryClient = useQueryClient()

  return (id: number) => {
    queryClient.prefetchQuery({
      queryKey: churchEventKeys.detail(id),
      queryFn: async () => {
        const response = await fetch(`/api/church-events/${id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch church event")
        }
        return response.json() as Promise<ChurchEvent>
      },
      staleTime: 5 * 60 * 1000,
    })
  }
}
