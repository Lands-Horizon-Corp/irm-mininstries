"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Download } from "lucide-react";
import { z } from "zod";

import { Base64ImageUpload } from "@/components/ui/base64-image-upload";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { generateMemberPDF } from "./member-pdf";
import { useCreateMember } from "./member-service";

const memberSchema = z.object({
  profilePicture: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  middleName: z.string().optional(),
  gender: z.enum(["male", "female"]),
  birthdate: z.string().min(1, "Birthdate is required"),
  yearJoined: z.number().min(1900, "Year joined must be at least 1900"),
  ministryInvolvement: z.string().optional(),
  occupation: z.string().optional(),
  educationalAttainment: z.string().optional(),
  school: z.string().optional(),
  degree: z.string().optional(),
  mobileNumber: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
  homeAddress: z.string().optional(),
  facebookLink: z.string().optional(),
  xLink: z.string().optional(),
  instagramLink: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

interface MemberFormProps {
  onClose?: () => void;
  isDialog?: boolean;
}

export default function MemberForm({
  onClose,
  isDialog = false,
}: MemberFormProps) {
  const router = useRouter();
  const createMember = useCreateMember();

  const form = useForm<z.infer<typeof memberSchema>>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      profilePicture: "",
      firstName: "",
      lastName: "",
      middleName: "",
      gender: "male",
      birthdate: "",
      yearJoined: new Date().getFullYear(),
      ministryInvolvement: "",
      occupation: "",
      educationalAttainment: "",
      school: "",
      degree: "",
      mobileNumber: "",
      email: "",
      homeAddress: "",
      facebookLink: "",
      xLink: "",
      instagramLink: "",
      notes: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof memberSchema>) => {
    createMember.mutate(values, {
      onSuccess: () => {
        if (isDialog && onClose) {
          onClose();
        } else {
          setTimeout(() => {
            router.push("/admin/members");
          }, 2000);
        }
      },
    });
  };

  const handleExportPDF = async () => {
    const formValues = form.getValues();

    // Validate required fields for PDF generation
    if (!formValues.firstName || !formValues.lastName) {
      form.setError("firstName", {
        message: "First name is required for PDF export",
      });
      form.setError("lastName", {
        message: "Last name is required for PDF export",
      });
      return;
    }

    try {
      await generateMemberPDF({
        ...formValues,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    }
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
              {/* Profile Picture */}
              <FormField
                control={form.control}
                name="profilePicture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium sm:text-base">
                      Profile Picture
                    </FormLabel>
                    <FormControl>
                      <Base64ImageUpload
                        placeholder="Upload Profile Picture"
                        value={field.value || ""}
                        onChange={(base64) => field.onChange(base64 || "")}
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
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium sm:text-base">
                        Gender
                        <span className="text-destructive ml-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value || ""}
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
                  name="birthdate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-sm font-medium sm:text-base">
                        Birthdate
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
                                  : "Select birthdate"}
                              </span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent align="start" className="w-auto p-0">
                            <Calendar
                              captionLayout="dropdown"
                              fromYear={1900}
                              mode="single"
                              selected={
                                field.value ? new Date(field.value) : undefined
                              }
                              toYear={new Date().getFullYear()}
                              onSelect={(date: Date | undefined) => {
                                if (date) {
                                  const formattedDate = format(
                                    date,
                                    "yyyy-MM-dd"
                                  );
                                  field.onChange(formattedDate);
                                } else {
                                  field.onChange("");
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
                  name="yearJoined"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium sm:text-base">
                        Year Joined
                        <span className="text-destructive ml-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-10 text-sm sm:h-11 sm:text-base"
                          max={new Date().getFullYear()}
                          min="1900"
                          placeholder="Enter year joined"
                          type="number"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Ministry & Work Information */}
          <Card className="relative overflow-hidden">
            <CardHeader className="px-3 pt-2 pb-2 sm:px-6 sm:pt-6 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <span className="leading-tight">
                  Ministry & Work Information
                </span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 px-3 pb-3 sm:space-y-6 sm:px-6 sm:pb-6">
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                <FormField
                  control={form.control}
                  name="ministryInvolvement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium sm:text-base">
                        Ministry Involvement
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="min-h-[100px] text-sm sm:text-base"
                          placeholder="Describe your ministry involvement and activities..."
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="occupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium sm:text-base">
                        Occupation
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-10 text-sm sm:h-11 sm:text-base"
                          placeholder="Enter your occupation"
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Educational Information */}
          <Card className="relative overflow-hidden">
            <CardHeader className="px-3 pt-2 pb-2 sm:px-6 sm:pt-6 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <span className="leading-tight">Educational Information</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 px-3 pb-3 sm:space-y-6 sm:px-6 sm:pb-6">
              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="educationalAttainment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium sm:text-base">
                        Highest Educational Attainment
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-10 text-sm sm:h-11 sm:text-base"
                          placeholder="e.g., Bachelor's Degree, Master's Degree"
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="school"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium sm:text-base">
                        School/University
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-10 text-sm sm:h-11 sm:text-base"
                          placeholder="Enter school or university name"
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="degree"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-sm font-medium sm:text-base">
                        Degree/Course
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-10 text-sm sm:h-11 sm:text-base"
                          placeholder="Enter degree or course name"
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="relative overflow-hidden">
            <CardHeader className="px-3 pt-2 pb-2 sm:px-6 sm:pt-6 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <span className="leading-tight">Contact Information</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 px-3 pb-3 sm:space-y-6 sm:px-6 sm:pb-6">
              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="mobileNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium sm:text-base">
                        Mobile Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-10 text-sm sm:h-11 sm:text-base"
                          placeholder="Enter mobile number"
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium sm:text-base">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-10 text-sm sm:h-11 sm:text-base"
                          placeholder="Enter email address"
                          type="email"
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="homeAddress"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-sm font-medium sm:text-base">
                        Home Address
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="min-h-[80px] text-sm sm:text-base"
                          placeholder="Enter complete home address"
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Social Media Links */}
          <Card className="relative overflow-hidden">
            <CardHeader className="px-3 pt-2 pb-2 sm:px-6 sm:pt-6 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <span className="leading-tight">Social Media Links</span>
                <span className="text-sm text-current/50">(Optional)</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 px-3 pb-3 sm:space-y-6 sm:px-6 sm:pb-6">
              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="facebookLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium sm:text-base">
                        Facebook
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-10 text-sm sm:h-11 sm:text-base"
                          placeholder="Facebook URL or username"
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="xLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium sm:text-base">
                        X (Twitter)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-10 text-sm sm:h-11 sm:text-base"
                          placeholder="X URL or username"
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="instagramLink"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-sm font-medium sm:text-base">
                        Instagram
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-10 text-sm sm:h-11 sm:text-base"
                          placeholder="Instagram URL or username"
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card className="relative overflow-hidden">
            <CardHeader className="px-3 pt-2 pb-2 sm:px-6 sm:pt-6 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <span className="leading-tight">Additional Information</span>
                <span className="text-sm text-current/50">(Optional)</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 px-3 pb-3 sm:space-y-6 sm:px-6 sm:pb-6">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium sm:text-base">
                      Notes
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="min-h-[100px] text-sm sm:text-base"
                        placeholder="Any additional notes or information about the member..."
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex flex-col gap-3 border-t px-3 pt-4 sm:flex-row sm:justify-between sm:gap-4 sm:px-0 sm:pt-6">
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="button" variant="outline" onClick={handleExportPDF}>
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </div>
            <Button disabled={createMember.isPending} type="submit">
              {createMember.isPending ? "Adding Member..." : "Add Member"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
