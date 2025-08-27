"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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

const ministryRecordSchema = z.object({
  id: z.number().int().optional(),
  churchLocationId: z
    .number()
    .int()
    .min(1, { message: "Church location is required" }),
  fromYear: z.string().min(1, { message: "From year is required" }),
  toYear: z.string().optional().nullable(),
  contribution: z.string().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

const awardRecognitionSchema = z.object({
  id: z.number().int().optional(),
  year: z.string().min(1, { message: "Year is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

const ministryRecordsAwardsSchema = z.object({
  ministryRecords: z.array(ministryRecordSchema).optional(),
  awardsRecognitions: z.array(awardRecognitionSchema).optional(),
});

type FormValues = z.infer<typeof ministryRecordsAwardsSchema>;

export function MinistryRecordsAwards({
  formData,
  updateMinisterData,
  onNext,
  onBack,
}: StepProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(ministryRecordsAwardsSchema),
    defaultValues: {
      ministryRecords: formData.ministryRecords || [],
      awardsRecognitions: formData.awardsRecognitions || [],
    },
    mode: "onBlur",
  });

  const { watch } = form;
  const ministryRecords = watch("ministryRecords") || [];
  const awardsRecognitions = watch("awardsRecognitions") || [];

  const addMinistryRecord = () => {
    const currentRecords = form.getValues("ministryRecords") || [];
    form.setValue("ministryRecords", [
      ...currentRecords,
      {
        churchLocationId: 1, // Default to first church ID
        fromYear: "",
        toYear: "",
        contribution: "",
      },
    ]);
  };

  const removeMinistryRecord = (index: number) => {
    const currentRecords = form.getValues("ministryRecords") || [];
    form.setValue(
      "ministryRecords",
      currentRecords.filter((_, i) => i !== index)
    );
  };

  const addAward = () => {
    const currentAwards = form.getValues("awardsRecognitions") || [];
    form.setValue("awardsRecognitions", [
      ...currentAwards,
      {
        year: "",
        description: "",
      },
    ]);
  };

  const removeAward = (index: number) => {
    const currentAwards = form.getValues("awardsRecognitions") || [];
    form.setValue(
      "awardsRecognitions",
      currentAwards.filter((_, i) => i !== index)
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

    // Update form data with ministry records and awards
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined) {
        (updateMinisterData as (field: keyof Minister, value: unknown) => void)(
          key as keyof Minister,
          value
        );
      }
    });

    // Scroll to top of page after successful form submission
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Continue to next step
    onNext();
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4 p-3 sm:space-y-8 sm:p-6">
      <Form {...form}>
        <form
          className="space-y-4 sm:space-y-8"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {/* Ministry Records Section */}
          <Card className="relative overflow-hidden">
            <CardHeader className="px-3 pt-2 pb-2 sm:px-6 sm:pt-6 sm:pb-4">
              <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                <span className="leading-tight">Ministry Records</span>
                <Button
                  className="flex items-center gap-2"
                  size="sm"
                  type="button"
                  variant="outline"
                  onClick={addMinistryRecord}
                >
                  <Plus className="h-4 w-4" />
                  Add Record
                </Button>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 px-3 pb-3 sm:space-y-6 sm:px-6 sm:pb-6">
              {ministryRecords.length === 0 ? (
                <div className="ext-current/50 py-8 text-center">
                  <p className="text-sm sm:text-base">
                    No ministry records added yet. Click &quot;Add Record&quot;
                    to add your church service history.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {ministryRecords.map((_, index) => (
                    <div
                      className="space-y-4 rounded-lg border p-4"
                      key={index}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-current/80 sm:text-base">
                          Ministry Record {index + 1}
                        </h4>
                        <Button
                          className="flex items-center gap-2 text-red-600 hover:text-red-700"
                          size="sm"
                          type="button"
                          variant="outline"
                          onClick={() => removeMinistryRecord(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name={`ministryRecords.${index}.churchLocationId`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium sm:text-base">
                                Church Location
                                <span className="text-destructive ml-1">*</span>
                              </FormLabel>
                              <FormControl>
                                <select
                                  {...field}
                                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:h-11 sm:text-base"
                                  value={field.value}
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                >
                                  <option value={1}>
                                    Main Church - Manila
                                  </option>
                                  <option value={2}>
                                    Branch Church - Quezon City
                                  </option>
                                  <option value={3}>
                                    Branch Church - Cebu
                                  </option>
                                  <option value={4}>
                                    Branch Church - Davao
                                  </option>
                                  <option value={5}>
                                    Mission Station - Baguio
                                  </option>
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`ministryRecords.${index}.fromYear`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium sm:text-base">
                                From Year
                                <span className="text-destructive ml-1">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  className="h-10 text-sm sm:h-11 sm:text-base"
                                  placeholder="e.g., 2020"
                                  type="number"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`ministryRecords.${index}.toYear`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium sm:text-base">
                                To Year
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  className="h-10 text-sm sm:h-11 sm:text-base"
                                  placeholder="e.g., 2024 (leave empty if current)"
                                  type="number"
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`ministryRecords.${index}.contribution`}
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel className="text-sm font-medium sm:text-base">
                                Contribution/Responsibilities
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  className="min-h-[100px] text-sm sm:text-base"
                                  placeholder="Describe your contributions and responsibilities at this church"
                                  value={field.value || ""}
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

          {/* Awards & Recognitions Section */}
          <Card className="relative overflow-hidden">
            <CardHeader className="px-3 pt-2 pb-2 sm:px-6 sm:pt-6 sm:pb-4">
              <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                <span className="leading-tight">Awards & Recognitions</span>
                <Button
                  className="flex items-center gap-2"
                  size="sm"
                  type="button"
                  variant="outline"
                  onClick={addAward}
                >
                  <Plus className="h-4 w-4" />
                  Add Award
                </Button>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 px-3 pb-3 sm:space-y-6 sm:px-6 sm:pb-6">
              {awardsRecognitions.length === 0 ? (
                <div className="ext-current/50 py-8 text-center">
                  <p className="text-sm sm:text-base">
                    No awards or recognitions added yet. Click &quot;Add
                    Award&quot; to add your achievements.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {awardsRecognitions.map((_, index) => (
                    <div
                      className="space-y-4 rounded-lg border p-4"
                      key={index}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-current/80 sm:text-base">
                          Award/Recognition {index + 1}
                        </h4>
                        <Button
                          className="flex items-center gap-2 text-red-600 hover:text-red-700"
                          size="sm"
                          type="button"
                          variant="outline"
                          onClick={() => removeAward(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name={`awardsRecognitions.${index}.year`}
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
                                  placeholder="e.g., 2023"
                                  type="number"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`awardsRecognitions.${index}.description`}
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel className="text-sm font-medium sm:text-base">
                                Award/Recognition Description
                                <span className="text-destructive ml-1">*</span>
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  className="min-h-[100px] text-sm sm:text-base"
                                  placeholder="Describe the award or recognition you received"
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

          {/* Navigation Buttons */}
          <div className="flex flex-col gap-3 border-t px-3 pt-4 sm:flex-row sm:justify-between sm:gap-4 sm:px-0 sm:pt-6">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="submit">Continue</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
