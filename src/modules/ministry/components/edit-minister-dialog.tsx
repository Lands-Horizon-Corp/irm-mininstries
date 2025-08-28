"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useMinister } from "../ministry-service";

import { MinisterForm } from "./minister-form";

interface EditMinisterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  ministerId: number;
}

export function EditMinisterDialog({
  isOpen,
  onClose,
  ministerId,
}: EditMinisterDialogProps) {
  const { data: ministerResponse, isLoading, error } = useMinister(ministerId);

  const handleSuccess = () => {
    onClose();
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Minister</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="border-primary mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2"></div>
              <p className="text-muted-foreground text-sm">
                Loading minister data...
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !ministerResponse?.success || !ministerResponse.data) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="min-w-7xl">
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-destructive text-sm">
              Failed to load minister data: {error?.message || "Unknown error"}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Convert string dates to Date objects for form compatibility
  const processedData = {
    ...ministerResponse.data,
    dateOfBirth: ministerResponse.data.dateOfBirth
      ? new Date(ministerResponse.data.dateOfBirth)
      : new Date(),
    fatherBirthday: ministerResponse.data.fatherBirthday
      ? new Date(ministerResponse.data.fatherBirthday)
      : new Date(),
    motherBirthday: ministerResponse.data.motherBirthday
      ? new Date(ministerResponse.data.motherBirthday)
      : new Date(),
    spouseBirthday: ministerResponse.data.spouseBirthday
      ? new Date(ministerResponse.data.spouseBirthday)
      : undefined,
    weddingDate: ministerResponse.data.weddingDate
      ? new Date(ministerResponse.data.weddingDate)
      : undefined,
    // Process children dates
    children:
      ministerResponse.data.children?.map((child) => ({
        ...child,
        dateOfBirth: child.dateOfBirth
          ? new Date(child.dateOfBirth)
          : new Date(),
      })) || [],
    // Process education dates
    educationBackgrounds:
      ministerResponse.data.educationBackgrounds?.map((edu) => ({
        ...edu,
        dateGraduated: edu.dateGraduated
          ? new Date(edu.dateGraduated)
          : undefined,
      })) || [],
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-screen min-w-7xl overflow-auto">
        <DialogHeader>
          <DialogTitle>Edit Minister</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <MinisterForm
            initialData={processedData}
            isDialog={true}
            mode="edit"
            onClose={onClose}
            onSuccess={handleSuccess}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
