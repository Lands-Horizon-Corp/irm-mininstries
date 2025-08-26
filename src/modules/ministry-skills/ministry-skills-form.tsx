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

import { useSubmitMinistrySkill } from "./ministry-skills-service";
import { ministrySkillsSchema } from "./ministry-skills-validation";

const MAX_CHARS = 500;

export default function MinistrySkillsForm() {
  const router = useRouter();
  const submitMinistrySkill = useSubmitMinistrySkill();

  const form = useForm<z.infer<typeof ministrySkillsSchema>>({
    defaultValues: {
      name: "",
      description: "",
    },
    resolver: zodResolver(ministrySkillsSchema),
  });

  const descriptionValue = form.watch("description");

  async function onSubmit(values: z.infer<typeof ministrySkillsSchema>) {
    submitMinistrySkill.mutate(values, {
      onSuccess: () => {
        form.reset();
        setTimeout(() => {
          router.push("/admin/ministry-skills");
        }, 1500);
      },
    });
  }

  return (
    <Card className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-bold">Add Ministry Skill</h2>
        <p className="text-muted-foreground">
          Add a new ministry skill to help categorize and organize ministry
          talents and abilities.
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
                  Skill Name<span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-background"
                    placeholder="e.g., Youth Ministry, Music Leadership, Teaching"
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
                    placeholder="Describe this ministry skill and its purpose in ministry work..."
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
            <Button disabled={submitMinistrySkill.isPending} type="submit">
              {submitMinistrySkill.isPending ? "Adding..." : "Add Skill"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
