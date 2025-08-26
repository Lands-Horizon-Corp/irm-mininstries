import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  BotIcon,
  EarthLockIcon,
  MonitorSmartphoneIcon,
  RocketIcon,
  Shield,
  TrendingUp,
  UserIcon,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const HeroHome = () => {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background gradients */}
      <div className="to-background/0 via-background/0 from-primary/50 absolute right-0 -z-10 -mt-16 h-screen w-full bg-radial-[ellipse_at_20%_0%] to-100%" />

      <div className="relative mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
        <div className="grid min-h-[80vh] items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Content Section */}
          <div className="animate-fade-in space-y-8">
            <div className="space-y-4">
              <div className="bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium">
                <Shield className="h-4 w-4" />
                E-COOPERATIVES SUITE
              </div>

              <h1 className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Empowering Communities Through{" "}
                <span className="bg-gradient-hero text-primary bg-clip-text">
                  Cooperative Ownership
                </span>
              </h1>

              <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
                Cooperatives embody the power of community, where shared
                ownership and mutual aid transform economic challenges into
                opportunities for progress and empowerment.
              </p>
            </div>
            {/* Action Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild className="group" size="lg" variant="default">
                <Link className="flex items-center" href="/join">
                  <UserIcon className="mr-2 h-5 w-5" />
                  Join Waitlist
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link className="button border px-2" href="/contact">
                  Contact us
                </Link>
              </Button>
            </div>
            <p className="text-muted-foreground mb-4">
              <RocketIcon className="mr-2 inline h-5 w-5" />
              Launch date: January 6, 2026
            </p>
            {/* Stats */}
            <div className="border-border/50 grid grid-cols-3 gap-8 border-t pt-8">
              <div className="text-center">
                <div className="mb-2 flex items-center justify-center gap-2">
                  <BotIcon className="text-primary h-8 w-8" />
                </div>
                <p className="text-muted-foreground text-sm">
                  AI Enabled Cooperative Banking with LLM and Machine Learning
                </p>
              </div>
              <div className="text-center">
                <div className="mb-2 flex items-center justify-center gap-2">
                  <EarthLockIcon className="text-community h-8 w-8" />
                </div>
                <p className="text-muted-foreground text-sm">
                  Advanced Security Implementation
                </p>
              </div>
              <div className="text-center">
                <div className="mb-2 flex items-center justify-center gap-2">
                  <MonitorSmartphoneIcon className="text-accent h-8 w-8" />
                  <span className="text-foreground text-2xl font-bold">
                    1B+
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">
                  Can handle billions of transactions with ease with latest
                  state of the art technologies
                </p>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="animate-slide-up relative">
            <div className="shadow-card relative overflow-hidden rounded-2xl">
              <Image
                alt="Cooperative community working together"
                className="h-[500px] w-full object-cover"
                height={1000}
                src="/images/poster.png"
                width={1000}
              />
              <div className="absolute inset-0 bg-gradient-to-t" />
            </div>

            {/* Floating cards */}
            <div
              className="bg-card shadow-card animate-fade-in absolute -top-4 -left-4 rounded-xl border p-4"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="flex items-center gap-3">
                <div className="bg-gradient-community flex h-10 w-10 items-center justify-center rounded-full">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold">25 New Members</p>
                  <p className="text-muted-foreground text-xs">This week</p>
                </div>
              </div>
            </div>

            <div
              className="bg-card shadow-card animate-fade-in absolute -right-4 -bottom-4 rounded-xl border p-4"
              style={{ animationDelay: "0.6s" }}
            >
              <div className="flex items-center gap-3">
                <div className="bg-gradient-hero flex h-10 w-10 items-center justify-center rounded-full">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold">P150K Growth</p>
                  <p className="text-muted-foreground text-xs">Last month</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroHome;
