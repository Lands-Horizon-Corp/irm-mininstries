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

import type { MinistryRank } from "./ministry-ranks-schema";
import {
  useCreateMinistryRank,
  useUpdateMinistryRank,
} from "./ministry-ranks-service";
import { ministryRanksSchema } from "./ministry-ranks-validation";

const MAX_CHARS = 500;

interface MinistryRanksFormProps {
  onClose?: () => void;
  isDialog?: boolean;
  mode?: "create" | "edit";
  initialData?: MinistryRank;
  onSuccess?: () => void;
}

export default function MinistryRanksForm({
  onClose,
  isDialog = false,
  mode = "create",
  initialData,
  onSuccess,
}: MinistryRanksFormProps) {
  const router = useRouter();
  const createMinistryRank = useCreateMinistryRank();
  const updateMinistryRank = useUpdateMinistryRank();

  const isEdit = mode === "edit" && initialData;

  const form = useForm<z.infer<typeof ministryRanksSchema>>({
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
    },
    resolver: zodResolver(ministryRanksSchema),
  });

  async function onSubmit(values: z.infer<typeof ministryRanksSchema>) {
    if (isEdit) {
      updateMinistryRank.mutate(
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
                router.push("/admin/ministry-ranks");
              }, 1500);
            }
          },
        }
      );
    } else {
      createMinistryRank.mutate(values, {
        onSuccess: () => {
          form.reset();
          if (onSuccess) {
            onSuccess();
          } else if (isDialog && onClose) {
            onClose();
          } else {
            setTimeout(() => {
              router.push("/admin/ministry-ranks");
            }, 1500);
          }
        },
      });
    }
  }

  const isPending = isEdit
    ? updateMinistryRank.isPending
    : createMinistryRank.isPending;
  const buttonText = isEdit
    ? isPending
      ? "Updating..."
      : "Update Rank"
    : isPending
      ? "Adding..."
      : "Add Rank";
  const formTitle = isEdit ? "Edit Ministry Rank" : "Add Ministry Rank";
  const formDescription = isEdit
    ? "Update this ministry rank's information."
    : "Add a new ministry rank to help organize leadership hierarchy and ministry positions within the church.";

  const FormContent = () => (
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
                Description
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
                {(field.value || "").length}/{MAX_CHARS}
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
    <Card className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-bold">{formTitle}</h2>
        <p className="text-muted-foreground">{formDescription}</p>
      </div>
      <FormContent />
    </Card>
  );
}
