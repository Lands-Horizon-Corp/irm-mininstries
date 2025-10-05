"use client";

import React from "react";

import { Crown, Plus } from "lucide-react";

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
import MinistryRanksTable from "@/modules/ministry-ranks/components/ministry-ranks-table";
import MinistryRanksForm from "@/modules/ministry-ranks/ministry-ranks-form";

export default function MinistryRanksPage() {
  const [dialogOpen, setDialogOpen] = React.useState(false);

  return (
    <div className="bg-background min-h-screen p-8">
      <Container>
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                <Crown className="text-primary h-6 w-6" />
              </div>
              <div>
                <h1 className="text-foreground text-3xl font-bold">
                  Ministry Ranks
                </h1>
                <p className="text-muted-foreground">
                  Manage ministry hierarchy and rank structure
                </p>
              </div>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Rank
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogTitle className="sr-only">Add Ministry Rank</DialogTitle>
                <DialogDescription>
                  Create a new ministry rank with hierarchy level and
                  permissions for the organizational structure.
                </DialogDescription>
                <MinistryRanksForm
                  isDialog={true}
                  onClose={() => setDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Ministry Ranks Table */}
          <Card className="p-6">
            <MinistryRanksTable />
          </Card>
        </div>
      </Container>
    </div>
  );
}
