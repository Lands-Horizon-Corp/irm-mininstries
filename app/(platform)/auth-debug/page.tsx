"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthDebugPage() {
  const [cookies, setCookies] = useState<string>("")
  const [authToken, setAuthToken] = useState<string>("")
  const [userInfo, setUserInfo] = useState<Record<string, unknown> | null>(null)

  useEffect(() => {
    // Get all cookies
    setCookies(document.cookie)

    // Extract auth token
    const tokenMatch = document.cookie.match(/auth-token=([^;]+)/)
    const token = tokenMatch ? tokenMatch[1] : ""
    setAuthToken(token)
  }, [])

  const checkCurrentUser = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      })
      const data = await response.json()
      setUserInfo(data)
    } catch (error) {
      setUserInfo({ error: String(error) })
    }
  }

  const clearCookies = () => {
    document.cookie =
      "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    window.location.reload()
  }

  return (
    <div className='container mx-auto p-6 space-y-6'>
      <h1 className='text-2xl font-bold'>Authentication Debug</h1>

      <Card>
        <CardHeader>
          <CardTitle>Cookies</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className='bg-muted p-3 rounded text-xs overflow-auto'>
            {cookies || "No cookies found"}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Auth Token</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className='bg-muted p-3 rounded text-xs overflow-auto'>
            {authToken || "No auth token found"}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current User Info</CardTitle>
        </CardHeader>
        <CardContent className='space-y-3'>
          <Button onClick={checkCurrentUser}>Check Current User</Button>
          {userInfo && (
            <pre className='bg-muted p-3 rounded text-xs overflow-auto'>
              {JSON.stringify(userInfo, null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant='destructive' onClick={clearCookies}>
            Clear All Cookies & Reload
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
