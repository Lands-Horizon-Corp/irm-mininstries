import { useEffect, useState } from "react"

import { ChurchCoverPhoto } from "@/types/common"

export function useChurchCovers() {
  const [covers, setCovers] = useState<ChurchCoverPhoto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCovers()
  }, [])

  const fetchCovers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/church-covers")
      if (!response.ok) {
        throw new Error("Failed to fetch church covers")
      }
      const data = await response.json()
      setCovers(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const createCover = async (
    cover: Omit<ChurchCoverPhoto, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
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
      const newCover = await response.json()
      setCovers(prev => [...prev, newCover])
      return newCover
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "An error occurred")
    }
  }

  const updateCover = async (
    id: number,
    cover: Omit<ChurchCoverPhoto, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
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
      const updatedCover = await response.json()
      setCovers(prev => prev.map(c => (c.id === id ? updatedCover : c)))
      return updatedCover
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "An error occurred")
    }
  }

  const deleteCover = async (id: number) => {
    try {
      const response = await fetch(`/api/church-covers/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Failed to delete church cover")
      }
      setCovers(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "An error occurred")
    }
  }

  return {
    covers,
    isLoading,
    error,
    createCover,
    updateCover,
    deleteCover,
    refetch: fetchCovers,
  }
}
