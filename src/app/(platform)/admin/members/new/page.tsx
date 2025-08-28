"use client";

import { Suspense } from "react";

import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import MemberForm from "@/modules/member/member-form";

function MemberFormWrapper() {
  return <MemberForm />;
}

export default function NewMemberPage() {
  return (
    <Container>
      <div className="mx-auto max-w-4xl space-y-6">
        <Heading
          align="left"
          description="Add a new member to the church directory with their personal, contact, and ministry information."
          title="Add New Member"
        />
        <Suspense
          fallback={
            <div className="flex h-32 items-center justify-center">
              <p className="text-muted-foreground text-sm">
                Loading member form...
              </p>
            </div>
          }
        >
          <MemberFormWrapper />
        </Suspense>
      </div>
    </Container>
  );
}
