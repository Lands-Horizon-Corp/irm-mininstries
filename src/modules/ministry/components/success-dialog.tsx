"use client";

import { useRouter } from "next/navigation";

import { CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  ministerName: string;
  ministerId: number | null;
  mode?: "create" | "edit";
}

export function SuccessDialog({
  isOpen,
  onClose,
  ministerName,
  ministerId,
  mode = "create",
}: SuccessDialogProps) {
  const router = useRouter();

  const handleViewMinister = () => {
    if (ministerId) {
      router.push(`/admin/ministers/${ministerId}`);
    } else {
      router.push("/admin/ministers");
    }
    onClose();
  };

  const handleCreateAnother = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    router.push("/");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Minister Application {mode === "edit" ? "Updated" : "Submitted"}{" "}
            Successfully!
          </DialogTitle>
          <DialogDescription className="mt-2 text-gray-500">
            The application for <strong>{ministerName}</strong> has been
            successfully {mode === "edit" ? "updated" : "submitted"} and saved
            to the ministry database.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button
            className="w-full sm:w-auto"
            variant="default"
            onClick={handleViewMinister}
          >
            View Minister Profile
          </Button>
          <Button
            className="w-full sm:w-auto"
            variant="outline"
            onClick={handleCreateAnother}
          >
            {mode === "edit"
              ? "Edit Another Minister"
              : "Create Another Application"}
          </Button>
          <Button
            className="w-full sm:w-auto"
            variant="ghost"
            onClick={handleGoHome}
          >
            Go to Dashboard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
