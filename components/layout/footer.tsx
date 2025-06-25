"use client"

import Link from "next/link"
import { Building2Icon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react"

export default function Footer() {
  return (
    <footer>
      <div className='mx-auto flex min-h-[320px] max-w-7xl flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8 font-thin'>
        <div className='grid grid-cols-1 place-items-start md:place-items-center items-start gap-12 md:grid-cols-3'>
          <div>
            <h3 className='mb-4 text-xl font-bold'>About Us</h3>
            <p className='text-base leading-relaxed'>
              We are a Christian community dedicated to spreading God&apos;s
              love and serving our local and global communities. Join us in
              faith, fellowship, and spiritual growth.
            </p>
          </div>
          <div>
            <h3 className='mb-4 text-xl font-bold'>Quick Links</h3>
            <ul className='space-y-2 text-base'>
              <li>
                <Link
                  href='/faq'
                  className='transition-colors hover:text-gray-600'
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href='/privacy-policy'
                  className='transition-colors hover:text-gray-600'
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href='/terms'
                  className='transition-colors hover:text-gray-600'
                >
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link
                  href='/cookies'
                  className='transition-colors hover:text-gray-600'
                >
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
          <address className='not-italic'>
            <h3 className='mb-4 text-xl font-bold'>Contact Us</h3>
            <ul className='space-y-2 text-base'>
              <li className='flex items-start gap-x-3'>
                <Building2Icon className='mt-1 size-5' aria-hidden='true' />
                <span>IRM Ministries</span>
              </li>
              <li className='flex items-center gap-x-3'>
                <MailIcon className='size-5' aria-hidden='true' />
                <a
                  href='mailto:irm.ministries@gmail.com'
                  className='hover:underline'
                >
                  irm.ministries@gmail.com
                </a>
              </li>
              <li className='flex items-center gap-x-3'>
                <PhoneIcon className='size-5' aria-hidden='true' />
                <a href='tel:+6323417653' className='hover:underline'>
                  (02) 3417 6053
                </a>
              </li>
              <li className='flex items-start gap-x-3'>
                <MapPinIcon className='mt-1 size-5' aria-hidden='true' />
                <span>
                  351 Tandang Sora Avenue Pasong Tamo 1107 Quezon City,
                  Philippines
                </span>
              </li>
            </ul>
          </address>
        </div>
        <div className='mt-12 border-t pt-6'>
          <p className='text-center text-base'>
            &copy; 2025 IRM Ministries. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
