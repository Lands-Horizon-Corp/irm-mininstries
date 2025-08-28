"use client";

import { useState } from "react";

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
import { Badge } from "@/components/ui/badge";
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
import type { Member } from "@/modules/member/member-schema";

interface MemberCardProps {
  member: Member;
  onView?: (member: Member) => void;
  onEdit?: (member: Member) => void;
  onDelete?: (memberId: number) => void;
  onDownloadPdf?: (member: Member) => void;
}

export function MemberCard({
  member,
  onView,
  onEdit,
  onDelete,
  onDownloadPdf,
}: MemberCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    onDelete?.(member.id);
    setIsDeleteDialogOpen(false);
  };

  const fullName = `${member.firstName} ${member.middleName ? member.middleName + " " : ""}${member.lastName}`;
  const initials = `${member.firstName[0]}${member.lastName[0]}`.toUpperCase();

  return (
    <>
      <Card className="group hover:border-primary/20 overflow-hidden transition-all duration-200 hover:shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  alt={fullName}
                  src={member.profilePicture || undefined}
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
                  Member #{member.id}
                </p>
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
                  <DropdownMenuItem onClick={() => onView(member)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                )}
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(member)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                )}
                {onDownloadPdf && (
                  <DropdownMenuItem onClick={() => onDownloadPdf(member)}>
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
              <p className="capitalize">{member.gender}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-xs">Age:</span>
              <p>
                {new Date().getFullYear() -
                  new Date(member.birthdate).getFullYear()}
              </p>
            </div>
          </div>

          {/* Contact Info */}
          {(member.email || member.mobileNumber) && (
            <div className="space-y-2">
              {member.email && (
                <div className="flex items-center gap-2">
                  <Mail className="text-muted-foreground h-3 w-3" />
                  <span className="text-muted-foreground truncate text-xs">
                    {member.email}
                  </span>
                </div>
              )}
              {member.mobileNumber && (
                <div className="flex items-center gap-2">
                  <Phone className="text-muted-foreground h-3 w-3" />
                  <span className="text-muted-foreground text-xs">
                    {member.mobileNumber}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Ministry & Work */}
          {(member.ministryInvolvement || member.occupation) && (
            <div className="space-y-1">
              {member.ministryInvolvement && (
                <Badge className="text-xs" variant="secondary">
                  {member.ministryInvolvement}
                </Badge>
              )}
              {member.occupation && (
                <p className="text-muted-foreground text-xs">
                  <span className="font-medium">Work:</span> {member.occupation}
                </p>
              )}
            </div>
          )}

          {/* Join Date */}
          <div className="border-border border-t pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Joined:</span>
              <span className="text-muted-foreground">{member.yearJoined}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Member</DialogTitle>
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
