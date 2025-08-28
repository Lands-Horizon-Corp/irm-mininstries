import Link from "next/link";

import { Facebook, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
              Quotes
            </h3>
            <p className="text-muted-foreground mt-4 text-sm leading-relaxed sm:text-base">
              &quot;There is no fear in love. But perfect love drives out fear,
              because fear has to do with punishment. The one who fears is not
              made perfect in love.&quot;
              <br />
              <span className="text-primary/80">NIV: 1 John 4:18</span>
            </p>
          </div>

          {/* Links Section */}
          <div>
            <h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
              Links
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors sm:text-base"
                  href="/"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors sm:text-base"
                  href="/faq"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors sm:text-base"
                  href="/join"
                >
                  Join Us
                </Link>
              </li>
              <li>
                <Link
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors sm:text-base"
                  href="/login"
                >
                  For Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
              Legal
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors sm:text-base"
                  href="/privacy"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors sm:text-base"
                  href="/terms"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
              Contact
            </h3>
            <ul className="mt-4 space-y-3">
              <li className="text-muted-foreground text-sm sm:text-base">
                <a
                  className="hover:text-foreground transition-colors"
                  href="mailto:irm-ministries@gmail.com"
                >
                  irm-ministries@gmail.com
                </a>
              </li>
              <li>
                <Link
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors sm:text-base"
                  href="/contact"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <div className="mt-4">
                  <p className="text-muted-foreground mb-2 text-sm font-medium">
                    Follow Us
                  </p>
                  <div className="flex items-center space-x-4">
                    <a
                      aria-label="Follow us on Facebook"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      href="https://www.facebook.com/irmevangelicalchurch"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <Facebook className="h-5 w-5" />
                    </a>

                    <a
                      aria-label="Subscribe to our YouTube channel"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      href="https://www.youtube.com/@irmlam"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <Youtube className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 border-t pt-8">
          <p className="text-muted-foreground text-center text-xs leading-relaxed sm:text-sm">
            &copy; {new Date().getFullYear()} Lands Horizon. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
