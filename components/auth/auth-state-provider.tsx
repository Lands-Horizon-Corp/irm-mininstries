"use client"

import { ReactNode } from "react"

import { useAuth } from "@/hooks/use-auth"

import { AuthLoading } from "./auth-loading"

interface AuthStateProviderProps {
  children: ReactNode
  showLoadingScreen?: boolean
  loadingMessage?: string
}

/**
 * AuthStateProvider ensures the user authentication state is loaded before rendering children.
 * This prevents flash of unauthenticated content and provides a smooth user experience.
 */
export function AuthStateProvider({
  children,
  showLoadingScreen = true,
  loadingMessage = "Loading authentication...",
}: AuthStateProviderProps) {
  const { loading, error } = useAuth()

  // Show loading screen during initial auth check
  if (loading && showLoadingScreen) {
    return <AuthLoading message={loadingMessage} />
  }

  // If there's an error, still render children (let the app handle auth redirects)
  if (error) {
    console.warn("Auth error:", error)
  }

  return <>{children}</>
}

export default AuthStateProvider
