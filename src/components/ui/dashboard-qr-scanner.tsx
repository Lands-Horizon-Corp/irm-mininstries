"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import jsQR from "jsqr";
import {
  Download,
  Edit,
  Eye,
  EyeOff,
  QrCode,
  Upload,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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

  // Dialog states
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);

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
        } catch (playError) {
          console.error("Video play error:", playError);
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

      console.error("Camera error:", error);
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
    } catch (error) {
      console.error("Failed to download PDF:", error);
      toast.error("Failed to download PDF. Please try again.");
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  const handleReset = () => {
    setScannedData(null);
    setError("");
    toast.info("Scanned data cleared. Ready to scan a new QR code.");
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Get profile data
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

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          QR Code Scanner
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* QR Scanner Section */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {/* Scanner Controls */}
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Camera Scanner</Label>
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
                          <p className="text-destructive text-xs">{error}</p>
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
                <Label className="text-sm font-medium">Upload QR Image</Label>
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
            </div>
          </div>

          {/* Profile Section */}
          <div className="lg:col-span-2">
            {scannedData ? (
              <div className="space-y-6">
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Profile</h3>
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
                      <div className="bg-muted h-16 w-16 animate-pulse rounded-full" />
                      <div className="space-y-2">
                        <div className="bg-muted h-5 w-32 animate-pulse rounded" />
                        <div className="bg-muted h-4 w-24 animate-pulse rounded" />
                        <div className="text-muted-foreground flex items-center gap-2 text-sm">
                          <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-r-transparent" />
                          Loading profile data...
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage
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
                        <AvatarFallback className="text-lg">
                          {profileName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="text-xl font-semibold">{profileName}</h4>
                        <p className="text-muted-foreground capitalize">
                          {scannedData.type} #{scannedData.id}
                        </p>
                        {!profileData && !isLoadingProfile && (
                          <p className="text-muted-foreground text-sm">
                            Profile not found in database
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Information Grid */}
                {isLoadingProfile ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div className="space-y-2" key={i}>
                        <div className="bg-muted h-4 w-16 animate-pulse rounded" />
                        <div className="bg-muted h-10 w-full animate-pulse rounded-md" />
                      </div>
                    ))}
                  </div>
                ) : profileData && !isLoadingProfile ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-sm">
                        Email
                      </Label>
                      <div className="border-input bg-muted h-10 rounded-md border px-3 py-2 text-sm">
                        {(profileData as Minister | Member)?.email ||
                          "Not provided"}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-sm">
                        Phone
                      </Label>
                      <div className="border-input bg-muted h-10 rounded-md border px-3 py-2 text-sm">
                        {scannedData.type === "member"
                          ? (profileData as Member)?.mobileNumber ||
                            "Not provided"
                          : (profileData as Minister)?.telephone ||
                            "Not provided"}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-sm">
                        Gender
                      </Label>
                      <div className="border-input bg-muted h-10 rounded-md border px-3 py-2 text-sm capitalize">
                        {(profileData as Minister | Member)?.gender ||
                          "Not specified"}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground text-sm">
                        {scannedData.type === "member"
                          ? "Year Joined"
                          : "Civil Status"}
                      </Label>
                      <div className="border-input bg-muted h-10 rounded-md border px-3 py-2 text-sm capitalize">
                        {scannedData.type === "member"
                          ? (profileData as Member)?.yearJoined ||
                            "Not provided"
                          : (profileData as Minister)?.civilStatus ||
                            "Not provided"}
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  {isLoadingProfile ? (
                    <div className="flex gap-3">
                      <div className="bg-muted h-10 w-20 animate-pulse rounded-md" />
                      <div className="bg-muted h-10 w-20 animate-pulse rounded-md" />
                      <div className="bg-muted h-10 w-32 animate-pulse rounded-md" />
                    </div>
                  ) : profileData && !isLoadingProfile ? (
                    <>
                      <Button onClick={handleView}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                      <Button variant="outline" onClick={handleEdit}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
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
                      <Button variant="outline">
                        <QrCode className="mr-2 h-4 w-4" />
                        QR Code
                      </Button>
                    }
                    type={scannedData.type}
                  />
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
    </Card>
  );
}
