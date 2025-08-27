import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="relative flex items-center justify-between">
        {/* Progress bar background */}
        <div className="bg-muted absolute top-1/2 left-0 h-1 w-full -translate-y-1/2" />

        {/* Active progress bar */}
        <div
          className="bg-primary absolute top-1/2 left-0 h-1 -translate-y-1/2 transition-all duration-300 ease-in-out"
          style={{ width: `${(currentStep / steps.length) * 100}%` }}
        />

        {/* Step indicators */}
        <div className="relative z-10 flex w-full justify-between">
          {steps.map((step, index) => {
            const isCompleted = currentStep > index + 1;
            const isCurrent = currentStep === index + 1;

            return (
              <div className="flex flex-1 flex-col items-center" key={step}>
                <div
                  className={cn(
                    "mb-14 flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold md:mb-4",
                    {
                      "border-primary bg-primary text-primary-foreground":
                        isCurrent,
                      "border-primary bg-background text-primary": isCompleted,
                      "border-muted-foreground bg-background text-muted-foreground":
                        !isCompleted && !isCurrent,
                    }
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                <span
                  className={cn(
                    "mt-2 hidden text-center text-sm font-medium md:block",
                    {
                      "text-primary": isCurrent || isCompleted,
                      "text-muted-foreground": !isCompleted && !isCurrent,
                    }
                  )}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
