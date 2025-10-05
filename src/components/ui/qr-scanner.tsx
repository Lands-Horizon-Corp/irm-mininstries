"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import jsQR from "jsqr";
import { Download, Edit, Eye, QrCode, UserCheck } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PersonQRCode } from "@/components/ui/person-qr-code";
import type { Member } from "@/modules/member/member-schema";
import { useMember } from "@/modules/member/member-service";
import type { ministers } from "@/modules/ministry/ministry-schema";
import { useMinister } from "@/modules/ministry/ministry-service";

type Minister = typeof ministers.$inferSelect;
type ScannedData = { id: number; type: "member" | "minister" };

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  member?: Member | null;
  minister?: Minister | null;
  onMemberAction?: (action: "view" | "edit" | "delete", member: Member) => void;
  onMinisterAction?: (
    action: "view" | "edit" | "delete",
    minister: Minister
  ) => void;
  onMemberFound?: (member: Member) => void;
  onMinisterFound?: (minister: Minister) => void;
}

export function QRScanner({
  isOpen,
  onClose,
  member,
  minister,
  onMemberAction,
  onMinisterAction,
  onMemberFound,
  onMinisterFound,
}: QRScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState<ScannedData | null>(null);
  const [error, setError] = useState<string>("");
  const [cameraStatus, setCameraStatus] = useState<string>("idle");

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
          setScanning(false);

          // Stop camera
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
          }
          if (videoRef.current) {
            videoRef.current.srcObject = null;
          }
          if (scanningIntervalRef.current) {
            clearInterval(scanningIntervalRef.current);
            scanningIntervalRef.current = null;
          }

          // Trigger found callbacks
          if (parsed.type === "member" && onMemberFound) {
            const mockMember = member || ({ id: parsed.id } as Member);
            onMemberFound(mockMember);
          } else if (parsed.type === "minister" && onMinisterFound) {
            const mockMinister = minister || ({ id: parsed.id } as Minister);
            onMinisterFound(mockMinister);
          }

          toast.success(
            `${parsed.type === "member" ? "Member" : "Minister"} QR code scanned successfully!`
          );
        } else {
          throw new Error("Invalid QR code format");
        }
      } catch {
        // Invalid QR code data
      }
    }
  }, [member, minister, onMemberFound, onMinisterFound]);

  // Camera functions
  const startCamera = async () => {
    setCameraStatus("requesting");
    try {
      // First check if the browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API not supported in this browser");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });

      setCameraStatus("stream-obtained");

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;

        // Add immediate play attempt
        const video = videoRef.current;

        video.onerror = () => {
          setError("Failed to load camera stream");
          toast.error("Failed to load camera stream");
        };

        // Try to play immediately
        const tryPlay = async () => {
          try {
            await video.play();
            setCameraStatus("playing");
            setScanning(true);
            setError("");

            scanningIntervalRef.current = setInterval(scanQRCode, 100); // Scan every 100ms for better responsiveness
          } catch {
            toast.error(
              "Failed to start video playback. Please allow autoplay and try again."
            );
            setCameraStatus("play-error");
            setError("Failed to start video playback");
          }
        };

        // Wait for metadata AND try immediate play
        video.onloadedmetadata = () => {
          tryPlay();
        };

        // Also try playing after a short delay as fallback
        setTimeout(() => {
          if (!scanning) {
            tryPlay();
          }
        }, 1000);
      } else {
        // Video element doesn't exist yet, set scanning first so it renders
        setScanning(true);
        streamRef.current = stream;

        // Try again after video element should be rendered
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;

            const video = videoRef.current;

            const tryPlayDelayed = async () => {
              try {
                await video.play();
                setCameraStatus("playing");
                setError("");
                scanningIntervalRef.current = setInterval(scanQRCode, 100);
              } catch {
                toast.error(
                  "Failed to start video playback. Please allow autoplay and try again."
                );
                setCameraStatus("play-error");
                setError("Failed to start video playback");
              }
            };

            video.onloadedmetadata = () => {
              tryPlayDelayed();
            };

            // Immediate try
            tryPlayDelayed();
          } else {
            toast.error("Video element still not available after delay!");
            setCameraStatus("video-element-missing");
            setError("Video element not available");
          }
        }, 100);
      }
    } catch (error) {
      toast.error("Error accessing camera:");

      let errorMessage = "Camera access denied. Please check permissions.";

      if (error instanceof DOMException) {
        switch (error.name) {
          case "NotAllowedError":
            errorMessage =
              "Camera access denied. Please allow camera permissions and try again.";
            break;
          case "NotFoundError":
            errorMessage =
              "No camera found. Please connect a camera and try again.";
            break;
          case "NotReadableError":
            errorMessage = "Camera is already in use by another application.";
            break;
          case "OverconstrainedError":
            errorMessage = "Camera doesn't support the required constraints.";
            break;
          default:
            errorMessage = `Camera error: ${error.message}`;
        }
      }

      toast.error(errorMessage);
      setError(errorMessage);
      setCameraStatus("error");
    }
  };
  const stopCamera = useCallback(() => {
    // Stop scanning interval
    if (scanningIntervalRef.current) {
      clearInterval(scanningIntervalRef.current);
      scanningIntervalRef.current = null;
    }

    // Stop camera stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setScanning(false);
    setCameraStatus("idle");
  }, []);

  // Manual input for testing
  const handleManualInput = (input: string) => {
    try {
      const parsed: ScannedData = JSON.parse(input);

      if (
        parsed.id &&
        (parsed.type === "member" || parsed.type === "minister")
      ) {
        setScannedData(parsed);
        stopCamera();

        // Trigger found callbacks
        if (parsed.type === "member" && onMemberFound) {
          const mockMember = member || ({ id: parsed.id } as Member);
          onMemberFound(mockMember);
        } else if (parsed.type === "minister" && onMinisterFound) {
          const mockMinister = minister || ({ id: parsed.id } as Minister);
          onMinisterFound(mockMinister);
        }
      } else {
        throw new Error("Invalid QR code format");
      }
    } catch {
      toast.error("Invalid QR code format");
      setError("Invalid QR code. Please try again.");
    }
  };

  // Action handlers
  const handleView = () => {
    if (scannedData?.type === "member" && profileData) {
      onMemberAction?.("view", profileData as Member);
      onClose(); // Close scanner after action
    } else if (scannedData?.type === "minister" && profileData) {
      onMinisterAction?.("view", profileData as Minister);
      onClose(); // Close scanner after action
    }
  };

  const handleEdit = () => {
    if (scannedData?.type === "member" && profileData) {
      onMemberAction?.("edit", profileData as Member);
      onClose(); // Close scanner after action
    } else if (scannedData?.type === "minister" && profileData) {
      onMinisterAction?.("edit", profileData as Minister);
      onClose(); // Close scanner after action
    }
  };

  const handleDownloadPDF = async () => {
    if (!scannedData) return;

    try {
      if (scannedData.type === "member" && member?.id) {
        // Implement member PDF download
        toast.success("Member PDF downloaded");
      } else if (scannedData.type === "minister" && minister?.id) {
        // Implement minister PDF download
        toast.success("Minister PDF downloaded");
      }
    } catch {
      toast.error("Failed to download PDF");
    }
  };

  const resetScanner = () => {
    setScannedData(null);
    setError("");
    startCamera();
  };

  // Cleanup on close
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setScannedData(null);
      setError("");
    }
  }, [isOpen, stopCamera, scanning, cameraStatus]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const profileData =
    scannedData?.type === "member"
      ? memberData?.data || member
      : ministerData?.data || minister;

  const isLoadingProfile =
    (scannedData?.type === "member" && memberLoading) ||
    (scannedData?.type === "minister" && ministerLoading);

  const profileName = profileData
    ? scannedData?.type === "member"
      ? `${(profileData as Member)?.firstName} ${(profileData as Member)?.lastName}`
      : `${(profileData as Minister)?.firstName} ${(profileData as Minister)?.lastName}`
    : scannedData
      ? `${scannedData.type === "member" ? "Member" : "Minister"} #${scannedData.id}`
      : "Unknown";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            QR Code Scanner
          </DialogTitle>
          <DialogDescription>
            Scan a member or minister QR code to access their profile
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Show camera status when requesting access */}
          {cameraStatus === "requesting" && (
            <div className="space-y-4 text-center">
              <div className="border-muted-foreground/25 rounded-lg border-2 border-dashed p-8">
                <QrCode className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <p className="text-muted-foreground text-sm">
                  Requesting camera access...
                </p>
              </div>
            </div>
          )}
          {!scanning && !scannedData && cameraStatus !== "requesting" && (
            <div className="space-y-4 text-center">
              <div className="border-muted-foreground/25 rounded-lg border-2 border-dashed p-8">
                <QrCode className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <p className="text-muted-foreground text-sm">
                  Click below to start camera and scan QR code
                </p>
              </div>
              <Button
                className="w-full"
                onClick={() => {
                  startCamera();
                }}
              >
                Start Camera
              </Button>

              {/* Manual input for testing */}
              <div className="space-y-2">
                <p className="text-muted-foreground text-xs">
                  For testing, paste QR data:
                </p>
                <input
                  className="w-full rounded border px-3 py-2 text-sm"
                  placeholder='{"id":1,"type":"member"}'
                  type="text"
                  onPaste={(e) => {
                    setTimeout(
                      () => handleManualInput(e.currentTarget.value),
                      0
                    );
                  }}
                />
              </div>
            </div>
          )}{" "}
          {scanning && !scannedData && (
            <div className="space-y-4">
              <div className="relative">
                <video
                  autoPlay
                  muted
                  playsInline
                  className="w-full rounded-lg bg-black"
                  ref={videoRef}
                  style={{ aspectRatio: "4/3" }}
                />
                <canvas className="hidden" ref={canvasRef} />

                {/* Debug info */}
                <div className="absolute top-2 left-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
                  Status: {cameraStatus}
                </div>

                {/* Scanning overlay */}
                <div className="absolute inset-4 rounded-lg border-2 border-white/50">
                  <div className="absolute top-0 left-0 h-6 w-6 border-t-2 border-l-2 border-white" />
                  <div className="absolute top-0 right-0 h-6 w-6 border-t-2 border-r-2 border-white" />
                  <div className="absolute bottom-0 left-0 h-6 w-6 border-b-2 border-l-2 border-white" />
                  <div className="absolute right-0 bottom-0 h-6 w-6 border-r-2 border-b-2 border-white" />
                </div>

                {/* Scanning indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 transform">
                  <div className="rounded-full bg-black/70 px-3 py-1 text-sm text-white">
                    Scanning for QR codes...
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={stopCamera}
                >
                  Stop Camera
                </Button>
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={resetScanner}
                >
                  Reset
                </Button>
              </div>

              {error && (
                <div className="text-destructive bg-destructive/10 rounded p-2 text-sm">
                  {error}
                </div>
              )}
            </div>
          )}
          {scannedData && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <UserCheck className="h-5 w-5" />
                  {scannedData.type === "member"
                    ? "Member Found"
                    : "Minister Found"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={
                        profileData && scannedData.type === "member"
                          ? (profileData as Member)?.profilePicture || undefined
                          : profileData && scannedData.type === "minister"
                            ? (profileData as Minister)?.imageUrl || undefined
                            : undefined
                      }
                    />
                    <AvatarFallback>
                      {profileName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{profileName}</h3>
                    <p className="text-muted-foreground text-sm capitalize">
                      {scannedData.type} #{scannedData.id}
                    </p>
                    {isLoadingProfile && (
                      <p className="text-muted-foreground text-xs">
                        Loading profile...
                      </p>
                    )}
                    {!profileData && !isLoadingProfile && (
                      <p className="text-muted-foreground text-xs">
                        Profile not found in database
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {profileData && !isLoadingProfile && (
                    <>
                      <Button size="sm" onClick={handleView}>
                        <Eye className="mr-1 h-4 w-4" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleEdit}>
                        <Edit className="mr-1 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleDownloadPDF}
                      >
                        <Download className="mr-1 h-4 w-4" />
                        PDF
                      </Button>
                    </>
                  )}
                  <PersonQRCode
                    id={scannedData.id}
                    name={profileName}
                    trigger={
                      <Button size="sm" variant="outline">
                        <QrCode className="mr-1 h-4 w-4" />
                        QR
                      </Button>
                    }
                    type={scannedData.type}
                  />
                  {!profileData && !isLoadingProfile && (
                    <Button
                      size="sm"
                      onClick={() => {
                        // Navigate to the profile or trigger an action to load the profile
                        if (scannedData.type === "member" && onMemberFound) {
                          onMemberFound({ id: scannedData.id } as Member);
                        } else if (
                          scannedData.type === "minister" &&
                          onMinisterFound
                        ) {
                          onMinisterFound({ id: scannedData.id } as Minister);
                        }
                        onClose();
                      }}
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      View Profile
                    </Button>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    variant="outline"
                    onClick={resetScanner}
                  >
                    Scan Another
                  </Button>
                  <Button
                    className="flex-1"
                    variant="outline"
                    onClick={onClose}
                  >
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
