"use client";

import { useState } from "react";
import Image from "next/image";

import type {
  ColumnDef,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import {
  ArrowUpDown,
  Calendar,
  ChevronDown,
  Download,
  Edit,
  Eye,
  FileSpreadsheet,
  FileTextIcon,
  Mail,
  MoreHorizontal,
  Phone,
  Search,
  Trash2,
  User,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { QRAction } from "@/components/ui/qr-action";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import MemberForm from "../member-form";
import { generateMemberPDF } from "../member-pdf";
import { useDeleteMember, useMembers } from "../member-service";

import { ViewMemberDialog } from "./view-member-dialog";
import { toast } from "sonner";

// Member interface for table display
interface Member {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string | null;
  gender: "male" | "female";
  email: string | null;
  mobileNumber: string | null;
  yearJoined: number;
  ministryInvolvement: string | null;
  occupation: string | null;
  profilePicture: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Member Actions Component
interface MemberActionsProps {
  member: Member;
}

const MemberActions = ({ member }: MemberActionsProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const deleteMemberMutation = useDeleteMember();

  const handleDelete = async () => {
    try {
      await deleteMemberMutation.mutateAsync(member.id);
      setIsDeleteDialogOpen(false);
    } catch {
      toast.error("Failed to delete member. Please try again.");
    }
  };

  const handlePDFDownload = async () => {
    setIsDownloadingPDF(true);
    try {
      await generateMemberPDF({
        profilePicture: member.profilePicture,
        firstName: member.firstName,
        lastName: member.lastName,
        middleName: member.middleName,
        gender: member.gender,
        birthdate: null,
        yearJoined: member.yearJoined,
        ministryInvolvement: member.ministryInvolvement,
        occupation: member.occupation,
        educationalAttainment: null,
        school: null,
        degree: null,
        mobileNumber: member.mobileNumber,
        email: member.email,
        homeAddress: null,
        facebookLink: null,
        xLink: null,
        instagramLink: null,
        notes: null,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
      });
    } catch {
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  const getFullName = () => {
    const parts = [member.firstName];
    if (member.middleName) parts.push(member.middleName);
    parts.push(member.lastName);
    return parts.join(" ");
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
          <DialogDescription>
            Update member information including personal details and ministry
            involvement.
          </DialogDescription>
          <MemberForm
            isDialog={true}
            memberId={member.id}
            onClose={() => setIsEditDialogOpen(false)}
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

// Define table columns
const columns: ColumnDef<Member>[] = [
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <MemberActions member={row.original} />,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <Button
        className="h-8 px-2"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        ID
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-mono text-sm">{row.getValue("id")}</div>
    ),
  },
  {
    id: "image",
    header: "Photo",
    cell: ({ row }) => {
      const member = row.original;
      const fullName = [member.firstName];
      if (member.middleName) fullName.push(member.middleName);
      fullName.push(member.lastName);

      return (
        <div className="relative h-10 w-10 overflow-hidden rounded-full">
          {member.profilePicture ? (
            <Image
              fill
              alt={fullName.join(" ")}
              className="object-cover"
              src={member.profilePicture}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-blue-100 dark:bg-blue-900">
              <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <Button
        className="h-8 px-2"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Full Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const member = row.original;
      const fullName = [member.firstName];
      if (member.middleName) fullName.push(member.middleName);
      fullName.push(member.lastName);

      return (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-blue-600" />
          <span className="font-medium">{fullName.join(" ")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.getValue("email") as string | null;
      return email ? (
        <div className="flex items-center gap-2">
          <Mail className="text-muted-foreground h-4 w-4" />
          <span className="font-mono text-sm">{email}</span>
        </div>
      ) : (
        <span className="text-muted-foreground text-sm">No email</span>
      );
    },
  },
  {
    accessorKey: "mobileNumber",
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.getValue("mobileNumber") as string | null;
      return phone ? (
        <div className="flex items-center gap-2">
          <Phone className="text-muted-foreground h-4 w-4" />
          <span className="font-mono text-sm">{phone}</span>
        </div>
      ) : (
        <span className="text-muted-foreground text-sm">No phone</span>
      );
    },
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => {
      const gender = row.getValue("gender") as string;
      return (
        <Badge
          className={
            gender === "male"
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
              : "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100"
          }
        >
          {gender}
        </Badge>
      );
    },
  },
  {
    accessorKey: "yearJoined",
    header: "Year Joined",
    cell: ({ row }) => {
      const year = row.getValue("yearJoined") as number;
      return <Badge variant="secondary">{year}</Badge>;
    },
  },
  {
    accessorKey: "occupation",
    header: "Occupation",
    cell: ({ row }) => {
      const occupation = row.getValue("occupation") as string | null;
      return <span className="text-sm">{occupation || "Not specified"}</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        className="h-8 px-2"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Registered
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as Date;
      return (
        <div className="flex items-center gap-2">
          <Calendar className="text-muted-foreground h-4 w-4" />
          <span className="text-sm">
            {format(new Date(createdAt), "MMM dd, yyyy")}
          </span>
        </div>
      );
    },
  },
];

// Main Members Table Component
export default function MemberTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  // Fetch members with current filters
  const {
    data: membersResponse,
    isLoading,
    error,
  } = useMembers({
    page: currentPage,
    limit: 10,
    search: searchQuery || undefined,
    sortBy: sorting[0]?.id,
    sortOrder: sorting[0]?.desc ? "desc" : "asc",
  });

  const members = membersResponse?.data || [];
  const pagination = membersResponse?.pagination;

  const table = useReactTable({
    data: members,
    columns,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnVisibility,
    },
  });

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleExportToExcel = async () => {
    try {
      setIsExporting(true);
      const response = await fetch("/api/member/export", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to export members");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `members-${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  if (error) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="text-center">
          <p className="text-destructive text-sm">
            Failed to load members: {error.message}
          </p>
          <Button
            className="mt-2"
            size="sm"
            variant="outline"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Members</h2>
          <p className="text-muted-foreground">
            Manage members and their information
          </p>
        </div>
        <div className="flex items-center gap-2">
          {pagination && (
            <Badge variant="secondary">
              {pagination.total} member{pagination.total !== 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            className="pl-9"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuItem
                    className="capitalize"
                    key={column.id}
                    onClick={() =>
                      column.toggleVisibility(!column.getIsVisible())
                    }
                  >
                    {column.getIsVisible() ? "✓ " : ""}
                    {column.id}
                  </DropdownMenuItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  className="h-24 text-center"
                  colSpan={columns.length}
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : members.length === 0 ? (
              <TableRow>
                <TableCell
                  className="h-24 text-center"
                  colSpan={columns.length}
                >
                  {searchQuery ? "No members found." : "No members yet."}
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  data-state={row.getIsSelected() && "selected"}
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground text-sm">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} results
          </div>
          <div className="flex items-center space-x-2">
            <Button
              disabled={!pagination.hasPrev || isLoading}
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  // Show first, last, current, and adjacent pages
                  return (
                    page === 1 ||
                    page === pagination.totalPages ||
                    Math.abs(page - pagination.page) <= 1
                  );
                })
                .map((page, index, array) => (
                  <div className="flex items-center" key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="text-muted-foreground px-2">...</span>
                    )}
                    <Button
                      className="h-8 w-8"
                      disabled={isLoading}
                      size="sm"
                      variant={page === pagination.page ? "default" : "ghost"}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  </div>
                ))}
            </div>
            <Button
              disabled={!pagination.hasNext || isLoading}
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Export Section */}
      <div className="flex items-center justify-center border-t pt-4">
        <Button
          className="gap-2"
          disabled={isExporting || members.length === 0}
          variant="outline"
          onClick={handleExportToExcel}
        >
          <FileSpreadsheet className="h-4 w-4" />
          {isExporting ? (
            <>
              <Download className="h-4 w-4 animate-spin" />
              Exporting...
            </>
          ) : (
            "Export to Excel"
          )}
        </Button>
      </div>
    </div>
  );
}
