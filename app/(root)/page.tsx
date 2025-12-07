import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { listActiveOfferings, getHomePage } from "@/server/actions";
import { HomepageSchema } from "@/types";
import type { z } from "zod";
import { cacheTag } from "next/cache";

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
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="relative overflow-hidden bg-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">Homepage</p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
              {content.hero.headline}
            </h1>
            <p className="text-lg text-zinc-700 lg:text-xl">{content.hero.subheadline}</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={content.hero.ctaLink}
                className="inline-flex items-center justify-center rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
              >
                {content.hero.ctaText}
              </Link>
            </div>
          </div>
          <div className="relative h-72 overflow-hidden rounded-2xl bg-zinc-100 shadow-lg lg:h-96">
            <Image
              src={content.hero.heroImageUrl}
              alt={content.hero.headline}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16">
        <section className="grid gap-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">Offerings</p>
              <h2 className="text-3xl font-bold tracking-tight">{content.offerings.title}</h2>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {offerings.map((item) => (
              <article key={item.id} className="flex h-full flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                  <span>ID {item.id}</span>
                  {item.isActive ? (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">Active</span>
                  ) : (
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-zinc-600">Hidden</span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-zinc-900">{item.title}</h3>
                <p className="text-sm text-zinc-700">{item.description}</p>
                {item.href && (
                  <Link href={item.href} className="text-sm font-semibold text-amber-700 hover:text-amber-800">
                    Learn more →
                  </Link>
                )}
              </article>
            ))}
            {offerings.length === 0 && (
              <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-6 text-sm text-zinc-600">
                No offerings yet. Add some in the database to populate this section.
              </div>
            )}
          </div>
        </section>

        <section className="grid gap-8">
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
