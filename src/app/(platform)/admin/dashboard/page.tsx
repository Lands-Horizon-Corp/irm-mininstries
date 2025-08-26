"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

import { LogOut, Shield, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-primary mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="bg-background min-h-screen py-12">
      <Container>
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-foreground text-3xl font-bold">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                Welcome to the IRM Ministries administration panel
              </p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>

          {/* User Info Card */}
          <Card className="mb-8 p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
                <User className="text-primary h-6 w-6" />
              </div>
              <div>
                <h2 className="text-foreground text-xl font-semibold">
                  {session.user?.name || "Admin User"}
                </h2>
                <p className="text-muted-foreground">{session.user?.email}</p>
                <div className="mt-1 flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">
                    Administrator
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Dashboard Content */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="p-6">
              <h3 className="text-foreground mb-2 text-lg font-semibold">
                Ministry Management
              </h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Manage ministry content, events, and announcements
              </p>
              <Button className="w-full" variant="outline">
                Manage Content
              </Button>
            </Card>

            <Card className="p-6">
              <h3 className="text-foreground mb-2 text-lg font-semibold">
                Minister Management
              </h3>
              <p className="text-muted-foreground mb-4 text-sm">
                View and manage ministers and contacts
              </p>
              <Button className="w-full" variant="outline">
                View Ministers
              </Button>
            </Card>

            <Card className="p-6">
              <h3 className="text-foreground mb-2 text-lg font-semibold">
                Prayer Requests
              </h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Review and manage prayer requests from the community
              </p>
              <Button className="w-full" variant="outline">
                View Requests
              </Button>
            </Card>

            <Card className="p-6">
              <h3 className="text-foreground mb-2 text-lg font-semibold">
                Contact Messages
              </h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Review messages and inquiries from visitors
              </p>
              <Button className="w-full" variant="outline">
                View Messages
              </Button>
            </Card>

            <Card className="p-6">
              <h3 className="text-foreground mb-2 text-lg font-semibold">
                Site Analytics
              </h3>
              <p className="text-muted-foreground mb-4 text-sm">
                View website traffic and engagement statistics
              </p>
              <Button className="w-full" variant="outline">
                View Analytics
              </Button>
            </Card>

            <Card className="p-6">
              <h3 className="text-foreground mb-2 text-lg font-semibold">
                Settings
              </h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Configure site settings and preferences
              </p>
              <Button className="w-full" variant="outline">
                Manage Settings
              </Button>
            </Card>
          </div>

          {/* Quick Stats */}
          <Card className="mt-8 p-6">
            <h3 className="text-foreground mb-4 text-lg font-semibold">
              Quick Statistics
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="text-primary text-2xl font-bold">0</div>
                <div className="text-muted-foreground text-sm">
                  Active Ministers
                </div>
              </div>
              <div className="text-center">
                <div className="text-primary text-2xl font-bold">0</div>
                <div className="text-muted-foreground text-sm">
                  Prayer Requests
                </div>
              </div>
              <div className="text-center">
                <div className="text-primary text-2xl font-bold">0</div>
                <div className="text-muted-foreground text-sm">
                  New Messages
                </div>
              </div>
              <div className="text-center">
                <div className="text-primary text-2xl font-bold">0</div>
                <div className="text-muted-foreground text-sm">
                  Monthly Visitors
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}
