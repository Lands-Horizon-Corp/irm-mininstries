"use client";

import React from "react";

import { Building2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ChurchForm from "@/modules/church/church-form";
import ChurchTable from "@/modules/church/components/church-table";

export default function ChurchesPage() {
  const [dialogOpen, setDialogOpen] = React.useState(false);

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
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Church
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[80vh] min-w-5xl overflow-y-auto">
                <DialogTitle className="sr-only">Add New Church</DialogTitle>
                <DialogDescription>
                  Create a new church with location details, contact
                  information, and administrative settings.
                </DialogDescription>
                <ChurchForm
                  isDialog={true}
                  onClose={() => setDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Church Table */}
          <Card className="p-6">
            <ChurchTable />
          </Card>
        </div>
      </Container>
    </div>
  );
}
