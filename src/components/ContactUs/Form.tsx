"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, MapPin } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Card } from "../ui/card";
import { Divider } from "../ui/divider";
import { Textarea } from "../ui/textarea";

const formSchema = z
  .object({
    description: z.string().min(10, {
      message: "Message must be at least 10 characters.",
    }),
    email: z.string().email("Email is not valid."),
    name: z.string().min(2, {
      message: "First and last name must be at least 2 characters.",
    }),
    prayerRequest: z.string().optional(),
    repeatEmail: z.string().email("Email is not valid."),
    subject: z.string().min(3, {
      message: "Subject is required.",
    }),
    supportEmail: z.string().email("Support email is not valid."),
  })
  .superRefine((data, ctx) => {
    if (data.email !== data.repeatEmail) {
      ctx.addIssue({
        code: "custom",
        message: "Emails do not match",
        path: ["repeatEmail"],
      });
    }
  });
export type ContactFormData = z.infer<typeof formSchema>;
const MAX_CHARS = 1000;

export default function ContactForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      description: "",
      email: "",
      name: "",
      prayerRequest: "",
      repeatEmail: "",
      subject: "",
      supportEmail: "info@irmministries.org",
    },
    resolver: zodResolver(formSchema),
  });

  const descriptionValue = form.watch("description");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);

      const response = await fetch("/api/submit-contact", {
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to submit form");
      }

      toast.success("Message sent successfully!", {
        description: "Our ministry team will get back to you soon. God bless!",
      });

      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      toast.error("Failed to send message", {
        description:
          error instanceof Error ? error.message : "Please try again later",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="block grow-0 px-6 py-10 pt-15 md:flex md:max-w-[66.67%] md:basis-[66.67%] md:flex-row">
      <div className="w-full md:grow-1">
        <Form {...form}>
          <form
            className="space-y-4 md:space-y-8"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm md:text-base">
                    Your Name<span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="bg-background"
                      placeholder="First and Last Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm md:text-base">
                    Subject<span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="bg-background"
                      placeholder="Prayer Request, Ministry Question, etc."
                      {...field}
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
                  <FormLabel className="text-sm md:text-base">
                    Your Email Address
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="bg-background"
                      placeholder="example@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="repeatEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm md:text-base">
                    Confirm Your Email Address
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="bg-background"
                      placeholder="example@email.com"
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
                    Your Message<span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="bg-background"
                      placeholder="Share your ministry questions, testimonies, or how we can support you..."
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
            <FormField
              control={form.control}
              name="prayerRequest"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm md:text-base">
                    Prayer Request (Optional)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="bg-background"
                      placeholder="Share any prayer requests you would like our ministry team to pray for..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Divider className="hidden md:block" />
            <Button
              className="float-none w-full md:float-right md:w-auto"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Sending..." : "Send Message →"}
            </Button>
          </form>
        </Form>
      </div>
      <Divider className="hidden md:block" orientation="vertical" />
      <Divider className="my-8 block md:hidden" />
      <div className="mt-8 flex flex-col justify-center md:mt-0 md:basis-[33.33%] md:pl-10">
        <div className="my-4 flex">
          <Link href="mailto:info@irmministries.org">
            <div className="font-noto-sans flex flex-row items-center">
              <Mail className="text-muted-foreground mr-4" size={24} />
              <div className="font-noto-sansmb-3">
                <p className="text-base font-semibold">E-Mail</p>
                <p className="text-muted-foreground text-sm font-light">
                  info@irmministries.org
                </p>
              </div>
            </div>
          </Link>
        </div>
        <div className="my-4 flex">
          <Link href="#">
            <div className="font-noto-sans flex flex-row items-center">
              <MapPin className="text-muted-foreground mr-4" size={24} />
              <div className="font-noto-sansmb-3">
                <p className="text-base font-semibold">Ministry Location</p>
                <p className="text-muted-foreground text-sm font-light">
                  International Revival Ministries
                  <br />
                  Serving communities worldwide
                  <br />
                  Contact us for local services
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </Card>
  );
}
