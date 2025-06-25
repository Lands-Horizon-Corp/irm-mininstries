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
    <section className='mx-auto w-full max-w-6xl py-16 bg-background'>
      <div className='text-center mb-12'>
        <h2 className='text-3xl font-bold tracking-tight text-foreground mb-4'>
          Our Core Values
        </h2>
        <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
          Discover the principles that guide our ministry and community
        </p>
      </div>
      <div className='flex flex-col md:flex-row items-stretch justify-center gap-8 md:gap-4 px-6'>
        {CHURCH_VALUES.map((value, idx) => (
          <React.Fragment key={value.title}>
            <div className='flex flex-col items-center flex-1 max-w-sm'>
              <div className='mb-6 rounded-full bg-primary/10 p-6 border border-primary/20'>
                <value.icon className='h-8 w-8 text-primary' />
              </div>
              <h3 className='text-center text-xl font-semibold mb-3 text-foreground'>
                {value.title}
              </h3>
              <p className='text-center text-muted-foreground leading-relaxed'>
                {value.description}
              </p>
            </div>
            {idx < CHURCH_VALUES.length - 1 && (
              <div className='hidden md:flex flex-row items-center justify-center self-stretch mx-4'>
                <ChevronRight className='text-primary/30' size={20} />
                <ChevronRight className='text-primary/60' size={20} />
                <ChevronRight className='text-primary/30' size={20} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  )
}

export default ChurchValues
