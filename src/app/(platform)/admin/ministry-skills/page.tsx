"use client";

import React from "react";

import { Award, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import MinistrySkillsTable from "@/modules/ministry-skills/components/ministry-skills-table";
import MinistrySkillsForm from "@/modules/ministry-skills/ministry-skills-form";

export default function MinistrySkillsPage() {
  const [dialogOpen, setDialogOpen] = React.useState(false);

  return (
    <div className="bg-background min-h-screen p-8">
      <Container>
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                <Award className="text-primary h-6 w-6" />
              </div>
              <div>
                <h1 className="text-foreground text-3xl font-bold">
                  Ministry Skills
                </h1>
                <p className="text-muted-foreground">
                  Manage skills and competencies for ministry roles
                </p>
              </div>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Skill
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogTitle className="sr-only">
                  Add Ministry Skill
                </DialogTitle>
                <MinistrySkillsForm
                  isDialog={true}
                  onClose={() => setDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Ministry Skills Table */}
          <Card className="p-6">
            <MinistrySkillsTable />
          </Card>
        </div>
      </Container>
    </div>
  );
}
