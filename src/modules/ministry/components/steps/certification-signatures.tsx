"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Plus, Trash2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";

import type { Minister, StepProps } from "../../ministry-validation";

const caseReportSchema = z.object({
  id: z.number().int().optional(),
  description: z.string().min(1, { message: "Description is required" }),
  year: z.string().min(1, { message: "Year is required" }),
  createdAt: z.any().optional(),
  updatedAt: z.any().optional(),
});

const certificationSignaturesSchema = z.object({
  caseReports: z.array(caseReportSchema).optional(),
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
      caseReports: formData.caseReports || [],
      certifiedBy: formData.certifiedBy || "",
      signatureImageUrl: formData.signatureImageUrl || "",
      signatureByCertifiedImageUrl: formData.signatureByCertifiedImageUrl || "",
      acceptDeclaration: false,
    },
    mode: "onBlur",
  });

  const { watch } = form;
  const acceptDeclaration = watch("acceptDeclaration");
  const caseReports = watch("caseReports") || [];

  const addCaseReport = () => {
    const currentReports = form.getValues("caseReports") || [];
    form.setValue("caseReports", [
      ...currentReports,
      {
        description: "",
        year: "",
      },
    ]);
  };

  const removeCaseReport = (index: number) => {
    const currentReports = form.getValues("caseReports") || [];
    form.setValue(
      "caseReports",
      currentReports.filter((_, i) => i !== index)
    );
  };

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
        if (key === "caseReports") {
          (
            updateMinisterData as (
              field: keyof Minister,
              value: unknown
            ) => void
          )(key as keyof Minister, value);
        } else if (typeof value === "string") {
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
          {/* Case Reports Section */}
          <Card className="relative overflow-hidden">
            <CardHeader className="px-3 pt-2 pb-2 sm:px-6 sm:pt-6 sm:pb-4">
              <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                <span className="leading-tight">Case Reports</span>
                <Button
                  className="flex items-center gap-2"
                  size="sm"
                  type="button"
                  variant="outline"
                  onClick={addCaseReport}
                >
                  <Plus className="h-4 w-4" />
                  Add Report
                </Button>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 px-3 pb-3 sm:space-y-6 sm:px-6 sm:pb-6">
              {caseReports.length === 0 ? (
                <div className="py-8 text-center text-current/50">
                  <p className="text-sm sm:text-base">
                    No case reports added yet. Click &quot;Add Report&quot; to
                    add case report information.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {caseReports.map((_, index) => (
                    <div
                      className="space-y-4 rounded-lg border p-4"
                      key={index}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-current/80 sm:text-base">
                          Case Report {index + 1}
                        </h4>
                        <Button
                          className="flex items-center gap-2 text-red-600 hover:text-red-700"
                          size="sm"
                          type="button"
                          variant="outline"
                          onClick={() => removeCaseReport(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name={`caseReports.${index}.year`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium sm:text-base">
                                Year
                                <span className="text-destructive ml-1">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  className="h-10 text-sm sm:h-11 sm:text-base"
                                  placeholder="Enter year (e.g., 2024)"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`caseReports.${index}.description`}
                          render={({ field }) => (
                            <FormItem className="md:col-span-1">
                              <FormLabel className="text-sm font-medium sm:text-base">
                                Description
                                <span className="text-destructive ml-1">*</span>
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  className="min-h-[80px] text-sm sm:text-base"
                                  placeholder="Enter case report description"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

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
              <ArrowRight className="mr-2 inline h-4 w-4" />
              Next
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
