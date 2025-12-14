import Image from "next/image";
import Link from "next/link";
import { getAboutPage } from "@/server/actions";
import { AboutSchema, type AboutContent } from "@/types";
import { cacheTag } from "next/cache";

const defaultAboutContent: AboutContent = {
  heroTitle: "About our team",
  heroSubtitle: "We are builders, designers, and operators who care about quality and speed.",
  heroImageUrl:
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
  body: "Use this space to tell your story, your mission, and what makes your company different.",
};

export default async function AboutPage() {
  "use cache"
  cacheTag("about-page");
  const page = await getAboutPage();
  const content = page?.content ?? defaultAboutContent;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="relative overflow-hidden bg-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">About</p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
              {content.heroTitle}
            </h1>
            <p className="text-lg text-zinc-700 lg:text-xl">{content.heroSubtitle}</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
              >
                Get in touch
              </Link>
              <Link
                href="/admin/about"
                className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-800 shadow-sm transition hover:border-amber-200 hover:text-amber-700"
              >
                Edit about page
              </Link>
            </div>
          </div>
          <div className="relative h-72 overflow-hidden rounded-2xl bg-zinc-100 shadow-lg lg:h-96">
            <Image src={content.heroImageUrl} alt={content.heroTitle} fill className="object-cover" priority />
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16">
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <article className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
            <div className="prose prose-zinc max-w-none prose-headings:font-semibold prose-p:text-zinc-700">
              <p className="whitespace-pre-line text-lg leading-8 text-zinc-800">{content.body}</p>
            </div>
          </article>
          <aside className="rounded-2xl border border-dashed border-amber-200 bg-amber-50/60 p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">What drives us</p>
            <p className="mt-3 text-lg font-semibold text-amber-900">Quality, speed, and partnership.</p>
            <p className="mt-2 text-sm text-amber-900/80">
              We build reliable systems, iterate quickly, and keep you in the loop. Have a new idea? Talk to us.
            </p>
            <div className="mt-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
              >
                Start a project
              </Link>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
