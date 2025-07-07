"use client"

import {
  Activity,
  Calendar,
  ImageIcon,
  MapPin,
  MessageSquare,
  Star,
  TrendingUp,
  Users,
} from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { useChurchCovers } from "@/hooks/use-church-covers"
import { useChurchEvents } from "@/hooks/use-church-events"
import { useChurchLocations } from "@/hooks/use-church-locations"
import { useContactUs } from "@/hooks/use-contact-us"
import { useMinistryRanks } from "@/hooks/use-ministry-ranks"
import { useMinistrySkills } from "@/hooks/use-ministry-skills"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"

const chartConfig = {
  value: {
    label: "Count",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export default function AdminPage() {
  const { covers = [], isLoading: loadingCovers } = useChurchCovers?.() || {}
  const { events = [], isLoading: loadingEvents } = useChurchEvents?.() || {}
  const { locations = [], isLoading: loadingLocations } =
    useChurchLocations?.() || {}
  const { contactUs = [], isLoading: loadingContact } = useContactUs?.() || {}
  const { ministryRanks = [], isLoading: loadingRanks } =
    useMinistryRanks?.() || {}
  const { ministrySkills = [], isLoading: loadingSkills } =
    useMinistrySkills?.() || {}

  const stats = [
    {
      label: "Church Covers",
      value: covers.length,
      loading: loadingCovers,
      icon: ImageIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      label: "Church Events",
      value: events.length,
      loading: loadingEvents,
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20",
    },
    {
      label: "Church Locations",
      value: locations.length,
      loading: loadingLocations,
      icon: MapPin,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
    },
    {
      label: "Contact Messages",
      value: contactUs.length,
      loading: loadingContact,
      icon: MessageSquare,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
    },
    {
      label: "Ministry Ranks",
      value: ministryRanks.length,
      loading: loadingRanks,
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    },
    {
      label: "Ministry Skills",
      value: ministrySkills.length,
      loading: loadingSkills,
      icon: Users,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
    },
  ]

  const chartData = stats.map(s => ({
    name: s.label.replace("Church ", "").replace("Ministry ", ""),
    value: s.value,
    fill: "var(--color-value)",
  }))

  const totalItems = stats.reduce((sum, stat) => sum + stat.value, 0)
  const isAnyLoading = stats.some(stat => stat.loading)

  return (
    <div className='min-h-screen bg-gradient-to-br from-background to-muted/20 p-6'>
      <div className='mx-auto max-w-7xl space-y-8'>
        {/* Header Section */}
        <div className='space-y-2'>
          <div className='flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground'>
              <Activity className='h-6 w-6' />
            </div>
            <div>
              <h1 className='text-4xl font-bold tracking-tight'>Dashboard</h1>
              <p className='text-lg text-muted-foreground'>
                IRM Ministries Admin Panel
              </p>
            </div>
          </div>
          <div className='flex items-center gap-4'>
            <Badge variant='secondary' className='text-sm'>
              Total Items: {isAnyLoading ? "Loading..." : totalItems}
            </Badge>
            <Badge variant='outline' className='text-sm'>
              Last Updated: {new Date().toLocaleDateString()}
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {stats.map(stat => {
            const Icon = stat.icon
            return (
              <Card
                key={stat.label}
                className='group relative overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/5'
              >
                <div className={`absolute inset-0 opacity-5 ${stat.bgColor}`} />
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-3'>
                  <CardTitle className='text-sm font-medium text-muted-foreground'>
                    {stat.label}
                  </CardTitle>
                  <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent className='space-y-2'>
                  <div className='text-3xl font-bold'>
                    {stat.loading ? (
                      <Skeleton className='h-8 w-16' />
                    ) : (
                      <span className='bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent'>
                        {stat.value}
                      </span>
                    )}
                  </div>
                  <div className='flex items-center text-xs text-muted-foreground'>
                    <TrendingUp className='mr-1 h-3 w-3' />
                    Active records
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Chart Section */}
        <div className='grid gap-6 lg:grid-cols-3'>
          <Card className='lg:col-span-2'>
            <CardHeader className='space-y-2'>
              <CardTitle className='flex items-center gap-2'>
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10'>
                  <BarChart className='h-4 w-4 text-primary' />
                </div>
                Data Overview
              </CardTitle>
              <p className='text-sm text-muted-foreground'>
                Visual representation of your ministry data
              </p>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={chartConfig}
                className='min-h-[300px] w-full'
              >
                <BarChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 20,
                    left: 20,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray='3 3'
                    className='stroke-muted'
                  />
                  <XAxis
                    dataKey='name'
                    tickLine={false}
                    axisLine={false}
                    className='text-xs'
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    className='text-xs'
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey='value'
                    fill='var(--color-value)'
                    radius={[6, 6, 0, 0]}
                    className='transition-all hover:opacity-80'
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Quick Stats Summary */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Quick Summary</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {stats.slice(0, 4).map(stat => {
                const Icon = stat.icon
                return (
                  <div
                    key={stat.label}
                    className='flex items-center justify-between'
                  >
                    <div className='flex items-center gap-3'>
                      <div className={`rounded-md p-1.5 ${stat.bgColor}`}>
                        <Icon className={`h-3 w-3 ${stat.color}`} />
                      </div>
                      <span className='text-sm font-medium'>
                        {stat.label
                          .replace("Church ", "")
                          .replace("Ministry ", "")}
                      </span>
                    </div>
                    <div className='text-sm font-semibold'>
                      {stat.loading ? (
                        <Skeleton className='h-4 w-8' />
                      ) : (
                        stat.value
                      )}
                    </div>
                  </div>
                )
              })}
              <div className='mt-4 pt-4 border-t'>
                <div className='flex items-center justify-between text-sm font-semibold'>
                  <span>Total Records</span>
                  <span className='text-primary'>
                    {isAnyLoading ? "..." : totalItems}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
