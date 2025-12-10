import { getPrivacyPage } from "@/server/actions";
import { type PrivacyContent } from "@/types";
import PrivacyForm from "@/components/forms/PrivacyForm";
import AdminPageWrapper from "@/components/AdminPageWrapper";
import { cacheTag } from "next/cache";
import { Suspense } from "react";

const defaultPrivacyContent: PrivacyContent = {
  title: "Privacy Policy",
  effectiveDate: new Date().toISOString().split('T')[0],
  content: `# Privacy Policy

## Information We Collect

We collect information that you provide directly to us, including when you create an account or contact us.

## How We Use Your Information

We use the information we collect to:
- Provide and maintain our services
- Communicate with you
- Improve our services

## Data Security

We implement appropriate security measures to protect your personal information.`,
};

async function Form() {
  "use cache"
  cacheTag("privacy-form");
  const existing = await getPrivacyPage();
  const initialContent = existing?.content ?? defaultPrivacyContent;

  return <PrivacyForm initialContent={initialContent} />;
}

export default async function AdminPrivacyPage() {
  return (
    <AdminPageWrapper
      pageName="Privacy"
      headline="Privacy Policy"
      subheadline="Edit your privacy policy using markdown formatting."
    >
      <Suspense fallback={<div>Loading form...</div>}>
        <Form />
      </Suspense>
    </AdminPageWrapper>
  );
}