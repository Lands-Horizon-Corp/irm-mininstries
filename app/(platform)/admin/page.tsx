"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { FileText, Loader2, Settings, Shield, Users } from "lucide-react"

import { useAuthSimple } from "@/hooks/use-auth-simple"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LogoutButton } from "@/components/auth/logout-button"
import { UserProfile } from "@/components/auth/user-profile"

export default function AdminPage() {
  const { loading, isAuthenticated, isAdmin } = useAuthSimple()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='flex items-center gap-2'>
          <Loader2 className='h-4 w-4 animate-spin' />
          <span className='text-sm text-muted-foreground'>Loading...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className='min-h-screen bg-background p-6'>
      <div className='max-w-6xl mx-auto space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold'>Admin Dashboard</h1>
            <p className='text-muted-foreground'>
              Welcome back, manage your IRM Ministries platform
            </p>
          </div>
          <LogoutButton />
        </div>

        {/* User Profile Card */}
        <UserProfile />

        {/* Admin Check */}
        {!isAdmin && (
          <Card className='border-destructive/50 bg-destructive/5'>
            <CardHeader>
              <CardTitle className='text-destructive'>
                Access Restricted
              </CardTitle>
              <CardDescription>
                You don&apos;t have admin privileges. Contact an administrator
                for access.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {/* Admin Dashboard Content */}
        {isAdmin && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {/* Users Management */}
            <Card className='hover:shadow-lg transition-shadow cursor-pointer'>
              <CardHeader>
                <div className='flex items-center space-x-2'>
                  <Users className='h-5 w-5 text-blue-600' />
                  <CardTitle>Users</CardTitle>
                </div>
                <CardDescription>
                  Manage user accounts and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant='outline' className='w-full'>
                  Manage Users
                </Button>
              </CardContent>
            </Card>

            {/* Church Covers */}
            <Card className='hover:shadow-lg transition-shadow cursor-pointer'>
              <CardHeader>
                <div className='flex items-center space-x-2'>
                  <FileText className='h-5 w-5 text-green-600' />
                  <CardTitle>Church Covers</CardTitle>
                </div>
                <CardDescription>
                  Manage church cover photos and content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant='outline' className='w-full'>
                  View Covers
                </Button>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card className='hover:shadow-lg transition-shadow cursor-pointer'>
              <CardHeader>
                <div className='flex items-center space-x-2'>
                  <Settings className='h-5 w-5 text-purple-600' />
                  <CardTitle>Settings</CardTitle>
                </div>
                <CardDescription>
                  Configure platform settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant='outline' className='w-full'>
                  Open Settings
                </Button>
              </CardContent>
            </Card>

            {/* Admin Tools */}
            <Card className='md:col-span-2 lg:col-span-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20'>
              <CardHeader>
                <div className='flex items-center space-x-2'>
                  <Shield className='h-5 w-5 text-blue-600' />
                  <CardTitle>Admin Tools</CardTitle>
                </div>
                <CardDescription>
                  Advanced administrative functions and system management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <Button variant='outline'>Database Management</Button>
                  <Button variant='outline'>System Logs</Button>
                  <Button variant='outline'>Backup & Export</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
