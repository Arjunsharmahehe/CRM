"use client";

import { useState, useTransition } from "react";
import { saveContactPage } from "@/server/actions";
import { ContactSchema, type ContactContent } from "@/types";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import { CTAInputTooltip } from "../CTATooltip";
import { toast } from "sonner";

export default function ContactForm({ initialContent }: { initialContent: ContactContent }) {
  const [content, setContent] = useState<ContactContent>(initialContent);
  const [isPending, startTransition] = useTransition();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();


    startTransition(async () => {
      try {
        const payload = ContactSchema.parse(content);
        await saveContactPage(payload);
        toast.success("Contact page saved.");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Something went wrong.";
        toast.error(message);
      }
    });
  };

  return (
    <form id="contact-metadata-form" onSubmit={onSubmit} className="flex flex-col gap-8">
      <section className="grid gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">Hero</p>
          <h2 className="text-xl font-semibold text-zinc-900">Heading</h2>
          <p className="text-sm text-zinc-600">Primary call-to-action for contacting you.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Label className="grid gap-2 text-sm font-medium text-zinc-800">
            Headline
            <Input
              value={content.headline}
              onChange={(e) => setContent((prev) => ({ ...prev, headline: e.target.value }))}
              maxLength={64}
              required
            />
          </Label>
          <Label className="grid gap-2 text-sm font-medium text-zinc-800">
            Subheadline
            <Input
              value={content.subheadline}
              onChange={(e) => setContent((prev) => ({ ...prev, subheadline: e.target.value }))}
              maxLength={160}
              required
            />
          </Label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Label className="grid gap-2 text-sm font-medium text-zinc-800">
            CTA Text
            <Input
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100"
              value={content.ctaText}
              onChange={(e) => setContent((prev) => ({ ...prev, ctaText: e.target.value }))}
              maxLength={40}
              required
            />
          </Label>
          <Label className="grid gap-2 text-sm font-medium text-zinc-800">
            CTA Link
            <InputGroup>
            <InputGroupInput
              type="url"
              value={content.ctaLink}
              onChange={(e) => setContent((prev) => ({ ...prev, ctaLink: e.target.value }))}
              required
            />
            <InputGroupAddon align="inline-end">
              <CTAInputTooltip />
            </InputGroupAddon>
            </InputGroup>

          </Label>
        </div>
      </section>

      <section className="grid gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">Details</p>
          <h2 className="text-xl font-semibold text-zinc-900">Contact information</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Label className="grid gap-2 text-sm font-medium text-zinc-800">
            Email
            <Input
              type="email"
              value={content.email}
              onChange={(e) => setContent((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
          </Label>
          <Label className="grid gap-2 text-sm font-medium text-zinc-800">
            Phone
            <Input
              value={content.phone}
              onChange={(e) => setContent((prev) => ({ ...prev, phone: e.target.value }))}
              maxLength={32}
              required
            />
          </Label>
        </div>
        <Label className="grid gap-2 text-sm font-medium text-zinc-800">
          Address
          <Textarea
            className="resize-none"
            value={content.address}
            onChange={(e) => setContent((prev) => ({ ...prev, address: e.target.value }))}
            rows={3}
            maxLength={200}
            required
          />
        </Label>
      </section>

      <div className="flex items-center justify-end gap-3">
        <button
          type="submit"
          form="contact-metadata-form"
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

