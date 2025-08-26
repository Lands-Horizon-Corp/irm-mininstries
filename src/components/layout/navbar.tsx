"use client";

import { useState } from "react";
import Link from "next/link";

import { Menu, UserIcon, X } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

import { cn } from "../../lib/utils";

import Logo from "./logo";

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
            <Link
              className={cn(
                buttonVariants({ variant: "link" }),
                "text-current"
              )}
              href="/"
            >
              Home
            </Link>
            <Link
              className={cn(
                buttonVariants({ variant: "link" }),
                "text-current"
              )}
              href="/contact"
            >
              Contact
            </Link>
            <Link
              className={cn(
                buttonVariants({ variant: "link" }),
                "text-current"
              )}
              href="/about"
            >
              About
            </Link>
            <Link className={cn(buttonVariants(), "ml-4")} href="/join">
              <UserIcon className="mr-2 inline h-4 w-4" /> Join Ministry
            </Link>
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
            <Link
              className={cn("block font-medium")}
              href="/"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              className={cn("block font-medium")}
              href="/contact"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              className={cn("block font-medium")}
              href="/about"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              className={cn(
                buttonVariants({ variant: "default" }),
                "mx-auto w-full px-4 py-2 text-center"
              )}
              href="/join"
              onClick={() => setIsMenuOpen(false)}
            >
              Join Ministry
            </Link>
          </div>
        </div>
      )}
      <div className="h-[0.5px] w-full rounded-4xl bg-current/20" />
    </nav>
  );
}
