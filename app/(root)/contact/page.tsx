import Image from "next/image";
import Link from "next/link";
import { getContactPage } from "@/server/actions";
import { ContactSchema, type ContactContent } from "@/app/admin/contact/schema";
import { cacheTag } from "next/cache";

const defaultContactContent: ContactContent = {
  headline: "Contact our team",
  subheadline: "Tell us about your project and we'll get back within one business day.",
  email: "hello@example.com",
  phone: "+1 (555) 123-4567",
  address: "123 Market Street, Suite 500, San Francisco, CA",
  ctaText: "Email us",
  ctaLink: "mailto:hello@example.com",
};

export default async function ContactPage() {
  "use cache"
  cacheTag("contact-page");
  const page = await getContactPage();
  const content = page?.content ?? defaultContactContent;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="relative overflow-hidden bg-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">Contact</p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
              {content.headline}
            </h1>
            <p className="text-lg text-zinc-700 lg:text-xl">{content.subheadline}</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={content.ctaLink}
                className="inline-flex items-center justify-center rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
              >
                {content.ctaText}
              </Link>
            </div>
          </div>
          <div className="relative h-72 overflow-hidden rounded-2xl bg-zinc-100 shadow-lg lg:h-96">
            <Image
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80"
              alt="Team collaborating"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-start">
          <section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-zinc-900">Get in touch</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Prefer email or phone? Use whatever is easiest. We'll respond quickly.
            </p>
            <dl className="mt-6 space-y-4 text-sm text-zinc-800">
              <div className="flex gap-3">
                <dt className="w-20 font-semibold text-zinc-700">Email</dt>
                <dd>
                  <Link href={`mailto:${content.email}`} className="text-amber-700 hover:text-amber-800">
                    {content.email}
                  </Link>
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-20 font-semibold text-zinc-700">Phone</dt>
                <dd>{content.phone}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-20 font-semibold text-zinc-700">Address</dt>
                <dd className="text-zinc-800">{content.address}</dd>
              </div>
            </dl>
          </section>

          <aside className="rounded-2xl border border-dashed border-amber-200 bg-amber-50/60 p-6 text-sm text-amber-900">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Need something specific?</p>
            <p className="mt-3 text-lg font-semibold text-amber-900">Tell us what you need.</p>
            <p className="mt-2">
              Partnerships, bulk orders, or other questions? We're here to help.
            </p>
            <div className="mt-4">
              <Link
                href={content.ctaLink}
                className="inline-flex items-center justify-center rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
              >
                {content.ctaText}
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
