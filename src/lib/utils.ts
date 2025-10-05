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
  const imageTypes = ["image/jpeg", "image/png", "image/jpg"];
  const isImage =
    imageTypes.includes(file.type) ||
    file.name.toLowerCase().endsWith(".jpg") ||
    file.name.toLowerCase().endsWith(".jpeg") ||
    file.name.toLowerCase().endsWith(".png");

  if (isImage) {
    const options = {
      maxSizeMB: 5, // Maximum size 5MB
      maxWidthOrHeight: 1920, // Maximum width or height
      useWebWorker: true,
      fileType: file.type,
      initialQuality: 0.8, // Initial quality
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
