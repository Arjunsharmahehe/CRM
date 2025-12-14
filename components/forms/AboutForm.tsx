"use client";

import { useState, useTransition } from "react";
import { saveAboutPage } from "@/server/actions";
import { AboutSchema, type AboutContent } from "@/types";
import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { ImageUpload } from "../image-upload";
import { toast } from "sonner";

export default function AboutForm({ initialContent }: { initialContent: AboutContent }) {
  const [content, setContent] = useState<AboutContent>(initialContent);
  const [imagePreview, setImagePreview] = useState<string | null>(initialContent.heroImageUrl || null);
  const [isPending, startTransition] = useTransition();

  const handleImageChange = (base64: string | null) => {
    setImagePreview(base64);
    // TODO: Upload to server and get URL
    // For now, we're not updating content.heroImageUrl
  };

  const handleImageError = (message: string) => {
    toast.error(message);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      try {
        const payload = AboutSchema.parse(content);
        await saveAboutPage(payload);
        toast.success("About page saved.");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Something went wrong.";
        toast.error(message);
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
          <Label className="grid gap-2 text-sm font-medium text-zinc-800">
            Title
            <Input
              value={content.heroTitle}
              onChange={(e) => setContent((prev) => ({ ...prev, heroTitle: e.target.value }))}
              maxLength={64}
              required
            />
          </Label>
          <Label className="grid gap-2 text-sm font-medium text-zinc-800">
            Subtitle
            <Input
              value={content.heroSubtitle}
              onChange={(e) => setContent((prev) => ({ ...prev, heroSubtitle: e.target.value }))}
              maxLength={160}
              required
            />
          </Label>
        </div>
        <div className="grid gap-2">
          <Label className="text-sm font-medium text-zinc-800">
            Hero image
          </Label>
          <ImageUpload
            value={imagePreview}
            onChange={handleImageChange}
            onError={handleImageError}
            maxSizeMB={4}
          />
        </div>
      </section>

      <section className="grid gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">Body</p>
          <h2 className="text-xl font-semibold text-zinc-900">Story</h2>
          <p className="text-sm text-zinc-600">Long-form content that tells your story.</p>
        </div>
        <Label className="grid gap-2 text-sm font-medium text-zinc-800">
          Body copy
          <Textarea
            className="resize-none"
            value={content.body}
            onChange={(e) => setContent((prev) => ({ ...prev, body: e.target.value }))}
            rows={8}
            maxLength={1200}
            required
          />
        </Label>
      </section>

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
