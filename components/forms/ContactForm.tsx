"use client";

import { useState, useTransition } from "react";
import { saveContactPage } from "@/server/actions";
import { ContactSchema, type ContactContent } from "../../app/admin/contact/schema";
import { cn } from "@/lib/utils";

export default function ContactForm({ initialContent }: { initialContent: ContactContent }) {
  const [content, setContent] = useState<ContactContent>(initialContent);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );
  const [isPending, startTransition] = useTransition();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    startTransition(async () => {
      try {
        const payload = ContactSchema.parse(content);
        await saveContactPage(payload);
        setStatus({ type: "success", message: "Contact page saved." });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Something went wrong.";
        setStatus({ type: "error", message });
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      <section className="grid gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">Hero</p>
          <h2 className="text-xl font-semibold text-zinc-900">Heading</h2>
          <p className="text-sm text-zinc-600">Primary call-to-action for contacting you.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-zinc-800">
            Headline
            <input
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100"
              value={content.headline}
              onChange={(e) => setContent((prev) => ({ ...prev, headline: e.target.value }))}
              maxLength={64}
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-zinc-800">
            Subheadline
            <input
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100"
              value={content.subheadline}
              onChange={(e) => setContent((prev) => ({ ...prev, subheadline: e.target.value }))}
              maxLength={160}
              required
            />
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-zinc-800">
            CTA Text
            <input
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100"
              value={content.ctaText}
              onChange={(e) => setContent((prev) => ({ ...prev, ctaText: e.target.value }))}
              maxLength={40}
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-zinc-800">
            CTA Link
            <input
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100"
              type="url"
              value={content.ctaLink}
              onChange={(e) => setContent((prev) => ({ ...prev, ctaLink: e.target.value }))}
              required
            />
          </label>
        </div>
      </section>

      <section className="grid gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">Details</p>
          <h2 className="text-xl font-semibold text-zinc-900">Contact information</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-zinc-800">
            Email
            <input
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100"
              type="email"
              value={content.email}
              onChange={(e) => setContent((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-zinc-800">
            Phone
            <input
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100"
              value={content.phone}
              onChange={(e) => setContent((prev) => ({ ...prev, phone: e.target.value }))}
              maxLength={32}
              required
            />
          </label>
        </div>
        <label className="grid gap-2 text-sm font-medium text-zinc-800">
          Address
          <textarea
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100"
            value={content.address}
            onChange={(e) => setContent((prev) => ({ ...prev, address: e.target.value }))}
            rows={3}
            maxLength={200}
            required
          />
        </label>
      </section>

      {status && (
        <div
          className={cn(
            "rounded-lg border px-4 py-3 text-sm",
            status.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-700",
          )}
        >
          {status.message}
        </div>
      )}

      <div className="flex items-center justify-end gap-3">
        <button
          type="submit"
          disabled={isPending}
          className={cn(
            "inline-flex items-center justify-center rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500",
            isPending && "opacity-70",
          )}
        >
          {isPending ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}
