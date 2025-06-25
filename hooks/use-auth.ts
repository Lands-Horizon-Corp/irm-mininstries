"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export interface User {
  id: number
  email: string
  role: string
}

interface LoginCredentials {
  email: string
  password: string
}

// API functions
async function fetchCurrentUser(): Promise<User | null> {
  const response = await fetch("/api/auth/me", {
    credentials: "include",
  })

  if (!response.ok) {
    if (response.status === 401) {
      return null // Not authenticated
    }
    throw new Error("Failed to fetch user")
  }

  const data = await response.json()
  return data.user
}

async function loginUser(credentials: LoginCredentials): Promise<User> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(credentials),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "Login failed")
  }

  return data.user
}

async function logoutUser(): Promise<void> {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  })
}

// React Query keys
const authKeys = {
  user: ["auth", "user"] as const,
}

export function useAuth() {
  const queryClient = useQueryClient()

  // Query for current user
  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: authKeys.user,
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: unknown) => {
      // Don't retry on 401 errors (user is not authenticated)
      if (error && typeof error === "object" && "message" in error) {
        const message = (error as Error).message
        if (message.includes("401") || message.includes("unauthorized")) {
          return false
        }
      }
      return failureCount < 2
    },
  })

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: user => {
      // Update the user query cache
      queryClient.setQueryData(authKeys.user, user)
      toast.success("Login successful!")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Login failed")
    },
  })

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      // Clear the user query cache
      queryClient.setQueryData(authKeys.user, null)
      // Invalidate to trigger a refetch
      queryClient.invalidateQueries({ queryKey: authKeys.user })
      toast.success("Logged out successfully!")
    },
    onError: (error: Error) => {
      console.error("Logout error:", error)
      toast.error("Logout failed")
    },
  })

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await loginMutation.mutateAsync({ email, password })
      return true
    } catch {
      return false
    }
  }

  // Logout function
  const logout = async (): Promise<void> => {
    await logoutMutation.mutateAsync()
  }

  // Computed values
  const isAuthenticated = !!user
  const isAdmin = user?.role === "admin"
  const loading =
    isLoading || loginMutation.isPending || logoutMutation.isPending

  return {
    user,
    loading,
    login,
    logout,
    checkAuth: refetch,
    isAuthenticated,
    isAdmin,
    error,
  }
}
