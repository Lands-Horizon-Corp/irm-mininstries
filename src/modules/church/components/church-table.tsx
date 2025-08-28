"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { format } from "date-fns";
import {
  Building2,
  Calendar,
  Edit,
  ExternalLink,
  Eye,
  Filter,
  Mail,
  MapPin,
  MoreHorizontal,
  QrCode,
  Search,
  Trash2,
  UserCheck,
  Users,
} from "lucide-react";

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
import { Input } from "@/components/ui/input";
import { QRCodeDialog } from "@/components/ui/qr-code";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import ChurchForm from "../church-form";
import type { Church } from "../church-schema";
import {
  useChurches,
  useChurchStats,
  useDeleteChurch,
} from "../church-service";

// Church Stats Component
interface ChurchStatsProps {
  churchId: number;
}

const ChurchStatsComponent = ({ churchId }: ChurchStatsProps) => {
  const { data: statsResponse, isLoading } = useChurchStats(churchId);
  const stats = statsResponse?.data;

  if (isLoading) {
    return (
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <div className="bg-muted h-4 w-4 animate-pulse rounded" />
          <span className="text-muted-foreground text-sm">Loading...</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-muted h-4 w-4 animate-pulse rounded" />
          <span className="text-muted-foreground text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="flex gap-4">
      <div className="flex items-center gap-2">
        <Users className="text-primary h-4 w-4" />
        <span className="text-sm font-medium">{stats.memberCount}</span>
        <span className="text-muted-foreground text-xs">Members</span>
      </div>
      <div className="flex items-center gap-2">
        <UserCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        <span className="text-sm font-medium">{stats.ministerCount}</span>
        <span className="text-muted-foreground text-xs">Ministers</span>
      </div>
    </div>
  );
};

// Church Actions Component
interface ChurchActionsProps {
  church: Church;
}

const ChurchActions = ({ church }: ChurchActionsProps) => {
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

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

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
          <DropdownMenuItem asChild>
            <Link href={`/admin/churches/view/${church.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>
            <QrCode className="mr-2 inline h-4 w-4" />
            QR Join Links
          </DropdownMenuLabel>
          <QRCodeDialog
            description="Share this QR code for members to join this church."
            filename={`join-member-${church.name.toLowerCase().replace(/\s+/g, "-")}`}
            title={`Join ${church.name} as Member`}
            trigger={
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Users className="mr-2 h-4 w-4" />
                Member Join Link
              </DropdownMenuItem>
            }
            value={`${baseUrl}/join/member?churchId=${church.id}`}
          />
          <QRCodeDialog
            description="Share this QR code for workers to join this church."
            filename={`join-worker-${church.name.toLowerCase().replace(/\s+/g, "-")}`}
            title={`Join ${church.name} as Worker`}
            trigger={
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <UserCheck className="mr-2 h-4 w-4" />
                Worker Join Link
              </DropdownMenuItem>
            }
            value={`${baseUrl}/join/worker?churchId=${church.id}`}
          />
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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

// Main Church Cards Component
export default function ChurchTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [limitPerPage, setLimitPerPage] = useState(12);

  // Fetch churches with current filters
  const {
    data: churchesResponse,
    isLoading,
    error,
  } = useChurches({
    page: currentPage,
    limit: limitPerPage,
    search: searchQuery || undefined,
    sortBy,
    sortOrder,
  });

  const churches = churchesResponse?.data || [];
  const pagination = churchesResponse?.pagination;

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleSortChange = (value: string) => {
    const [field, order] = value.split("-");
    setSortBy(field);
    setSortOrder(order as "asc" | "desc");
    setCurrentPage(1);
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
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Churches</h2>
          <p className="text-muted-foreground">
            Manage church locations and information
          </p>
        </div>
        <div className="flex items-center gap-2">
          {pagination && (
            <Badge className="text-sm" variant="secondary">
              {pagination.total} church{pagination.total !== 1 ? "es" : ""}
            </Badge>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            className="pl-9"
            placeholder="Search churches..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Filter className="text-muted-foreground h-4 w-4" />
            <Select
              value={`${sortBy}-${sortOrder}`}
              onValueChange={handleSortChange}
            >
              <SelectTrigger className="w-[230px]">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                <SelectItem value="createdAt-desc">Newest First</SelectItem>
                <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                <SelectItem value="address-asc">Location (A-Z)</SelectItem>
                <SelectItem value="address-desc">Location (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select
            value={limitPerPage.toString()}
            onValueChange={(value) => setLimitPerPage(parseInt(value))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">6 per page</SelectItem>
              <SelectItem value="12">12 per page</SelectItem>
              <SelectItem value="24">24 per page</SelectItem>
              <SelectItem value="48">48 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Churches Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card className="overflow-hidden" key={i}>
              <div className="bg-muted h-48 w-full animate-pulse" />
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="bg-muted h-4 w-3/4 animate-pulse rounded" />
                  <div className="bg-muted h-3 w-full animate-pulse rounded" />
                  <div className="bg-muted h-3 w-2/3 animate-pulse rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : churches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Building2 className="text-muted-foreground mb-4 h-16 w-16" />
          <h3 className="mb-2 text-lg font-semibold">
            {searchQuery ? "No churches found" : "No churches yet"}
          </h3>
          <p className="text-muted-foreground max-w-md text-center">
            {searchQuery
              ? `No churches match your search "${searchQuery}". Try adjusting your search terms.`
              : "Get started by adding your first church location."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {churches.map((church) => (
            <Card
              className="group hover:border-primary/20 overflow-hidden transition-all duration-200 hover:shadow-lg"
              key={church.id}
            >
              {/* Church Image */}
              <div className="from-primary/5 to-primary/10 relative h-48 w-full overflow-hidden bg-gradient-to-br">
                {church.imageUrl ? (
                  <Image
                    fill
                    alt={`${church.name} church`}
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                    src={church.imageUrl}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Building2 className="text-muted-foreground h-12 w-12" />
                  </div>
                )}

                {/* Action Button Overlay */}
                <div className="absolute top-2 right-2">
                  <ChurchActions church={church} />
                </div>
              </div>

              {/* Church Information */}
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    className="group-hover:text-primary line-clamp-2 text-lg leading-tight font-semibold transition-colors"
                    href={`/admin/churches/view/${church.id}`}
                  >
                    {church.name}
                  </Link>
                  <Badge className="shrink-0 text-xs" variant="outline">
                    #{church.id}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 pt-0">
                {/* Address */}
                {church.latitude && church.longitude ? (
                  <a
                    className="group/map hover:bg-muted/50 -m-1 flex items-start gap-2 rounded p-1 transition-colors"
                    href={`https://www.google.com/maps?q=${church.latitude},${church.longitude}`}
                    rel="noopener noreferrer"
                    target="_blank"
                    title="Open in Google Maps"
                  >
                    <div className="flex items-start gap-2">
                      <MapPin className="text-primary group-hover/map:text-primary/80 mt-0.5 h-4 w-4 shrink-0 transition-colors" />
                      <div className="flex-1">
                        <p className="text-muted-foreground group-hover/map:text-foreground line-clamp-2 text-sm transition-colors">
                          {church.address}
                        </p>
                      </div>
                      <ExternalLink className="text-muted-foreground group-hover/map:text-primary mt-0.5 h-3 w-3 shrink-0 transition-colors" />
                    </div>
                  </a>
                ) : (
                  <div className="flex items-start gap-2">
                    <MapPin className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
                    <p
                      className="text-muted-foreground line-clamp-2 text-sm"
                      title={church.address || undefined}
                    >
                      {church.address}
                    </p>
                  </div>
                )}

                {/* Email */}
                <div className="flex items-center gap-2">
                  <Mail className="text-muted-foreground h-4 w-4 shrink-0" />
                  <p
                    className="text-muted-foreground truncate text-sm"
                    title={church.email || undefined}
                  >
                    {church.email}
                  </p>
                </div>

                {/* Stats */}
                <div className="border-border border-t pt-2">
                  <ChurchStatsComponent churchId={church.id} />
                </div>

                {/* Creation Date */}
                <div className="flex items-center gap-2 pt-1">
                  <Calendar className="text-muted-foreground h-4 w-4" />
                  <span className="text-muted-foreground text-xs">
                    Created {format(new Date(church.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-6">
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
