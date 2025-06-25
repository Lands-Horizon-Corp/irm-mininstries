"use client"

import { ReactNode } from "react"

import { useAuth } from "@/hooks/use-auth"

import { AuthPageLoading } from "./page-loading"

interface AuthWrapperProps {
  children: ReactNode
  showLoadingOnAuthCheck?: boolean
}

function AuthGate({
  children,
  showLoadingOnAuthCheck = true,
}: AuthWrapperProps) {
  const { loading } = useAuth()

  // Show auth loading during initial authentication check
  if (loading && showLoadingOnAuthCheck) {
    return <AuthPageLoading />
  }

  return <>{children}</>
}

export function AuthWrapper({
  children,
  showLoadingOnAuthCheck = true,
}: AuthWrapperProps) {
  return (
    <AuthGate showLoadingOnAuthCheck={showLoadingOnAuthCheck}>
      {children}
    </AuthGate>
  )
}

// Hook to check if auth is loading (useful for individual components)
export function useAuthLoading() {
  const { loading } = useAuth()
  return loading
}

export default AuthWrapper
