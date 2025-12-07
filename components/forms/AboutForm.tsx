"use client";

import { useState, useTransition } from "react";
import { saveAboutPage } from "@/server/actions";
import { AboutSchema, type AboutContent } from "../../app/admin/about/schema";
import { cn } from "@/lib/utils";

export default function AboutForm({ initialContent }: { initialContent: AboutContent }) {
  const [content, setContent] = useState<AboutContent>(initialContent);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );
  const [isPending, startTransition] = useTransition();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    startTransition(async () => {
      try {
        const payload = AboutSchema.parse(content);
        await saveAboutPage(payload);
        setStatus({ type: "success", message: "About page saved." });
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
          <h2 className="text-xl font-semibold text-zinc-900">Heading and imagery</h2>
          <p className="text-sm text-zinc-600">Update the hero copy and image for your About page.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-zinc-800">
            Title
            <input
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100"
              value={content.heroTitle}
              onChange={(e) => setContent((prev) => ({ ...prev, heroTitle: e.target.value }))}
              maxLength={64}
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-zinc-800">
            Subtitle
            <input
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100"
              value={content.heroSubtitle}
              onChange={(e) => setContent((prev) => ({ ...prev, heroSubtitle: e.target.value }))}
              maxLength={160}
              required
            />
          </label>
        </div>
        <label className="grid gap-2 text-sm font-medium text-zinc-800">
          Hero image URL
          <input
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100"
            type="url"
            value={content.heroImageUrl}
            onChange={(e) => setContent((prev) => ({ ...prev, heroImageUrl: e.target.value }))}
            required
          />
        </label>
      </section>

      <section className="grid gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">Body</p>
          <h2 className="text-xl font-semibold text-zinc-900">Story</h2>
          <p className="text-sm text-zinc-600">Long-form content that tells your story.</p>
        </div>
        <label className="grid gap-2 text-sm font-medium text-zinc-800">
          Body copy
          <textarea
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100"
            value={content.body}
            onChange={(e) => setContent((prev) => ({ ...prev, body: e.target.value }))}
            rows={8}
            maxLength={1200}
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
