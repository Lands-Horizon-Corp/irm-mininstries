"use client";

import { useState } from "react";

import { format } from "date-fns";
import {
  Download,
  Edit,
  Eye,
  Mail,
  MoreHorizontal,
  Phone,
  Trash2,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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

  const handleDelete = () => {
    onDelete?.(minister.id);
    setIsDeleteDialogOpen(false);
  };

  const fullName = `${minister.firstName} ${minister.middleName ? minister.middleName + " " : ""}${minister.lastName}${minister.suffix ? " " + minister.suffix : ""}`;
  const initials =
    `${minister.firstName[0]}${minister.lastName[0]}`.toUpperCase();

  return (
    <>
      <Card className="group hover:border-primary/20 overflow-hidden transition-all duration-200 hover:shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  alt={fullName}
                  src={minister.imageUrl || undefined}
                />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm leading-tight font-semibold">
                  {fullName}
                </h3>
                <p className="text-muted-foreground text-xs">
                  Minister #{minister.id}
                </p>
                {minister.nickname && (
                  <p className="text-muted-foreground text-xs italic">
                    &ldquo;{minister.nickname}&rdquo;
                  </p>
                )}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="h-8 w-8 p-0" size="sm" variant="ghost">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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
                <DropdownMenuSeparator />
                {onDelete && (
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pt-0">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground text-xs">Gender:</span>
              <p className="capitalize">{minister.gender}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-xs">Status:</span>
              <p className="capitalize">{minister.civilStatus}</p>
            </div>
          </div>

          {/* Contact Info */}
          {(minister.email || minister.telephone) && (
            <div className="space-y-2">
              {minister.email && (
                <div className="flex items-center gap-2">
                  <Mail className="text-muted-foreground h-3 w-3" />
                  <span className="text-muted-foreground truncate text-xs">
                    {minister.email}
                  </span>
                </div>
              )}
              {minister.telephone && (
                <div className="flex items-center gap-2">
                  <Phone className="text-muted-foreground h-3 w-3" />
                  <span className="text-muted-foreground text-xs">
                    {minister.telephone}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Birth Info */}
          <div className="space-y-1">
            <div className="text-xs">
              <span className="text-muted-foreground">Birth:</span>{" "}
              <span className="text-muted-foreground">
                {format(new Date(minister.dateOfBirth), "MMM d, yyyy")}
              </span>
            </div>
            <div className="text-xs">
              <span className="text-muted-foreground">Place:</span>{" "}
              <span className="text-muted-foreground">
                {minister.placeOfBirth}
              </span>
            </div>
          </div>

          {/* Address */}
          {minister.presentAddress && (
            <div className="text-xs">
              <span className="text-muted-foreground">Address:</span>{" "}
              <span className="text-muted-foreground line-clamp-2">
                {minister.presentAddress}
              </span>
            </div>
          )}

          {/* Created Date */}
          <div className="border-border border-t pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Registered:</span>
              <span className="text-muted-foreground">
                {format(new Date(minister.createdAt), "MMM d, yyyy")}
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
    </>
  );
}
