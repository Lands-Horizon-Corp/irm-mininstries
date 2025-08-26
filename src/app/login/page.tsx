"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect to admin if already logged in
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "admin") {
      router.push("/admin");
    }
  }, [session, status, router]);

  const form = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: LoginFormData) {
    try {
      setIsLoading(true);

      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Login failed", {
          description: "Please check your credentials and try again.",
        });
      } else if (result?.ok) {
        toast.success("Login successful!", {
          description: "Welcome to the admin panel.",
        });

        // Redirect to admin dashboard
        window.location.href = "/admin";
      }
    } catch {
      toast.error("Login failed", {
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Show loading spinner while checking authentication
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="to-background/0 via-background/0 from-primary/50 absolute right-0 -z-10 h-screen w-full bg-radial-[ellipse_at_10%_100%] to-100%" />
        <Container>
          <div className="mx-auto max-w-md">
            <Card className="p-8">
              <div className="text-center">
                <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
                <p className="text-muted-foreground">
                  Checking authentication...
                </p>
              </div>
            </Card>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="to-background/0 via-background/0 from-primary/50 absolute right-0 -z-10 h-screen w-full bg-radial-[ellipse_at_10%_100%] to-100%" />

      <Container>
        <div className="mx-auto max-w-md">
          <Card className="p-8">
            <div className="mb-8 text-center">
              <h1 className="text-foreground mb-2 text-2xl font-bold">
                Admin Login
              </h1>
              <p className="text-muted-foreground">
                Sign in to access the IRM Ministries admin panel
              </p>
            </div>

            <Form {...form}>
              <form
                className="space-y-6"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Email Address<span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                          <Input
                            {...field}
                            className="bg-background border-input pl-10"
                            disabled={isLoading}
                            placeholder="admin@irmministries.org"
                            type="email"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Password<span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                          <Input
                            {...field}
                            className="bg-background border-input pr-10 pl-10"
                            disabled={isLoading}
                            placeholder="Enter your password"
                            type={showPassword ? "text" : "password"}
                          />
                          <button
                            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transform"
                            disabled={isLoading}
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button className="w-full" disabled={isLoading} type="submit">
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground text-sm">
                Forgot your password?{" "}
                <Link className="text-primary hover:underline" href="/contact">
                  Contact Support
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link
                className="text-muted-foreground hover:text-foreground text-sm"
                href="/"
              >
                ← Back to Home
              </Link>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}
