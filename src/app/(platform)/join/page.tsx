import { Suspense } from "react";

import { Heading } from "@/components/ui/heading";
import { MinisterForm } from "@/modules/ministry/components/minister-form";

export default function JoinPage() {
  return (
    <div className="join_minister__container my-16 flex min-h-screen flex-col justify-center">
      <div className="to-background/0 via-background/0 from-primary/20 absolute right-0 -z-10 h-screen w-full bg-radial-[ellipse_at_0%_50%] to-100%" />

      <div className="mx-auto w-full px-5 md:px-10">
        <Heading
          align="center"
          className="text-primary p-5"
          description="Complete the application form below to join our community of dedicated ministers serving God's people worldwide."
          title="Minister Form"
        />

        <Suspense fallback={<div>Loading...</div>}>
          <MinisterForm />
        </Suspense>
      </div>
    </div>
  );
}
