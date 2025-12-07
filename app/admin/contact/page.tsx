import { getContactPage } from "@/server/actions";
import { ContactSchema, type ContactContent } from "./schema";
import ContactForm from "./ContactForm";

const defaultContactContent: ContactContent = {
  headline: "Contact our team",
  subheadline: "Tell us about your project and we'll get back within one business day.",
  email: "hello@example.com",
  phone: "+1 (555) 123-4567",
  address: "123 Market Street, Suite 500, San Francisco, CA",
  ctaText: "Email us",
  ctaLink: "mailto:hello@example.com",
};

export default async function AdminContactPage() {
  const existing = await getContactPage();
  const initialContent = existing?.content ?? defaultContactContent;

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">Contact</p>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Contact page content</h1>
        <p className="text-sm text-zinc-600">Manage contact details, CTA, and address.</p>
      </div>

      <ContactForm initialContent={initialContent} />
    </div>
  );
}
