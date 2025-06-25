"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"

const Logo = () => {
  return (
    <Link href='/'>
      <Image
        src={"/images/irm-logo.png"}
        width={40}
        height={40}
        alt='Logo'
        priority
        style={{ width: "auto", height: "auto" }}
      />
    </Link>
  )
}

export default Logo
