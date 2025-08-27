"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
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

const contactGovernmentInfoSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }).optional(),
  telephone: z.string().optional(),
  address: z.string().min(1, { message: "Address is required" }),
  presentAddress: z.string().min(1, { message: "Present address is required" }),
  permanentAddress: z.string().optional(),
  passportNumber: z.string().optional(),
  sssNumber: z.string().optional(),
  philhealth: z.string().optional(),
  tin: z.string().optional(),
});

type FormValues = z.infer<typeof contactGovernmentInfoSchema>;

export function ContactGovernmentInfo({
  formData,
  updateMinisterData,
  onNext,
  onBack,
}: StepProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(contactGovernmentInfoSchema),
    defaultValues: {
      email: formData.email || "",
      telephone: formData.telephone || "",
      address: formData.address || "",
      presentAddress: formData.presentAddress || "",
      permanentAddress: formData.permanentAddress || "",
      passportNumber: formData.passportNumber || "",
      sssNumber: formData.sssNumber || "",
      philhealth: formData.philhealth || "",
      tin: formData.tin || "",
    },
    mode: "onBlur",
  });

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

    // Update form data with contact and government info
    Object.keys(values).forEach((key) => {
      const value = values[key as keyof FormValues];
      if (value !== undefined) {
        updateMinisterData(key as keyof FormValues, value);
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
          {/* Contact Information Section */}
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
                  name="telephone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium sm:text-base">
                        Telephone Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-10 text-sm sm:h-11 sm:text-base"
                          placeholder="Enter telephone number"
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-sm font-medium sm:text-base">
                        Address
                        <span className="text-destructive ml-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-10 text-sm sm:h-11 sm:text-base"
                          placeholder="Enter complete address"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="presentAddress"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-sm font-medium sm:text-base">
                        Present Address
                        <span className="text-destructive ml-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-10 text-sm sm:h-11 sm:text-base"
                          placeholder="Enter present address"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="permanentAddress"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-sm font-medium sm:text-base">
                        Permanent Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-10 text-sm sm:h-11 sm:text-base"
                          placeholder="Enter permanent address (optional)"
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

          {/* Government IDs Section */}
          <Card className="relative overflow-hidden">
            <CardHeader className="px-3 pt-2 pb-2 sm:px-6 sm:pt-6 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <span className="leading-tight">Government IDs</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 px-3 pb-3 sm:space-y-6 sm:px-6 sm:pb-6">
              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="passportNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium sm:text-base">
                        Passport Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-10 text-sm sm:h-11 sm:text-base"
                          placeholder="Enter passport number"
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sssNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium sm:text-base">
                        SSS Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-10 text-sm sm:h-11 sm:text-base"
                          placeholder="Enter SSS number"
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="philhealth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium sm:text-base">
                        PhilHealth Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-10 text-sm sm:h-11 sm:text-base"
                          placeholder="Enter PhilHealth number"
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium sm:text-base">
                        TIN Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="h-10 text-sm sm:h-11 sm:text-base"
                          placeholder="Enter TIN number"
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
