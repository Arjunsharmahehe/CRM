import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { listActiveOfferings, getHomePage } from "@/server/actions";
import { HomepageSchema } from "@/types";
import type { z } from "zod";
import { cacheTag } from "next/cache";
import Threads from "@/components/Threads";
import { OfferingCard } from "@/components/OfferingCard";

type HomeContent = z.infer<typeof HomepageSchema>;

const defaultHomeContent: HomeContent = {
  hero: {
    headline: "Build with confidence",
    subheadline: "Manage your site content from one place and publish instantly.",
    ctaText: "Get started",
    ctaLink: "https://example.com/contact",
    heroImageUrl: "https://images.unsplash.com/photo-1522199710521-72d69614c702?auto=format&fit=crop&w=1200&q=80",
  },
  offerings: {
    title: "What we do",
  },
  testimonials: {
    title: "What customers say",
    items: [],
  },
};

async function HomeContent() {
  "use cache"
  cacheTag("home-page");
  const [page, offerings] = await Promise.all([getHomePage(), listActiveOfferings()]);
  const content = page?.content ?? defaultHomeContent;

  return (
    <div className="min-h-screen w-full bg-zinc-50 text-zinc-900">
      <header className="relative flex min-h-screen w-full items-center justify-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 z-0">
          <Threads
            amplitude={1.3}
            distance={0.6}
            enableMouseInteraction={true}
          />
        </div>

        {/* Gradient overlays for depth */}
        {/* <div className="absolute inset-0 z-1 bg-linear-to-b from-zinc-900/20 via-transparent to-zinc-50" />
        <div className="absolute bottom-0 left-0 right-0 z-1 h-32 bg-linear-to-t from-zinc-50 to-transparent" /> */}

        {/* Hero content */}
        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* Text content */}
          <div className="space-y-6">
            <h1 className="text-5xl font-bold leading-tight tracking-tight text-zinc-900 lg:text-6xl xl:text-7xl">
              {content.hero.headline}
            </h1>
            <p className="text-xl leading-relaxed text-zinc-700 lg:text-2xl">
              {content.hero.subheadline}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={content.hero.ctaLink}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-amber-600/30 transition-all hover:bg-amber-700 hover:shadow-xl hover:shadow-amber-600/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
              >
                {content.hero.ctaText}
                <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Hero image */}
          <div className="relative">
            {/* <div className="absolute -left-4 -top-4 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />
            <div className="absolute -bottom-4 -right-4 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" /> */}
            <div className="relative overflow-hidden rounded-3xl bg-zinc-100 shadow-2xl shadow-zinc-900/20">
              <Image
                src={content.hero.heroImageUrl}
                alt={content.hero.headline}
                width={600}
                height={600}
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
          <svg className="h-6 w-6 text-zinc-900/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16">
        <section id="offerings" className="grid gap-12">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">Offerings</p>
            <h2 className="mt-2 text-4xl font-bold tracking-tight lg:text-5xl">{content.offerings.title}</h2>
          </div>
          <div className="flex flex-col gap-0.5">
            {offerings.map((item, index) => (
              <OfferingCard key={item.id} offering={item} index={index} />
            ))}
            {offerings.length === 0 && (
              <div className="col-span-full rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center text-zinc-600">
                <p className="text-lg font-medium">No offerings yet</p>
                <p className="mt-2 text-sm text-zinc-500">Add some in the admin panel to showcase your services.</p>
              </div>
            )}
          </div>
        </section>

        <section className="grid gap-8 mt-48">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">Testimonials</p>
              <h2 className="text-3xl font-bold tracking-tight">{content.testimonials.title}</h2>
            </div>
          </div>
          {content.testimonials.items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-6 text-sm text-zinc-600">
              Add testimonials in the admin to showcase social proof.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {content.testimonials.items.map((item, index) => (
                <figure key={`${item.author}-${index}`} className="flex h-full flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                  <blockquote className="text-sm text-zinc-700">“{item.quote}”</blockquote>
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full bg-zinc-100">
                      <Image src={item.authorImageUrl} alt={item.author} fill className="object-cover" />
                    </div>
                    <figcaption className="text-sm font-semibold text-zinc-900">{item.author}</figcaption>
                  </div>
                </figure>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function HomeFallback() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="space-y-4">
          <div className="h-4 w-24 rounded-full bg-zinc-200" />
          <div className="h-10 w-2/3 rounded-full bg-zinc-200" />
          <div className="h-6 w-1/2 rounded-full bg-zinc-200" />
          <div className="h-10 w-32 rounded-lg bg-amber-200" />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<HomeFallback />}>
      <HomeContent />
    </Suspense>
  );
}
