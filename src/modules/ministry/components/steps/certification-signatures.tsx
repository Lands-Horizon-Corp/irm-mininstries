"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import SignatureCanvasComponent from "@/components/ui/signature-canvas";

import type { Minister } from "../../ministry-validation";

interface StepProps {
  formData: Minister;
  updateMinisterData: (
    field: keyof Minister,
    value: string | boolean | Date | string[] | File | null
  ) => void;
  onNext: () => void;
  onBack: () => void;
}

const certificationSignaturesSchema = z.object({
  certifiedBy: z.string().optional(),
  signatureImageUrl: z.string().optional(),
  signatureByCertifiedImageUrl: z.string().optional(),
  acceptDeclaration: z.boolean().refine((val) => val === true, {
    message: "You must accept the declaration to proceed",
  }),
});

type FormValues = z.infer<typeof certificationSignaturesSchema>;

export function CertificationSignatures({
  formData,
  updateMinisterData,
  onNext,
  onBack,
}: StepProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(certificationSignaturesSchema),
    defaultValues: {
      certifiedBy: formData.certifiedBy || "",
      signatureImageUrl: formData.signatureImageUrl || "",
      signatureByCertifiedImageUrl: formData.signatureByCertifiedImageUrl || "",
      acceptDeclaration: false,
    },
    mode: "onBlur",
  });

  const { watch } = form;
  const acceptDeclaration = watch("acceptDeclaration");

  const onSubmit = async (values: FormValues) => {
    const valid = await form.trigger();
    if (!valid) {
      // Scroll to first error field
      const firstErrorField = document.querySelector(
        '[aria-invalid="true"], [data-invalid]'
      );
      if (firstErrorField) {
        firstErrorField.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }

    // Update form data with certification information
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined) {
        if (typeof value === "string") {
          updateMinisterData(key as keyof Minister, value);
        }
      }
    });

    // Scroll to top of page after successful form submission
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Continue to final submission
    onNext();
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4 p-3 sm:space-y-8 sm:p-6">
      <Form {...form}>
        <form
          className="space-y-4 sm:space-y-8"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {/* Certification Information Section */}
          <Card className="relative overflow-hidden">
            <CardHeader className="px-3 pt-2 pb-2 sm:px-6 sm:pt-6 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <span className="leading-tight">Certification Information</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 px-3 pb-3 sm:space-y-6 sm:px-6 sm:pb-6">
              <FormField
                control={form.control}
                name="certifiedBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium sm:text-base">
                      Certified By
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="h-10 text-sm sm:h-11 sm:text-base"
                        placeholder="Enter the name of the certifying authority or person"
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Digital Signatures Section */}
          <Card className="relative overflow-hidden">
            <CardHeader className="px-3 pt-2 pb-2 sm:px-6 sm:pt-6 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <span className="leading-tight">Digital Signatures</span>
                <span className="text-sm text-current/50">(Optional)</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 px-3 pb-3 sm:space-y-6 sm:px-6 sm:pb-6">
              {/* Applicant Signature */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-current/80 sm:text-base">
                  Applicant&apos;s Signature
                </h4>
                <FormField
                  control={form.control}
                  name="signatureImageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium sm:text-base">
                        Draw Your Signature
                      </FormLabel>
                      <FormControl>
                        <SignatureCanvasComponent
                          className="w-full"
                          name="applicant-signature"
                          value={field.value || ""}
                          onChange={(base64) => {
                            field.onChange(base64);
                            updateMinisterData("signatureImageUrl", base64);
                          }}
                        />
                      </FormControl>
                      <p className="mt-2 text-xs text-gray-500">
                        Draw your signature using your mouse, trackpad, or touch
                        screen
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Certified By Signature */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-current/80 sm:text-base">
                  Certifying Authority&apos;s Signature
                </h4>
                <FormField
                  control={form.control}
                  name="signatureByCertifiedImageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium sm:text-base">
                        Draw Certifying Authority&apos;s Signature
                      </FormLabel>
                      <FormControl>
                        <SignatureCanvasComponent
                          className="w-full"
                          name="certifier-signature"
                          value={field.value || ""}
                          onChange={(base64) => {
                            field.onChange(base64);
                            updateMinisterData(
                              "signatureByCertifiedImageUrl",
                              base64
                            );
                          }}
                        />
                      </FormControl>
                      <p className="mt-2 text-xs text-gray-500">
                        Draw the signature of the person or authority certifying
                        this application
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Final Declaration */}
          <Card className="relative overflow-hidden">
            <CardContent className="space-y-3 px-3 pb-3 sm:space-y-4 sm:px-6 sm:pb-6">
              <div className="space-y-4 text-center">
                <h3 className="text-lg font-semibold">
                  Declaration & Data Protection
                </h3>
                <p className="text-left text-sm leading-relaxed">
                  I hereby declare that all information provided in this
                  application is accurate and complete to the best of my
                  knowledge. We will ensure your data is protected according to
                  our privacy policy and will only be used for ministry
                  registration purposes. Your personal information will be
                  handled with the utmost confidentiality and security measures
                  in place.
                </p>

                <FormField
                  control={form.control}
                  name="acceptDeclaration"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-left text-sm font-medium">
                          I accept the declaration above and consent to the
                          processing of my personal data for ministry
                          registration purposes.
                          <span className="text-destructive ml-1">*</span>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex flex-col gap-3 border-t px-3 pt-4 sm:flex-row sm:justify-between sm:gap-4 sm:px-0 sm:pt-6">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button disabled={!acceptDeclaration} type="submit">
              <CheckIcon className="mr-2 inline h-4 w-4" />
              Submit Application
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
