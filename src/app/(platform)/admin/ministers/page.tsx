"use client";
import { useState } from "react";

import { Plus, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MinisterForm } from "@/modules/ministry/components/minister-form";
import MinisterTable from "@/modules/ministry/components/minister-table";

export default function MinistersPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
  };
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
            <div className="flex gap-2">
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Minister
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open("/join", "_blank")}
              >
                Full Form
              </Button>
            </div>
          </div>

          {/* Ministers Table */}
          <Card className="p-6">
            <MinisterTable />
          </Card>

          {/* Create Minister Dialog */}
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogContent className="max-h-screen min-w-7xl overflow-auto">
              <DialogHeader>
                <DialogTitle>Create New Minister</DialogTitle>
                <DialogDescription>
                  Add a new minister with their personal details, ministry
                  skills, and church assignment.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <MinisterForm
                  isDialog={true}
                  mode="create"
                  onClose={() => setIsCreateDialogOpen(false)}
                  onSuccess={handleCreateSuccess}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Container>
    </div>
  );
}
