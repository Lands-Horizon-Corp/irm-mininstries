"use client";

import React from "react";

import { MessageCircle, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ContactTable from "@/modules/contact-us/components/contact-table";
import ContactForm from "@/modules/contact-us/contact-us-form";

export default function ContactUsPage() {
  const [dialogOpen, setDialogOpen] = React.useState(false);

  return (
    <div className="bg-background min-h-screen p-8">
      <Container>
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                <MessageCircle className="text-primary h-6 w-6" />
              </div>
              <div>
                <h1 className="text-foreground text-3xl font-bold">
                  Contact Messages
                </h1>
                <p className="text-muted-foreground">
                  View and manage contact form submissions
                </p>
              </div>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Message
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
                <ContactForm
                  isDialog={true}
                  onClose={() => setDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Contact Table */}
          <Card className="p-6">
            <ContactTable />
          </Card>
        </div>
      </Container>
    </div>
  );
}
