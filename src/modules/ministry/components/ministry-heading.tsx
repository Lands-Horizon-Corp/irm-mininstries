import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";

export default function MinistryHeading() {
  return (
    <Container className="py-8">
      <div className="text-center">
        <Heading
          className="mb-4"
          description="Manage ministry and their detailed profiles. Add new Ministers with comprehensive information including personal details, family information, ministry experiences, and professional background to build a complete Ministers directory."
          title="Ministry"
        />
      </div>
    </Container>
  );
}
