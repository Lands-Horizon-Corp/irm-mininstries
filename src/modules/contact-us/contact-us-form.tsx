"use client";

import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2Icon, BuildingIcon, Mail, MapPin } from "lucide-react";
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

import { useSubmitContactForm } from "./contact-us-service";
import { contactUsFormSchema } from "./contact-us-validation";

const MAX_CHARS = 1000;

interface ContactFormProps {
  onClose?: () => void;
  isDialog?: boolean;
}

export default function ContactForm({
  onClose,
  isDialog = false,
}: ContactFormProps) {
  const router = useRouter();
  const submitContactForm = useSubmitContactForm();

  const form = useForm<z.infer<typeof contactUsFormSchema>>({
    defaultValues: {
      description: "",
      email: "",
      name: "",
      prayerRequest: "",
      repeatEmail: "",
      subject: "",
      supportEmail: "admin@irm-ministries.org",
    },
    resolver: zodResolver(contactUsFormSchema),
  });

  async function onSubmit(values: z.infer<typeof contactUsFormSchema>) {
    submitContactForm.mutate(values, {
      onSuccess: () => {
        if (isDialog && onClose) {
          onClose();
        } else {
          setTimeout(() => {
            router.push("/");
          }, 2000);
        }
      },
    });
  }

  const FormContent = () => (
    <Form {...form}>
      <form
        className="space-y-4 md:space-y-6"
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
                {field.value.length}/{MAX_CHARS}
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

        {!isDialog && <Divider className="hidden md:block" />}

        <div className={`flex ${isDialog ? "justify-end space-x-4" : ""}`}>
          {isDialog && (
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button
            className={
              isDialog ? "" : "float-none w-full md:float-right md:w-auto"
            }
            disabled={submitContactForm.isPending}
            type="submit"
          >
            {submitContactForm.isPending
              ? "Sending..."
              : isDialog
                ? "Send Message"
                : "Send Message →"}
          </Button>
        </div>
      </form>
    </Form>
  );

  if (isDialog) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="mb-2 text-xl font-bold">Send Message</h2>
          <p className="text-muted-foreground text-sm">
            Send a message or prayer request to our ministry team.
          </p>
        </div>
        <FormContent />
      </div>
    );
  }

  return (
    <Card className="block grow-0 px-6 py-10 pt-15 md:flex md:max-w-[66.67%] md:basis-[66.67%] md:flex-row">
      <div className="w-full md:grow-1">
        <FormContent />
      </div>
      <Divider className="hidden md:block" orientation="vertical" />
      <Divider className="my-8 block md:hidden" />
      <div className="mt-8 flex flex-col justify-center md:mt-0 md:basis-[33.33%] md:pl-10">
        <div className="my-4 flex">
          <Link href="mailto:admin@irm-ministries.org">
            <div className="font-noto-sans flex flex-row items-center">
              <Mail className="text-muted-foreground mr-4" size={24} />
              <div className="font-noto-sansmb-3">
                <p className="text-base font-semibold">E-Mail</p>
                <p className="text-muted-foreground text-sm font-light">
                  admin@irm-ministries.org
                </p>
                <p className="text-muted-foreground text-sm font-light">
                  <strong> IRM Office : </strong>
                  <span className="text-white">irm_ec@yahoo.com</span>
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
                  351 Tandang Sora Avenue Pasong Tamo 1107,
                  <br />
                  Quezon City,
                  <br />
                  Philippines
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </Card>
  );
}
