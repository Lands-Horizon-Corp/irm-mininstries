"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"

export interface User {
  id: number
  email: string
  role: string
}

export function useAuthSimple() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        toast.success("Login successful!")
        // Force a re-render of all components using this hook
        window.dispatchEvent(new Event("auth-change"))
        return true
      } else {
        toast.error(data.error || "Login failed")
        return false
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error("Login failed. Please try again.")
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })

      setUser(null)
      toast.success("Logged out successfully!")
      // Force a re-render of all components using this hook
      window.dispatchEvent(new Event("auth-change"))
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Logout failed")
    } finally {
      setLoading(false)
    }
  }

  const isAuthenticated = !!user
  const isAdmin = user?.role === "admin"

  useEffect(() => {
    checkAuth()

    // Listen for auth change events
    const handleAuthChange = () => {
      checkAuth()
    }

    window.addEventListener("auth-change", handleAuthChange)

    return () => {
      window.removeEventListener("auth-change", handleAuthChange)
    }
  }, [])

  return {
    user,
    loading,
    login,
    logout,
    checkAuth,
    isAuthenticated,
    isAdmin,
  }
}
