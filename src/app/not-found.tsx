"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ArrowLeft, Home, RefreshCw, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  const [countdown, setCountdown] = useState(10);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsRedirecting(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Separate useEffect for navigation to avoid setState during render
  useEffect(() => {
    if (countdown === 0 && isRedirecting) {
      const redirectTimer = setTimeout(() => {
        router.push("/");
      }, 100); // Small delay to ensure state updates are complete

      return () => clearTimeout(redirectTimer);
    }
  }, [countdown, isRedirecting, router]);

  const handleGoHome = () => {
    setIsRedirecting(true);
    router.push("/");
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <Container className="flex min-h-screen items-center justify-center py-12">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-12 text-center">
          {/* 404 Number */}
          <div className="mb-8">
            <h1 className="text-primary/20 text-9xl font-bold select-none">
              404
            </h1>
          </div>

          {/* Error Message */}
          <div className="mb-8 space-y-4">
            <div className="text-muted-foreground flex items-center justify-center gap-2">
              <Search className="h-6 w-6" />
              <h2 className="text-foreground text-2xl font-semibold">
                Page Not Found
              </h2>
            </div>
            <p className="text-muted-foreground mx-auto max-w-md">
              Sorry, we couldn&apos;t find the page you&apos;re looking for. It
              might have been moved, deleted, or the URL might be incorrect.
            </p>
          </div>

          {/* Countdown */}
          <div className="mb-8">
            <Card className="bg-background/50 border-muted">
              <CardContent className="p-4">
                <div className="flex items-center justify-center gap-2 text-sm">
                  {isRedirecting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span className="text-muted-foreground">
                        Redirecting to home...
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-muted-foreground">
                        Automatically redirecting to home in
                      </span>
                      <span className="text-primary font-mono text-lg font-bold">
                        {countdown}s
                      </span>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              className="flex items-center gap-2"
              disabled={isRedirecting}
              size="lg"
              onClick={handleGoHome}
            >
              <Home className="h-4 w-4" />
              Go to Home
            </Button>

            <Button
              className="flex items-center gap-2"
              disabled={isRedirecting}
              size="lg"
              variant="outline"
              onClick={handleGoBack}
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>

            <Button
              className="flex items-center gap-2"
              disabled={isRedirecting}
              size="lg"
              variant="ghost"
              onClick={handleRefresh}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Page
            </Button>
          </div>

          {/* Additional Help */}
          <div className="border-border mt-12 border-t pt-8">
            <p className="text-muted-foreground mb-4 text-sm">
              Need help? Here are some useful links:
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link
                className="text-primary hover:text-primary/80 underline underline-offset-4"
                href="/"
              >
                Home Page
              </Link>
              <Link
                className="text-primary hover:text-primary/80 underline underline-offset-4"
                href="/contact"
              >
                Contact Us
              </Link>
              <Link
                className="text-primary hover:text-primary/80 underline underline-offset-4"
                href="/faq"
              >
                FAQ
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
