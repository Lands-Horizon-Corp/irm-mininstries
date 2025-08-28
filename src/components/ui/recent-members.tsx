"use client";

import { useEffect, useState } from "react";

import { format, formatDistanceToNow } from "date-fns";
import {
  Calendar,
  Church,
  Edit,
  Eye,
  FileTextIcon,
  Mail,
  MoreHorizontal,
  Trash2,
  User,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ImageViewer } from "@/components/ui/image-viewer";
import { QRAction } from "@/components/ui/qr-action";
import { ViewMemberDialog } from "@/modules/member/components/view-member-dialog";
// Import member-related components and services
import MemberForm from "@/modules/member/member-form";
import { generateMemberPDF } from "@/modules/member/member-pdf";
import { useDeleteMember } from "@/modules/member/member-service";

interface RecentMember {
  id: number;
  firstName: string;
  lastName: string;
  email: string | null;
  mobileNumber: string | null;
  createdAt: string;
  churchId: number;
  churchName: string | null;
  churchAddress: string | null;
  profilePicture: string | null;
  gender: "male" | "female";
  yearJoined: number;
  occupation: string | null;
}

interface RecentMembersResponse {
  success: boolean;
  data: RecentMember[];
  count: number;
}

// Member Actions Component (similar to the one in member-table.tsx)
interface MemberActionsProps {
  member: RecentMember;
  onRefresh: () => void;
}

const MemberActions = ({ member, onRefresh }: MemberActionsProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const deleteMemberMutation = useDeleteMember();

  const handleDelete = async () => {
    try {
      await deleteMemberMutation.mutateAsync(member.id);
      setIsDeleteDialogOpen(false);
      onRefresh(); // Refresh the recent members list
    } catch (error) {
      console.error("Failed to delete member:", error);
    }
  };

  const handlePDFDownload = async () => {
    setIsDownloadingPDF(true);
    try {
      await generateMemberPDF({
        profilePicture: member.profilePicture,
        firstName: member.firstName,
        lastName: member.lastName,
        middleName: null, // Not available in recent members data
        gender: member.gender,
        birthdate: null, // Not available in recent members data
        yearJoined: member.yearJoined,
        ministryInvolvement: null, // Not available in recent members data
        occupation: member.occupation,
        educationalAttainment: null, // Not available in recent members data
        school: null, // Not available in recent members data
        degree: null, // Not available in recent members data
        mobileNumber: member.mobileNumber,
        email: member.email,
        homeAddress: null, // Not available in recent members data
        facebookLink: null, // Not available in recent members data
        xLink: null, // Not available in recent members data
        instagramLink: null, // Not available in recent members data
        notes: null, // Not available in recent members data
        createdAt: new Date(member.createdAt),
        updatedAt: new Date(member.createdAt), // Using createdAt as fallback
      });
    } catch (error) {
      console.error("Failed to download PDF:", error);
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  const getFullName = () => {
    return `${member.firstName} ${member.lastName}`;
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="h-8 w-8 p-0" variant="ghost">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={isDownloadingPDF}
            onClick={handlePDFDownload}
          >
            <FileTextIcon className="mr-2 h-4 w-4" />
            {isDownloadingPDF ? "Downloading..." : "PDF Download"}
          </DropdownMenuItem>
          <QRAction id={member.id} name={getFullName()} type="member" />
          <DropdownMenuItem onClick={() => setIsViewDialogOpen(true)}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              member &quot;{getFullName()}&quot; and all associated data.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={deleteMemberMutation.isPending}
              variant="destructive"
              onClick={handleDelete}
            >
              {deleteMemberMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Member Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-h-[90vh] w-full min-w-4xl overflow-y-auto">
          <DialogTitle>Edit Member</DialogTitle>
          <MemberForm
            isDialog={true}
            memberId={member.id}
            onClose={() => {
              setIsEditDialogOpen(false);
              onRefresh(); // Refresh the recent members list after edit
            }}
          />
        </DialogContent>
      </Dialog>

      {/* View Member Dialog */}
      <ViewMemberDialog
        isOpen={isViewDialogOpen}
        memberId={member.id}
        onClose={() => setIsViewDialogOpen(false)}
      />
    </>
  );
};

// Member Item Component
interface MemberItemProps {
  member: RecentMember;
  onRefresh: () => void;
  formatDate: (dateString: string) => string;
  getTimeAgo: (dateString: string) => string;
  getInitials: (firstName: string, lastName: string) => string;
}

const MemberItem = ({
  member,
  onRefresh,
  formatDate,
  getTimeAgo,
  getInitials,
}: MemberItemProps) => {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);

  const handleNameClick = () => {
    setIsViewDialogOpen(true);
  };

  const handleImageClick = () => {
    if (member.profilePicture) {
      setIsImageViewerOpen(true);
    }
  };

  return (
    <>
      <div className="bg-card/50 hover:bg-card flex items-start space-x-3 rounded-lg border p-3 transition-colors">
        <Avatar
          className={`h-10 w-10 ${member.profilePicture ? "cursor-pointer hover:opacity-80" : ""}`}
          onClick={handleImageClick}
        >
          <AvatarImage src={member.profilePicture || undefined} />
          <AvatarFallback className="text-xs">
            {getInitials(member.firstName, member.lastName)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <h4
                className="text-foreground hover:text-primary cursor-pointer truncate text-sm font-semibold transition-colors"
                onClick={handleNameClick}
              >
                {member.firstName} {member.lastName}
              </h4>

              <div className="mt-1 flex items-center gap-1">
                <Church className="text-muted-foreground h-3 w-3" />
                <span className="text-muted-foreground truncate text-xs">
                  {member.churchName || "No Church"}
                </span>
              </div>

              {member.email && (
                <div className="mt-1 flex items-center gap-1">
                  <Mail className="text-muted-foreground h-3 w-3" />
                  <span className="text-muted-foreground truncate text-xs">
                    {member.email}
                  </span>
                </div>
              )}

              <div className="mt-1 flex items-center gap-1">
                <Calendar className="text-muted-foreground h-3 w-3" />
                <span className="text-muted-foreground text-xs">
                  Joined {getTimeAgo(member.createdAt)} (
                  {formatDate(member.createdAt)})
                </span>
              </div>
            </div>

            <MemberActions member={member} onRefresh={onRefresh} />
          </div>
        </div>
      </div>

      {/* View Member Dialog */}
      <ViewMemberDialog
        isOpen={isViewDialogOpen}
        memberId={member.id}
        onClose={() => setIsViewDialogOpen(false)}
      />

      {/* Image Viewer for profile pictures */}
      <ImageViewer
        alt={`${member.firstName} ${member.lastName} profile picture`}
        isOpen={isImageViewerOpen}
        src={member.profilePicture}
        onClose={() => setIsImageViewerOpen(false)}
      />
    </>
  );
};

export function RecentMembers() {
  const [members, setMembers] = useState<RecentMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecentMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/members/recent");
      const data: RecentMembersResponse = await response.json();

      if (data.success) {
        setMembers(data.data);
      } else {
        setError("Failed to fetch recent members");
      }
    } catch (err) {
      setError("Error loading recent members");
      console.error("Error fetching recent members:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentMembers();
  }, []);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };

  const getTimeAgo = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <User className="text-primary h-5 w-5" />
            New Members (Last 31 Days)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div className="flex animate-pulse items-center space-x-3" key={i}>
              <div className="bg-muted h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="bg-muted h-4 w-3/4 rounded" />
                <div className="bg-muted h-3 w-1/2 rounded" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <User className="text-primary h-5 w-5" />
            New Members (Last 31 Days)
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <User className="text-muted-foreground mb-4 h-12 w-12" />
          <h3 className="mb-2 text-lg font-semibold">Unable to Load Members</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button size="sm" onClick={fetchRecentMembers}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <User className="text-primary h-5 w-5" />
            New Members (Last 31 Days)
          </CardTitle>
          <Badge className="px-2 py-1 text-xs" variant="secondary">
            {members.length} members
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 overflow-y-auto">
        {members.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <User className="text-muted-foreground mb-4 h-12 w-12" />
            <h3 className="mb-2 text-lg font-semibold">No New Members</h3>
            <p className="text-muted-foreground">
              No members have joined in the last 31 days.
            </p>
          </div>
        ) : (
          members.map((member) => (
            <MemberItem
              formatDate={formatDate}
              getInitials={getInitials}
              getTimeAgo={getTimeAgo}
              key={member.id}
              member={member}
              onRefresh={fetchRecentMembers}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}
