"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Church,
  Crown,
  Home,
  Image,
  UserCog,
  Users,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: Home,
  },
  {
    title: "Church Cover",
    href: "/admin/church-cover",
    icon: Image,
  },
  {
    title: "Church Events",
    href: "/admin/church-events",
    icon: Calendar,
  },
  {
    title: "Churches",
    href: "/admin/church-locations",
    icon: Church,
  },
  {
    title: "Ministry Ranks",
    href: "/admin/ministry-ranks",
    icon: Crown,
  },
  {
    title: "Members",
    href: "/admin/members",
    icon: Users,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: UserCog,
  },
]

interface AdminSidebarProps {
  className?: string
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "relative flex flex-col border-r bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Header */}
      <div className='flex h-16 items-center justify-between px-4 border-b'>
        {!collapsed && (
          <h2 className='text-lg font-semibold text-foreground'>Admin Panel</h2>
        )}
        <Button
          variant='ghost'
          size='icon'
          onClick={() => setCollapsed(!collapsed)}
          className='h-8 w-8'
        >
          {collapsed ? (
            <ChevronRight className='h-4 w-4' />
          ) : (
            <ChevronLeft className='h-4 w-4' />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className='flex-1 space-y-1 p-2'>
        {sidebarItems.map(item => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground",
                  collapsed && "justify-center"
                )}
              >
                <item.icon className='h-4 w-4 flex-shrink-0' />
                {!collapsed && <span>{item.title}</span>}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className='border-t p-4'>
        {!collapsed && (
          <div className='text-xs text-muted-foreground'>
            IRM Ministries Admin
          </div>
        )}
      </div>
    </div>
  )
}
