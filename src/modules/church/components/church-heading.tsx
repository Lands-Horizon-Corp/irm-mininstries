import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";

export default function ChurchHeading() {
  return (
    <Container className="py-8">
      <div className="text-center">
        <Heading
          className="mb-4"
          description="Manage and organize church locations to expand our ministry network. Add new churches with their location details, contact information, and descriptions to help connect communities with local ministries."
          title="Church Management"
        />
      </div>
    </Container>
  );
}
