"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"

const Logo = () => {
  return (
    <Link href='/'>
      <Image src={"/images/irm-logo.png"} width={40} height={40} alt='Logo' />
    </Link>
  )
}

export default Logo
