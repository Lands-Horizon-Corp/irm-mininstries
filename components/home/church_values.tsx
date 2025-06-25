"use client"

import React from "react"
import { BookOpen, ChevronRight, EyeIcon, HeartIcon } from "lucide-react"

export const CHURCH_VALUES = [
  {
    icon: BookOpen,
    title: "Mission",
    description:
      "We exist to glorify God by obeying the Great Commandment and fulfilling the Great Commission.",
  },
  {
    icon: EyeIcon,
    title: "Vision",
    description: "Redemption and Transformation of Nations.",
  },
  {
    icon: HeartIcon,
    title: "Core Values",
    description:
      "Loving God, Personal Holiness, Loving people, Servant Leadership, Spirit-led Ministry, Holistic Mission, Shared Resources",
  },
]

export function ChurchValues() {
  return (
    <section className='mx-auto w-full max-w-6xl py-16 bg-background animate-in fade-in duration-1000'>
      <div className='text-center mb-12 animate-in slide-in-from-top duration-700'>
        <h2 className='text-3xl font-bold tracking-tight text-foreground mb-4'>
          Our Core Values
        </h2>
        <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
          Discover the principles that guide our ministry and community
        </p>
      </div>
      <div className='flex items-center flex-col md:flex-row justify-center gap-8 md:gap-4 px-6'>
        {CHURCH_VALUES.map((value, idx) => (
          <React.Fragment key={value.title}>
            <div
              className={`flex flex-col items-center flex-1 max-w-sm group animate-in slide-in-from-bottom duration-700 ${
                idx === 0 ? "delay-200" : idx === 1 ? "delay-400" : "delay-600"
              }`}
            >
              <div className='mb-6 rounded-full bg-primary/10 p-6 border border-primary/20 transition-all duration-300 hover:bg-primary/20 hover:scale-110 hover:shadow-lg'>
                <value.icon className='h-8 w-8 text-primary transition-transform duration-300 group-hover:animate-pulse' />
              </div>
              <h3 className='text-center text-xl font-semibold mb-3 text-foreground transition-colors duration-300 group-hover:text-primary'>
                {value.title}
              </h3>
              <p className='text-center text-muted-foreground leading-relaxed transition-colors duration-300 group-hover:text-foreground'>
                {value.description}
              </p>
            </div>
            {idx < CHURCH_VALUES.length - 1 && (
              <div className='hidden md:flex flex-row items-center justify-center self-stretch mx-4 animate-in fade-in duration-1000 delay-700'>
                <ChevronRight
                  className='text-primary/30 animate-pulse'
                  size={20}
                />
                <ChevronRight
                  className='text-primary/60 animate-pulse animation-delay-150'
                  size={20}
                />
                <ChevronRight
                  className='text-primary/30 animate-pulse animation-delay-300'
                  size={20}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  )
}

export default ChurchValues
