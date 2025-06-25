import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminPage() {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold text-foreground'>Dashboard</h1>
        <p className='text-muted-foreground'>
          Welcome to the IRM Ministries Admin Panel
        </p>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Churches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>12</div>
            <p className='text-xs text-muted-foreground'>+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>1,234</div>
            <p className='text-xs text-muted-foreground'>
              +180 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Active Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>23</div>
            <p className='text-xs text-muted-foreground'>+7 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Ministry Ranks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>8</div>
            <p className='text-xs text-muted-foreground'>No change</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='flex items-center'>
              <div className='ml-4 space-y-1'>
                <p className='text-sm font-medium leading-none'>
                  New church added: Grace Community Church
                </p>
                <p className='text-sm text-muted-foreground'>2 hours ago</p>
              </div>
            </div>
            <div className='flex items-center'>
              <div className='ml-4 space-y-1'>
                <p className='text-sm font-medium leading-none'>
                  Event created: Youth Conference 2025
                </p>
                <p className='text-sm text-muted-foreground'>5 hours ago</p>
              </div>
            </div>
            <div className='flex items-center'>
              <div className='ml-4 space-y-1'>
                <p className='text-sm font-medium leading-none'>
                  New member joined: John Smith
                </p>
                <p className='text-sm text-muted-foreground'>1 day ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
