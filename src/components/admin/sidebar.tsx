"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Award,
  Building2,
  ChevronLeft,
  ChevronRight,
  Crown,
  LayoutDashboard,
  MessageCircle,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

const sidebarItems = [
  {
    href: "/admin",
    icon: LayoutDashboard,
    title: "Dashboard",
  },
  {
    href: "/admin/churches",
    icon: Building2,
    title: "Churches",
  },
  {
    href: "/admin/ministry-ranks",
    icon: Crown,
    title: "Ministry Ranks",
  },
  {
    href: "/admin/ministry-skills",
    icon: Award,
    title: "Ministry Skills",
  },
  {
    href: "/admin/contact-us",
    icon: MessageCircle,
    title: "Contact Us",
  },
  {
    href: "/admin/ministers",
    icon: Users,
    title: "Ministers",
  },
];

export function AdminSidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={cn(
        "bg-background flex flex-col border-r transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4">
        {!isCollapsed && (
          <h2 className="text-foreground text-lg font-semibold">Admin Panel</h2>
        )}
        <Button
          className="ml-auto h-8 w-8 p-0"
          size="sm"
          variant="ghost"
          onClick={toggleSidebar}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-2 p-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href === "/admin" && pathname === "/admin/dashboard");

          return (
            <Link
              className={cn(
                "hover:bg-accent hover:text-accent-foreground flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground",
                isCollapsed && "justify-center px-2"
              )}
              href={item.href}
              key={item.href}
              title={isCollapsed ? item.title : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* Footer */}
      <div className="p-4">
        {!isCollapsed ? (
          <p className="text-muted-foreground text-xs">
            IRM Ministries Admin v1.0
          </p>
        ) : (
          <div className="flex justify-center">
            <div
              className="h-2 w-2 rounded-full bg-green-500"
              title="System Online"
            />
          </div>
        )}
      </div>
    </div>
  );
}
