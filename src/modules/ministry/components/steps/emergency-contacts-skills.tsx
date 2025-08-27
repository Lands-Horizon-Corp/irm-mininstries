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
import { RelationshipSelect } from "@/components/ui/relationship-select";
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

const emergencyContactSchema = z.object({
  id: z.number().int().optional(),
  name: z.string().min(1, { message: "Contact name is required" }),
  relationship: z.string().min(1, { message: "Relationship is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  contactNumber: z.string().min(1, { message: "Contact number is required" }),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

const emergencyContactsSkillsSchema = z.object({
  // Emergency Contacts
  emergencyContacts: z.array(emergencyContactSchema).optional(),

  // Skills & Interests
  skills: z.string().optional(),
  hobbies: z.string().optional(),
  sports: z.string().optional(),
  otherReligiousSecularTraining: z.string().optional(),
});

type FormValues = z.infer<typeof emergencyContactsSkillsSchema>;

export function EmergencyContactsSkills({
  formData,
  updateMinisterData,
  onNext,
  onBack,
}: StepProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(emergencyContactsSkillsSchema),
    defaultValues: {
      emergencyContacts: formData.emergencyContacts || [],
      skills: formData.skills || "",
      hobbies: formData.hobbies || "",
      sports: formData.sports || "",
      otherReligiousSecularTraining:
        formData.otherReligiousSecularTraining || "",
    },
    mode: "onBlur",
  });

  const { watch } = form;
  const emergencyContacts = watch("emergencyContacts") || [];

  const addEmergencyContact = () => {
    const currentContacts = form.getValues("emergencyContacts") || [];
    form.setValue("emergencyContacts", [
      ...currentContacts,
      {
        name: "",
        relationship: "",
        address: "",
        contactNumber: "",
      },
    ]);
  };

  const removeEmergencyContact = (index: number) => {
    const currentContacts = form.getValues("emergencyContacts") || [];
    form.setValue(
      "emergencyContacts",
      currentContacts.filter((_, i) => i !== index)
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

    // Update form data with emergency contacts and skills
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === "emergencyContacts") {
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
          {/* Emergency Contacts Section */}
          <Card className="relative overflow-hidden">
            <CardHeader className="px-3 pt-2 pb-2 sm:px-6 sm:pt-6 sm:pb-4">
              <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                <span className="leading-tight">Emergency Contacts</span>
                <Button
                  className="flex items-center gap-2"
                  size="sm"
                  type="button"
                  variant="outline"
                  onClick={addEmergencyContact}
                >
                  <Plus className="h-4 w-4" />
                  Add Contact
                </Button>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 px-3 pb-3 sm:space-y-6 sm:px-6 sm:pb-6">
              {emergencyContacts.length === 0 ? (
                <div className="py-8 text-center text-current/50">
                  <p className="text-sm sm:text-base">
                    No emergency contacts added yet. Click &quot;Add
                    Contact&quot; to add emergency contact information.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {emergencyContacts.map((_, index) => (
                    <div
                      className="space-y-4 rounded-lg border p-4"
                      key={index}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-current/80 sm:text-base">
                          Emergency Contact {index + 1}
                        </h4>
                        <Button
                          className="flex items-center gap-2 text-red-600 hover:text-red-700"
                          size="sm"
                          type="button"
                          variant="outline"
                          onClick={() => removeEmergencyContact(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name={`emergencyContacts.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium sm:text-base">
                                Full Name
                                <span className="text-destructive ml-1">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  className="h-10 text-sm sm:h-11 sm:text-base"
                                  placeholder="Enter contact's full name"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`emergencyContacts.${index}.relationship`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium sm:text-base">
                                Relationship
                                <span className="text-destructive ml-1">*</span>
                              </FormLabel>
                              <FormControl>
                                <RelationshipSelect
                                  className="h-10 text-sm sm:h-11 sm:text-base"
                                  placeholder="Select relationship"
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
                          name={`emergencyContacts.${index}.contactNumber`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium sm:text-base">
                                Contact Number
                                <span className="text-destructive ml-1">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  className="h-10 text-sm sm:h-11 sm:text-base"
                                  placeholder="Enter phone number"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`emergencyContacts.${index}.address`}
                          render={({ field }) => (
                            <FormItem className="md:col-span-1">
                              <FormLabel className="text-sm font-medium sm:text-base">
                                Address
                                <span className="text-destructive ml-1">*</span>
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  className="min-h-[80px] text-sm sm:text-base"
                                  placeholder="Enter complete address"
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

          {/* Skills & Interests Section */}
          <Card className="relative overflow-hidden">
            <CardHeader className="px-3 pt-2 pb-2 sm:px-6 sm:pt-6 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <span className="leading-tight">Skills & Interests</span>
                <span className="ext-current/50 text-sm">(Optional)</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 px-3 pb-3 sm:space-y-6 sm:px-6 sm:pb-6">
              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium sm:text-base">
                        Skills
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="min-h-[100px] text-sm sm:text-base"
                          placeholder="List your skills and abilities"
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hobbies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium sm:text-base">
                        Hobbies
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="min-h-[100px] text-sm sm:text-base"
                          placeholder="List your hobbies and interests"
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sports"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium sm:text-base">
                        Sports
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="min-h-[100px] text-sm sm:text-base"
                          placeholder="List sports you play or enjoy"
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="otherReligiousSecularTraining"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium sm:text-base">
                        Other Religious/Secular Training
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="min-h-[100px] text-sm sm:text-base"
                          placeholder="List any other training or certifications"
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
            <Button type="submit">Continue</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
