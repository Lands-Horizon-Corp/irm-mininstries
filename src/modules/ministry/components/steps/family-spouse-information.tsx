"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

const childSchema = z.object({
  id: z.number().int().optional(),
  name: z.string().min(1, { message: "Child name is required" }),
  placeOfBirth: z.string().min(1, { message: "Place of birth is required" }),
  dateOfBirth: z.date(),
  gender: z.enum(["male", "female"]),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

const familySpouseInformationSchema = z.object({
  // Family Information
  fatherName: z.string().min(1, { message: "Father's name is required" }),
  fatherProvince: z
    .string()
    .min(1, { message: "Father's province is required" }),
  fatherBirthday: z.date(),
  fatherOccupation: z
    .string()
    .min(1, { message: "Father's occupation is required" }),
  motherName: z.string().min(1, { message: "Mother's name is required" }),
  motherProvince: z
    .string()
    .min(1, { message: "Mother's province is required" }),
  motherBirthday: z.date(),
  motherOccupation: z
    .string()
    .min(1, { message: "Mother's occupation is required" }),

  // Spouse Information
  spouseName: z.string().optional(),
  spouseProvince: z.string().optional(),
  spouseBirthday: z.date().optional(),
  spouseOccupation: z.string().optional(),
  weddingDate: z.date().optional(),

  // Children Information
  children: z.array(childSchema).optional(),
});

type FormValues = z.infer<typeof familySpouseInformationSchema>;

export function FamilySpouseInformation({
  formData,
  updateMinisterData,
  onNext,
  onBack,
}: StepProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(familySpouseInformationSchema),
    defaultValues: {
      fatherName: formData.fatherName || "",
      fatherProvince: formData.fatherProvince || "",
      fatherBirthday: formData.fatherBirthday || new Date(),
      fatherOccupation: formData.fatherOccupation || "",
      motherName: formData.motherName || "",
      motherProvince: formData.motherProvince || "",
      motherBirthday: formData.motherBirthday || new Date(),
      motherOccupation: formData.motherOccupation || "",
      spouseName: formData.spouseName || "",
      spouseProvince: formData.spouseProvince || "",
      spouseBirthday: formData.spouseBirthday || undefined,
      spouseOccupation: formData.spouseOccupation || "",
      weddingDate: formData.weddingDate || undefined,
      children: formData.children || [],
    },
    mode: "onBlur",
  });

  const { watch } = form;
  const children = watch("children") || [];

  const addChild = () => {
    const currentChildren = form.getValues("children") || [];
    form.setValue("children", [
      ...currentChildren,
      {
        name: "",
        placeOfBirth: "",
        dateOfBirth: new Date(),
        gender: "male" as const,
      },
    ]);
  };

  const removeChild = (index: number) => {
    const currentChildren = form.getValues("children") || [];
    form.setValue(
      "children",
      currentChildren.filter((_, i) => i !== index)
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

    // Update form data with family and spouse information
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined) {
        // Handle different value types appropriately
        if (key === "children") {
          // For children array, we need to handle it specially since it's not in the basic updateMinisterData types
          // We'll cast the function to accept the children array type
          (
            updateMinisterData as (
              field: keyof Minister,
              value: unknown
            ) => void
          )(key as keyof Minister, value);
        } else if (
          typeof value === "string" ||
          typeof value === "boolean" ||
          value instanceof Date
        ) {
          updateMinisterData(key as keyof Minister, value);
        }
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
          {/* Family Information Section */}
          <Card className="relative overflow-hidden">
            <CardHeader className="px-3 pt-2 pb-2 sm:px-6 sm:pt-6 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <span className="leading-tight">Family Information</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 px-3 pb-3 sm:space-y-6 sm:px-6 sm:pb-6">
              {/* Father's Information */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-current/80 sm:text-base">
                  Father&apos;s Information
                </h4>
                <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="fatherName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium sm:text-base">
                          Father&apos;s Name
                          <span className="text-destructive ml-1">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="h-10 text-sm sm:h-11 sm:text-base"
                            placeholder="Enter father's full name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fatherProvince"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium sm:text-base">
                          Father&apos;s Province
                          <span className="text-destructive ml-1">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="h-10 text-sm sm:h-11 sm:text-base"
                            placeholder="Enter father's province"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fatherBirthday"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-sm font-medium sm:text-base">
                          Father&apos;s Birthday
                          <span className="text-destructive ml-1">*</span>
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
                                    : "Select father's birthday"}
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
                                  if (date) {
                                    const day = new Date(
                                      format(date, "yyyy-MM-dd")
                                    );
                                    field.onChange(day);
                                  }
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
                    name="fatherOccupation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium sm:text-base">
                          Father&apos;s Occupation
                          <span className="text-destructive ml-1">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="h-10 text-sm sm:h-11 sm:text-base"
                            placeholder="Enter father's occupation"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Mother's Information */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-current/80 sm:text-base">
                  Mother&apos;s Information
                </h4>
                <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="motherName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium sm:text-base">
                          Mother&apos;s Name
                          <span className="text-destructive ml-1">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="h-10 text-sm sm:h-11 sm:text-base"
                            placeholder="Enter mother's full name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="motherProvince"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium sm:text-base">
                          Mother&apos;s Province
                          <span className="text-destructive ml-1">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="h-10 text-sm sm:h-11 sm:text-base"
                            placeholder="Enter mother's province"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="motherBirthday"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-sm font-medium sm:text-base">
                          Mother&apos;s Birthday
                          <span className="text-destructive ml-1">*</span>
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
                                    : "Select mother's birthday"}
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
                                  if (date) {
                                    const day = new Date(
                                      format(date, "yyyy-MM-dd")
                                    );
                                    field.onChange(day);
                                  }
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
                    name="motherOccupation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium sm:text-base">
                          Mother&apos;s Occupation
                          <span className="text-destructive ml-1">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="h-10 text-sm sm:h-11 sm:text-base"
                            placeholder="Enter mother's occupation"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Spouse Information Section */}
          <Card className="relative overflow-hidden">
            <CardHeader className="px-3 pt-2 pb-2 sm:px-6 sm:pt-6 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <span className="leading-tight">Spouse Information</span>
                <span className="ext-current/50 text-sm">(Optional)</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 px-3 pb-3 sm:space-y-6 sm:px-6 sm:pb-6">
              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="spouseName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium sm:text-base">
                        Spouse&apos;s Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-10 text-sm sm:h-11 sm:text-base"
                          placeholder="Enter spouse's full name"
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="spouseProvince"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium sm:text-base">
                        Spouse&apos;s Province
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-10 text-sm sm:h-11 sm:text-base"
                          placeholder="Enter spouse's province"
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="spouseBirthday"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-sm font-medium sm:text-base">
                        Spouse&apos;s Birthday
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
                                  ? format(new Date(field.value), "dd/MM/yyyy")
                                  : "Select spouse's birthday"}
                              </span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent align="start" className="w-auto p-0">
                            <Calendar
                              captionLayout="dropdown"
                              mode="single"
                              selected={
                                field.value ? new Date(field.value) : undefined
                              }
                              onSelect={(date: Date | undefined) => {
                                if (date) {
                                  const day = new Date(
                                    format(date, "yyyy-MM-dd")
                                  );
                                  field.onChange(day);
                                }
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
                  name="spouseOccupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium sm:text-base">
                        Spouse&apos;s Occupation
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-10 text-sm sm:h-11 sm:text-base"
                          placeholder="Enter spouse's occupation"
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="weddingDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col md:col-span-2">
                      <FormLabel className="text-sm font-medium sm:text-base">
                        Wedding Date
                      </FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              className="h-10 w-full justify-start bg-transparent text-sm font-normal sm:h-11 sm:text-base md:w-1/2"
                              variant="outline"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                              <span className="truncate">
                                {field.value
                                  ? format(new Date(field.value), "dd/MM/yyyy")
                                  : "Select wedding date"}
                              </span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent align="start" className="w-auto p-0">
                            <Calendar
                              captionLayout="dropdown"
                              mode="single"
                              selected={
                                field.value ? new Date(field.value) : undefined
                              }
                              onSelect={(date: Date | undefined) => {
                                if (date) {
                                  const day = new Date(
                                    format(date, "yyyy-MM-dd")
                                  );
                                  field.onChange(day);
                                }
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Children Information Section */}
          <Card className="relative overflow-hidden">
            <CardHeader className="px-3 pt-2 pb-2 sm:px-6 sm:pt-6 sm:pb-4">
              <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                <span className="leading-tight">Children Information</span>
                <Button
                  className="flex items-center gap-2"
                  size="sm"
                  type="button"
                  variant="outline"
                  onClick={addChild}
                >
                  <Plus className="h-4 w-4" />
                  Add Child
                </Button>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 px-3 pb-3 sm:space-y-6 sm:px-6 sm:pb-6">
              {children.length === 0 ? (
                <div className="ext-current/50 py-8 text-center">
                  <p className="text-sm sm:text-base">
                    No children added yet. Click &quot;Add Child&quot; to add
                    child information.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {children.map((_, index) => (
                    <div
                      className="space-y-4 rounded-lg border p-4"
                      key={index}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-current/80 sm:text-base">
                          Child {index + 1}
                        </h4>
                        <Button
                          className="flex items-center gap-2 text-red-600 hover:text-red-700"
                          size="sm"
                          type="button"
                          variant="outline"
                          onClick={() => removeChild(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name={`children.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium sm:text-base">
                                Child&apos;s Name
                                <span className="text-destructive ml-1">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  className="h-10 text-sm sm:h-11 sm:text-base"
                                  placeholder="Enter child's name"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`children.${index}.placeOfBirth`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium sm:text-base">
                                Place of Birth
                                <span className="text-destructive ml-1">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  className="h-10 text-sm sm:h-11 sm:text-base"
                                  placeholder="Enter place of birth"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`children.${index}.dateOfBirth`}
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="text-sm font-medium sm:text-base">
                                Date of Birth
                                <span className="text-destructive ml-1">*</span>
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
                                          : "Select date of birth"}
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
                                        if (date) {
                                          const day = new Date(
                                            format(date, "yyyy-MM-dd")
                                          );
                                          field.onChange(day);
                                        }
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
                          name={`children.${index}.gender`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium sm:text-base">
                                Gender
                                <span className="text-destructive ml-1">*</span>
                              </FormLabel>
                              <FormControl>
                                <select
                                  {...field}
                                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:h-11 sm:text-base"
                                >
                                  <option value="male">Male</option>
                                  <option value="female">Female</option>
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
