import { getTermsPage } from "@/server/actions";
import { cacheTag } from "next/cache";
import { Suspense } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

async function TermsAndConditions() {
  "use cache"
  cacheTag("terms-page");
  const page = await getTermsPage();

  if (!page) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-4xl font-bold text-zinc-900">Terms and Conditions</h1>
        <p className="mt-4 text-zinc-600">Content not available.</p>
      </div>
    );
  }

  const { title, content, effectiveDate } = page.content;

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <header className="mb-12 border-b border-zinc-200 pb-8">
        <h1 className="text-4xl font-bold text-zinc-900">{title}</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Effective Date: {new Date(effectiveDate).toLocaleDateString()}
        </p>
      </header>
      <article className="prose prose-lg prose-zinc max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </article>
    </div>
  );
}

export default async function TermsPage() {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TermsAndConditions />
    </Suspense>
  );
}