import { type ClassValue, clsx } from "clsx";
import imageCompression from "browser-image-compression";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const abbreviateUUID = (uuid: string, abbrevLength = 7) => {
  if (uuid.length <= abbrevLength - 1) return uuid;

  const cleanedUUID = uuid.replace(/-/g, "");
  return cleanedUUID.substring(0, abbrevLength);
};

export const imageCompressed = async (file: File): Promise<File> => {
  let processedFile = file;
  const imageTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/gif",
    "image/webp",
    "image/bmp",
    "image/tiff",
    "image/tif",
    "image/svg+xml",
    "image/avif",
    "image/heic",
    "image/heif",
  ];
  const isImage =
    imageTypes.includes(file.type) ||
    file.name.toLowerCase().endsWith(".jpg") ||
    file.name.toLowerCase().endsWith(".jpeg") ||
    file.name.toLowerCase().endsWith(".png") ||
    file.name.toLowerCase().endsWith(".gif") ||
    file.name.toLowerCase().endsWith(".webp") ||
    file.name.toLowerCase().endsWith(".bmp") ||
    file.name.toLowerCase().endsWith(".tiff") ||
    file.name.toLowerCase().endsWith(".tif") ||
    file.name.toLowerCase().endsWith(".svg") ||
    file.name.toLowerCase().endsWith(".avif") ||
    file.name.toLowerCase().endsWith(".heic") ||
    file.name.toLowerCase().endsWith(".heif");

  if (isImage) {
    const options = {
      maxSizeMB: 1, // Ultra-compressed: Maximum size 1Mb
      maxWidthOrHeight: 800, // Smaller dimensions for better compression
      useWebWorker: true,
      fileType: "image/webp", // WebP for superior compression
      initialQuality: 0.7, // Lower quality for smaller size
      alwaysKeepResolution: false, // Allow resolution reduction
      maxIteration: 15, // More compression iterations
    };

    try {
      processedFile = await imageCompression(file, options);
    } catch {
      toast.error("Image compression failed, using original image.");
      processedFile = file;
    }
  }
  return processedFile;
};
