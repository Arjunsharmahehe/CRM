import { getTermsPage } from "@/server/actions";
import { type TermsContent } from "@/types";
import TermsForm from "@/components/forms/TermsForm";
import AdminPageWrapper from "@/components/AdminPageWrapper";
import { cacheTag } from "next/cache";
import { Suspense } from "react";

const defaultTermsContent: TermsContent = {
  title: "Terms and Conditions",
  effectiveDate: new Date().toISOString().split('T')[0],
  content: `# Terms and Conditions

## 1. Acceptance of Terms

By accessing and using this service, you accept and agree to be bound by the terms and conditions of this agreement.

## 2. Use License

Permission is granted to temporarily access the materials on our website for personal, non-commercial use only.

## 3. Disclaimer

The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied.`,
};

async function Form() {
  "use cache"
  cacheTag("terms-form");
  const existing = await getTermsPage();
  const initialContent = existing?.content ?? defaultTermsContent;

  return <TermsForm initialContent={initialContent} />;
}

export default async function AdminTermsPage() {
  return (
    <AdminPageWrapper
      pageName="Terms"
      headline="Terms & Conditions"
      subheadline="Edit your terms and conditions using markdown formatting."
    >
      <Suspense fallback={<div>Loading form...</div>}>
        <Form />
      </Suspense>
    </AdminPageWrapper>
  );
}