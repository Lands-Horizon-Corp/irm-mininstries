import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function UsersPage() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>Users</h1>
          <p className='text-muted-foreground'>
            Manage system users and their permissions
          </p>
        </div>
        <Button>
          <Plus className='h-4 w-4 mr-2' />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-center py-8'>
            <p className='text-muted-foreground'>No users found.</p>
            <p className='text-sm text-muted-foreground mt-2'>
              Add system users to manage access and permissions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
