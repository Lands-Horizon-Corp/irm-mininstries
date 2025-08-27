"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  BookIcon,
  BookOpen,
  CrossIcon,
  Eye,
  Heart,
  RocketIcon,
  Shield,
  UserIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const bibleVerses = [
  { reference: "Matthew 11:28", text: "Come to me" },
  { reference: "Philippians 4:13", text: "I can do all things" },
  { reference: "Psalm 46:10", text: "Be still and know" },
  { reference: "Proverbs 3:5", text: "Trust in the Lord" },
  { reference: "1 John 4:8", text: "God is love" },
  { reference: "Isaiah 41:10", text: "Fear not" },
  { reference: "Matthew 28:20", text: "I am with you" },
  { reference: "John 13:34", text: "Love one another" },
  { reference: "John 20:19", text: "Peace be with you" },
  { reference: "John 14:6", text: "I am the way" },
  { reference: "Matthew 7:7", text: "Ask and you shall receive" },
  { reference: "Matthew 6:33", text: "Seek first the kingdom" },
  { reference: "Psalm 23:1", text: "The Lord is my shepherd" },
  { reference: "Philippians 4:4", text: "Rejoice in the Lord" },
  { reference: "Joshua 1:9", text: "Be strong and courageous" },
  { reference: "Lamentations 3:23", text: "Great is His faithfulness" },
  { reference: "Psalm 147:3", text: "He heals the brokenhearted" },
  { reference: "1 Peter 5:7", text: "Cast all your anxiety" },
  { reference: "John 3:16", text: "For God so loved" },
  { reference: "1 Thessalonians 5:18", text: "In all things give thanks" },
  { reference: "Ephesians 4:32", text: "Be kind to one another" },
  { reference: "Lamentations 3:22", text: "His mercies are new" },
  { reference: "Nehemiah 8:10", text: "The joy of the Lord" },
  { reference: "2 Corinthians 5:7", text: "Walk by faith" },
  { reference: "Romans 8:28", text: "God works all things" },
  { reference: "Hebrews 13:5", text: "I will never leave you" },
  { reference: "Matthew 5:16", text: "Let your light shine" },
  { reference: "Romans 12:2", text: "Be transformed" },
  { reference: "1 Thessalonians 5:17", text: "Pray without ceasing" },
  { reference: "Psalm 46:1", text: "God is our refuge" },
  { reference: "Romans 5:5", text: "Hope does not disappoint" },
  { reference: "John 16:33", text: "I have overcome" },
  { reference: "2 Corinthians 12:9", text: "His grace is sufficient" },
  { reference: "John 8:32", text: "The truth will set you free" },
  { reference: "Matthew 5:9", text: "Blessed are the peacemakers" },
  { reference: "1 Corinthians 10:13", text: "God is faithful" },
  { reference: "Psalm 139:14", text: "I am fearfully made" },
  { reference: "Luke 1:37", text: "Nothing is impossible" },
  { reference: "Philippians 4:6", text: "Be anxious for nothing" },
  { reference: "Exodus 14:14", text: "The Lord fights for you" },
  { reference: "Psalm 37:4", text: "Delight in the Lord" },
  { reference: "Isaiah 40:29", text: "He gives power" },
  { reference: "Romans 10:17", text: "Faith comes by hearing" },
  { reference: "2 Timothy 1:7", text: "God has not given fear" },
  { reference: "John 15:5", text: "I am the vine" },
  { reference: "1 Corinthians 13:4", text: "Love is patient" },
  { reference: "Psalm 37:5", text: "Commit your way" },
  { reference: "Psalm 34:17", text: "The righteous cry out" },
  { reference: "1 Corinthians 1:27", text: "God chose the weak" },
  { reference: "Acts 17:28", text: "In Him we live" },
  { reference: "James 1:2", text: "Consider it pure joy" },
  { reference: "John 1:14", text: "The word became flesh" },
  { reference: "Ephesians 2:8", text: "By grace you are saved" },
  { reference: "Psalm 100:5", text: "God is good" },
  { reference: "Deuteronomy 31:6", text: "The Lord your God" },
  { reference: "John 11:25", text: "I am the resurrection" },
  { reference: "Proverbs 19:21", text: "Many are the plans" },
  { reference: "Philippians 4:5", text: "The Lord is near" },
  { reference: "1 Peter 5:6", text: "Humble yourselves" },
  { reference: "Numbers 23:19", text: "God is not a man" },
  { reference: "Matthew 26:41", text: "The spirit is willing" },
  { reference: "Joel 2:25", text: "I will restore" },
  { reference: "James 4:6", text: "God opposes the proud" },
  { reference: "Psalm 119:105", text: "Your word is a lamp" },
  { reference: "Matthew 9:37", text: "The harvest is plentiful" },
  { reference: "Romans 5:8", text: "God demonstrates His love" },
  { reference: "John 15:15", text: "I have called you friends" },
  { reference: "Psalm 129:4", text: "The Lord is righteous" },
  { reference: "Psalm 30:5", text: "Weeping may endure" },
  { reference: "Philippians 4:19", text: "God will supply" },
  { reference: "Isaiah 30:15", text: "In quietness and trust" },
  { reference: "Psalm 27:1", text: "The Lord is my light" },
  { reference: "John 15:13", text: "Greater love has no one" },
  { reference: "Ephesians 3:20", text: "God is able" },
  { reference: "Psalm 34:8", text: "Taste and see" },
  { reference: "Psalm 145:9", text: "The Lord is good to all" },
  { reference: "Isaiah 43:19", text: "God will make a way" },
  { reference: "Jeremiah 29:11", text: "I know the plans" },
  { reference: "Psalm 37:7", text: "Be still before the Lord" },
  { reference: "Psalm 136:1", text: "God's love endures" },
  { reference: "Deuteronomy 30:19", text: "I have set before you" },
  { reference: "Psalm 118:14", text: "The Lord is my strength" },
  { reference: "2 Peter 3:9", text: "God is not slow" },
  { reference: "John 1:1", text: "In the beginning was" },
  { reference: "Numbers 6:24", text: "The Lord bless you" },
  { reference: "Romans 8:28", text: "God causes all things" },
  { reference: "Matthew 28:20", text: "I am with you always" },
  { reference: "Psalm 145:8", text: "The Lord is gracious" },
  { reference: "Revelation 21:4", text: "God will wipe away" },
  { reference: "John 15:9", text: "I have loved you" },
  { reference: "Psalm 37:24", text: "The Lord upholds" },
  { reference: "Hebrews 13:6", text: "God is our helper" },
  { reference: "Matthew 11:28", text: "I will give you rest" },
  { reference: "Psalm 103:8", text: "The Lord is compassionate" },
  { reference: "Revelation 21:5", text: "God makes all things new" },
  { reference: "Revelation 22:13", text: "I am the Alpha" },
  { reference: "Lamentations 3:24", text: "The Lord is my portion" },
  { reference: "1 John 4:16", text: "God is love" },
  { reference: "Hebrews 13:5", text: "I will never forsake" },
  { reference: "Psalm 10:16", text: "The Lord is king" },
  { reference: "James 1:5", text: "God gives wisdom" },
  { reference: "John 10:11", text: "I am the good shepherd" },
  { reference: "Psalm 18:2", text: "The Lord is my rock" },
  { reference: "Ephesians 2:14", text: "God is our peace" },
  { reference: "Isaiah 66:13", text: "I will comfort you" },
  { reference: "Psalm 97:1", text: "The Lord reigns" },
];

const HeroHome = () => {
  const [verse1, setVerse1] = useState(bibleVerses[0]);
  const [verse2, setVerse2] = useState(bibleVerses[1]);
  const [isAnimating1, setIsAnimating1] = useState(false);
  const [isAnimating2, setIsAnimating2] = useState(false);

  const getRandomVerse = () => {
    return bibleVerses[Math.floor(Math.random() * bibleVerses.length)];
  };

  useEffect(() => {
    const interval1 = setInterval(() => {
      setIsAnimating1(true);
      setTimeout(() => {
        setVerse1(getRandomVerse());
        setIsAnimating1(false);
      }, 300);
    }, 4000);

    const interval2 = setInterval(() => {
      setIsAnimating2(true);
      setTimeout(() => {
        setVerse2(getRandomVerse());
        setIsAnimating2(false);
      }, 300);
    }, 4500);

    return () => {
      clearInterval(interval1);
      clearInterval(interval2);
    };
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background gradients */}
      <div className="to-background/0 via-background/0 from-primary/50 absolute right-0 -z-10 -mt-16 h-screen w-full bg-radial-[ellipse_at_20%_0%] to-100%" />

      <div className="relative mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
        <div className="grid min-h-[80vh] items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Content Section */}
          <div className="animate-fade-in space-y-8">
            <div className="space-y-4">
              <div className="bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium">
                <Shield className="h-4 w-4" />
                IRM MINISTRIES
              </div>

              <h1 className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Intentional Redeeming{" "}
                <span className="bg-gradient-hero text-primary bg-clip-text">
                  Ministries
                </span>
              </h1>

              <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
                A church rooted in God&apos;s Word, united in prayer, and
                commissioned to redeem lives through intentional discipleship.
                We embody servant leadership while nurturing relationships with
                God and people.
              </p>
            </div>
            {/* Action Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild className="group" size="lg" variant="default">
                <Link className="flex items-center" href="/join">
                  <UserIcon className="mr-2 h-5 w-5" />
                  Join Us
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link className="button border px-2" href="/contact">
                  Contact us
                </Link>
              </Button>
            </div>
            <p className="text-muted-foreground mb-4">
              <RocketIcon className="mr-2 inline h-5 w-5" />
              Please join us as one of the IRM Ministry.
            </p>
            {/* Ministry Information */}
            <div className="border-border/50 grid grid-cols-3 gap-8 border-t pt-8">
              <div className="text-center">
                <div className="mb-2 flex items-center justify-center gap-2">
                  <Heart className="text-primary h-8 w-8" />
                </div>
                <h3 className="text-foreground mb-2 text-sm font-semibold">
                  Mission
                </h3>
                <p className="text-muted-foreground text-sm">
                  Redemption and Transformation of Nations.
                </p>
              </div>
              <div className="text-center">
                <div className="mb-2 flex items-center justify-center gap-2">
                  <Eye className="text-community h-8 w-8" />
                </div>
                <h3 className="text-foreground mb-2 text-sm font-semibold">
                  Vision
                </h3>
                <p className="text-muted-foreground text-sm">
                  We exist to glorify God by obeying the Great Commandment and
                  fulfilling the Great Commission.
                </p>
              </div>
              <div className="text-center">
                <div className="mb-2 flex items-center justify-center gap-2">
                  <BookOpen className="text-accent h-8 w-8" />
                </div>
                <h3 className="text-foreground mb-2 text-sm font-semibold">
                  Core Values
                </h3>
                <p className="text-muted-foreground text-sm">
                  Loving God, Personal Holiness, Loving people, Servant
                  Leadership, Spirit-led Ministry, Holistic Mission, Shared
                  Resources
                </p>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="animate-slide-up relative">
            <div className="shadow-card relative overflow-hidden rounded-2xl">
              <div className="animate-float to-background/0 via-background/0 from-primary/50 absolute top-0 right-0 -z-10 h-full w-full bg-radial-[ellipse_at_50%_50%] to-100%" />

              <Image
                alt="IRM Ministries - Faith Community"
                className="animate-float h-[300px] w-full object-cover"
                height={1000}
                src="/images/book.png"
                width={1000}
              />

              <Image
                alt="IRM Ministries - Faith Community"
                className="animate-float absolute top-0 right-0 h-[300px] w-[300px] object-cover opacity-90 transition delay-700 duration-300"
                height={1000}
                src="/images/cross.png"
                width={1000}
              />
              <div className="animate-float to-background/0 via-background/0 from-primary/50 absolute top-0 right-0 -z-10 h-full w-full bg-radial-[ellipse_at_50%_50%] to-100%" />
              <div className="absolute inset-0 bg-gradient-to-t" />
            </div>

            {/* Floating cards */}
            <div
              className={`bg-card shadow-card animate-fade-in absolute -top-4 -left-4 rounded-xl border p-4 transition-all duration-300 ${
                isAnimating1 ? "scale-95 opacity-0" : "scale-100 opacity-100"
              }`}
              style={{ animationDelay: "0.3s" }}
            >
              <div className="flex items-center gap-3">
                <div className="bg-gradient-community flex h-10 w-10 items-center justify-center rounded-full">
                  <CrossIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    &ldquo;{verse1.text}&rdquo;
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {verse1.reference}
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`bg-card shadow-card animate-fade-in absolute -right-4 -bottom-4 rounded-xl border p-4 transition-all duration-300 ${
                isAnimating2 ? "scale-95 opacity-0" : "scale-100 opacity-100"
              }`}
              style={{ animationDelay: "0.6s" }}
            >
              <div className="flex items-center gap-3">
                <div className="bg-gradient-hero flex h-10 w-10 items-center justify-center rounded-full">
                  <BookIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    &ldquo;{verse2.text}&rdquo;
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {verse2.reference}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroHome;
