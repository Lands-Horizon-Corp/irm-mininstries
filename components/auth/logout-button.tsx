"use client"

import { LogOut } from "lucide-react"

import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"

export function LogoutButton() {
  const { logout, loading, user } = useAuth()

  const handleLogout = async () => {
    await logout()
    // Redirect to home page after logout
    window.location.href = "/"
  }

  if (!user) return null

  return (
    <Button
      onClick={handleLogout}
      disabled={loading}
      variant='outline'
      size='sm'
      className='flex items-center gap-2'
    >
      <LogOut className='h-4 w-4' />
      {loading ? "Signing out..." : "Logout"}
    </Button>
  )
}
