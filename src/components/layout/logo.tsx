"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";

const Logo = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder or the default logo during SSR
    return (
      <Link className="w-14" href="/">
        <Image
          priority
          alt="E-Coop Logo"
          height={300}
          src="/images/logo-white.webp"
          style={{ height: "auto", width: "auto" }}
          width={300}
        />
      </Link>
    );
  }

  return (
    <Link className="w-14" href="/">
      <Image
        priority
        alt="E-Coop Logo"
        height={300}
        src={
          resolvedTheme === "dark"
            ? "/images/logo-white.webp"
            : "/images/logo-dark.webp"
        }
        style={{ height: "auto", width: "auto" }}
        width={300}
      />
    </Link>
  );
};

export default Logo;
