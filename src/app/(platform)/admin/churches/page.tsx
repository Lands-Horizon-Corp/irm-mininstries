import { Building2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";

export default function ChurchesPage() {
  return (
    <div className="bg-background min-h-screen p-8">
      <Container>
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                <Building2 className="text-primary h-6 w-6" />
              </div>
              <div>
                <h1 className="text-foreground text-3xl font-bold">
                  Churches Management
                </h1>
                <p className="text-muted-foreground">
                  Manage churches and their information
                </p>
              </div>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Church
            </Button>
          </div>

          {/* Content */}
          <Card className="p-8">
            <div className="text-center">
              <Building2 className="text-muted-foreground/50 mx-auto h-16 w-16" />
              <h3 className="text-foreground mt-4 text-lg font-semibold">
                No churches found
              </h3>
              <p className="text-muted-foreground mt-2">
                Start by adding your first church to manage their information
                and details.
              </p>
              <Button className="mt-4" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Church
              </Button>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}
