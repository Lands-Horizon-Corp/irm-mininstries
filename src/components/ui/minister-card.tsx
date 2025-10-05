"use client";

import { useState } from "react";

import { format, formatDistanceToNow } from "date-fns";
import {
  Calendar,
  Crown,
  Download,
  Edit,
  Eye,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  QrCode,
  Trash2,
  UserPlus,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PersonQRCode } from "@/components/ui/person-qr-code";
import type { ministers } from "@/modules/ministry/ministry-schema";

type Minister = typeof ministers.$inferSelect;

interface MinisterCardProps {
  minister: Minister;
  onView?: (minister: Minister) => void;
  onEdit?: (minister: Minister) => void;
  onDelete?: (ministerId: number) => void;
  onDownloadPdf?: (minister: Minister) => void;
}

export function MinisterCard({
  minister,
  onView,
  onEdit,
  onDelete,
  onDownloadPdf,
}: MinisterCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);

  const handleDelete = () => {
    onDelete?.(minister.id);
    setIsDeleteDialogOpen(false);
  };

  const fullName = `${minister.firstName} ${minister.middleName ? minister.middleName + " " : ""}${minister.lastName}${minister.suffix ? " " + minister.suffix : ""}`;
  const initials =
    `${minister.firstName[0]}${minister.lastName[0]}`.toUpperCase();

  return (
    <>
      <Card
        className="group border-border/50 from-background to-muted/30 hover:border-primary/20 relative overflow-hidden bg-gradient-to-br transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="from-primary to-primary/80 absolute top-0 left-0 h-1 w-full bg-gradient-to-r" />

        <CardContent className="p-6">
          <div className="mb-4 flex items-start gap-4">
            <div className="relative">
              <Avatar className="ring-primary/20 group-hover:ring-primary/30 h-16 w-16 ring-2 ring-offset-2 transition-all duration-300">
                <AvatarImage
                  alt={fullName}
                  className="object-cover"
                  src={minister.imageUrl || undefined}
                />
                <AvatarFallback className="from-primary/10 to-primary/20 text-primary bg-gradient-to-br text-lg font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="from-primary to-primary/80 absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br shadow-sm">
                <Crown className="text-primary-foreground h-3 w-3" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-foreground mb-1 text-lg font-semibold text-balance">
                {fullName}
              </h3>

              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="bg-primary/10 text-primary inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize">
                  {minister.gender}
                </span>
                <span className="bg-secondary/80 text-secondary-foreground inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize">
                  {minister.civilStatus}
                </span>
                {minister.nickname && (
                  <span className="bg-muted text-muted-foreground inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium italic">
                    &quot;{minister.nickname}&quot;
                  </span>
                )}
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className={`h-8 w-8 p-0 transition-opacity duration-200 ${
                    isHovered
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                  size="sm"
                  variant="ghost"
                >
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {onView && (
                  <DropdownMenuItem onClick={() => onView(minister)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                )}
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(minister)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                )}
                {onDownloadPdf && (
                  <DropdownMenuItem onClick={() => onDownloadPdf(minister)}>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => setIsQRDialogOpen(true)}>
                  <QrCode className="mr-2 h-4 w-4" />
                  Download QR
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {onDelete && (
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {(minister.email || minister.telephone) && (
            <div className="mb-4 flex flex-wrap gap-3">
              {minister.email && (
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                    <Mail className="text-primary h-4 w-4" />
                  </div>
                  <span className="text-muted-foreground max-w-[180px] truncate text-sm">
                    {minister.email}
                  </span>
                </div>
              )}
              {minister.telephone && (
                <div className="flex items-center gap-2">
                  <div className="bg-secondary/60 flex h-8 w-8 items-center justify-center rounded-full">
                    <Phone className="text-secondary-foreground h-4 w-4" />
                  </div>
                  <span className="text-muted-foreground text-sm">
                    {minister.telephone}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
                <Calendar className="text-muted-foreground h-4 w-4" />
              </div>
              <span className="text-muted-foreground text-sm">
                Born {format(new Date(minister.dateOfBirth), "MMMM yyyy")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
                <MapPin className="text-muted-foreground h-4 w-4" />
              </div>
              <span className="text-muted-foreground text-sm">
                {minister.placeOfBirth}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                <UserPlus className="text-primary h-4 w-4" />
              </div>
              <span className="text-muted-foreground text-sm">
                Minister since{" "}
                {format(new Date(minister.createdAt), "MMM dd, yyyy")} •{" "}
                {formatDistanceToNow(new Date(minister.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Minister</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{fullName}</strong>? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* QR Code Dialog */}
      <PersonQRCode
        id={minister.id}
        name={fullName}
        type="minister"
        isOpen={isQRDialogOpen}
        onClose={() => setIsQRDialogOpen(false)}
      />
    </>
  );
}
