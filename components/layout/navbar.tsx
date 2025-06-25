"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Building2,
  Globe,
  Home,
  LogIn,
  LogOut,
  LucideIcon,
  Menu,
  Phone,
  Shield,
  User,
  X,
} from "lucide-react"

import { useAuthSimple } from "@/hooks/use-auth-simple"
import { useLanguage } from "@/hooks/use-language"

import { Language, LanguageSelect } from "../ui/language-select"
import { ModeToggle } from "../ui/mode-toggle"
import Logo from "./logo"

interface Route {
  href: string
  label: string
  icon: LucideIcon
  isButton?: boolean
  requiresAdmin?: boolean
}

export const LANGUAGES: Language[] = [
  { code: "en", label: "ENG", countryCode: "US", title: "English" },
]

const BASE_ROUTES = [
  { href: "/", label: "Home", icon: Home },
  { href: "/contact", label: "Contact", icon: Phone },
  { href: "/churches", label: "Churches", icon: Building2 },
]

export function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { selected, setSelected } = useLanguage(LANGUAGES)
  const { user, logout, isAuthenticated, isAdmin } = useAuthSimple()

  const handleLogout = async () => {
    await logout()
    setIsMenuOpen(false)
  }

  // Dynamic routes based on authentication status
  const routes: Route[] = [
    ...BASE_ROUTES,
    ...(isAuthenticated
      ? [
          {
            href: "/admin",
            label: "Dashboard",
            icon: Shield,
            requiresAdmin: true,
          },
        ]
      : [{ href: "/login", label: "Login", icon: LogIn, isButton: true }]),
  ]

  return (
    <nav className='border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='mx-auto max-w-7xl px-6'>
        <div className='flex h-[72px] items-center justify-between'>
          {/* Logo and brand */}
          <div className='flex items-center'>
            <Logo />
          </div>

          {/* Desktop nav */}
          <div className='hidden items-center space-x-8 md:flex'>
            {routes.map((route, index) => {
              // Skip admin routes for non-admin users
              if (route.requiresAdmin && !isAdmin) return null

              return route.isButton ? (
                <Link
                  key={index}
                  href={route.href}
                  className='inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                >
                  <route.icon className='h-4 w-4' />
                  {route.label}
                </Link>
              ) : (
                <Link
                  key={route.href}
                  href={route.href}
                  className={`inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground ${
                    pathname === route.href
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  <route.icon className='h-4 w-4' />
                  {route.label}
                </Link>
              )
            })}

            {/* User Profile & Logout for authenticated users */}
            {isAuthenticated && (
              <div className='flex items-center gap-3 ml-4 pl-4 border-l border-border'>
                <div className='flex items-center gap-2'>
                  <div className='p-1.5 bg-primary/10 rounded-full'>
                    <User className='h-4 w-4 text-primary' />
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-xs font-medium text-foreground'>
                      {user?.email}
                    </span>
                    {isAdmin && (
                      <div className='flex items-center gap-1'>
                        <Shield className='h-3 w-3 text-amber-500' />
                        <span className='text-xs text-amber-600 dark:text-amber-400'>
                          Admin
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className='inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors'
                >
                  <LogOut className='h-4 w-4' />
                  Logout
                </button>
              </div>
            )}

            {/* Language selector with current language */}
            <div className='ml-6 flex items-center space-x-2 border-l border-border pl-6'>
              <Globe className='size-8 text-muted-foreground' />
              <LanguageSelect
                languages={LANGUAGES}
                value={selected}
                onChange={setSelected}
              />
              <ModeToggle />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className='flex items-center space-x-2 md:hidden'>
            <ModeToggle />
            <button
              type='button'
              className='inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors'
              aria-controls='mobile-menu'
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className='sr-only'>
                {isMenuOpen ? "Close menu" : "Open menu"}
              </span>
              {isMenuOpen ? (
                <X className='block h-6 w-6' aria-hidden='true' />
              ) : (
                <Menu className='block h-6 w-6' aria-hidden='true' />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className='border-t border-border bg-background md:hidden'>
          <div className='space-y-2 px-4 py-4'>
            {routes.map((route, index) => {
              // Skip admin routes for non-admin users
              if (route.requiresAdmin && !isAdmin) return null

              return route.isButton ? (
                <Link
                  key={index}
                  href={route.href}
                  className='mt-2 flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                  onClick={() => setIsMenuOpen(false)}
                >
                  <route.icon className='h-4 w-4' />
                  {route.label}
                </Link>
              ) : (
                <Link
                  key={route.href}
                  href={route.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                    pathname === route.href
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <route.icon className='h-4 w-4' />
                  {route.label}
                </Link>
              )
            })}

            {/* User Profile & Logout for authenticated users on mobile */}
            {isAuthenticated && (
              <div className='mt-4 pt-4 border-t border-border space-y-3'>
                <div className='flex items-center gap-3 px-3 py-2 bg-muted/50 rounded-md'>
                  <div className='p-1.5 bg-primary/10 rounded-full'>
                    <User className='h-4 w-4 text-primary' />
                  </div>
                  <div className='flex-1'>
                    <div className='text-sm font-medium text-foreground'>
                      {user?.email}
                    </div>
                    {isAdmin && (
                      <div className='flex items-center gap-1 mt-0.5'>
                        <Shield className='h-3 w-3 text-amber-500' />
                        <span className='text-xs text-amber-600 dark:text-amber-400'>
                          Admin
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className='w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors'
                >
                  <LogOut className='h-4 w-4' />
                  Logout
                </button>
              </div>
            )}

            <div className='mt-4 flex items-center justify-between border-t border-border pt-4'>
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <Globe className='h-4 w-4' />
                <span>Language</span>
              </div>
              <LanguageSelect
                languages={LANGUAGES}
                value={selected}
                onChange={setSelected}
              />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
