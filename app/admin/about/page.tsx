import { getAboutPage } from "@/server/actions";
import { AboutSchema, type AboutContent } from "./schema";
import AboutForm from "./AboutForm";

const defaultAboutContent: AboutContent = {
  heroTitle: "About our team",
  heroSubtitle: "We are builders, designers, and operators who care about quality and speed.",
  heroImageUrl:
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
  body: "Use this space to tell your story, your mission, and what makes your company different.",
};

export default async function AdminAboutPage() {
  const existing = await getAboutPage();
  const initialContent = existing?.content ?? defaultAboutContent;

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">About</p>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">About page content</h1>
        <p className="text-sm text-zinc-600">Update the hero and body copy for your About page.</p>
      </div>

      <AboutForm initialContent={initialContent} />
    </div>
  );
}
