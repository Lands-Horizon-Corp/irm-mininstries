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

const seminarConferenceSchema = z.object({
  id: z.number().int().optional(),
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional().nullable(),
  place: z.string().optional().nullable(),
  year: z.string().min(1, { message: "Year is required" }),
  numberOfHours: z
    .number()
    .int()
    .min(1, { message: "Number of hours must be at least 1" }),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

const seminarsConferencesSchema = z.object({
  seminarsConferences: z.array(seminarConferenceSchema).optional(),
});

type FormValues = z.infer<typeof seminarsConferencesSchema>;

export function SeminarsConferences({
  formData,
  updateMinisterData,
  onNext,
  onBack,
}: StepProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(seminarsConferencesSchema),
    defaultValues: {
      seminarsConferences: formData.seminarsConferences || [],
    },
    mode: "onBlur",
  });

  const { watch } = form;
  const seminarsConferences = watch("seminarsConferences") || [];

  const addSeminarConference = () => {
    const currentSeminars = form.getValues("seminarsConferences") || [];
    form.setValue("seminarsConferences", [
      ...currentSeminars,
      {
        title: "",
        description: "",
        place: "",
        year: "",
        numberOfHours: 1,
      },
    ]);
  };

  const removeSeminarConference = (index: number) => {
    const currentSeminars = form.getValues("seminarsConferences") || [];
    form.setValue(
      "seminarsConferences",
      currentSeminars.filter((_, i) => i !== index)
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

    // Update form data with seminars and conferences
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
          {/* Seminars & Conferences Section */}
          <Card className="relative overflow-hidden">
            <CardHeader className="px-3 pt-2 pb-2 sm:px-6 sm:pt-6 sm:pb-4">
              <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                <span className="leading-tight">
                  Seminars & Conferences
                  <br />
                  <span className="text-xs">(LOCAL OR ABROAD)</span>
                </span>
                <Button
                  className="flex items-center gap-2"
                  size="sm"
                  type="button"
                  variant="outline"
                  onClick={addSeminarConference}
                >
                  <Plus className="h-4 w-4" />
                  Add Event
                </Button>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 px-3 pb-3 sm:space-y-6 sm:px-6 sm:pb-6">
              {seminarsConferences.length === 0 ? (
                <div className="ext-current/50 py-8 text-center">
                  <p className="text-sm sm:text-base">
                    No seminars or conferences added yet. Click &quot;Add
                    Event&quot; to add educational events you&apos;ve attended.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {seminarsConferences.map((_, index) => (
                    <div
                      className="space-y-4 rounded-lg border p-4"
                      key={index}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-current/80 sm:text-base">
                          Event {index + 1}
                        </h4>
                        <Button
                          className="flex items-center gap-2 text-red-600 hover:text-red-700"
                          size="sm"
                          type="button"
                          variant="outline"
                          onClick={() => removeSeminarConference(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name={`seminarsConferences.${index}.title`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium sm:text-base">
                                Event Title
                                <span className="text-destructive ml-1">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  className="h-10 text-sm sm:h-11 sm:text-base"
                                  placeholder="Enter seminar or conference title"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`seminarsConferences.${index}.place`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium sm:text-base">
                                Location/Place
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  className="h-10 text-sm sm:h-11 sm:text-base"
                                  placeholder="Enter event location"
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`seminarsConferences.${index}.year`}
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
                                  placeholder="e.g., 2024"
                                  type="number"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`seminarsConferences.${index}.numberOfHours`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium sm:text-base">
                                Number of Hours
                                <span className="text-destructive ml-1">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  className="h-10 text-sm sm:h-11 sm:text-base"
                                  min={1}
                                  placeholder="Enter number of hours"
                                  type="number"
                                  value={field.value || ""}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    field.onChange(value ? Number(value) : "");
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`seminarsConferences.${index}.description`}
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel className="text-sm font-medium sm:text-base">
                                Description
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  className="min-h-[100px] text-sm sm:text-base"
                                  placeholder="Describe what you learned or the topics covered"
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
