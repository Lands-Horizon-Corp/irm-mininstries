"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { format, formatDistanceToNow } from "date-fns";
import jsQR from "jsqr";
import {
  Calendar,
  Download,
  Edit,
  Eye,
  EyeOff,
  QrCode,
  Search,
  Upload,
  User,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { useSearch } from "@/components/providers/search-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImageViewer } from "@/components/ui/image-viewer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PersonQRCode } from "@/components/ui/person-qr-code";
import { Separator } from "@/components/ui/separator";
import { ViewMemberDialog } from "@/modules/member/components/view-member-dialog";
import MemberForm from "@/modules/member/member-form";
import { generateMemberPDF } from "@/modules/member/member-pdf";
import type { Member } from "@/modules/member/member-schema";
import { useMember } from "@/modules/member/member-service";
import { EditMinisterDialog } from "@/modules/ministry/components/edit-minister-dialog";
import { ViewMinisterDialog } from "@/modules/ministry/components/view-minister-dialog";
import type { ministers } from "@/modules/ministry/ministry-schema";
import {
  downloadMinisterPDF,
  useMinister,
} from "@/modules/ministry/ministry-service";

type Minister = typeof ministers.$inferSelect;
type ScannedData = { id: number; type: "member" | "minister" };

interface DashboardQRScannerProps {
  onMemberAction?: (action: string, member: Member) => void;
  onMinisterAction?: (action: string, minister: Minister) => void;
}

export function DashboardQRScanner({
  onMemberAction: _onMemberAction,
  onMinisterAction: _onMinisterAction,
}: DashboardQRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<ScannedData | null>(null);
  const [error, setError] = useState<string>("");
  const [cameraStatus, setCameraStatus] = useState<string>("idle");
  const [isMounted, setIsMounted] = useState(false);
  const [searchMode, setSearchMode] = useState<"qr" | "search">("qr");

  // Search provider
  const {
    memberSearchQuery,
    ministerSearchQuery,
    memberResults,
    ministerResults,
    isSearchingMembers,
    isSearchingMinisters,
    setMemberSearchQuery,
    setMinisterSearchQuery,
    searchMembers,
    searchMinisters,
    clearMemberSearch,
    clearMinisterSearch,
    clearAllSearches,
  } = useSearch();

  // Dialog states
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);

  // Use hooks to fetch profile data based on scanned ID
  const { data: memberData, isLoading: memberLoading } = useMember(
    scannedData?.type === "member" ? scannedData.id : 0
  );
  const { data: ministerData, isLoading: ministerLoading } = useMinister(
    scannedData?.type === "minister" ? scannedData.id : 0
  );

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanningIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const cameraTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // QR code scanning function
  const scanQRCode = useCallback(() => {
    const isCurrentlyScanning = scanningIntervalRef.current !== null;

    if (!videoRef.current || !canvasRef.current || !isCurrentlyScanning) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx || video.videoWidth === 0 || video.videoHeight === 0) {
      return;
    }

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data from canvas
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Use jsQR to detect QR code
    const qrCode = jsQR(imageData.data, imageData.width, imageData.height);

    if (qrCode) {
      try {
        const parsed: ScannedData = JSON.parse(qrCode.data);

        if (
          parsed.id &&
          (parsed.type === "member" || parsed.type === "minister")
        ) {
          setScannedData(parsed);
        }
      } catch {
        // Invalid QR code format - ignore
      }
    }
  }, []);

  // Camera functions
  const startCamera = async () => {
    setCameraStatus("requesting");
    setError("");

    // Clear any existing timeout
    if (cameraTimeoutRef.current) {
      clearTimeout(cameraTimeoutRef.current);
    }

    // Check if video element is available
    if (!videoRef.current) {
      setCameraStatus("error");
      setError("Video element not ready. Please try again.");
      return;
    }

    // Set a timeout to prevent infinite loading
    cameraTimeoutRef.current = setTimeout(() => {
      if (cameraStatus !== "playing") {
        setCameraStatus("error");
        setError(
          "Camera startup timed out. Please try again or check permissions."
        );
        stopCamera();
      }
    }, 10000); // 10 second timeout

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API not supported in this browser");
      }

      const stream = await navigator.mediaDevices
        .getUserMedia({
          video: {
            facingMode: "environment", // Try back camera first
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
        })
        .catch(async () => {
          // If back camera fails, try front camera
          return await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: "user", // Front camera fallback
              width: { ideal: 640 },
              height: { ideal: 480 },
            },
          });
        });

      setCameraStatus("stream-obtained");
      streamRef.current = stream;

      const video = videoRef.current;
      if (!video) {
        throw new Error("Video element became unavailable");
      }

      video.srcObject = stream;

      // Wait for video to be ready and start playing
      const startVideoPlayback = async () => {
        try {
          await video.play();
          setCameraStatus("playing");
          setError("");

          // Clear the timeout since we succeeded
          if (cameraTimeoutRef.current) {
            clearTimeout(cameraTimeoutRef.current);
            cameraTimeoutRef.current = null;
          }

          // Start QR code scanning
          scanningIntervalRef.current = setInterval(scanQRCode, 200);
        } catch {
          toast.error(
            "Failed to start video playback. Please allow autoplay and try again."
          );
          setCameraStatus("play-error");
          setError(
            "Failed to start video playback. Please allow autoplay and try again."
          );
        }
      };

      // Handle when video metadata is loaded
      video.onloadedmetadata = startVideoPlayback;

      // Fallback: try to start after a short delay
      setTimeout(() => {
        if (cameraStatus !== "playing" && video.readyState >= 2) {
          startVideoPlayback();
        }
      }, 1000);
    } catch (error) {
      let errorMessage = "Camera access denied. Please check permissions.";

      if (error instanceof DOMException) {
        switch (error.name) {
          case "NotAllowedError":
            errorMessage =
              "Camera access denied. Please allow camera permissions and refresh the page.";
            break;
          case "NotFoundError":
            errorMessage = "No camera found. Please connect a camera device.";
            break;
          case "NotReadableError":
            errorMessage =
              "Camera is already in use by another application. Please close other camera apps.";
            break;
          case "OverconstrainedError":
            errorMessage =
              "Camera constraints not supported. Trying with basic settings.";
            break;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      setError(errorMessage);
      setCameraStatus("error");

      // Clear timeout on error
      if (cameraTimeoutRef.current) {
        clearTimeout(cameraTimeoutRef.current);
        cameraTimeoutRef.current = null;
      }
    }
  };

  const stopCamera = useCallback(() => {
    // Clear scanning interval
    if (scanningIntervalRef.current) {
      clearInterval(scanningIntervalRef.current);
      scanningIntervalRef.current = null;
    }

    // Clear camera timeout
    if (cameraTimeoutRef.current) {
      clearTimeout(cameraTimeoutRef.current);
      cameraTimeoutRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraStatus("idle");
    setError("");
  }, []);

  const toggleScanning = () => {
    if (!isMounted) {
      setError("Component not ready. Please wait a moment and try again.");
      return;
    }

    if (isScanning) {
      stopCamera();
      setIsScanning(false);
    } else {
      setIsScanning(true);
      startCamera();
    }
  };

  // Ensure component is mounted before allowing camera access
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // File upload handler
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (imageData) {
          const qrCode = jsQR(
            imageData.data,
            imageData.width,
            imageData.height
          );
          if (qrCode) {
            try {
              const parsed: ScannedData = JSON.parse(qrCode.data);
              if (
                parsed.id &&
                (parsed.type === "member" || parsed.type === "minister")
              ) {
                setScannedData(parsed);
              } else {
                toast.error("Invalid QR code format");
              }
            } catch {
              toast.error("Could not parse QR code data");
            }
          } else {
            toast.error("No QR code found in the uploaded image");
          }
        }
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
    event.target.value = ""; // Reset input
  };

  // Action handlers
  const handleView = () => {
    setIsViewDialogOpen(true);
  };

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  const handlePDFDownload = async () => {
    if (!scannedData || !profileData) return;

    setIsDownloadingPDF(true);
    try {
      if (scannedData.type === "member") {
        const member = profileData as Member;
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
          tiktokLink: null,
          instagramLink: null,
          notes: null,
          createdAt: member.createdAt,
          updatedAt: member.updatedAt,
        });
        toast.success("Member PDF downloaded successfully!");
      } else if (scannedData.type === "minister") {
        await downloadMinisterPDF(scannedData.id);
        toast.success("Minister PDF downloaded successfully!");
      }
    } catch {
      toast.error("Failed to download PDF. Please try again.");
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  const handleReset = () => {
    setScannedData(null);
    setError("");
    clearAllSearches();
    toast.info("Data cleared. Ready to scan or search again.");
  };

  // Handle search result selection
  const handleSearchResultSelect = (result: {
    id: number;
    type: "member" | "minister";
  }) => {
    setScannedData({ id: result.id, type: result.type });
    clearAllSearches();
    setSearchMode("qr"); // Switch back to QR mode
  };

  // Handle search input with debouncing
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (memberSearchQuery.length >= 2) {
        searchMembers(memberSearchQuery);
      } else {
        clearMemberSearch();
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [memberSearchQuery, searchMembers, clearMemberSearch]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (ministerSearchQuery.length >= 2) {
        searchMinisters(ministerSearchQuery);
      } else {
        clearMinisterSearch();
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [ministerSearchQuery, searchMinisters, clearMinisterSearch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const profileData =
    scannedData?.type === "member" ? memberData?.data : ministerData?.data;

  const isLoadingProfile =
    (scannedData?.type === "member" && memberLoading) ||
    (scannedData?.type === "minister" && ministerLoading);

  const profileName = profileData
    ? `${profileData.firstName} ${profileData.lastName}`
    : scannedData
      ? `${scannedData.type === "member" ? "Member" : "Minister"} #${scannedData.id}`
      : "Unknown";

  useEffect(() => {
    if (scannedData && profileData && !isLoadingProfile) {
      const personType = scannedData.type === "member" ? "Member" : "Minister";
      const personName = `${profileData.firstName} ${profileData.lastName}`;
      toast.success(`${personType} profile loaded: ${personName}`, {
        description: `Successfully scanned QR code for ${personType} #${scannedData.id}`,
      });
    }
  }, [isLoadingProfile, profileData, scannedData]);

  // Get profile data

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            QR Code Scanner & Search
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={searchMode === "qr" ? "default" : "outline"}
              onClick={() => {
                setSearchMode("qr");
                clearAllSearches();
              }}
            >
              <QrCode className="mr-2 h-4 w-4" />
              QR Scan
            </Button>
            <Button
              size="sm"
              variant={searchMode === "search" ? "default" : "outline"}
              onClick={() => {
                setSearchMode("search");
                setScannedData(null);
                stopCamera();
                setIsScanning(false);
              }}
            >
              <Search className="mr-2 h-4 w-4" />
              Search By Name
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Scanner/Search Section */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {searchMode === "qr" ? (
                <>
                  {/* Scanner Controls */}
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">
                      Camera Scanner
                    </Label>
                    <Button
                      className="flex items-center gap-2"
                      size="sm"
                      variant="outline"
                      onClick={toggleScanning}
                    >
                      {isScanning ? (
                        <>
                          <EyeOff className="h-4 w-4" />
                          Stop
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4" />
                          Start
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Camera Feed */}
                  <div className="bg-muted relative aspect-square overflow-hidden rounded-lg border">
                    {/* Video element - always present in DOM */}
                    <video
                      autoPlay
                      muted
                      playsInline
                      className={`h-full w-full object-cover ${
                        isScanning && cameraStatus === "playing"
                          ? "block"
                          : "hidden"
                      }`}
                      ref={videoRef}
                    />
                    <canvas className="hidden" ref={canvasRef} />

                    {/* Scanning UI - only show when actively scanning */}
                    {isScanning && cameraStatus === "playing" && (
                      <>
                        {/* Scanning Overlay */}
                        <div className="border-primary/50 absolute inset-4 rounded border-2">
                          <div className="border-primary absolute -top-1 -left-1 h-6 w-6 border-t-2 border-l-2" />
                          <div className="border-primary absolute -top-1 -right-1 h-6 w-6 border-t-2 border-r-2" />
                          <div className="border-primary absolute -bottom-1 -left-1 h-6 w-6 border-b-2 border-l-2" />
                          <div className="border-primary absolute -right-1 -bottom-1 h-6 w-6 border-r-2 border-b-2" />
                        </div>

                        {/* Status Indicator */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                          <div className="bg-primary/90 text-primary-foreground rounded-full px-3 py-1 text-xs">
                            Scanning...
                          </div>
                        </div>
                      </>
                    )}

                    {/* Placeholder UI - show when not actively scanning */}
                    {(!isScanning || cameraStatus !== "playing") && (
                      <div className="absolute inset-0 flex h-full items-center justify-center">
                        <div className="text-center">
                          <QrCode className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
                          <p className="text-muted-foreground text-sm">
                            {isScanning && cameraStatus !== "playing"
                              ? cameraStatus === "requesting"
                                ? "Requesting camera access..."
                                : cameraStatus === "stream-obtained"
                                  ? "Initializing camera..."
                                  : "Starting camera..."
                              : "Click Start to begin scanning"}
                          </p>
                          {error && (
                            <div className="mt-3 space-y-2">
                              <p className="text-destructive text-xs">
                                {error}
                              </p>
                              {(cameraStatus === "error" ||
                                cameraStatus === "play-error") && (
                                <Button
                                  className="h-8 text-xs"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setError("");
                                    setCameraStatus("idle");
                                    setIsScanning(false);
                                    // Small delay to ensure state is reset
                                    setTimeout(() => toggleScanning(), 100);
                                  }}
                                >
                                  Try Again
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Upload QR Code */}
                  <Separator />
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Upload QR Image
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileUpload}
                      />
                      <Button
                        className="flex items-center gap-2"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4" />
                        Upload QR
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Search Interface */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">
                      Search by Name
                    </Label>

                    {/* Member Search */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="text-muted-foreground h-4 w-4" />
                        <Label className="text-muted-foreground text-xs font-medium">
                          Members
                        </Label>
                      </div>
                      <Input
                        placeholder="Search members by name..."
                        value={memberSearchQuery}
                        onChange={(e) => setMemberSearchQuery(e.target.value)}
                      />

                      {/* Member Results */}
                      {memberResults.length > 0 && (
                        <div className="max-h-60 space-y-2 overflow-y-auto rounded-md border p-2">
                          {memberResults.map((result) => (
                            <div
                              className="group relative flex cursor-pointer items-center gap-3 rounded-lg border border-blue-200/50 bg-gradient-to-r from-blue-50 to-slate-50 p-3 transition-all duration-200 hover:border-blue-300 hover:from-blue-100 hover:to-slate-100 hover:shadow-md dark:border-blue-800/30 dark:from-blue-950/30 dark:to-slate-950/30 dark:hover:border-blue-700/50 dark:hover:from-blue-900/40 dark:hover:to-slate-900/40"
                              key={`member-${result.id}`}
                              onClick={() =>
                                handleSearchResultSelect({
                                  id: result.id,
                                  type: "member",
                                })
                              }
                            >
                              {/* Member Badge */}
                              <div className="absolute -top-1 -right-1 rounded-full bg-blue-500 px-2 py-0.5 text-[10px] font-medium text-white shadow-sm">
                                Member
                              </div>

                              <Avatar className="h-12 w-12 ring-2 ring-blue-200/50 transition-all group-hover:ring-blue-300 dark:ring-blue-800/50 dark:group-hover:ring-blue-700/50">
                                <AvatarImage
                                  className="object-cover"
                                  src={result.profilePicture || undefined}
                                />
                                <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                                  {result.firstName[0]}
                                  {result.lastName[0]}
                                </AvatarFallback>
                              </Avatar>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <User className="h-3.5 w-3.5 text-blue-500" />
                                  <p className="truncate text-sm font-semibold text-blue-900 dark:text-blue-100">
                                    {result.firstName}{" "}
                                    {result.middleName &&
                                      result.middleName + " "}
                                    {result.lastName}
                                  </p>
                                </div>
                                <div className="mt-1 flex items-center gap-2 text-xs text-blue-600/80 dark:text-blue-400/80">
                                  <span>
                                    Born:{" "}
                                    {new Date(
                                      result.dateOfBirth
                                    ).toLocaleDateString()}
                                  </span>
                                  {result.churchName && (
                                    <>
                                      <span>•</span>
                                      <span className="truncate">
                                        {result.churchName}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* Hover indicator */}
                              <div className="opacity-0 transition-opacity group-hover:opacity-100">
                                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {isSearchingMembers && (
                        <div className="flex items-center justify-center py-4">
                          <div className="text-muted-foreground flex items-center gap-2 text-sm">
                            <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-r-transparent" />
                            Searching members...
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Minister Search */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Users className="text-muted-foreground h-4 w-4" />
                        <Label className="text-muted-foreground text-xs font-medium">
                          Ministers
                        </Label>
                      </div>
                      <Input
                        placeholder="Search ministers by name..."
                        value={ministerSearchQuery}
                        onChange={(e) => setMinisterSearchQuery(e.target.value)}
                      />

                      {/* Minister Results */}
                      {ministerResults.length > 0 && (
                        <div className="max-h-60 space-y-2 overflow-y-auto rounded-md border p-2">
                          {ministerResults.map((result) => (
                            <div
                              className="group relative flex cursor-pointer items-center gap-3 rounded-lg border border-purple-200/50 bg-gradient-to-r from-purple-50 to-indigo-50 p-3 transition-all duration-200 hover:border-purple-300 hover:from-purple-100 hover:to-indigo-100 hover:shadow-md dark:border-purple-800/30 dark:from-purple-950/30 dark:to-indigo-950/30 dark:hover:border-purple-700/50 dark:hover:from-purple-900/40 dark:hover:to-indigo-900/40"
                              key={`minister-${result.id}`}
                              onClick={() =>
                                handleSearchResultSelect({
                                  id: result.id,
                                  type: "minister",
                                })
                              }
                            >
                              {/* Minister Badge */}
                              <div className="absolute -top-1 -right-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-2 py-0.5 text-[10px] font-medium text-white shadow-sm">
                                Minister
                              </div>

                              <Avatar className="h-12 w-12 ring-2 ring-purple-200/50 transition-all group-hover:ring-purple-300 dark:ring-purple-800/50 dark:group-hover:ring-purple-700/50">
                                <AvatarImage
                                  className="object-cover"
                                  src={result.imageUrl || undefined}
                                />
                                <AvatarFallback className="bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-700 dark:from-purple-900/50 dark:to-indigo-900/50 dark:text-purple-300">
                                  {result.firstName[0]}
                                  {result.lastName[0]}
                                </AvatarFallback>
                              </Avatar>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <Users className="h-3.5 w-3.5 text-purple-600" />
                                  <p className="truncate text-sm font-semibold text-purple-900 dark:text-purple-100">
                                    {result.firstName}{" "}
                                    {result.middleName &&
                                      result.middleName + " "}
                                    {result.lastName}
                                  </p>
                                </div>
                                <div className="mt-1 flex items-center gap-2 text-xs text-purple-600/80 dark:text-purple-400/80">
                                  <span>
                                    Born:{" "}
                                    {new Date(
                                      result.dateOfBirth
                                    ).toLocaleDateString()}
                                  </span>
                                  {result.churchName && (
                                    <>
                                      <span>•</span>
                                      <span className="truncate">
                                        {result.churchName}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* Hover indicator with gradient */}
                              <div className="opacity-0 transition-opacity group-hover:opacity-100">
                                <div className="h-2 w-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {isSearchingMinisters && (
                        <div className="flex items-center justify-center py-4">
                          <div className="text-muted-foreground flex items-center gap-2 text-sm">
                            <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-r-transparent" />
                            Searching ministers...
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Profile Section */}
          <div className="lg:col-span-2">
            {scannedData ? (
              <div className="space-y-6">
                {/* Profile Header with Different Styling */}
                <div
                  className={`rounded-xl border p-6 ${
                    scannedData.type === "member"
                      ? "border-blue-200/50 bg-gradient-to-br from-blue-50/50 via-slate-50/30 to-blue-50/20 dark:border-blue-800/30 dark:from-blue-950/20 dark:via-slate-950/10 dark:to-blue-950/10"
                      : "border-purple-200/50 bg-gradient-to-br from-purple-50/50 via-indigo-50/30 to-purple-50/20 dark:border-purple-800/30 dark:from-purple-950/20 dark:via-indigo-950/10 dark:to-purple-950/10"
                  }`}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3
                        className={`text-lg font-semibold ${
                          scannedData.type === "member"
                            ? "text-blue-900 dark:text-blue-100"
                            : "text-purple-900 dark:text-purple-100"
                        }`}
                      >
                        Profile
                      </h3>
                      {/* Role Badge */}
                      <div
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          scannedData.type === "member"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                            : "bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 dark:from-purple-900/50 dark:to-indigo-900/50 dark:text-purple-300"
                        }`}
                      >
                        {scannedData.type === "member"
                          ? "Church Member"
                          : "Minister"}
                      </div>
                    </div>
                    <Button
                      className="flex items-center gap-2"
                      size="sm"
                      variant="outline"
                      onClick={handleReset}
                    >
                      <X className="h-4 w-4" />
                      Clear
                    </Button>
                  </div>

                  {isLoadingProfile ? (
                    <div className="flex items-center gap-4">
                      <div
                        className={`h-20 w-20 animate-pulse rounded-full ring-4 ${
                          scannedData.type === "member"
                            ? "bg-blue-100 ring-blue-200/50 dark:bg-blue-900/30 dark:ring-blue-800/30"
                            : "bg-gradient-to-br from-purple-100 to-indigo-100 ring-purple-200/50 dark:from-purple-900/30 dark:to-indigo-900/30 dark:ring-purple-800/30"
                        }`}
                      />
                      <div className="space-y-3">
                        <div
                          className={`h-6 w-40 animate-pulse rounded ${
                            scannedData.type === "member"
                              ? "bg-blue-200 dark:bg-blue-800/50"
                              : "bg-purple-200 dark:bg-purple-800/50"
                          }`}
                        />
                        <div
                          className={`h-4 w-28 animate-pulse rounded ${
                            scannedData.type === "member"
                              ? "bg-blue-100 dark:bg-blue-900/30"
                              : "bg-purple-100 dark:bg-purple-900/30"
                          }`}
                        />
                        <div className="text-muted-foreground flex items-center gap-2 text-sm">
                          <div
                            className={`h-4 w-4 animate-spin rounded-full border-2 border-r-transparent ${
                              scannedData.type === "member"
                                ? "border-blue-500"
                                : "border-purple-500"
                            }`}
                          />
                          Loading profile data...
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar
                          className={`h-20 w-20 cursor-pointer ring-4 transition-all hover:opacity-80 hover:ring-8 ${
                            scannedData.type === "member"
                              ? "ring-blue-200/50 hover:ring-blue-300/50 dark:ring-blue-800/30 dark:hover:ring-blue-700/50"
                              : "ring-purple-200/50 hover:ring-purple-300/50 dark:ring-purple-800/30 dark:hover:ring-purple-700/50"
                          }`}
                          onClick={() => {
                            const imageUrl =
                              profileData && scannedData.type === "member"
                                ? (profileData as Member)?.profilePicture
                                : profileData && scannedData.type === "minister"
                                  ? (profileData as Minister)?.imageUrl
                                  : null;
                            if (imageUrl) {
                              setIsImageViewerOpen(true);
                            }
                          }}
                        >
                          <AvatarImage
                            className="object-cover"
                            src={
                              profileData && scannedData.type === "member"
                                ? (profileData as Member)?.profilePicture ||
                                  undefined
                                : profileData && scannedData.type === "minister"
                                  ? (profileData as Minister)?.imageUrl ||
                                    undefined
                                  : undefined
                            }
                          />
                          <AvatarFallback
                            className={`text-lg font-semibold ${
                              scannedData.type === "member"
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                                : "bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-700 dark:from-purple-900/50 dark:to-indigo-900/50 dark:text-purple-300"
                            }`}
                          >
                            {profileName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        {/* Status Indicator */}
                        <div
                          className={`absolute -right-1 -bottom-1 h-6 w-6 rounded-full border-4 border-white shadow-sm dark:border-gray-800 ${
                            scannedData.type === "member"
                              ? "bg-blue-500"
                              : "bg-gradient-to-r from-purple-500 to-indigo-500"
                          }`}
                        >
                          {scannedData.type === "member" ? (
                            <User className="h-3 w-3 p-0.5 text-white" />
                          ) : (
                            <Users className="h-3 w-3 p-0.5 text-white" />
                          )}
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          {scannedData.type === "member" ? (
                            <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          ) : (
                            <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          )}
                          <h4
                            className={`text-2xl font-bold ${
                              scannedData.type === "member"
                                ? "text-blue-900 dark:text-blue-100"
                                : "text-purple-900 dark:text-purple-100"
                            }`}
                          >
                            {profileName}
                          </h4>
                        </div>

                        <div className="flex items-center gap-2">
                          <p
                            className={`text-sm font-medium ${
                              scannedData.type === "member"
                                ? "text-blue-600/80 dark:text-blue-400/80"
                                : "text-purple-600/80 dark:text-purple-400/80"
                            }`}
                          >
                            {scannedData.type === "member"
                              ? "Member"
                              : "Minister"}{" "}
                            #{scannedData.id}
                          </p>

                          {/* ID Badge */}
                          <div
                            className={`rounded px-2 py-1 font-mono text-xs ${
                              scannedData.type === "member"
                                ? "bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                                : "bg-purple-100/80 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                            }`}
                          >
                            ID: {scannedData.id}
                          </div>
                        </div>

                        {!profileData && !isLoadingProfile && (
                          <p className="text-muted-foreground mt-2 text-sm">
                            Profile not found in database
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Information Grid */}
                {isLoadingProfile ? (
                  <div
                    className={`rounded-lg border p-4 ${
                      scannedData.type === "member"
                        ? "border-blue-200/30 bg-blue-50/20 dark:border-blue-800/20 dark:bg-blue-950/10"
                        : "border-purple-200/30 bg-purple-50/20 dark:border-purple-800/20 dark:bg-purple-950/10"
                    }`}
                  >
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div className="space-y-2" key={i}>
                          <div
                            className={`h-4 w-16 animate-pulse rounded ${
                              scannedData.type === "member"
                                ? "bg-blue-200 dark:bg-blue-800/50"
                                : "bg-purple-200 dark:bg-purple-800/50"
                            }`}
                          />
                          <div
                            className={`h-10 w-full animate-pulse rounded-md ${
                              scannedData.type === "member"
                                ? "bg-blue-100 dark:bg-blue-900/30"
                                : "bg-purple-100 dark:bg-purple-900/30"
                            }`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : profileData && !isLoadingProfile ? (
                  <div
                    className={`rounded-lg border p-4 ${
                      scannedData.type === "member"
                        ? "border-blue-200/30 bg-blue-50/20 dark:border-blue-800/20 dark:bg-blue-950/10"
                        : "border-purple-200/30 bg-purple-50/20 dark:border-purple-800/20 dark:bg-purple-950/10"
                    }`}
                  >
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="space-y-2">
                        <Label
                          className={`text-sm font-medium ${
                            scannedData.type === "member"
                              ? "text-blue-700 dark:text-blue-300"
                              : "text-purple-700 dark:text-purple-300"
                          }`}
                        >
                          Email
                        </Label>
                        <div
                          className={`h-10 rounded-md border px-3 py-2 text-sm ${
                            scannedData.type === "member"
                              ? "border-blue-200 bg-blue-50/50 text-blue-900 dark:border-blue-800/50 dark:bg-blue-950/30 dark:text-blue-100"
                              : "border-purple-200 bg-purple-50/50 text-purple-900 dark:border-purple-800/50 dark:bg-purple-950/30 dark:text-purple-100"
                          }`}
                        >
                          {(profileData as Minister | Member)?.email ||
                            "Not provided"}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label
                          className={`text-sm font-medium ${
                            scannedData.type === "member"
                              ? "text-blue-700 dark:text-blue-300"
                              : "text-purple-700 dark:text-purple-300"
                          }`}
                        >
                          Phone
                        </Label>
                        <div
                          className={`h-10 rounded-md border px-3 py-2 text-sm ${
                            scannedData.type === "member"
                              ? "border-blue-200 bg-blue-50/50 text-blue-900 dark:border-blue-800/50 dark:bg-blue-950/30 dark:text-blue-100"
                              : "border-purple-200 bg-purple-50/50 text-purple-900 dark:border-purple-800/50 dark:bg-purple-950/30 dark:text-purple-100"
                          }`}
                        >
                          {scannedData.type === "member"
                            ? (profileData as Member)?.mobileNumber ||
                              "Not provided"
                            : (profileData as Minister)?.telephone ||
                              "Not provided"}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label
                          className={`text-sm font-medium ${
                            scannedData.type === "member"
                              ? "text-blue-700 dark:text-blue-300"
                              : "text-purple-700 dark:text-purple-300"
                          }`}
                        >
                          Gender
                        </Label>
                        <div
                          className={`h-10 rounded-md border px-3 py-2 text-sm capitalize ${
                            scannedData.type === "member"
                              ? "border-blue-200 bg-blue-50/50 text-blue-900 dark:border-blue-800/50 dark:bg-blue-950/30 dark:text-blue-100"
                              : "border-purple-200 bg-purple-50/50 text-purple-900 dark:border-purple-800/50 dark:bg-purple-950/30 dark:text-purple-100"
                          }`}
                        >
                          {(profileData as Minister | Member)?.gender ||
                            "Not specified"}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label
                          className={`text-sm font-medium ${
                            scannedData.type === "member"
                              ? "text-blue-700 dark:text-blue-300"
                              : "text-purple-700 dark:text-purple-300"
                          }`}
                        >
                          {scannedData.type === "member"
                            ? "Year Joined"
                            : "Civil Status"}
                        </Label>
                        <div
                          className={`h-10 rounded-md border px-3 py-2 text-sm capitalize ${
                            scannedData.type === "member"
                              ? "border-blue-200 bg-blue-50/50 text-blue-900 dark:border-blue-800/50 dark:bg-blue-950/30 dark:text-blue-100"
                              : "border-purple-200 bg-purple-50/50 text-purple-900 dark:border-purple-800/50 dark:bg-purple-950/30 dark:text-purple-100"
                          }`}
                        >
                          {scannedData.type === "member"
                            ? (profileData as Member)?.yearJoined ||
                              "Not provided"
                            : (profileData as Minister)?.civilStatus ||
                              "Not provided"}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label
                          className={`text-sm font-medium ${
                            scannedData.type === "member"
                              ? "text-blue-700 dark:text-blue-300"
                              : "text-purple-700 dark:text-purple-300"
                          }`}
                        >
                          Joined Date
                        </Label>
                        <div
                          className={`flex h-10 items-center gap-2 rounded-md border px-3 py-2 text-sm ${
                            scannedData.type === "member"
                              ? "border-blue-200 bg-blue-50/50 text-blue-900 dark:border-blue-800/50 dark:bg-blue-950/30 dark:text-blue-100"
                              : "border-purple-200 bg-purple-50/50 text-purple-900 dark:border-purple-800/50 dark:bg-purple-950/30 dark:text-purple-100"
                          }`}
                        >
                          <Calendar className="h-4 w-4" />
                          <span>
                            {format(
                              new Date(
                                (profileData as Minister | Member)?.createdAt
                              ),
                              "MMM dd, yyyy"
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label
                          className={`text-sm font-medium ${
                            scannedData.type === "member"
                              ? "text-blue-700 dark:text-blue-300"
                              : "text-purple-700 dark:text-purple-300"
                          }`}
                        >
                          Time Since Joined
                        </Label>
                        <div
                          className={`flex h-10 items-center gap-2 rounded-md border px-3 py-2 text-sm ${
                            scannedData.type === "member"
                              ? "border-blue-200 bg-blue-50/50 text-blue-900 dark:border-blue-800/50 dark:bg-blue-950/30 dark:text-blue-100"
                              : "border-purple-200 bg-purple-50/50 text-purple-900 dark:border-purple-800/50 dark:bg-purple-950/30 dark:text-purple-100"
                          }`}
                        >
                          <UserPlus className="h-4 w-4" />
                          <span>
                            {formatDistanceToNow(
                              new Date(
                                (profileData as Minister | Member)?.createdAt
                              ),
                              { addSuffix: true }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Actions */}
                <div
                  className={`rounded-lg border p-4 ${
                    scannedData.type === "member"
                      ? "border-blue-200/30 bg-gradient-to-r from-blue-50/30 to-slate-50/20 dark:border-blue-800/20 dark:from-blue-950/20 dark:to-slate-950/10"
                      : "border-purple-200/30 bg-gradient-to-r from-purple-50/30 to-indigo-50/20 dark:border-purple-800/20 dark:from-purple-950/20 dark:to-indigo-950/10"
                  }`}
                >
                  <div className="mb-3">
                    <h4
                      className={`text-sm font-semibold ${
                        scannedData.type === "member"
                          ? "text-blue-800 dark:text-blue-200"
                          : "text-purple-800 dark:text-purple-200"
                      }`}
                    >
                      Available Actions
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {isLoadingProfile ? (
                      <div className="flex gap-3">
                        <div
                          className={`h-10 w-20 animate-pulse rounded-md ${
                            scannedData.type === "member"
                              ? "bg-blue-200 dark:bg-blue-800/50"
                              : "bg-purple-200 dark:bg-purple-800/50"
                          }`}
                        />
                        <div
                          className={`h-10 w-20 animate-pulse rounded-md ${
                            scannedData.type === "member"
                              ? "bg-blue-100 dark:bg-blue-900/30"
                              : "bg-purple-100 dark:bg-purple-900/30"
                          }`}
                        />
                        <div
                          className={`h-10 w-32 animate-pulse rounded-md ${
                            scannedData.type === "member"
                              ? "bg-blue-200 dark:bg-blue-800/50"
                              : "bg-purple-200 dark:bg-purple-800/50"
                          }`}
                        />
                      </div>
                    ) : profileData && !isLoadingProfile ? (
                      <>
                        <Button
                          className={
                            scannedData.type === "member"
                              ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                              : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
                          }
                          onClick={handleView}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                        <Button
                          className={
                            scannedData.type === "member"
                              ? "border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-950/50"
                              : "border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-950/50"
                          }
                          variant="outline"
                          onClick={handleEdit}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Profile
                        </Button>
                        <Button
                          className={`${
                            scannedData.type === "member"
                              ? "border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-950/50"
                              : "border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-950/50"
                          } ${isDownloadingPDF ? "cursor-not-allowed opacity-50" : ""}`}
                          disabled={isDownloadingPDF}
                          variant="outline"
                          onClick={handlePDFDownload}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          {isDownloadingPDF ? "Downloading..." : "Download PDF"}
                        </Button>
                      </>
                    ) : null}
                    <PersonQRCode
                      id={scannedData.id}
                      name={profileName}
                      trigger={
                        <Button
                          className={
                            scannedData.type === "member"
                              ? "border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-950/50"
                              : "border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-950/50"
                          }
                          variant="outline"
                        >
                          <QrCode className="mr-2 h-4 w-4" />
                          Generate QR
                        </Button>
                      }
                      type={scannedData.type}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <QrCode className="text-muted-foreground mx-auto mb-4 h-24 w-24" />
                  <h3 className="mb-2 text-lg font-semibold">
                    No QR Code Scanned
                  </h3>
                  <p className="text-muted-foreground">
                    Start the camera or upload an image to scan a QR code
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {/* View Dialogs */}
      {scannedData?.type === "member" && (
        <ViewMemberDialog
          isOpen={isViewDialogOpen}
          memberId={scannedData.id}
          onClose={() => setIsViewDialogOpen(false)}
        />
      )}

      {scannedData?.type === "minister" && (
        <ViewMinisterDialog
          isOpen={isViewDialogOpen}
          ministerId={scannedData.id}
          onClose={() => setIsViewDialogOpen(false)}
        />
      )}

      {/* Edit Dialogs */}
      {scannedData?.type === "member" && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-h-[90vh] w-full min-w-4xl overflow-y-auto">
            <DialogTitle>Edit Member</DialogTitle>
            <DialogDescription>
              Update member information including personal details and ministry
              involvement.
            </DialogDescription>
            <MemberForm
              isDialog={true}
              memberId={scannedData.id}
              onClose={() => setIsEditDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {scannedData?.type === "minister" && (
        <EditMinisterDialog
          isOpen={isEditDialogOpen}
          ministerId={scannedData.id}
          onClose={() => setIsEditDialogOpen(false)}
        />
      )}

      {/* Image Viewer for profile pictures */}
      <ImageViewer
        alt={`${profileName} profile picture`}
        isOpen={isImageViewerOpen}
        src={
          profileData && scannedData?.type === "member"
            ? (profileData as Member)?.profilePicture || null
            : profileData && scannedData?.type === "minister"
              ? (profileData as Minister)?.imageUrl || null
              : null
        }
        onClose={() => setIsImageViewerOpen(false)}
      />
    </Card>
  );
}
