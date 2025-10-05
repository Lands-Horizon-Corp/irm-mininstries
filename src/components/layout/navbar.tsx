"use client";

import { useState } from "react";
import Link from "next/link";

import { Menu, UserIcon, X, LucideIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

import { cn } from "../../lib/utils";

import Logo from "./logo";

interface NavRoute {
  href: string;
  label: string;
  variant?: "default" | "link";
  icon?: LucideIcon;
  showOnMobile?: boolean;
  showOnDesktop?: boolean;
}

const navRoutes: NavRoute[] = [
  {
    href: "/",
    label: "Home",
    variant: "link",
    showOnMobile: true,
    showOnDesktop: true,
  },
  {
    href: "/contact",
    label: "Contact",
    variant: "link",
    showOnMobile: true,
    showOnDesktop: true,
  },
  {
    href: "/join",
    label: "Join",
    variant: "default",
    icon: UserIcon,
    showOnMobile: true,
    showOnDesktop: true,
  },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-20 w-full backdrop-blur-2xl">
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Logo />
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {navRoutes
              .filter((route) => route.showOnDesktop)
              .map((route) => {
                const Icon = route.icon;
                const isJoinButton = route.variant === "default";

                return (
                  <Link
                    key={route.href}
                    className={cn(
                      buttonVariants({ variant: route.variant || "link" }),
                      route.variant === "link" ? "text-current" : "",
                      isJoinButton ? "ml-4" : ""
                    )}
                    href={route.href}
                  >
                    {Icon && <Icon className="mr-2 inline h-4 w-4" />}
                    {route.label}
                  </Link>
                );
              })}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              aria-controls="mobile-menu"
              aria-expanded="false"
              className="focus:ring-primary inline-flex items-center justify-center rounded-md p-2 focus:ring-2 focus:outline-none focus:ring-inset"
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">
                {isMenuOpen ? "Close menu" : "Open menu"}
              </span>
              {isMenuOpen ? (
                <X aria-hidden="true" className="block h-6 w-6" />
              ) : (
                <Menu aria-hidden="true" className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="space-y-4 px-2 pt-2 pb-3">
            {navRoutes
              .filter((route) => route.showOnMobile)
              .map((route) => {
                const Icon = route.icon;
                const isJoinButton = route.variant === "default";

                return (
                  <Link
                    key={route.href}
                    className={cn(
                      isJoinButton
                        ? buttonVariants({ variant: "default" }) +
                            " mx-auto w-full px-4 py-2 text-center"
                        : "block font-medium"
                    )}
                    href={route.href}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {Icon && !isJoinButton && (
                      <Icon className="mr-2 inline h-4 w-4" />
                    )}
                    {route.label}
                  </Link>
                );
              })}
          </div>
        </div>
      )}
      <div className="h-[0.5px] w-full rounded-4xl bg-current/20" />
    </nav>
  );
}
