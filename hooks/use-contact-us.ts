import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { ContactUs } from "@/types/common"

// API functions
async function fetchContactUs(): Promise<ContactUs[]> {
  const response = await fetch("/api/contact-us")
  if (!response.ok) throw new Error("Failed to fetch contact submissions")
  return response.json()
}

async function createContactUs(
  data: Omit<ContactUs, "id" | "createdAt" | "updatedAt">
): Promise<ContactUs> {
  const response = await fetch("/api/contact-us", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to submit contact form")
  return response.json()
}

async function deleteContactUs(id: number): Promise<void> {
  const response = await fetch(`/api/contact-us/${id}`, { method: "DELETE" })
  if (!response.ok) throw new Error("Failed to delete contact submission")
}

export function useContactUs() {
  const queryClient = useQueryClient()
  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["contact-us"],
    queryFn: fetchContactUs,
    staleTime: 2 * 60 * 1000,
  })

  const createMutation = useMutation({
    mutationFn: createContactUs,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-us"] })
      toast.success("Contact form submitted successfully!")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to submit contact form")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteContactUs,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-us"] })
      toast.success("Contact submission deleted")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete contact submission")
    },
  })

  return {
    contactUs: data,
    isLoading,
    error: error?.message || null,
    refetch,
    createContactUs: createMutation.mutateAsync,
    deleteContactUs: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
