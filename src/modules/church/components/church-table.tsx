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
  Edit,
  Eye,
  Mail,
  MapPin,
  MoreHorizontal,
  Search,
  Trash2,
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

import ChurchForm from "../church-form";
import type { Church } from "../church-schema";
import { useChurches, useDeleteChurch } from "../church-service";

// Church Actions Component
interface ChurchActionsProps {
  church: Church;
}

const ChurchActions = ({ church }: ChurchActionsProps) => {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const deleteChurchMutation = useDeleteChurch();

  const handleDelete = async () => {
    try {
      await deleteChurchMutation.mutateAsync(church.id);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete church:", error);
    }
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
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
        <DialogContent className="min-w-4xl">
          <DialogHeader>
            <DialogTitle>Church Details</DialogTitle>
            <DialogDescription>
              View church information and location details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Church Image */}
            {church.imageUrl && (
              <div className="relative h-48 w-full overflow-hidden rounded-lg">
                <Image
                  fill
                  alt="Church"
                  className="h-full w-full object-cover"
                  src={church.imageUrl}
                />
              </div>
            )}

            {/* Church Information */}
            <div className="grid gap-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Name</h3>
                <p className="text-muted-foreground text-sm">{church.name}</p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm font-medium">Address</span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {church.address}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm font-medium">Email</span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {church.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <span className="text-sm font-medium">Coordinates</span>
                  <p className="text-muted-foreground text-sm">
                    Lat: {church.latitude}, Lng: {church.longitude}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm font-medium">Created</span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {format(new Date(church.createdAt), "PPP")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-h-[90vh] min-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="sr-only">Edit Church</DialogTitle>
          </DialogHeader>
          <ChurchForm
            initialData={church}
            isDialog={true}
            mode="edit"
            onClose={() => setIsEditDialogOpen(false)}
            onSuccess={handleEditSuccess}
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
              church and all associated data.
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
              disabled={deleteChurchMutation.isPending}
              variant="destructive"
              onClick={handleDelete}
            >
              {deleteChurchMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Define table columns
const columns: ColumnDef<Church>[] = [
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ChurchActions church={row.original} />,
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
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return (
        <div className="max-w-[300px] truncate" title={name}>
          {name}
        </div>
      );
    },
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => {
      const address = row.getValue("address") as string;
      return (
        <div className="flex items-center gap-2">
          <MapPin className="text-muted-foreground h-4 w-4" />
          <span className="max-w-[200px] truncate" title={address}>
            {address}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.getValue("email") as string;
      return (
        <div className="flex items-center gap-2">
          <Mail className="text-muted-foreground h-4 w-4" />
          <span className="font-mono text-sm">{email}</span>
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
          <span className="text-sm">{format(new Date(createdAt), "PPP")}</span>
        </div>
      );
    },
  },
];

// Main Church Table Component
export default function ChurchTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch churches with current filters
  const {
    data: churchesResponse,
    isLoading,
    error,
  } = useChurches({
    page: currentPage,
    limit: 10,
    search: searchQuery || undefined,
    sortBy: sorting[0]?.id,
    sortOrder: sorting[0]?.desc ? "desc" : "asc",
  });

  const churches = churchesResponse?.data || [];
  const pagination = churchesResponse?.pagination;

  const table = useReactTable({
    data: churches,
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
            Failed to load churches: {error.message}
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
          <h2 className="text-2xl font-bold">Churches</h2>
          <p className="text-muted-foreground">
            Manage church locations and information
          </p>
        </div>
        <div className="flex items-center gap-2">
          {pagination && (
            <Badge variant="secondary">
              {pagination.total} church{pagination.total !== 1 ? "es" : ""}
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
            placeholder="Search churches..."
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
            ) : churches.length === 0 ? (
              <TableRow>
                <TableCell
                  className="h-24 text-center"
                  colSpan={columns.length}
                >
                  {searchQuery ? "No churches found." : "No churches yet."}
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
