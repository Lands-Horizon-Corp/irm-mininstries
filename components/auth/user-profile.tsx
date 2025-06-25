"use client"

import { Shield, User } from "lucide-react"

import { useAuth } from "@/hooks/use-auth"

import { LogoutButton } from "./logout-button"

export function UserProfile() {
  const { user, loading, isAuthenticated, isAdmin } = useAuth()

  if (loading) {
    return (
      <div className='flex items-center gap-2'>
        <div className='h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600'></div>
        <span className='text-sm text-gray-600'>Loading...</span>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className='flex items-center gap-4 p-4 bg-gray-50 rounded-lg'>
      <div className='flex items-center gap-2'>
        <div className='p-2 bg-blue-100 rounded-full'>
          <User className='h-4 w-4 text-blue-600' />
        </div>
        <div>
          <div className='flex items-center gap-2'>
            <span className='text-sm font-medium text-gray-900'>
              {user.email}
            </span>
            {isAdmin && (
              <div className='flex items-center gap-1 px-2 py-1 bg-amber-100 rounded-full'>
                <Shield className='h-3 w-3 text-amber-600' />
                <span className='text-xs font-medium text-amber-700'>
                  Admin
                </span>
              </div>
            )}
          </div>
          <span className='text-xs text-gray-500'>Role: {user.role}</span>
        </div>
      </div>
      <LogoutButton />
    </div>
  )
}
