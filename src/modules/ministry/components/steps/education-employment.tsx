"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EducationalAttainmentSelect } from "@/components/ui/educational-attainment-select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";

import type { Minister, StepProps } from "../../ministry-validation";

const educationBackgroundSchema = z.object({
  id: z.number().int().optional(),
  schoolName: z.string().min(1, { message: "School name is required" }),
  educationalAttainment: z
    .string()
    .min(1, { message: "Educational attainment is required" }),
  dateGraduated: z.date().optional().nullable(),
  description: z.string().optional().nullable(),
  course: z.string().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

const employmentRecordSchema = z.object({
  id: z.number().int().optional(),
  companyName: z.string().min(1, { message: "Company name is required" }),
  fromYear: z.string().min(1, { message: "From year is required" }),
  toYear: z.string().optional().nullable(),
  position: z.string().min(1, { message: "Position is required" }),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

const educationEmploymentSchema = z.object({
  educationBackgrounds: z.array(educationBackgroundSchema).optional(),
  employmentRecords: z.array(employmentRecordSchema).optional(),
});

type FormValues = z.infer<typeof educationEmploymentSchema>;

export function EducationEmployment({
  formData,
  updateMinisterData,
  onNext,
  onBack,
}: StepProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(educationEmploymentSchema),
    defaultValues: {
      educationBackgrounds: formData.educationBackgrounds || [],
      employmentRecords: formData.employmentRecords || [],
    },
    mode: "onBlur",
  });

  const { watch } = form;
  const educationBackgrounds = watch("educationBackgrounds") || [];
  const employmentRecords = watch("employmentRecords") || [];

  const addEducation = () => {
    const currentEducation = form.getValues("educationBackgrounds") || [];
    form.setValue("educationBackgrounds", [
      ...currentEducation,
      {
        schoolName: "",
        educationalAttainment: "",
        dateGraduated: null,
        description: "",
        course: "",
      },
    ]);
  };

  const removeEducation = (index: number) => {
    const currentEducation = form.getValues("educationBackgrounds") || [];
    form.setValue(
      "educationBackgrounds",
      currentEducation.filter((_, i) => i !== index)
    );
  };

  const addEmployment = () => {
    const currentEmployment = form.getValues("employmentRecords") || [];
    form.setValue("employmentRecords", [
      ...currentEmployment,
      {
        companyName: "",
        fromYear: "",
        toYear: "",
        position: "",
      },
    ]);
  };

  const removeEmployment = (index: number) => {
    const currentEmployment = form.getValues("employmentRecords") || [];
    form.setValue(
      "employmentRecords",
      currentEmployment.filter((_, i) => i !== index)
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

    // Update form data with education and employment information
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
          {/* Education Background Section */}
          <Card className="relative overflow-hidden">
            <CardHeader className="px-3 pt-2 pb-2 sm:px-6 sm:pt-6 sm:pb-4">
              <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                <span className="leading-tight">Education Background</span>
                <Button
                  className="flex items-center gap-2"
                  size="sm"
                  type="button"
                  variant="outline"
                  onClick={addEducation}
                >
                  <Plus className="h-4 w-4" />
                  Add Education
                </Button>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 px-3 pb-3 sm:space-y-6 sm:px-6 sm:pb-6">
              {educationBackgrounds.length === 0 ? (
                <div className="ext-current/50 py-8 text-center">
                  <p className="text-sm sm:text-base">
                    No education records added yet. Click &quot;Add
                    Education&quot; to add your educational background.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {educationBackgrounds.map((_, index) => (
                    <div
                      className="space-y-4 rounded-lg border p-4"
                      key={index}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-current/80 sm:text-base">
                          Education {index + 1}
                        </h4>
                        <Button
                          className="flex items-center gap-2 text-red-600 hover:text-red-700"
                          size="sm"
                          type="button"
                          variant="outline"
                          onClick={() => removeEducation(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name={`educationBackgrounds.${index}.schoolName`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium sm:text-base">
                                School Name
                                <span className="text-destructive ml-1">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  className="h-10 text-sm sm:h-11 sm:text-base"
                                  placeholder="Enter school name"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`educationBackgrounds.${index}.educationalAttainment`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium sm:text-base">
                                Educational Attainment
                                <span className="text-destructive ml-1">*</span>
                              </FormLabel>
                              <FormControl>
                                <EducationalAttainmentSelect
                                  className="h-10 text-sm sm:h-11 sm:text-base"
                                  placeholder="Select educational level"
                                  value={field.value}
                                  onChange={field.onChange}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`educationBackgrounds.${index}.course`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium sm:text-base">
                                Course/Program
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  className="h-10 text-sm sm:h-11 sm:text-base"
                                  placeholder="Enter course or program name"
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`educationBackgrounds.${index}.dateGraduated`}
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="text-sm font-medium sm:text-base">
                                Date Graduated
                              </FormLabel>
                              <FormControl>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      className="h-10 w-full justify-start bg-transparent text-sm font-normal sm:h-11 sm:text-base"
                                      variant="outline"
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                                      <span className="truncate">
                                        {field.value
                                          ? format(
                                              new Date(field.value),
                                              "dd/MM/yyyy"
                                            )
                                          : "Select graduation date"}
                                      </span>
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    align="start"
                                    className="w-auto p-0"
                                  >
                                    <Calendar
                                      captionLayout="dropdown"
                                      mode="single"
                                      selected={
                                        field.value
                                          ? new Date(field.value)
                                          : undefined
                                      }
                                      onSelect={(date: Date | undefined) => {
                                        field.onChange(date || null);
                                      }}
                                    />
                                  </PopoverContent>
                                </Popover>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`educationBackgrounds.${index}.description`}
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel className="text-sm font-medium sm:text-base">
                                Description
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  className="min-h-[80px] text-sm sm:text-base"
                                  placeholder="Additional details about your education"
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

          {/* Employment Records Section */}
          <Card className="relative overflow-hidden">
            <CardHeader className="px-3 pt-2 pb-2 sm:px-6 sm:pt-6 sm:pb-4">
              <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                <span className="leading-tight">Employment History</span>
                <Button
                  className="flex items-center gap-2"
                  size="sm"
                  type="button"
                  variant="outline"
                  onClick={addEmployment}
                >
                  <Plus className="h-4 w-4" />
                  Add Employment
                </Button>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 px-3 pb-3 sm:space-y-6 sm:px-6 sm:pb-6">
              {employmentRecords.length === 0 ? (
                <div className="ext-current/50 py-8 text-center">
                  <p className="text-sm sm:text-base">
                    No employment records added yet. Click &quot;Add
                    Employment&quot; to add your work history.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {employmentRecords.map((_, index) => (
                    <div
                      className="space-y-4 rounded-lg border p-4"
                      key={index}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-current/80 sm:text-base">
                          Employment {index + 1}
                        </h4>
                        <Button
                          className="flex items-center gap-2 text-red-600 hover:text-red-700"
                          size="sm"
                          type="button"
                          variant="outline"
                          onClick={() => removeEmployment(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name={`employmentRecords.${index}.companyName`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium sm:text-base">
                                Company Name
                                <span className="text-destructive ml-1">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  className="h-10 text-sm sm:h-11 sm:text-base"
                                  placeholder="Enter company name"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`employmentRecords.${index}.position`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium sm:text-base">
                                Position
                                <span className="text-destructive ml-1">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  className="h-10 text-sm sm:h-11 sm:text-base"
                                  placeholder="Enter your position/job title"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`employmentRecords.${index}.fromYear`}
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
                          name={`employmentRecords.${index}.toYear`}
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
