import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ChurchesPage() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>Churches</h1>
          <p className='text-muted-foreground'>
            Manage all churches in your ministry
          </p>
        </div>
        <Button>
          <Plus className='h-4 w-4 mr-2' />
          Add Church
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Churches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-center py-8'>
            <p className='text-muted-foreground'>No churches registered.</p>
            <p className='text-sm text-muted-foreground mt-2'>
              Add your first church to begin managing your ministry network.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
