import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function MembersPage() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>Members</h1>
          <p className='text-muted-foreground'>
            Manage church members and their information
          </p>
        </div>
        <Button>
          <Plus className='h-4 w-4 mr-2' />
          Add Member
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Church Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-center py-8'>
            <p className='text-muted-foreground'>No members found.</p>
            <p className='text-sm text-muted-foreground mt-2'>
              Start by adding your first church member.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
