"use client";

import Link from "next/link";

import { ArrowRight, UserCheck, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";

export default function JoinPage() {
  return (
    <div className="join_selection__container my-16 flex min-h-screen flex-col justify-center">
      <div className="to-background/0 via-background/0 from-primary/20 absolute right-0 -z-10 h-screen w-full bg-radial-[ellipse_at_0%_50%] to-100%" />

      <div className="mx-auto w-full max-w-4xl px-5 md:px-10">
        <Heading
          align="center"
          className="text-primary p-5"
          description="Choose how you'd like to join our community and serve God's people worldwide."
          title="Join IRM Ministries"
        />

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Worker Card */}
          <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <Users className="text-primary h-8 w-8" />
              </div>
              <CardTitle className="text-xl">Join as Worker</CardTitle>
              <CardDescription className="text-base">
                Become a minister and serve our community with your spiritual
                calling and dedication.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li className="flex items-center">
                  <ArrowRight className="text-primary mr-2 h-4 w-4" />
                  Ministry leadership opportunities
                </li>
                <li className="flex items-center">
                  <ArrowRight className="text-primary mr-2 h-4 w-4" />
                  Spiritual guidance and counseling
                </li>
                <li className="flex items-center">
                  <ArrowRight className="text-primary mr-2 h-4 w-4" />
                  Community service and outreach
                </li>
                <li className="flex items-center">
                  <ArrowRight className="text-primary mr-2 h-4 w-4" />
                  Teaching and preaching roles
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link className="w-full" href="/join/worker">
                <Button className="w-full" size="lg">
                  Join as Worker
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Member Card */}
          <Card className="border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <UserCheck className="text-primary h-8 w-8" />
              </div>
              <CardTitle className="text-xl">Join as Member</CardTitle>
              <CardDescription className="text-base">
                Become a valued member of our congregation and participate in
                our community activities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li className="flex items-center">
                  <ArrowRight className="text-primary mr-2 h-4 w-4" />
                  Participate in worship services
                </li>
                <li className="flex items-center">
                  <ArrowRight className="text-primary mr-2 h-4 w-4" />
                  Join community events and activities
                </li>
                <li className="flex items-center">
                  <ArrowRight className="text-primary mr-2 h-4 w-4" />
                  Access to spiritual resources
                </li>
                <li className="flex items-center">
                  <ArrowRight className="text-primary mr-2 h-4 w-4" />
                  Fellowship and support network
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link className="w-full" href="/join/member">
                <Button className="w-full" size="lg" variant="outline">
                  Join as Member
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
