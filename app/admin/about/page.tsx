import { getAboutPage } from "@/server/actions";
import { AboutSchema, type AboutContent } from "./schema";
import AboutForm from "@/components/forms/AboutForm";
import AdminPageWrapper from "@/components/AdminPageWrapper";
import { cacheTag } from "next/cache";
import { Suspense } from "react";

const defaultAboutContent: AboutContent = {
  heroTitle: "About our team",
  heroSubtitle: "We are builders, designers, and operators who care about quality and speed.",
  heroImageUrl:
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
  body: "Use this space to tell your story, your mission, and what makes your company different.",
};

async function Form(){
  "use cache"
  cacheTag("about-form");
  const existing = await getAboutPage();
  const initialContent = existing?.content ?? defaultAboutContent;

  return <AboutForm initialContent={initialContent} />
}

export default async function AdminAboutPage() {

  return (
    <AdminPageWrapper pageName="About" headline="About page content" subheadline="Update the hero and body copy for your About page.">
      <Suspense fallback={<div>Loading form...</div>}>
        <Form />
      </Suspense>
    </AdminPageWrapper>
  );
}
