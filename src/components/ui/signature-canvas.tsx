import { useEffect, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

import { RotateCcwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface SignatureCanvasProps {
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  className?: string;
}

const SignatureCanvasComponent = ({
  value,
  onChange,
  name,
  className,
}: SignatureCanvasProps) => {
  const canvasRef = useRef<SignatureCanvas>(null);

  // Resize canvas for high-DPI screens
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasEl = canvas.getCanvas();
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    const prevWidth = canvasEl.width;
    const prevHeight = canvasEl.height;

    const newWidth = canvasEl.offsetWidth * ratio;
    const newHeight = canvasEl.offsetHeight * ratio;

    // Only resize if dimensions actually changed to avoid unnecessary operations
    if (prevWidth !== newWidth || prevHeight !== newHeight) {
      canvasEl.width = newWidth;
      canvasEl.height = newHeight;
      canvasEl.getContext("2d")?.scale(ratio, ratio);

      // Only clear and restore if we have existing content
      if (value) {
        try {
          canvas.fromDataURL(value);
        } catch (error) {
          console.warn("Failed to restore signature after resize:", error);
        }
      }
    }
  };

  // Initial setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initial resize
    resizeCanvas();

    // Add resize listener
    const handleResize = () => {
      // Debounce resize to avoid rapid firing
      const timeoutId = setTimeout(resizeCanvas, 100);
      return () => clearTimeout(timeoutId);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Handle external value changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (value && !canvas.isEmpty()) {
      // Don't overwrite if canvas already has content
      return;
    }

    if (value) {
      try {
        canvas.fromDataURL(value);
      } catch (error) {
        console.warn("Failed to load signature:", error);
      }
    } else if (!value && !canvas.isEmpty()) {
      canvas.clear();
    }
  }, [value]);

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.clear();
    onChange?.("");
  };

  const handleSignatureEnd = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      if (!canvas.isEmpty()) {
        const dataURL = canvas.toDataURL("image/png");
        onChange?.(dataURL);
      } else {
        onChange?.("");
      }
    } catch (error) {
      console.warn("Failed to capture signature:", error);
      onChange?.("");
    }
  };

  return (
    <div className={`relative ${className || ""}`}>
      <div className="rounded-lg border border-gray-300">
        <SignatureCanvas
          canvasProps={{
            className: "w-full  rounded-lg bg-white",
            id: name,
          }}
          penColor="black"
          ref={canvasRef}
          onEnd={handleSignatureEnd}
        />
      </div>
      <div className="absolute right-2 bottom-2 bg-white">
        <Button
          className="border-2 bg-white text-black"
          size="sm"
          type="button"
          onClick={clearSignature}
        >
          <RotateCcwIcon className="mr-1 inline h-3 w-3" />
          Clear
        </Button>
      </div>
    </div>
  );
};

export default SignatureCanvasComponent;
