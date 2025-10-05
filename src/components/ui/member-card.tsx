"use client";

import { useState } from "react";

import { format, formatDistanceToNow } from "date-fns";
import {
  Briefcase,
  Calendar,
  Download,
  Edit,
  Eye,
  Heart,
  Mail,
  MoreHorizontal,
  Phone,
  QrCode,
  Trash2,
  UserPlus,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);

  const handleDelete = () => {
    onDelete?.(member.id);
    setIsDeleteDialogOpen(false);
  };

  const fullName = `${member.firstName} ${member.middleName ? member.middleName + " " : ""}${member.lastName}`;
  const initials = `${member.firstName[0]}${member.lastName[0]}`.toUpperCase();
  const age =
    new Date().getFullYear() - new Date(member.birthdate).getFullYear();

  return (
    <>
      <Card className="group bg-card border-border/50 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
        <CardContent className="p-6">
          {/* Header Section */}
          <div className="mb-4 flex items-start gap-4">
            <Avatar className="ring-primary/20 h-16 w-16 shrink-0 ring-2">
              <AvatarImage
                alt={fullName}
                className="object-cover"
                src={member.profilePicture || undefined}
              />
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-card-foreground mb-1 text-lg leading-tight font-bold text-balance">
                    {fullName}
                  </h3>
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {member.gender} • {age} years old
                    </span>
                    {member.yearJoined && (
                      <>
                        <span>•</span>
                        <span>Joined {member.yearJoined}</span>
                      </>
                    )}
                  </div>
                  <div className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
                    <UserPlus className="h-4 w-4" />
                    <span>
                      Member since{" "}
                      {format(new Date(member.createdAt), "MMM dd, yyyy")} •{" "}
                      {formatDistanceToNow(new Date(member.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                      size="sm"
                      variant="ghost"
                    >
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
                    <DropdownMenuItem onClick={() => setIsQRDialogOpen(true)}>
                      <QrCode className="mr-2 h-4 w-4" />
                      Download QR
                    </DropdownMenuItem>
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
            </div>
          </div>

          {/* Contact Information */}
          {(member.email || member.mobileNumber) && (
            <div className="mb-4 space-y-2">
              {member.email && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                    <Mail className="text-primary h-4 w-4" />
                  </div>
                  <span className="text-card-foreground truncate font-medium">
                    {member.email}
                  </span>
                </div>
              )}
              {member.mobileNumber && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                    <Phone className="text-primary h-4 w-4" />
                  </div>
                  <span className="text-card-foreground font-medium">
                    {member.mobileNumber}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Ministry & Work Information */}
          {(member.ministryInvolvement || member.occupation) && (
            <div className="space-y-3">
              {member.ministryInvolvement && (
                <div className="flex items-center gap-3">
                  <div className="bg-secondary/10 flex h-8 w-8 items-center justify-center rounded-full">
                    <Heart className="text-secondary h-4 w-4" />
                  </div>
                  <Badge className="font-medium" variant="secondary">
                    {member.ministryInvolvement}
                  </Badge>
                </div>
              )}
              {member.occupation && (
                <div className="flex items-center gap-3">
                  <div className="bg-accent/10 flex h-8 w-8 items-center justify-center rounded-full">
                    <Briefcase className="text-accent h-4 w-4" />
                  </div>
                  <Badge className="font-medium" variant="outline">
                    {member.occupation}
                  </Badge>
                </div>
              )}
            </div>
          )}
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

      {/* QR Code Dialog */}
      <PersonQRCode
        id={member.id}
        name={fullName}
        type="member"
        isOpen={isQRDialogOpen}
        onClose={() => setIsQRDialogOpen(false)}
      />
    </>
  );
}
