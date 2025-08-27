import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";

export default function MinistrySkillsHeading() {
  return (
    <Container className="py-8">
      <div className="text-center">
        <Heading
          className="mb-4"
          description="Manage and organize ministry skills to help categorize talents and abilities within our church community. These skills help us identify and connect the right people for ministry opportunities."
          title="Ministry Skills"
        />
      </div>
    </Container>
  );
}
