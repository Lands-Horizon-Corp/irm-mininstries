"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { format } from "date-fns";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Edit,
  Mail,
  MapPin,
  QrCode,
  Trash2,
  UserCheck,
  Users,
} from "lucide-react";

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
import { QRCodeDialog } from "@/components/ui/qr-code";
import { Separator } from "@/components/ui/separator";
import ChurchForm from "@/modules/church/church-form";
import {
  useChurch,
  useChurchStats,
  useDeleteChurch,
} from "@/modules/church/church-service";

interface ChurchViewPageProps {
  churchId: number;
}

export default function ChurchViewPage({ churchId }: ChurchViewPageProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: churchResponse, isLoading, error } = useChurch(churchId);
  const { data: statsResponse, isLoading: statsLoading } =
    useChurchStats(churchId);
  const deleteChurchMutation = useDeleteChurch();

  const church = churchResponse?.data;
  const stats = statsResponse?.data;

  const handleDelete = async () => {
    try {
      await deleteChurchMutation.mutateAsync(churchId);
      setIsDeleteDialogOpen(false);
      // Navigate back to churches list
      window.location.href = "/admin/churches";
    } catch (error) {
      console.error("Failed to delete church:", error);
    }
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2" />
            <p className="text-muted-foreground">Loading church details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !church) {
    notFound();
  }

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="container mx-auto space-y-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild size="sm" variant="ghost">
            <Link href="/admin/churches">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Churches
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{church.name}</h1>
            <p className="text-muted-foreground">Church Details</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline">#{church.id}</Badge>
          <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Information */}
        <div className="space-y-6 lg:col-span-2">
          {/* Church Image */}
          <Card>
            <CardContent className="p-0">
              <div className="relative h-64 w-full overflow-hidden rounded-t-lg bg-gradient-to-br from-blue-50 to-indigo-100">
                {church.imageUrl ? (
                  <Image
                    fill
                    alt={`${church.name} church`}
                    className="object-cover"
                    src={church.imageUrl}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Building2 className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Address</span>
                  </div>
                  <p className="text-sm text-gray-600">{church.address}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Email</span>
                  </div>
                  <p className="text-sm text-gray-600">{church.email}</p>
                </div>
              </div>

              {church.latitude && church.longitude && (
                <div className="space-y-2">
                  <span className="font-medium">Coordinates</span>
                  <p className="text-sm text-gray-600">
                    Lat: {church.latitude}, Lng: {church.longitude}
                  </p>
                </div>
              )}

              {church.description && (
                <div className="space-y-2">
                  <span className="font-medium">Description</span>
                  <p className="text-sm text-gray-600">{church.description}</p>
                </div>
              )}

              <Separator />

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">
                  Created {format(new Date(church.createdAt), "PPP")}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {statsLoading ? (
                <div className="py-4 text-center">
                  <p className="text-sm text-gray-500">Loading statistics...</p>
                </div>
              ) : stats ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Members</span>
                    </div>
                    <Badge variant="secondary">{stats.memberCount}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Ministers</span>
                    </div>
                    <Badge variant="secondary">{stats.ministerCount}</Badge>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total People</span>
                    <Badge>{stats.totalPeople}</Badge>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No statistics available</p>
              )}
            </CardContent>
          </Card>

          {/* QR Code Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Join Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <QRCodeDialog
                description="Share this QR code for members to join this church."
                filename={`join-member-${church.name.toLowerCase().replace(/\s+/g, "-")}`}
                title={`Join ${church.name} as Member`}
                trigger={
                  <Button className="w-full" size="sm" variant="outline">
                    <Users className="mr-2 h-4 w-4" />
                    Member Join QR
                  </Button>
                }
                value={`${baseUrl}/join/member?churchId=${church.id}`}
              />

              <QRCodeDialog
                description="Share this QR code for workers to join this church."
                filename={`join-worker-${church.name.toLowerCase().replace(/\s+/g, "-")}`}
                title={`Join ${church.name} as Worker`}
                trigger={
                  <Button className="w-full" size="sm" variant="outline">
                    <UserCheck className="mr-2 h-4 w-4" />
                    Worker Join QR
                  </Button>
                }
                value={`${baseUrl}/join/worker?churchId=${church.id}`}
              />
            </CardContent>
          </Card>
        </div>
      </div>

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
              This action cannot be undone. This will permanently delete{" "}
              <strong>{church.name}</strong> and all associated data.
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
    </div>
  );
}
