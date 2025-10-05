"use client";

import React, { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import NextImage from "next/image";

import { Camera, Check, RotateCcw, RotateCw, Upload, X } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Input } from "./input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { toast } from "sonner";

interface Base64ImageUploadProps {
  value?: string | null;
  onChange: (base64: string | null) => void;
  className?: string;
  accept?: string;
  placeholder?: string;
}

export const Base64ImageUpload: React.FC<Base64ImageUploadProps> = ({
  value,
  onChange,
  className,
  accept = "image/jpeg,image/png,.jpg,.jpeg,.png",
  placeholder = "Upload Image",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [tempBase64, setTempBase64] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>(
    []
  );
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(
    undefined
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);
  const rotationCanvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize preview when value changes
  React.useEffect(() => {
    if (value) {
      setPreviewUrl(value);
    } else {
      setPreviewUrl(null);
    }
  }, [value]);

  // Get available camera devices
  React.useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );
        setAvailableDevices(videoDevices);

        // Set default to back camera if available, otherwise first camera
        const backCamera = videoDevices.find(
          (device) =>
            device.label.toLowerCase().includes("back") ||
            device.label.toLowerCase().includes("rear") ||
            device.label.toLowerCase().includes("environment")
        );
        setSelectedDeviceId(backCamera?.deviceId || videoDevices[0]?.deviceId);
      } catch {
        toast.error(
          "Failed to access camera devices. Please check permissions."
        );
        setCameraError(
          "Failed to access camera devices. Please check permissions."
        );
        setAvailableDevices([]);
        setSelectedDeviceId(undefined);
      }
    };

    getDevices();
  }, []);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileSelect = useCallback(async (file: File) => {
    setUploadError(null); // Clear any previous errors

    // Check if file type is valid
    if (!file || (file.type !== "image/jpeg" && file.type !== "image/png")) {
      setUploadError("Please select a valid image file (JPEG or PNG).");
      return;
    }

    // Check file size (1.5MB = 1.5 * 1024 * 1024 bytes = 1,572,864 bytes)
    const maxSizeInBytes = 1.5 * 1024 * 1024; // 1.5MB
    if (file.size > maxSizeInBytes) {
      const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      setUploadError(
        `File size (${fileSizeInMB}MB) exceeds the maximum limit of 1.5MB. Please choose a smaller image.`
      );
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      setTempBase64(base64);
      setPreviewUrl(base64);
      setIsEditing(true);
    } catch {
      toast.error("Failed to process the image. Please try again.");
      setUploadError("Failed to process the image. Please try again.");
    }
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadError(null); // Clear any previous errors when selecting new file
      handleFileSelect(file);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      setUploadError(null); // Clear any previous errors when dropping new file
      const file = e.dataTransfer.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const startCamera = () => {
    setCameraError(null);
    setIsCameraActive(true);
  };

  const stopCamera = () => {
    setIsCameraActive(false);
    setCameraError(null);
  };

  const capturePhoto = useCallback(() => {
    if (webcamRef.current) {
      try {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          setTempBase64(imageSrc);
          setPreviewUrl(imageSrc);
          setIsEditing(true);
          stopCamera();
        }
      } catch {
        toast.error("Failed to capture photo. Please try again.");
        setCameraError("Failed to capture photo. Please try again.");
      }
    }
  }, []);

  const switchCamera = () => {
    if (availableDevices.length > 1) {
      const currentIndex = availableDevices.findIndex(
        (device) => device.deviceId === selectedDeviceId
      );
      const nextIndex = (currentIndex + 1) % availableDevices.length;
      setSelectedDeviceId(availableDevices[nextIndex].deviceId);
    }
  };

  const rotateImage = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const applyRotation = () => {
    if (!tempBase64 || !rotationCanvasRef.current) return;

    const canvas = rotationCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Set canvas size based on rotation
      if (rotation % 180 === 0) {
        canvas.width = img.width;
        canvas.height = img.height;
      } else {
        canvas.width = img.height;
        canvas.height = img.width;
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Apply rotation
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);

      // Draw the full image without cropping
      const drawWidth = rotation % 180 === 0 ? img.width : img.height;
      const drawHeight = rotation % 180 === 0 ? img.height : img.width;

      ctx.drawImage(
        img,
        -drawWidth / 2,
        -drawHeight / 2,
        drawWidth,
        drawHeight
      );

      ctx.restore();

      // Convert to base64 and save
      const rotatedBase64 = canvas.toDataURL("image/jpeg", 0.9);
      onChange(rotatedBase64);
      setIsOpen(false);
      setIsEditing(false);
      setTempBase64(null);
      setRotation(0);
    };

    img.src = tempBase64;
  };

  const handleRemove = () => {
    onChange(null);
    setPreviewUrl(null);
    setTempBase64(null);
    setIsEditing(false);
    setRotation(0);
  };

  const resetAndClose = () => {
    setIsOpen(false);
    setIsEditing(false);
    setTempBase64(null);
    setRotation(0);
    setUploadError(null); // Clear upload errors
    stopCamera();
    if (!value) {
      setPreviewUrl(null);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center gap-2">
        <Dialog
          open={isOpen}
          onOpenChange={(open) => {
            if (!open) resetAndClose();
            setIsOpen(open);
          }}
        >
          <DialogTrigger asChild>
            <Button
              className="border-muted-foreground/25 hover:border-primary hover:bg-accent hover:text-accent-foreground flex h-10 items-center gap-2 border-2 border-dashed bg-none px-4 py-2 transition-all duration-200"
              variant="outline"
            >
              <Upload className="h-4 w-4" />
              {value ? "Change Image" : placeholder}
            </Button>
          </DialogTrigger>

          {value && (
            <Button
              className="border-destructive/20 text-muted-foreground hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive h-10 w-10 p-0 transition-all duration-200"
              size="sm"
              variant="outline"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                Upload Image
              </DialogTitle>
            </DialogHeader>

            {!isEditing ? (
              <Tabs className="w-full" defaultValue="upload">
                <TabsList className="mb-6 grid w-full grid-cols-2">
                  <TabsTrigger value="upload">Upload File</TabsTrigger>
                  <TabsTrigger value="camera">Camera</TabsTrigger>
                </TabsList>

                <TabsContent className="space-y-4" value="upload">
                  {uploadError && (
                    <div className="border-destructive/20 bg-destructive/10 rounded-lg border p-4">
                      <p className="text-destructive text-sm font-medium">
                        Upload Error
                      </p>
                      <p className="text-destructive/80 mt-1 text-sm">
                        {uploadError}
                      </p>
                    </div>
                  )}

                  <div
                    className={cn(
                      "group rounded-xl border-2 border-dashed p-12 text-center transition-all duration-300",
                      isDragging
                        ? "border-primary bg-primary/10 scale-[1.02]"
                        : "border-muted-foreground/25 hover:border-primary hover:bg-primary/5",
                      "hover:scale-[1.01] hover:shadow-lg"
                    )}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <div className="flex flex-col items-center space-y-4">
                      <div className="bg-primary/10 group-hover:bg-primary/20 rounded-full p-4 transition-colors duration-200">
                        <Upload className="text-primary h-8 w-8" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-foreground text-lg font-medium">
                          Drag image here
                        </p>
                        <p className="text-muted-foreground text-sm">
                          or click to select files
                        </p>
                        <p className="text-muted-foreground text-xs">
                          Maximum file size: 1.5MB (JPEG, PNG)
                        </p>
                      </div>
                      <Button
                        className="mt-4"
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Browse Files
                      </Button>
                    </div>
                  </div>

                  <Input
                    accept={accept}
                    className="hidden"
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileInputChange}
                  />
                </TabsContent>

                <TabsContent className="space-y-4" value="camera">
                  <div className="space-y-4">
                    {cameraError && (
                      <div className="border-destructive/20 bg-destructive/10 rounded-lg border p-4">
                        <p className="text-destructive text-sm font-medium">
                          Camera Error
                        </p>
                        <p className="text-destructive/80 mt-1 text-sm">
                          {cameraError}
                        </p>
                      </div>
                    )}

                    {!isCameraActive ? (
                      <div className="space-y-6 py-8 text-center">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="bg-primary/10 rounded-full p-4">
                            <Camera className="text-primary h-8 w-8" />
                          </div>
                          <div className="space-y-2">
                            <p className="text-lg font-medium">Take Photo</p>
                            <p className="text-muted-foreground text-sm">
                              Use your camera to capture an image
                            </p>
                          </div>
                        </div>
                        <Button
                          className="px-8"
                          size="lg"
                          onClick={startCamera}
                        >
                          <Camera className="mr-2 h-4 w-4" />
                          Start Camera
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="relative overflow-hidden rounded-xl shadow-lg">
                          <Webcam
                            audio={false}
                            className="h-80 w-full object-cover"
                            height={480}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={{
                              width: 1280,
                              height: 720,
                              deviceId: selectedDeviceId,
                            }}
                            width={640}
                            onUserMediaError={() => {
                              toast.error(
                                "Camera access error. Please check permissions."
                              );
                              setCameraError(
                                "Camera access failed. Please check permissions and try again."
                              );
                              setIsCameraActive(false);
                            }}
                          />
                        </div>
                        <div className="flex flex-wrap justify-center gap-3">
                          <Button
                            className="px-8"
                            size="lg"
                            onClick={capturePhoto}
                          >
                            <Camera className="mr-2 h-4 w-4" />
                            Take Photo
                          </Button>
                          {availableDevices.length > 1 && (
                            <Button
                              size="lg"
                              variant="outline"
                              onClick={switchCamera}
                            >
                              <RotateCcw className="mr-2 h-4 w-4" />
                              Switch Camera
                            </Button>
                          )}
                          <Button
                            size="lg"
                            variant="outline"
                            onClick={stopCamera}
                          >
                            Cancel
                          </Button>
                        </div>
                        {availableDevices.length > 1 && (
                          <div className="text-center">
                            <p className="text-muted-foreground text-sm">
                              Using:{" "}
                              {availableDevices.find(
                                (d) => d.deviceId === selectedDeviceId
                              )?.label || "Camera"}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2 text-center">
                  <h3 className="text-xl font-semibold">Edit Image</h3>
                  <p className="text-muted-foreground">
                    Rotate and adjust before saving the image
                  </p>
                </div>

                {previewUrl && previewUrl.trim() !== "" && (
                  <div className="relative flex justify-center">
                    <div className="bg-muted relative max-h-96 w-full max-w-md overflow-hidden rounded-xl shadow-lg">
                      <NextImage
                        alt="Preview"
                        className="h-auto w-full object-contain"
                        height={400}
                        src={previewUrl}
                        style={{ transform: `rotate(${rotation}deg)` }}
                        width={400}
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-center">
                  <Button
                    className="px-6"
                    variant="outline"
                    onClick={rotateImage}
                  >
                    <RotateCw className="mr-2 h-4 w-4" />
                    Rotate 90°
                  </Button>
                </div>

                <div className="flex justify-end gap-3 border-t pt-4">
                  <Button size="lg" variant="outline" onClick={resetAndClose}>
                    Cancel
                  </Button>
                  <Button className="px-8" size="lg" onClick={applyRotation}>
                    <Check className="mr-2 h-4 w-4" />
                    Save Image
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {value && previewUrl && previewUrl.trim() !== "" && (
        <div className="mt-6">
          <div className="group relative inline-block">
            <NextImage
              alt="Uploaded"
              className="border-border max-h-64 max-w-full rounded-xl border-2 object-cover shadow-md transition-shadow duration-200 group-hover:shadow-lg"
              height={200}
              src={previewUrl}
              width={300}
            />
            <div className="absolute inset-0 rounded-xl bg-black/0 transition-colors duration-200 group-hover:bg-black/5" />
          </div>
        </div>
      )}

      {/* Hidden canvas for processing */}
      <canvas className="hidden" ref={rotationCanvasRef} />
    </div>
  );
};
