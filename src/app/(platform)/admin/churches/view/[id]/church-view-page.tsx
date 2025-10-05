"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { format } from "date-fns";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Download,
  Edit,
  ExternalLink,
  FileSpreadsheet,
  Mail,
  MapPin,
  Navigation,
  QrCode,
  Search,
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
import { Input } from "@/components/ui/input";
import { MemberCard } from "@/components/ui/member-card";
import { MinisterCard } from "@/components/ui/minister-card";
import { QRCodeDialog } from "@/components/ui/qr-code";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChurchForm from "@/modules/church/church-form";
import {
  useChurch,
  useChurchMembers,
  useChurchMinisters,
  useChurchStats,
  useDeleteChurch,
} from "@/modules/church/church-service";
import { ViewMemberDialog } from "@/modules/member/components/view-member-dialog";
import MemberForm from "@/modules/member/member-form";
import { generateMemberPDF } from "@/modules/member/member-pdf";
import { useDeleteMember } from "@/modules/member/member-service";
import type { Member } from "@/modules/member/member-validation";
import { MinisterForm } from "@/modules/ministry/components/minister-form";
import { ViewMinisterDialog } from "@/modules/ministry/components/view-minister-dialog";
import {
  downloadMinisterPDF,
  useDeleteMinister,
} from "@/modules/ministry/ministry-service";
import type { Minister } from "@/modules/ministry/ministry-validation";
import { toast } from "sonner";

interface ChurchViewPageProps {
  churchId: number;
}

export default function ChurchViewPage({ churchId }: ChurchViewPageProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("members");
  const [membersSearch, setMembersSearch] = useState("");
  const [ministersSearch, setMinistersSearch] = useState("");
  const [membersPage, setMembersPage] = useState(1);
  const [ministersPage, setMinistersPage] = useState(1);

  // Member action states
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isEditMemberDialogOpen, setIsEditMemberDialogOpen] = useState(false);
  const [isViewMemberDialogOpen, setIsViewMemberDialogOpen] = useState(false);
  const [isDeleteMemberDialogOpen, setIsDeleteMemberDialogOpen] =
    useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);

  // Minister action states
  const [selectedMinister, setSelectedMinister] = useState<Minister | null>(
    null
  );
  const [isEditMinisterDialogOpen, setIsEditMinisterDialogOpen] =
    useState(false);
  const [isViewMinisterDialogOpen, setIsViewMinisterDialogOpen] =
    useState(false);
  const [isDeleteMinisterDialogOpen, setIsDeleteMinisterDialogOpen] =
    useState(false);
  const [isDownloadingMinisterPDF, setIsDownloadingMinisterPDF] =
    useState(false);
  const [isExportingMembers, setIsExportingMembers] = useState(false);
  const [isExportingMinisters, setIsExportingMinisters] = useState(false);

  const { data: churchResponse, isLoading, error } = useChurch(churchId);
  const { data: statsResponse, isLoading: statsLoading } =
    useChurchStats(churchId);

  // Fetch members and ministers
  const { data: membersResponse, isLoading: membersLoading } = useChurchMembers(
    churchId,
    {
      page: membersPage,
      limit: 12,
      search: membersSearch || undefined,
      sortBy: "firstName",
      sortOrder: "asc",
    }
  );

  const { data: ministersResponse, isLoading: ministersLoading } =
    useChurchMinisters(churchId, {
      page: ministersPage,
      limit: 12,
      search: ministersSearch || undefined,
      sortBy: "firstName",
      sortOrder: "asc",
    });

  const deleteChurchMutation = useDeleteChurch();
  const deleteMemberMutation = useDeleteMember();
  const deleteMinisterMutation = useDeleteMinister();

  // Google Maps setup
  const { isLoaded: isMapLoaded } = useJsApiLoader({
    id: "google-maps-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: ["places", "geometry"],
  });

  const church = churchResponse?.data;
  const stats = statsResponse?.data;
  const members = membersResponse?.data || [];
  const membersPagination = membersResponse?.pagination;
  const ministers = ministersResponse?.data || [];
  const ministersPagination = ministersResponse?.pagination;

  const handleDelete = async () => {
    await deleteChurchMutation.mutateAsync(churchId);
    setIsDeleteDialogOpen(false);
    // Navigate back to churches list
    window.location.href = "/admin/churches";
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
  };

  // Member action handlers
  const handleMemberView = (member: Member) => {
    setSelectedMember(member);
    setIsViewMemberDialogOpen(true);
  };

  const handleMemberEdit = (member: Member) => {
    setSelectedMember(member);
    setIsEditMemberDialogOpen(true);
  };

  const handleMemberDelete = (member: Member) => {
    setSelectedMember(member);
    setIsDeleteMemberDialogOpen(true);
  };

  const handleMemberDeleteConfirm = async () => {
    if (selectedMember && selectedMember.id) {
      await deleteMemberMutation.mutateAsync(selectedMember.id);
      setIsDeleteMemberDialogOpen(false);
      setSelectedMember(null);
    }
  };

  const handleMemberPDFDownload = async (member: Member) => {
    setIsDownloadingPDF(true);
    try {
      await generateMemberPDF({
        profilePicture: member.profilePicture,
        firstName: member.firstName,
        lastName: member.lastName,
        middleName: member.middleName,
        gender: member.gender,
        birthdate: member.birthdate,
        yearJoined: member.yearJoined,
        ministryInvolvement: member.ministryInvolvement,
        occupation: member.occupation,
        educationalAttainment: member.educationalAttainment,
        school: member.school,
        degree: member.degree,
        mobileNumber: member.mobileNumber,
        email: member.email,
        homeAddress: member.homeAddress,
        facebookLink: member.facebookLink,
        xLink: member.xLink,
        instagramLink: member.instagramLink,
        notes: member.notes,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
      });
    } catch {
      toast.error("Failed to download PDF");
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  // Minister action handlers
  const handleMinisterView = (minister: Minister) => {
    setSelectedMinister(minister);
    setIsViewMinisterDialogOpen(true);
  };

  const handleMinisterEdit = (minister: Minister) => {
    setSelectedMinister(minister);
    setIsEditMinisterDialogOpen(true);
  };

  const handleMinisterDelete = (minister: Minister) => {
    setSelectedMinister(minister);
    setIsDeleteMinisterDialogOpen(true);
  };

  const handleMinisterDeleteConfirm = async () => {
    if (selectedMinister && selectedMinister.id) {
      await deleteMinisterMutation.mutateAsync(selectedMinister.id);
      setIsDeleteMinisterDialogOpen(false);
      setSelectedMinister(null);
    }
  };

  const handleMinisterPDFDownload = async (minister: Minister) => {
    setIsDownloadingMinisterPDF(true);
    try {
      if (minister.id) {
        await downloadMinisterPDF(minister.id);
      }
    } finally {
      setIsDownloadingMinisterPDF(false);
    }
  };

  // Export handler functions
  const handleExportMembers = async () => {
    try {
      setIsExportingMembers(true);
      const response = await fetch(`/api/churches/${churchId}/members/export`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to export members");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const churchName =
        church?.name.toLowerCase().replace(/[^a-z0-9]/g, "-") || "church";
      link.download = `${churchName}-members-${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Export members failed");
    } finally {
      setIsExportingMembers(false);
    }
  };

  const handleExportMinisters = async () => {
    try {
      setIsExportingMinisters(true);
      const response = await fetch(
        `/api/churches/${churchId}/ministers/export`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to export ministers");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const churchName =
        church?.name.toLowerCase().replace(/[^a-z0-9]/g, "-") || "church";
      link.download = `${churchName}-ministers-${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Export ministers failed");
    } finally {
      setIsExportingMinisters(false);
    }
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
    <div className="container mx-auto space-y-6 px-5 py-8">
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
              <div className="from-primary/5 to-primary/10 relative h-64 w-full overflow-hidden rounded-t-lg bg-gradient-to-br">
                {church.imageUrl ? (
                  <Image
                    fill
                    alt={`${church.name} church`}
                    className="object-cover"
                    src={church.imageUrl}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Building2 className="text-muted-foreground h-16 w-16" />
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
                    <MapPin className="text-muted-foreground h-4 w-4" />
                    <span className="font-medium">Address</span>
                  </div>
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
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="text-muted-foreground h-4 w-4" />
                    <span className="font-medium">Email</span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {church.email}
                  </p>
                </div>
              </div>

              {church.latitude && church.longitude && (
                <div className="space-y-2">
                  <span className="font-medium">Coordinates</span>
                  <p className="text-muted-foreground text-sm">
                    Lat: {church.latitude}, Lng: {church.longitude}
                  </p>
                </div>
              )}

              {church.description && (
                <div className="space-y-2">
                  <span className="font-medium">Description</span>
                  <p className="text-muted-foreground text-sm">
                    {church.description}
                  </p>
                </div>
              )}

              <Separator />

              <div className="flex items-center gap-2">
                <Calendar className="text-muted-foreground h-4 w-4" />
                <span className="text-muted-foreground text-sm">
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
                  <p className="text-muted-foreground text-sm">
                    Loading statistics...
                  </p>
                </div>
              ) : stats ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="text-primary h-4 w-4" />
                      <span className="text-sm">Members</span>
                    </div>
                    <Badge variant="secondary">{stats.memberCount}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
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
                <p className="text-muted-foreground text-sm">
                  No statistics available
                </p>
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

          {/* Location Map */}
          {church.latitude && church.longitude && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="h-5 w-5" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-48 w-full overflow-hidden rounded-lg border">
                  {isMapLoaded ? (
                    <GoogleMap
                      center={{
                        lat: parseFloat(church.latitude),
                        lng: parseFloat(church.longitude),
                      }}
                      mapContainerStyle={{
                        width: "100%",
                        height: "100%",
                      }}
                      options={{
                        disableDefaultUI: true,
                        zoomControl: true,
                        gestureHandling: "cooperative",
                        clickableIcons: false,
                      }}
                      zoom={15}
                    >
                      <Marker
                        position={{
                          lat: parseFloat(church.latitude),
                          lng: parseFloat(church.longitude),
                        }}
                        title={church.name}
                      />
                    </GoogleMap>
                  ) : (
                    <div className="bg-muted text-muted-foreground flex h-full w-full items-center justify-center text-sm">
                      Loading map...
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium">{church.name}</p>
                      {church.address && (
                        <p className="text-muted-foreground text-xs">
                          {church.address}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-muted-foreground font-mono text-xs">
                    {parseFloat(church.latitude).toFixed(6)},{" "}
                    {parseFloat(church.longitude).toFixed(6)}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    asChild
                    className="flex-1"
                    size="sm"
                    variant="outline"
                  >
                    <a
                      href={`https://www.google.com/maps?q=${church.latitude},${church.longitude}`}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open in Maps
                    </a>
                  </Button>
                  <Button
                    asChild
                    className="flex-1"
                    size="sm"
                    variant="outline"
                  >
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${church.latitude},${church.longitude}`}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <Navigation className="mr-2 h-4 w-4" />
                      Get Directions
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Members and Ministers Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="members">
            Members ({stats?.memberCount || 0})
          </TabsTrigger>
          <TabsTrigger value="ministers">
            Ministers ({stats?.ministerCount || 0})
          </TabsTrigger>
        </TabsList>
        <TabsContent className="mt-6 space-y-4" value="members">
          {/* Members Search */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <Input
                    className="pl-9"
                    placeholder="Search members..."
                    value={membersSearch}
                    onChange={(e) => {
                      setMembersSearch(e.target.value);
                      setMembersPage(1);
                    }}
                  />
                </div>
                <Button
                  className="gap-2"
                  disabled={isExportingMembers || members.length === 0}
                  variant="outline"
                  onClick={handleExportMembers}
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  {isExportingMembers ? (
                    <>
                      <Download className="h-4 w-4 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    "Export Excel"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* PDF Download Loading Notification */}
          {isDownloadingPDF && (
            <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="border-primary h-4 w-4 animate-spin rounded-full border-b-2" />
                  <span className="text-sm text-blue-700 dark:text-blue-300">
                    Generating PDF, please wait...
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Members Grid */}
          {membersLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card className="overflow-hidden" key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-muted h-12 w-12 animate-pulse rounded-full" />
                      <div className="space-y-2">
                        <div className="bg-muted h-4 w-32 animate-pulse rounded" />
                        <div className="bg-muted h-3 w-20 animate-pulse rounded" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : members.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
                <h3 className="mb-2 text-lg font-semibold">
                  {membersSearch ? "No members found" : "No members yet"}
                </h3>
                <p className="text-muted-foreground">
                  {membersSearch
                    ? `No members match "${membersSearch}"`
                    : "This church doesn't have any members yet."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((member) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  onDelete={() => handleMemberDelete(member)}
                  onDownloadPdf={() => handleMemberPDFDownload(member)}
                  onEdit={() => handleMemberEdit(member)}
                  onView={() => handleMemberView(member)}
                />
              ))}
            </div>
          )}

          {/* Members Pagination */}
          {membersPagination && membersPagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                disabled={!membersPagination.hasPrev}
                size="sm"
                variant="outline"
                onClick={() => setMembersPage(membersPage - 1)}
              >
                Previous
              </Button>
              <span className="text-muted-foreground text-sm">
                Page {membersPagination.page} of {membersPagination.totalPages}
              </span>
              <Button
                disabled={!membersPagination.hasNext}
                size="sm"
                variant="outline"
                onClick={() => setMembersPage(membersPage + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent className="mt-6 space-y-4" value="ministers">
          {/* Ministers Search */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <Input
                    className="pl-9"
                    placeholder="Search ministers..."
                    value={ministersSearch}
                    onChange={(e) => {
                      setMinistersSearch(e.target.value);
                      setMinistersPage(1);
                    }}
                  />
                </div>
                <Button
                  className="gap-2"
                  disabled={isExportingMinisters || ministers.length === 0}
                  variant="outline"
                  onClick={handleExportMinisters}
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  {isExportingMinisters ? (
                    <>
                      <Download className="h-4 w-4 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    "Export Excel"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Minister PDF Download Loading Notification */}
          {isDownloadingMinisterPDF && (
            <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="border-primary h-4 w-4 animate-spin rounded-full border-b-2" />
                  <span className="text-sm text-blue-700 dark:text-blue-300">
                    Generating Minister PDF, please wait...
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ministers Grid */}
          {ministersLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card className="overflow-hidden" key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-muted h-12 w-12 animate-pulse rounded-full" />
                      <div className="space-y-2">
                        <div className="bg-muted h-4 w-32 animate-pulse rounded" />
                        <div className="bg-muted h-3 w-20 animate-pulse rounded" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : ministers.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <UserCheck className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
                <h3 className="mb-2 text-lg font-semibold">
                  {ministersSearch ? "No ministers found" : "No ministers yet"}
                </h3>
                <p className="text-muted-foreground">
                  {ministersSearch
                    ? `No ministers match "${ministersSearch}"`
                    : "This church doesn't have any ministers yet."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ministers.map((minister) => (
                <MinisterCard
                  key={minister.id}
                  minister={minister}
                  onDelete={() => handleMinisterDelete(minister)}
                  onDownloadPdf={() => handleMinisterPDFDownload(minister)}
                  onEdit={() => handleMinisterEdit(minister)}
                  onView={() => handleMinisterView(minister)}
                />
              ))}
            </div>
          )}

          {/* Ministers Pagination */}
          {ministersPagination && ministersPagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                disabled={!ministersPagination.hasPrev}
                size="sm"
                variant="outline"
                onClick={() => setMinistersPage(ministersPage - 1)}
              >
                Previous
              </Button>
              <span className="text-muted-foreground text-sm">
                Page {ministersPagination.page} of{" "}
                {ministersPagination.totalPages}
              </span>
              <Button
                disabled={!ministersPagination.hasNext}
                size="sm"
                variant="outline"
                onClick={() => setMinistersPage(ministersPage + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

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

      {/* Member Action Dialogs */}
      {selectedMember && (
        <>
          {/* Edit Member Dialog */}
          <Dialog
            open={isEditMemberDialogOpen}
            onOpenChange={setIsEditMemberDialogOpen}
          >
            <DialogContent className="max-h-[90vh] w-full min-w-4xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Member</DialogTitle>
              </DialogHeader>
              <MemberForm
                isDialog={true}
                memberId={selectedMember.id}
                onClose={() => {
                  setIsEditMemberDialogOpen(false);
                  setSelectedMember(null);
                }}
              />
            </DialogContent>
          </Dialog>

          {/* View Member Dialog */}
          {selectedMember && selectedMember?.id && (
            <ViewMemberDialog
              isOpen={isViewMemberDialogOpen}
              memberId={selectedMember.id}
              onClose={() => {
                setIsViewMemberDialogOpen(false);
                setSelectedMember(null);
              }}
            />
          )}

          {/* Delete Member Confirmation Dialog */}
          <Dialog
            open={isDeleteMemberDialogOpen}
            onOpenChange={setIsDeleteMemberDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete the
                  member &quot;{selectedMember.firstName}{" "}
                  {selectedMember.lastName}&quot; and all associated data.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDeleteMemberDialogOpen(false);
                    setSelectedMember(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  disabled={deleteMemberMutation.isPending}
                  variant="destructive"
                  onClick={handleMemberDeleteConfirm}
                >
                  {deleteMemberMutation.isPending ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}

      {/* Minister Action Dialogs */}
      {selectedMinister && (
        <>
          {/* Edit Minister Dialog */}
          <Dialog
            open={isEditMinisterDialogOpen}
            onOpenChange={setIsEditMinisterDialogOpen}
          >
            <DialogContent className="max-h-[90vh] w-full min-w-4xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Minister</DialogTitle>
              </DialogHeader>
              <MinisterForm
                initialData={selectedMinister}
                isDialog={true}
                mode="edit"
                onClose={() => {
                  setIsEditMinisterDialogOpen(false);
                  setSelectedMinister(null);
                }}
              />
            </DialogContent>
          </Dialog>

          {/* View Minister Dialog */}
          {selectedMinister && selectedMinister?.id && (
            <ViewMinisterDialog
              isOpen={isViewMinisterDialogOpen}
              ministerId={selectedMinister.id}
              onClose={() => {
                setIsViewMinisterDialogOpen(false);
                setSelectedMinister(null);
              }}
            />
          )}

          {/* Delete Minister Confirmation Dialog */}
          <Dialog
            open={isDeleteMinisterDialogOpen}
            onOpenChange={setIsDeleteMinisterDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete the
                  minister &quot;{selectedMinister.firstName}{" "}
                  {selectedMinister.lastName}&quot; and all associated data
                  including ministry records, skills, and personal information.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDeleteMinisterDialogOpen(false);
                    setSelectedMinister(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  disabled={deleteMinisterMutation.isPending}
                  variant="destructive"
                  onClick={handleMinisterDeleteConfirm}
                >
                  {deleteMinisterMutation.isPending ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
