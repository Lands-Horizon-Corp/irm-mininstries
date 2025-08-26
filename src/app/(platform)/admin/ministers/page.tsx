import { Plus, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import MinisterTable from "@/modules/ministry/components/minister-table";

export default function MinistersPage() {
  return (
    <div className="bg-background min-h-screen p-8">
      <Container>
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                <Users className="text-primary h-6 w-6" />
              </div>
              <div>
                <h1 className="text-foreground text-3xl font-bold">
                  Ministers
                </h1>
                <p className="text-muted-foreground">
                  Manage minister profiles and assignments
                </p>
              </div>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Minister
            </Button>
          </div>

          {/* Ministers Table */}
          <Card className="p-6">
            <MinisterTable />
          </Card>
        </div>
      </Container>
    </div>
  );
}
