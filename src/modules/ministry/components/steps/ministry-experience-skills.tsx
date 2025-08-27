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

import { useMinistryRanks } from "../../../ministry-ranks/ministry-ranks-service";
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

const ministryExperienceSchema = z.object({
  id: z.number().int().optional(),
  ministryRankId: z
    .number()
    .int()
    .min(1, { message: "Ministry rank is required" }),
  description: z.string().optional().nullable(),
  fromYear: z.string().min(1, { message: "From year is required" }),
  toYear: z.string().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

const ministrySkillSchema = z.object({
  id: z.number().int().optional(),
  ministrySkillId: z
    .number()
    .int()
    .min(1, { message: "Ministry skill is required" }),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

const ministryExperienceSkillsSchema = z.object({
  ministryExperiences: z.array(ministryExperienceSchema).optional(),
  ministrySkills: z.array(ministrySkillSchema).optional(),
});

type FormValues = z.infer<typeof ministryExperienceSkillsSchema>;

export function MinistryExperienceSkills({
  formData,
  updateMinisterData,
  onNext,
  onBack,
}: StepProps) {
  const { data: ministryRanksResponse } = useMinistryRanks({
    page: 1,
    limit: 100,
  });
  const ministryRanks = ministryRanksResponse?.data || [];
  const form = useForm<FormValues>({
    resolver: zodResolver(ministryExperienceSkillsSchema),
    defaultValues: {
      ministryExperiences: formData.ministryExperiences || [],
      ministrySkills: formData.ministrySkills || [],
    },
    mode: "onBlur",
  });

  const { watch } = form;
  const ministryExperiences = watch("ministryExperiences") || [];
  const ministrySkills = watch("ministrySkills") || [];

  const addMinistryExperience = () => {
    const currentExperiences = form.getValues("ministryExperiences") || [];
    form.setValue("ministryExperiences", [
      ...currentExperiences,
      {
        ministryRankId: 1, // Default to first ministry rank ID
        description: "",
        fromYear: "",
        toYear: "",
      },
    ]);
  };

  const removeMinistryExperience = (index: number) => {
    const currentExperiences = form.getValues("ministryExperiences") || [];
    form.setValue(
      "ministryExperiences",
      currentExperiences.filter((_, i) => i !== index)
    );
  };

  const addMinistrySkill = () => {
    const currentSkills = form.getValues("ministrySkills") || [];
    form.setValue("ministrySkills", [
      ...currentSkills,
      {
        ministrySkillId: 1, // Default to first skill ID
      },
    ]);
  };

  const removeMinistrySkill = (index: number) => {
    const currentSkills = form.getValues("ministrySkills") || [];
    form.setValue(
      "ministrySkills",
      currentSkills.filter((_, i) => i !== index)
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

    // Update form data with ministry experience and skills
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
          {/* Ministry Experience Section */}
          <Card className="relative overflow-hidden">
            <CardHeader className="px-3 pt-2 pb-2 sm:px-6 sm:pt-6 sm:pb-4">
              <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                <span className="leading-tight">Ministry Experience</span>
                <Button
                  className="flex items-center gap-2"
                  size="sm"
                  type="button"
                  variant="outline"
                  onClick={addMinistryExperience}
                >
                  <Plus className="h-4 w-4" />
                  Add Experience
                </Button>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 px-3 pb-3 sm:space-y-6 sm:px-6 sm:pb-6">
              {ministryExperiences.length === 0 ? (
                <div className="ext-current/50 py-8 text-center">
                  <p className="text-sm sm:text-base">
                    No ministry experience added yet. Click &quot;Add
                    Experience&quot; to add your ministry background.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {ministryExperiences.map((_, index) => (
                    <div
                      className="space-y-4 rounded-lg border p-4"
                      key={index}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-current/50 sm:text-base">
                          Ministry Experience {index + 1}
                        </h4>
                        <Button
                          className="flex items-center gap-2 text-red-600 hover:text-red-700"
                          size="sm"
                          type="button"
                          variant="outline"
                          onClick={() => removeMinistryExperience(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name={`ministryExperiences.${index}.ministryRankId`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium sm:text-base">
                                Ministry Rank
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
                                  {ministryRanks.map(
                                    (rank: { id: number; name: string }) => (
                                      <option key={rank.id} value={rank.id}>
                                        {rank.name}
                                      </option>
                                    )
                                  )}
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`ministryExperiences.${index}.fromYear`}
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
                          name={`ministryExperiences.${index}.toYear`}
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
                          name={`ministryExperiences.${index}.description`}
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel className="text-sm font-medium sm:text-base">
                                Description
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  className="min-h-[100px] text-sm sm:text-base"
                                  placeholder="Describe your ministry experience and responsibilities"
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

          {/* Ministry Skills Section */}
          <Card className="relative overflow-hidden">
            <CardHeader className="px-3 pt-2 pb-2 sm:px-6 sm:pt-6 sm:pb-4">
              <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                <span className="leading-tight">Ministry Skills</span>
                <Button
                  className="flex items-center gap-2"
                  size="sm"
                  type="button"
                  variant="outline"
                  onClick={addMinistrySkill}
                >
                  <Plus className="h-4 w-4" />
                  Add Skill
                </Button>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 px-3 pb-3 sm:space-y-6 sm:px-6 sm:pb-6">
              {ministrySkills.length === 0 ? (
                <div className="ext-current/50 py-8 text-center">
                  <p className="text-sm sm:text-base">
                    No ministry skills added yet. Click &quot;Add Skill&quot; to
                    add your ministry capabilities.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {ministrySkills.map((_, index) => (
                    <div
                      className="space-y-4 rounded-lg border p-4"
                      key={index}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-current/80 sm:text-base">
                          Ministry Skill {index + 1}
                        </h4>
                        <Button
                          className="flex items-center gap-2 text-red-600 hover:text-red-700"
                          size="sm"
                          type="button"
                          variant="outline"
                          onClick={() => removeMinistrySkill(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:gap-6">
                        <FormField
                          control={form.control}
                          name={`ministrySkills.${index}.ministrySkillId`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium sm:text-base">
                                Ministry Skill
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
                                  <option value={1}>Preaching</option>
                                  <option value={2}>Teaching</option>
                                  <option value={3}>Pastoral Care</option>
                                  <option value={4}>Evangelism</option>
                                  <option value={5}>Music Ministry</option>
                                  <option value={6}>Youth Ministry</option>
                                  <option value={7}>
                                    Children&apos;s Ministry
                                  </option>
                                  <option value={8}>Administration</option>
                                  <option value={9}>Counseling</option>
                                  <option value={10}>Prayer Ministry</option>
                                </select>
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
