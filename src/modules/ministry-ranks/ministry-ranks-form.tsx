"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
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

import { useSubmitMinistryRank } from "./ministry-ranks-service";
import { ministryRanksSchema } from "./ministry-ranks-validation";

const MAX_CHARS = 500;

export default function MinistryRanksForm() {
  const router = useRouter();
  const submitMinistryRank = useSubmitMinistryRank();

  const form = useForm<z.infer<typeof ministryRanksSchema>>({
    defaultValues: {
      name: "",
      description: "",
    },
    resolver: zodResolver(ministryRanksSchema),
  });

  const descriptionValue = form.watch("description");

  async function onSubmit(values: z.infer<typeof ministryRanksSchema>) {
    submitMinistryRank.mutate(values, {
      onSuccess: () => {
        form.reset();
        setTimeout(() => {
          router.push("/admin/ministry-ranks");
        }, 1500);
      },
    });
  }

  return (
    <Card className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-bold">Add Ministry Rank</h2>
        <p className="text-muted-foreground">
          Add a new ministry rank to help organize leadership hierarchy and
          ministry positions within the church.
        </p>
      </div>

      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm md:text-base">
                  Rank Name<span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-background"
                    placeholder="e.g., Pastor, Elder, Deacon, Ministry Leader"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className="text-sm md:text-base">
                  Description<span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="bg-background"
                    placeholder="Describe this ministry rank, its responsibilities, and role within the church hierarchy..."
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <div className="text-muted-foreground absolute right-2 bottom-2 text-xs">
                  {descriptionValue.length}/{MAX_CHARS}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Divider />

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button disabled={submitMinistryRank.isPending} type="submit">
              {submitMinistryRank.isPending ? "Adding..." : "Add Rank"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
