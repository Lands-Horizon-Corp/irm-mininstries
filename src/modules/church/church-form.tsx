"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin } from "lucide-react";
import type z from "zod";

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
import { Textarea } from "@/components/ui/textarea";

import { useSubmitChurch } from "./church-service";
import { churchSchema } from "./church-validation";

const MAX_DESCRIPTION_CHARS = 1000;
const MAX_ADDRESS_CHARS = 500;

interface ChurchFormProps {
  onClose?: () => void;
  isDialog?: boolean;
}

export default function ChurchForm({
  onClose,
  isDialog = false,
}: ChurchFormProps) {
  const router = useRouter();
  const submitChurch = useSubmitChurch();

  const form = useForm<z.infer<typeof churchSchema>>({
    defaultValues: {
      imageUrl: "",
      longitude: "",
      latitude: "",
      address: "",
      email: "",
      description: "",
    },
    resolver: zodResolver(churchSchema),
  });

  const descriptionValue = form.watch("description");
  const addressValue = form.watch("address");

  async function onSubmit(values: z.infer<typeof churchSchema>) {
    submitChurch.mutate(values, {
      onSuccess: () => {
        form.reset();
        if (isDialog && onClose) {
          onClose();
        } else {
          setTimeout(() => {
            router.push("/admin/churches");
          }, 1500);
        }
      },
    });
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
                  Church Image URL<span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-background"
                    placeholder="https://example.com/church-image.jpg"
                    type="url"
                    {...field}
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
                  {addressValue.length}/{MAX_ADDRESS_CHARS}
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
                    Latitude<span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="bg-background"
                      placeholder="e.g., 40.7128"
                      {...field}
                    />
                  </FormControl>
                  <p className="text-muted-foreground text-xs">
                    Range: -90 to 90
                  </p>
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
                      className="bg-background"
                      placeholder="e.g., -74.0060"
                      {...field}
                    />
                  </FormControl>
                  <p className="text-muted-foreground text-xs">
                    Range: -180 to 180
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                {descriptionValue.length}/{MAX_DESCRIPTION_CHARS}
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
          <Button disabled={submitChurch.isPending} type="submit">
            {submitChurch.isPending ? "Adding Church..." : "Add Church"}
          </Button>
        </div>
      </form>
    </Form>
  );

  if (isDialog) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="mb-2 text-xl font-bold">Add New Church</h2>
          <p className="text-muted-foreground text-sm">
            Add a new church location to expand our ministry network and connect
            with more communities.
          </p>
        </div>
        <FormContent />
      </div>
    );
  }

  return (
    <Card className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-bold">Add New Church</h2>
        <p className="text-muted-foreground">
          Add a new church location to expand our ministry network and connect
          with more communities.
        </p>
      </div>
      <FormContent />
    </Card>
  );
}
