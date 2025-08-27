import Image from "next/image";

import { Check } from "lucide-react";

const IntroSection = () => {
  return (
    <section className="flex items-center bg-none px-5">
      <div className="to-background via-background from-primary/20 absolute right-0 -z-10 h-screen w-full bg-radial-[ellipse_at_100%_40%] to-100%" />

      <div className="mx-auto">
        <div className="mx-auto w-full max-w-5xl rounded-2xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-12">
            <div className="relative order-2 aspect-[4/5] overflow-hidden rounded-lg md:order-1">
              <Image
                alt="Intro Section Image"
                className="object-cover opacity-85"
                height={1000}
                src="/images/bible.png"
                width={1000}
              />
              <div className="animate-float to-background/0 via-background/0 from-primary/50 absolute top-0 right-0 -z-10 h-full w-full bg-radial-[ellipse_at_50%_50%] to-100%" />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="mb-4 text-2xl font-bold md:mb-6 md:text-3xl">
                Join Our Ministry Family
              </h2>

              <p className="mb-4 text-current/70 md:mb-6">
                A welcoming community rooted in God&apos;s Word, united in
                prayer, and committed to transforming lives through intentional
                discipleship and servant leadership.
              </p>
              <p className="text-muted-foreground mb-4">
                Please join us as one of the ministry family.
              </p>

              <div className="space-y-3 md:space-y-4">
                <h3 className="text-lg font-semibold md:text-xl">
                  How to Join Us
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <Check aria-hidden className="text-primary h-5 w-5" />
                    <span className="text-current/70">
                      Completely welcoming – no barriers, all are welcome
                    </span>
                  </li>

                  <li className="flex items-start gap-3">
                    <Check aria-hidden className="text-primary h-5 w-5" />
                    <span className="text-current/70">
                      Simple process – connect with us in just a few minutes
                    </span>
                  </li>

                  <li className="flex items-start gap-3">
                    <Check aria-hidden className="text-primary h-5 w-5" />
                    <span className="text-current/70">
                      Open doors – no prerequisites required, come as you are
                    </span>
                  </li>

                  <li className="flex items-start gap-3">
                    <Check aria-hidden className="text-primary h-5 w-5" />
                    <span className="text-current/70">
                      Personal connection – ministry leaders will reach out to
                      welcome you
                    </span>
                  </li>

                  <li className="flex items-start gap-3">
                    <Check aria-hidden className="text-primary h-5 w-5" />
                    <span className="text-current/70">
                      Christ-centered faith – believing in Jesus as our Savior
                      and Lord
                    </span>
                  </li>

                  <li className="flex items-start gap-3">
                    <Check aria-hidden className="text-primary h-5 w-5" />
                    <span className="text-current/70">
                      Spirit-led ministry – guided by the Holy Spirit in all we
                      do
                    </span>
                  </li>

                  <li className="flex items-start gap-3">
                    <Check aria-hidden className="text-primary h-5 w-5" />
                    <span className="text-current/70">
                      Loving community – caring for one another as family
                    </span>
                  </li>

                  <li className="flex items-start gap-3">
                    <Check aria-hidden className="text-primary h-5 w-5" />
                    <span className="text-current/70">
                      Great Commission focus – sharing God&apos;s love through
                      word and deed
                    </span>
                  </li>

                  <li className="flex items-start gap-3">
                    <Check aria-hidden className="text-primary h-5 w-5" />
                    <span className="text-current/70">
                      Hope in Christ&apos;s return – living faithfully until He
                      comes
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
