"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/admin/dashboard");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="border-primary mb-4 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
      </div>
    </div>
  );
}
