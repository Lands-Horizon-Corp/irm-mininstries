"use client";

import { Users } from "lucide-react";

import { Heading } from "@/components/ui/heading";

export function MemberHeading() {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
        <Users className="text-primary h-6 w-6" />
      </div>
      <div>
        <Heading
          align="left"
          description="Manage church members and their information"
          title="Members Management"
        />
      </div>
    </div>
  );
}
