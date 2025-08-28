"use client";

import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import MemberForm from "@/modules/member/member-form";

export default function NewMemberPage() {
  return (
    <Container>
      <div className="mx-auto max-w-4xl space-y-6">
        <Heading
          align="left"
          description="Add a new member to the church directory with their personal, contact, and ministry information."
          title="Add New Member"
        />
        <MemberForm />
      </div>
    </Container>
  );
}
