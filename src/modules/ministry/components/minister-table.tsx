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
  FileTextIcon,
  Mail,
  MapPin,
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

import {
  downloadMinisterPDF,
  useDeleteMinister,
  useMinisters,
} from "../ministry-service";

import { EditMinisterDialog } from "./edit-minister-dialog";
import { ViewMinisterDialog } from "./view-minister-dialog";

// Minister interface based on your requirements
interface Minister {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string | null;
  email: string | null;
  telephone: string | null;
  gender: "male" | "female";
  civilStatus: "single" | "married" | "widowed" | "separated" | "divorced";
  address: string;
  presentAddress: string;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Minister Actions Component
interface MinisterActionsProps {
  minister: Minister;
}

const MinisterActions = ({ minister }: MinisterActionsProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const deleteMinisterMutation = useDeleteMinister();

  const handleDelete = async () => {
    try {
      await deleteMinisterMutation.mutateAsync(minister.id);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete minister:", error);
    }
  };

  const handlePDFDownload = async () => {
    setIsDownloadingPDF(true);
    try {
      await downloadMinisterPDF(minister.id);
    } catch (error) {
      console.error("Failed to download PDF:", error);
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  const getFullName = () => {
    const parts = [minister.firstName];
    if (minister.middleName) parts.push(minister.middleName);
    parts.push(minister.lastName);
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
          <QRAction id={minister.id} name={getFullName()} type="minister" />
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
              minister &quot;{getFullName()}&quot; and all associated data
              including ministry records, skills, and personal information.
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
              disabled={deleteMinisterMutation.isPending}
              variant="destructive"
              onClick={handleDelete}
            >
              {deleteMinisterMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Minister Dialog */}
      <EditMinisterDialog
        isOpen={isEditDialogOpen}
        ministerId={minister.id}
        onClose={() => setIsEditDialogOpen(false)}
      />

      {/* View Minister Dialog */}
      <ViewMinisterDialog
        isOpen={isViewDialogOpen}
        ministerId={minister.id}
        onClose={() => setIsViewDialogOpen(false)}
      />
    </>
  );
};

// Define table columns
const columns: ColumnDef<Minister>[] = [
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <MinisterActions minister={row.original} />,
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
      const minister = row.original;
      const fullName = [minister.firstName];
      if (minister.middleName) fullName.push(minister.middleName);
      fullName.push(minister.lastName);

      return (
        <div className="relative h-10 w-10 overflow-hidden rounded-full">
          {minister.imageUrl ? (
            <Image
              fill
              alt={fullName.join(" ")}
              className="object-cover"
              src={minister.imageUrl}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-purple-100 dark:bg-purple-900">
              <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
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
      const minister = row.original;
      const fullName = [minister.firstName];
      if (minister.middleName) fullName.push(minister.middleName);
      fullName.push(minister.lastName);

      return (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-purple-600" />
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
    accessorKey: "telephone",
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.getValue("telephone") as string | null;
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
    accessorKey: "civilStatus",
    header: "Civil Status",
    cell: ({ row }) => {
      const status = row.getValue("civilStatus") as string;
      const getStatusColor = (status: string) => {
        switch (status) {
          case "single":
            return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
          case "married":
            return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
          case "widowed":
            return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100";
          case "separated":
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
          case "divorced":
            return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
          default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100";
        }
      };

      return <Badge className={getStatusColor(status)}>{status}</Badge>;
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
          <span className="max-w-[200px] truncate text-sm" title={address}>
            {address}
          </span>
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

// Main Ministers Table Component
export default function MinisterTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch ministers with current filters
  const {
    data: ministersResponse,
    isLoading,
    error,
  } = useMinisters({
    page: currentPage,
    limit: 10,
    search: searchQuery || undefined,
    sortBy: sorting[0]?.id,
    sortOrder: sorting[0]?.desc ? "desc" : "asc",
  });

  const ministers = ministersResponse?.data || [];
  const pagination = ministersResponse?.pagination;

  const table = useReactTable({
    data: ministers,
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
            Failed to load ministers: {error.message}
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
          <h2 className="text-2xl font-bold">Ministers</h2>
          <p className="text-muted-foreground">
            Manage ministers and their information
          </p>
        </div>
        <div className="flex items-center gap-2">
          {pagination && (
            <Badge variant="secondary">
              {pagination.total} minister{pagination.total !== 1 ? "s" : ""}
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
            placeholder="Search ministers..."
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
            ) : ministers.length === 0 ? (
              <TableRow>
                <TableCell
                  className="h-24 text-center"
                  colSpan={columns.length}
                >
                  {searchQuery ? "No ministers found." : "No ministers yet."}
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
