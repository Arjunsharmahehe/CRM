import { getContactPage } from "@/server/actions";
import { ContactSchema, type ContactContent } from "./schema";
import ContactForm from "../../../components/forms/ContactForm";
import { cacheTag } from "next/cache";
import AdminPageWrapper from "@/components/AdminPageWrapper";
import { Suspense } from "react";

const defaultContactContent: ContactContent = {
  headline: "Contact our team",
  subheadline: "Tell us about your project and we'll get back within one business day.",
  email: "hello@example.com",
  phone: "+1 (555) 123-4567",
  address: "123 Market Street, Suite 500, San Francisco, CA",
  ctaText: "Email us",
  ctaLink: "mailto:hello@example.com",
};

async function Form(){
  "use cache"
  cacheTag("contact-page");
  const existing = await getContactPage();
  const initialContent = existing?.content ?? defaultContactContent;

  return <ContactForm initialContent={initialContent} />
}

export default async function AdminContactPage() {
  const existing = await getContactPage();
  const initialContent = existing?.content ?? defaultContactContent;

  return (
    <AdminPageWrapper pageName="Contact" headline="Contact page content" subheadline="Update the headline, subheadline, and contact details for your Contact page.">
      <Suspense fallback={<div>Loading form...</div>}>
        <Form />
      </Suspense>
    </AdminPageWrapper>
  );
}
