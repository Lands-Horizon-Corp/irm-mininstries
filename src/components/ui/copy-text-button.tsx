import { CheckIcon, CopyIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

import { toast } from "sonner";

interface Props<TErr = Error> {
  textContent: string;
  copyInterval?: number;
  className?: string;
  successText?: string;
  successClassName?: string;
  onCopySuccess?: () => void;
  onCopyError?: (error: TErr) => void;
}

const CopyTextButton = <TErr = Error,>({
  className,
  textContent,
  successText,
  successClassName,
  copyInterval = 2500,
  onCopyError,
  onCopySuccess,
}: Props<TErr>) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard
      .writeText(textContent)
      .then(() => {
        setCopied(true);
        toast.success(successText ?? "Coppied");
        onCopySuccess?.();
        setTimeout(() => setCopied(false), copyInterval);
      })
      .catch((err: TErr) => {
        onCopyError?.(err);
        toast.error("Sorry, Failed to copy");
      });
  }, [copyInterval, onCopyError, onCopySuccess, successText, textContent]);

  if (copied)
    return (
      <CheckIcon
        className={cn("text-primary inline", className, successClassName)}
      />
    );

  return (
    <button
      className={cn(
        "text-foreground/40 hover:text-foreground inline cursor-pointer duration-150 ease-in-out",
        copied && "pointer-events-none",
        className
      )}
      onClick={(e) => {
        e.stopPropagation();
        handleCopy();
      }}
    >
      <CopyIcon className="size-full" />
    </button>
  );
};

export default CopyTextButton;
