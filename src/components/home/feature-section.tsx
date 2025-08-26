import Link from "next/link";

import { CheckCircle, FileText, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function FeatureSection() {
  return (
    <section className="bg-backgroun flex items-center py-8 md:py-16">
      <div className="to-background/0 via-background/0 from-primary/20 absolute right-0 -z-10 h-full w-full bg-radial-[ellipse_at_-20%_50%] to-10%" />

      <div className="container mx-auto px-4">
        <div className="mx-auto w-full max-w-5xl">
          <h2 className="text-foreground mb-2 text-center text-2xl font-bold md:mb-3 md:text-3xl">
            How to Join Our Ministry
          </h2>
          <p className="text-muted-foreground mb-6 text-center md:mb-8">
            Become part of IRM Ministries family in just 3 easy steps:
          </p>

          <div className="space-y-4 md:grid md:grid-cols-3 md:gap-8 md:space-y-0">
            <div className="bg-card overflow-hidden rounded-lg shadow-sm">
              <div className="bg-primary/10 flex h-40 items-center justify-center rounded-2xl p-3">
                <FileText className="text-primary h-16 w-16" />
              </div>
              <div className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="bg-primary flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold text-white">
                    1
                  </span>
                  <h3 className="text-foreground font-bold">
                    Fill Out the Form
                  </h3>
                </div>
                <p className="text-muted-foreground text-sm md:text-base">
                  Enter your personal details including name, age, contact
                  information, and ministry background. Share your faith journey
                  with us.
                </p>
              </div>
            </div>

            <div className="bg-card overflow-hidden rounded-lg shadow-sm">
              <div className="bg-community/10 flex h-40 items-center justify-center rounded-2xl p-3">
                <Upload className="text-community h-16 w-16" />
              </div>
              <div className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="bg-community flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold text-white">
                    2
                  </span>
                  <h3 className="text-foreground font-bold">
                    Upload Documents
                  </h3>
                </div>
                <p className="text-muted-foreground text-sm md:text-base">
                  Upload your photo, identification documents, and any relevant
                  ministry certificates or training credentials.
                </p>
              </div>
            </div>

            <div className="bg-card overflow-hidden rounded-lg shadow-sm">
              <div className="bg-accent/10 flex h-40 items-center justify-center rounded-2xl p-3">
                <CheckCircle className="text-accent h-16 w-16" />
              </div>
              <div className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="bg-accent flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold text-white">
                    3
                  </span>
                  <h3 className="text-foreground font-bold">Receive Welcome</h3>
                </div>
                <p className="text-muted-foreground text-sm md:text-base">
                  After review, our ministry leaders will contact you personally
                  to welcome you into our church family and guide your next
                  steps.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Button
              asChild
              className="h-[42px] w-full md:w-auto"
              variant="default"
            >
              <Link href="/join">Join Us Today</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
