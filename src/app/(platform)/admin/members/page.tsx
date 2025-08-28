"use client";

import { Container } from "@/components/ui/container";
import { MemberHeading } from "@/modules/member/components/member-heading";
import MemberTable from "@/modules/member/components/member-table";

export default function MembersPage() {
  return (
    <Container>
      <div className="space-y-6">
        <MemberHeading />
        <MemberTable />
      </div>
    </Container>
  );
}
