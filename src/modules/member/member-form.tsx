"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Download } from "lucide-react";
import { z } from "zod";

import { Base64ImageUpload } from "@/components/ui/base64-image-upload";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ChurchSelect } from "@/components/ui/church-select";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { MemberSuccessDialog } from "./components/member-success-dialog";
import { generateMemberPDF } from "./member-pdf";
import { useCreateMember, useMember, useUpdateMember } from "./member-service";

// Create a form-specific schema that properly handles form input types
const memberFormSchema = z.object({
  churchId: z.number().int().min(1, "Please select a church"),
  profilePicture: z.string().optional().nullable(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  middleName: z.string().optional().nullable(),
  gender: z.enum(["male", "female"]),
  birthdate: z.string().min(1, "Birthdate is required"),
  yearJoined: z
    .number()
    .int()
    .min(1900, "Invalid year")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
  ministryInvolvement: z.string().optional().nullable(),
  occupation: z.string().optional().nullable(),
  educationalAttainment: z.string().optional().nullable(),
  school: z.string().optional().nullable(),
  degree: z.string().optional().nullable(),
  mobileNumber: z.string().optional().nullable(),
  email: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) => !val || val === "" || z.string().email().safeParse(val).success,
      {
        message: "Invalid email format",
      }
    ),
  homeAddress: z.string().optional().nullable(),
  facebookLink: z.string().optional().nullable(),
  xLink: z.string().optional().nullable(),
  instagramLink: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  privacyConsent: z.boolean().refine((val) => val === true, {
    message: "You must accept the privacy declaration to proceed",
  }),
});

interface MemberFormProps {
  onClose?: () => void;
  isDialog?: boolean;
  memberId?: number; // For editing mode
}

export default function MemberForm({
  onClose,
  isDialog = false,
  memberId,
}: MemberFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const createMember = useCreateMember();
  const updateMember = useUpdateMember();

  // Get church ID from URL parameters
  const urlChurchId = searchParams.get("churchId");
  const churchIdFromUrl = urlChurchId ? parseInt(urlChurchId, 10) : null;

  // Fetch member data if editing
  const { data: memberData, isLoading: isMemberLoading } = useMember(
    memberId || 0
  );

  // State for success dialog
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [createdMemberId, setCreatedMemberId] = useState<number | null>(null);

  const isEditMode = !!memberId;

  const form = useForm<z.infer<typeof memberFormSchema>>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      churchId: churchIdFromUrl || 0,
      profilePicture: null,
      firstName: "",
      lastName: "",
      middleName: null,
      gender: "male",
      birthdate: "",
      yearJoined: new Date().getFullYear(),
      ministryInvolvement: null,
      occupation: null,
      educationalAttainment: null,
      school: null,
      degree: null,
      mobileNumber: null,
      email: null,
      homeAddress: null,
      facebookLink: null,
      xLink: null,
      instagramLink: null,
      notes: null,
      privacyConsent: false,
    },
    mode: "onChange",
  });

  // Update form when member data is loaded
  const member = memberData?.data;

  // Reset form with member data when editing
  useEffect(() => {
    if (isEditMode && member && !isMemberLoading) {
      form.reset({
        churchId: member.churchId || 0,
        profilePicture: member.profilePicture || null,
        firstName: member.firstName || "",
        lastName: member.lastName || "",
        middleName: member.middleName || null,
        gender: member.gender || "male",
        birthdate: member.birthdate || "",
        yearJoined: member.yearJoined || new Date().getFullYear(),
        ministryInvolvement: member.ministryInvolvement || null,
        occupation: member.occupation || null,
        educationalAttainment: member.educationalAttainment || null,
        school: member.school || null,
        degree: member.degree || null,
        mobileNumber: member.mobileNumber || null,
        email: member.email || null,
        homeAddress: member.homeAddress || null,
        facebookLink: member.facebookLink || null,
        xLink: member.xLink || null,
        instagramLink: member.instagramLink || null,
        notes: member.notes || null,
        privacyConsent: true, // In edit mode, assume consent was already given
      });
    }
  }, [isEditMode, member, isMemberLoading, form]);

  // Update church ID from URL parameter if available and not in edit mode
  useEffect(() => {
    if (
      !isEditMode &&
      churchIdFromUrl &&
      churchIdFromUrl !== form.getValues("churchId")
    ) {
      form.setValue("churchId", churchIdFromUrl);
    }
  }, [churchIdFromUrl, form, isEditMode]);

  const onSubmit = async (values: z.infer<typeof memberFormSchema>) => {
    // Remove privacyConsent from the data before sending to API
    const { privacyConsent: _privacyConsent, ...memberData } = values;

    if (isEditMode && memberId) {
      // Update existing member
      updateMember.mutate(
        { id: memberId, data: memberData },
        {
          onSuccess: () => {
            if (isDialog && onClose) {
              onClose();
            } else {
              setCreatedMemberId(memberId);
              setShowSuccessDialog(true);
            }
          },
        }
      );
    } else {
      // Create new member
      createMember.mutate(memberData, {
        onSuccess: (result) => {
          if (isDialog && onClose) {
            onClose();
          } else {
            setCreatedMemberId(result?.data?.id || null);
            setShowSuccessDialog(true);
          }
        },
      });
    }
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
      // Fetch church information if church is selected
      let churchData = null;
      if (formValues.churchId) {
        const response = await fetch(`/api/churches/${formValues.churchId}`);
        if (response.ok) {
          const result = await response.json();
          churchData = result.data;
        }
      }

      // Remove privacyConsent from form values before PDF generation
      const { privacyConsent: _privacyConsent, ...pdfData } = formValues;

      await generateMemberPDF({
        ...pdfData,
        churchName: churchData?.name,
        churchAddress: churchData?.address,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4 p-3 sm:space-y-8 sm:p-6">
      {/* Loading state when fetching member data */}
      {isEditMode && isMemberLoading && (
        <div className="flex h-32 items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground text-sm">
              Loading member data...
            </p>
          </div>
        </div>
      )}

      {/* Show form when not loading or not in edit mode */}
      {(!isEditMode || !isMemberLoading) && (
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
                {/* Church Selection */}
                <FormField
                  control={form.control}
                  name="churchId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium sm:text-base">
                        Church
                        <span className="text-destructive ml-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <ChurchSelect
                          className="h-10 text-sm sm:h-11 sm:text-base"
                          placeholder="Select a church"
                          value={field.value || null}
                          onValueChange={(value) =>
                            field.onChange(Number(value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                                    ? format(
                                        new Date(field.value),
                                        "dd/MM/yyyy"
                                      )
                                    : "Select birthdate"}
                                </span>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              align="start"
                              className="w-auto p-0"
                            >
                              <Calendar
                                captionLayout="dropdown"
                                fromYear={1900}
                                mode="single"
                                selected={
                                  field.value
                                    ? new Date(field.value)
                                    : undefined
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
                          <EducationalAttainmentSelect
                            className="h-10 text-sm sm:h-11 sm:text-base"
                            placeholder="Select educational attainment"
                            value={field.value || ""}
                            onChange={field.onChange}
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

            {/* Privacy Declaration Section - Only show in create mode */}
            {!isEditMode && (
              <Card className="relative overflow-hidden border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/20">
                <CardHeader className="px-3 pt-3 pb-2 sm:px-6 sm:pt-4 sm:pb-3">
                  <CardTitle className="flex items-center gap-2 text-base text-orange-800 sm:text-lg dark:text-orange-200">
                    <span className="leading-tight">Privacy Declaration</span>
                    <span className="text-destructive text-sm">*</span>
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 px-3 pb-3 sm:space-y-6 sm:px-6 sm:pb-6">
                  <div className="rounded-md border border-orange-200 bg-white/60 p-4 text-sm dark:border-orange-800 dark:bg-orange-950/30">
                    <div className="space-y-3 text-gray-700 dark:text-gray-300">
                      <p className="font-medium text-orange-800 dark:text-orange-200">
                        Data Protection Declaration:
                      </p>
                      <p>
                        I hereby declare that all information provided in this
                        application is accurate and complete to the best of my
                        knowledge. We will ensure your data is protected
                        according to our privacy policy and will only be used
                        for ministry registration purposes. Your personal
                        information will be handled with the utmost
                        confidentiality and security measures in place.
                      </p>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="privacyConsent"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="cursor-pointer text-sm font-medium sm:text-base">
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
                </CardContent>
              </Card>
            )}

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
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleExportPDF}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
              </div>
              <Button
                disabled={createMember.isPending || updateMember.isPending}
                type="submit"
              >
                {isEditMode
                  ? updateMember.isPending
                    ? "Updating Member..."
                    : "Update Member"
                  : createMember.isPending
                    ? "Adding Member..."
                    : "Add Member"}
              </Button>
            </div>
          </form>
        </Form>
      )}

      {/* Success Dialog */}
      <MemberSuccessDialog
        isOpen={showSuccessDialog}
        memberId={createdMemberId}
        memberName={`${form.getValues("firstName")} ${form.getValues("lastName")}`}
        mode={isEditMode ? "edit" : "create"}
        onClose={() => setShowSuccessDialog(false)}
      />
    </div>
  );
}
