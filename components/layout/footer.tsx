"use client"

import Link from "next/link"
import { Building2Icon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react"

export default function Footer() {
  return (
    <footer className='bg-background border-t'>
      <div className='mx-auto flex min-h-[320px] max-w-7xl flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 place-items-start md:place-items-center items-start gap-12 md:grid-cols-3'>
          <div>
            <h3 className='mb-4 text-xl font-semibold text-foreground'>
              About Us
            </h3>
            <p className='text-sm leading-relaxed text-muted-foreground'>
              We are a Christian community dedicated to spreading God&apos;s
              love and serving our local and global communities. Join us in
              faith, fellowship, and spiritual growth.
            </p>
          </div>
          <div>
            <h3 className='mb-4 text-xl font-semibold text-foreground'>
              Quick Links
            </h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  href='/faq'
                  className='text-muted-foreground transition-colors hover:text-foreground focus:text-foreground'
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href='/privacy-policy'
                  className='text-muted-foreground transition-colors hover:text-foreground focus:text-foreground'
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href='/terms'
                  className='text-muted-foreground transition-colors hover:text-foreground focus:text-foreground'
                >
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link
                  href='/cookies'
                  className='text-muted-foreground transition-colors hover:text-foreground focus:text-foreground'
                >
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
          <address className='not-italic'>
            <h3 className='mb-4 text-xl font-semibold text-foreground'>
              Contact Us
            </h3>
            <ul className='space-y-2 text-sm'>
              <li className='flex items-start gap-x-3'>
                <Building2Icon
                  className='mt-1 h-4 w-4 text-muted-foreground'
                  aria-hidden='true'
                />
                <span className='text-muted-foreground'>IRM Ministries</span>
              </li>
              <li className='flex items-center gap-x-3'>
                <MailIcon
                  className='h-4 w-4 text-muted-foreground'
                  aria-hidden='true'
                />
                <a
                  href='mailto:irm.ministries@gmail.com'
                  className='text-muted-foreground transition-colors hover:text-foreground focus:text-foreground hover:underline'
                >
                  irm.ministries@gmail.com
                </a>
              </li>
              <li className='flex items-center gap-x-3'>
                <PhoneIcon
                  className='h-4 w-4 text-muted-foreground'
                  aria-hidden='true'
                />
                <a
                  href='tel:+6323417653'
                  className='text-muted-foreground transition-colors hover:text-foreground focus:text-foreground hover:underline'
                >
                  (02) 3417 6053
                </a>
              </li>
              <li className='flex items-start gap-x-3'>
                <MapPinIcon
                  className='mt-1 h-4 w-4 text-muted-foreground'
                  aria-hidden='true'
                />
                <span className='text-muted-foreground'>
                  351 Tandang Sora Avenue Pasong Tamo 1107 Quezon City,
                  Philippines
                </span>
              </li>
            </ul>
          </address>
        </div>
        <div className='mt-12 border-t border-border pt-6 w-full'>
          <p className='text-center text-sm text-muted-foreground'>
            &copy; 2025 IRM Ministries. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
