import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ChurchEventsPage() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>Church Events</h1>
          <p className='text-muted-foreground'>
            Manage church events and activities
          </p>
        </div>
        <Button>
          <Plus className='h-4 w-4 mr-2' />
          Add Event
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-center py-8'>
            <p className='text-muted-foreground'>No events scheduled.</p>
            <p className='text-sm text-muted-foreground mt-2'>
              Create your first church event to get started.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
