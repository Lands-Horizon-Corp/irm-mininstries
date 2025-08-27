import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";

export default function MinistryRanksHeading() {
  return (
    <Container className="py-8">
      <div className="text-center">
        <Heading
          className="mb-4"
          description="Manage and organize ministry ranks to establish clear leadership hierarchy and ministry positions within our church. These ranks help define roles, responsibilities, and authority levels in ministry work."
          title="Ministry Ranks"
        />
      </div>
    </Container>
  );
}
