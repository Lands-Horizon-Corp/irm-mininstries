"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin } from "lucide-react";
import type z from "zod";

import { Base64ImageUpload } from "@/components/ui/base64-image-upload";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MapPicker } from "@/components/ui/map-picker";
import { Textarea } from "@/components/ui/textarea";

import type { Church } from "./church-schema";
import { useCreateChurch, useUpdateChurch } from "./church-service";
import { churchSchema } from "./church-validation";

const MAX_DESCRIPTION_CHARS = 1000;
const MAX_ADDRESS_CHARS = 500;

interface ChurchFormProps {
  onClose?: () => void;
  isDialog?: boolean;
  mode?: "create" | "edit";
  initialData?: Church;
  onSuccess?: () => void;
}

export default function ChurchForm({
  onClose,
  isDialog = false,
  mode = "create",
  initialData,
  onSuccess,
}: ChurchFormProps) {
  const router = useRouter();
  const createChurch = useCreateChurch();
  const updateChurch = useUpdateChurch();

  const isEdit = mode === "edit" && initialData;

  const form = useForm<z.infer<typeof churchSchema>>({
    defaultValues: {
      imageUrl: initialData?.imageUrl || "",
      longitude: initialData?.longitude || "",
      latitude: initialData?.latitude || "",
      address: initialData?.address || "",
      email: initialData?.email || "",
      description: initialData?.description || "",
    },
    resolver: zodResolver(churchSchema),
  });

  const isPending = isEdit ? updateChurch.isPending : createChurch.isPending;
  const buttonText = isEdit
    ? isPending
      ? "Updating..."
      : "Update Church"
    : isPending
      ? "Adding Church..."
      : "Add Church";
  const formTitle = isEdit ? "Edit Church" : "Add New Church";
  const formDescription = isEdit
    ? "Update this church's information and location details."
    : "Add a new church location to expand our ministry network and connect with more communities.";

  async function onSubmit(values: z.infer<typeof churchSchema>) {
    if (isEdit) {
      updateChurch.mutate(
        {
          id: initialData.id,
          data: values,
        },
        {
          onSuccess: () => {
            form.reset();
            if (onSuccess) {
              onSuccess();
            } else if (isDialog && onClose) {
              onClose();
            } else {
              setTimeout(() => {
                router.push("/admin/churches");
              }, 1500);
            }
          },
        }
      );
    } else {
      createChurch.mutate(values, {
        onSuccess: () => {
          form.reset();
          if (onSuccess) {
            onSuccess();
          } else if (isDialog && onClose) {
            onClose();
          } else {
            setTimeout(() => {
              router.push("/admin/churches");
            }, 1500);
          }
        },
      });
    }
  }

  const FormContent = () => (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        {/* Basic Information */}
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm md:text-base">
                  Church Email<span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-background"
                    placeholder="church@example.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm md:text-base">
                  Church Image<span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Base64ImageUpload
                    placeholder="Upload Church Image"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Location Information */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <MapPin size={20} />
            <h3 className="text-lg font-semibold">Location Details</h3>
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className="text-sm md:text-base">
                  Church Address<span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="bg-background"
                    placeholder="Enter the full church address including street, city, state, and postal code..."
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <div className="text-muted-foreground absolute right-2 bottom-2 text-xs">
                  {field.value.length}/{MAX_ADDRESS_CHARS}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="latitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm md:text-base">
                    Church Location<span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <MapPicker
                      placeholder="Click to select church location"
                      title="Select Church Location"
                      value={
                        field.value && form.watch("longitude")
                          ? {
                              lat: parseFloat(field.value),
                              lng: parseFloat(form.watch("longitude")),
                            }
                          : null
                      }
                      variant="outline"
                      onChange={(location) => {
                        if (location) {
                          form.setValue("latitude", location.lat.toString());
                          form.setValue("longitude", location.lng.toString());
                        } else {
                          form.setValue("latitude", "");
                          form.setValue("longitude", "");
                        }
                      }}
                    />
                  </FormControl>
                  <p className="text-muted-foreground text-xs">
                    Click to select the church location on the map
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm md:text-base">
                        Latitude<span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          readOnly
                          className="bg-background"
                          placeholder="e.g., 40.7128"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm md:text-base">
                        Longitude<span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          readOnly
                          className="bg-background"
                          placeholder="e.g., -74.0060"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel className="text-sm md:text-base">
                Church Description<span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  className="bg-background"
                  placeholder="Describe the church, its mission, community, services, and what makes it unique..."
                  rows={5}
                  {...field}
                />
              </FormControl>
              <div className="text-muted-foreground absolute right-2 bottom-2 text-xs">
                {field.value.length}/{MAX_DESCRIPTION_CHARS}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {!isDialog && <Divider />}

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={isDialog ? onClose : () => router.back()}
          >
            Cancel
          </Button>
          <Button disabled={isPending} type="submit">
            {buttonText}
          </Button>
        </div>
      </form>
    </Form>
  );

  if (isDialog) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="mb-2 text-xl font-bold">{formTitle}</h2>
          <p className="text-muted-foreground text-sm">{formDescription}</p>
        </div>
        <FormContent />
      </div>
    );
  }

  return (
    <Card className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-bold">{formTitle}</h2>
        <p className="text-muted-foreground">{formDescription}</p>
      </div>
      <FormContent />
    </Card>
  );
}
