"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { z } from "zod";

import { Base64ImageUpload } from "@/components/ui/base64-image-upload";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChurchSelect } from "@/components/ui/church-select";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import type { StepProps } from "../../ministry-validation";

const personalInformationSchema = z.object({
  churchId: z.number().min(1, "Please select a church"),
  biography: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  middleName: z.string().optional(),
  suffix: z.string().optional(),
  nickname: z.string().optional(),
  dateOfBirth: z.date(),
  placeOfBirth: z.string().min(1, { message: "Place of birth is required" }),
  gender: z.enum(["male", "female"]),
  heightFeet: z.string().min(1, { message: "Height is required" }),
  weightKg: z.string().min(1, { message: "Weight is required" }),
  civilStatus: z.enum([
    "single",
    "married",
    "widowed",
    "separated",
    "divorced",
  ]),
  imageUrl: z.string().optional(),
});

type FormValues = z.infer<typeof personalInformationSchema>;

export function PersonalInformation({
  formData,
  updateMinisterData,
  onNext,
  onBack,
}: StepProps) {
  const searchParams = useSearchParams();
  const urlChurchId = searchParams.get("churchId");

  // Parse the church ID from URL params if available
  const churchIdFromUrl = urlChurchId ? parseInt(urlChurchId, 10) : null;
  const initialChurchId = churchIdFromUrl || formData.churchId || 0;

  const form = useForm<FormValues>({
    resolver: zodResolver(personalInformationSchema),
    defaultValues: {
      churchId: initialChurchId,
      biography: formData.biography || "",
      firstName: formData.firstName || "",
      lastName: formData.lastName || "",
      middleName: formData.middleName || "",
      suffix: formData.suffix || "",
      nickname: formData.nickname || "",
      dateOfBirth: formData.dateOfBirth || new Date(),
      placeOfBirth: formData.placeOfBirth || "",
      gender: formData.gender || "male",
      heightFeet: formData.heightFeet || "",
      weightKg: formData.weightKg || "",
      civilStatus: formData.civilStatus || "single",
      imageUrl: formData.imageUrl || "",
    },
    mode: "onBlur",
  });

  // Update form when URL church ID changes
  useEffect(() => {
    if (churchIdFromUrl && churchIdFromUrl !== form.getValues("churchId")) {
      form.setValue("churchId", churchIdFromUrl);
    }
  }, [churchIdFromUrl, form]);

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

    // Update form data with personal information
    Object.keys(values).forEach((key) => {
      const value = values[key as keyof FormValues];
      if (value !== undefined) {
        // Handle different value types
        if (typeof value === "number") {
          updateMinisterData(key as keyof FormValues, value.toString());
        } else if (
          typeof value === "string" ||
          typeof value === "boolean" ||
          value instanceof Date
        ) {
          updateMinisterData(key as keyof FormValues, value);
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
          {/* Personal Information Section */}
          <Card className="relative overflow-hidden">
            <CardHeader className="px-3 pt-2 pb-2 sm:px-6 sm:pt-6 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <span className="leading-tight">Personal Information</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 px-3 pb-3 sm:space-y-6 sm:px-6 sm:pb-6">
              {/* Biography Field */}
              <FormField
                control={form.control}
                name="biography"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium sm:text-base">
                      Biography
                      <span className="ml-2 text-sm font-normal text-current/50">
                        (Tell us something about yourself)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="min-h-[100px] text-sm sm:text-base"
                        placeholder="Share your story, background, interests, or anything that helps us know you better..."
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Church Designation */}
              <FormField
                control={form.control}
                name="churchId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium sm:text-base">
                      Church Designation
                      <span className="text-destructive ml-1">*</span>
                      <span className="ml-2 text-sm font-normal text-current/50">
                        (Select the church you are currently assigned to)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <ChurchSelect
                        className="h-10 text-sm sm:h-11 sm:text-base"
                        placeholder="Select your designated church"
                        value={field.value || null}
                        onValueChange={(value) => field.onChange(value || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium sm:text-base">
                        First Name
                        <span className="text-destructive ml-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-10 text-sm sm:h-11 sm:text-base"
                          placeholder="Enter first name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium sm:text-base">
                        Last Name
                        <span className="text-destructive ml-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-10 text-sm sm:h-11 sm:text-base"
                          placeholder="Enter last name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="middleName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium sm:text-base">
                        Middle Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-10 text-sm sm:h-11 sm:text-base"
                          placeholder="Enter middle name (optional)"
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="suffix"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium sm:text-base">
                        Suffix
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-10 text-sm sm:h-11 sm:text-base"
                          placeholder="Enter suffix (optional)"
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nickname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium sm:text-base">
                        Nickname
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-10 text-sm sm:h-11 sm:text-base"
                          placeholder="Enter nickname (optional)"
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfBirth"
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
                                  ? format(new Date(field.value), "dd/MM/yyyy")
                                  : "Select date of birth"}
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
                  name="placeOfBirth"
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
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium sm:text-base">
                        Gender
                        <span className="text-destructive ml-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="h-10 text-sm sm:h-11 sm:text-base">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="heightFeet"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium sm:text-base">
                        Height (feet)
                        <span className="text-destructive ml-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-10 text-sm sm:h-11 sm:text-base"
                          placeholder="Enter height in feet"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="weightKg"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium sm:text-base">
                        Weight (kg)
                        <span className="text-destructive ml-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-10 text-sm sm:h-11 sm:text-base"
                          placeholder="Enter weight in kg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="civilStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium sm:text-base">
                        Civil Status
                        <span className="text-destructive ml-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="h-10 text-sm sm:h-11 sm:text-base">
                            <SelectValue placeholder="Select civil status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="single">Single</SelectItem>
                            <SelectItem value="married">Married</SelectItem>
                            <SelectItem value="widowed">Widowed</SelectItem>
                            <SelectItem value="separated">Separated</SelectItem>
                            <SelectItem value="divorced">Divorced</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-sm font-medium sm:text-base">
                        Profile Picture
                      </FormLabel>
                      <FormControl>
                        <Base64ImageUpload
                          placeholder="Upload Profile Picture"
                          value={field.value}
                          onChange={(base64) => field.onChange(base64)}
                        />
                      </FormControl>
                      <FormMessage />
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
            <Button className="" type="submit">
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
