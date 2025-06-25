"use client"

import { useAuth } from "./use-auth"

/**
 * Hook that provides global loading states for the application.
 * Combines authentication loading with any other global loading states.
 */
export function useGlobalLoading() {
  const { loading: authLoading, error: authError } = useAuth()

  return {
    isLoading: authLoading,
    authLoading,
    authError,
    // Add other global loading states here as needed
    // e.g., configLoading, themeLoading, etc.
  }
}

/**
 * Simple hook to check if the app is in an initial loading state.
 * Useful for showing skeleton loaders or loading screens.
 */
export function useIsAppLoading() {
  const { isLoading } = useGlobalLoading()
  return isLoading
}
