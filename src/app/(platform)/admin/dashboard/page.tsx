"use client";

import Link from "next/link";

import {
  Award,
  Building2,
  Crown,
  LayoutDashboard,
  MessageCircle,
  Users,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { DashboardQRScanner } from "@/components/ui/dashboard-qr-scanner";

const quickLinks = [
  {
    title: "Ministers",
    subtitle: "Manage ministers and staff members",
    icon: Users,
    href: "/admin/ministers",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Ministry Ranks",
    subtitle: "Manage leadership hierarchy and positions",
    icon: Crown,
    href: "/admin/ministry-ranks",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Ministry Skills",
    subtitle: "Manage skills and competencies",
    icon: Award,
    href: "/admin/ministry-skills",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Churches",
    subtitle: "Manage church locations and information",
    icon: Building2,
    href: "/admin/churches",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    title: "Contact Messages",
    subtitle: "View and manage contact submissions",
    icon: MessageCircle,
    href: "/admin/contact-us",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
];

export default function DashboardPage() {
  return (
    <div className="bg-background min-h-screen p-8">
      <Container>
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                <LayoutDashboard className="text-primary h-6 w-6" />
              </div>
              <div>
                <h1 className="text-foreground text-3xl font-bold">
                  Admin Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Welcome to the IRM Ministries administration panel
                </p>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="space-y-6">
            {/* QR Scanner - Full Width */}
            <DashboardQRScanner />

            {/* Quick Links Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {quickLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link href={link.href} key={link.href}>
                    <Card className="group cursor-pointer p-6 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
                      <div className="flex items-start space-x-4">
                        <div
                          className={`${link.bgColor} flex h-12 w-12 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110`}
                        >
                          <IconComponent className={`h-6 w-6 ${link.color}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-foreground group-hover:text-primary mb-2 text-lg font-semibold transition-colors duration-200">
                            {link.title}
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            {link.subtitle}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Welcome Message */}
          <Card className="mt-8 p-6 text-center">
            <h3 className="text-foreground mb-2 text-xl font-semibold">
              Ministry Administration
            </h3>
            <p className="text-muted-foreground">
              Use the links above to manage different aspects of the ministry.
              Click on any card to navigate to that section.
            </p>
          </Card>
        </div>
      </Container>
    </div>
  );
}
