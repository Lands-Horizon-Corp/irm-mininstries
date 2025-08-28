"use client";

import { useState } from "react";

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
  Edit,
  Eye,
  FileText,
  MoreHorizontal,
  Search,
  Star,
  Trash2,
  Zap,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import MinistrySkillsForm from "../ministry-skills-form";
import type { MinistrySkill } from "../ministry-skills-schema";
import {
  useDeleteMinistrySkill,
  useMinistrySkills,
} from "../ministry-skills-service";

// Ministry Skill Actions Component
interface MinistrySkillActionsProps {
  ministrySkill: MinistrySkill;
}

const MinistrySkillActions = ({ ministrySkill }: MinistrySkillActionsProps) => {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const deleteMinistrySkillMutation = useDeleteMinistrySkill();

  const handleDelete = async () => {
    try {
      await deleteMinistrySkillMutation.mutateAsync(ministrySkill.id);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete ministry skill:", error);
    }
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

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ministry Skill Details</DialogTitle>
            <DialogDescription>
              View ministry skill information and requirements.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Skill Header */}
            <div className="flex items-center gap-4 rounded-lg border bg-gradient-to-r from-green-50 to-emerald-50 p-4 dark:from-green-950/30 dark:to-emerald-950/30">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{ministrySkill.name}</h3>
                <p className="text-muted-foreground text-sm">Ministry Skill</p>
              </div>
            </div>

            {/* Skill Information */}
            <div className="grid gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Star className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm font-medium">Skill Name</span>
                </div>
                <p className="text-foreground text-lg font-medium">
                  {ministrySkill.name}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm font-medium">Description</span>
                </div>
                <div className="bg-muted/50 rounded-lg border p-4">
                  <p className="text-muted-foreground text-sm">
                    {ministrySkill.description}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm font-medium">Created</span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {format(new Date(ministrySkill.createdAt), "PPP")}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm font-medium">Last Updated</span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {format(new Date(ministrySkill.updatedAt), "PPP")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogTitle className="sr-only">Edit Ministry Skill</DialogTitle>
          <MinistrySkillsForm
            initialData={ministrySkill}
            isDialog={true}
            mode="edit"
            onClose={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              ministry skill and all associated data. Ministers with this skill
              may be affected.
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
              disabled={deleteMinistrySkillMutation.isPending}
              variant="destructive"
              onClick={handleDelete}
            >
              {deleteMinistrySkillMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Define table columns
const columns: ColumnDef<MinistrySkill>[] = [
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <MinistrySkillActions ministrySkill={row.original} />,
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
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        className="h-8 px-2"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Skill Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return (
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-green-600" />
          <span className="text-foreground font-semibold">{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <Button
        className="h-8 px-2"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Description
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return (
        <div className="max-w-[400px] truncate" title={description}>
          <span className="text-muted-foreground">{description}</span>
        </div>
      );
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
        Created
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string;
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
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <Button
        className="h-8 px-2"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Updated
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const updatedAt = row.getValue("updatedAt") as string;
      return (
        <div className="flex items-center gap-2">
          <Calendar className="text-muted-foreground h-4 w-4" />
          <span className="text-sm">
            {format(new Date(updatedAt), "MMM dd, yyyy")}
          </span>
        </div>
      );
    },
  },
];

// Main Ministry Skills Table Component
export default function MinistrySkillsTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch ministry skills with current filters
  const {
    data: ministrySkillsResponse,
    isLoading,
    error,
  } = useMinistrySkills({
    page: currentPage,
    limit: 10,
    search: searchQuery || undefined,
    sortBy: sorting[0]?.id,
    sortOrder: sorting[0]?.desc ? "desc" : "asc",
  });

  const ministrySkills = ministrySkillsResponse?.data || [];
  const pagination = ministrySkillsResponse?.pagination;

  const table = useReactTable({
    data: ministrySkills,
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

  if (error) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="text-center">
          <p className="text-destructive text-sm">
            Failed to load ministry skills: {error.message}
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
          <h2 className="text-2xl font-bold">Ministry Skills</h2>
          <p className="text-muted-foreground">
            Manage skills and capabilities for ministry work
          </p>
        </div>
        <div className="flex items-center gap-2">
          {pagination && (
            <Badge variant="secondary">
              {pagination.total} skill{pagination.total !== 1 ? "s" : ""}
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
            placeholder="Search ministry skills..."
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
            ) : ministrySkills.length === 0 ? (
              <TableRow>
                <TableCell
                  className="h-24 text-center"
                  colSpan={columns.length}
                >
                  {searchQuery
                    ? "No ministry skills found."
                    : "No ministry skills yet."}
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
    </div>
  );
}
