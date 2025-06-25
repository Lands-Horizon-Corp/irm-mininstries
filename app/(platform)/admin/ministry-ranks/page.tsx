import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function MinistryRanksPage() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>Ministry Ranks</h1>
          <p className='text-muted-foreground'>
            Manage ministry positions and hierarchies
          </p>
        </div>
        <Button>
          <Plus className='h-4 w-4 mr-2' />
          Add Rank
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ministry Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-center py-8'>
            <p className='text-muted-foreground'>No ministry ranks defined.</p>
            <p className='text-sm text-muted-foreground mt-2'>
              Create ministry ranks to organize your leadership structure.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
