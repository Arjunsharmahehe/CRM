"use client";

import { useState, useTransition } from "react";
import { saveHomePage } from "@/server/actions";
import { HomepageSchema } from "@/types";
import { cn } from "@/lib/utils";
import type { z } from "zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { ImageUpload } from "@/components/image-upload";
import { toast } from "sonner";

type HomeContent = z.infer<typeof HomepageSchema>;

type Props = {
  initialContent: HomeContent;
};

const newTestimonial = () => ({
  quote: "A short testimonial about our work.",
  author: "Customer Name",
  authorImageUrl:
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=200&q=80",
});

export default function HomeForm({ initialContent }: Props) {
  const [content, setContent] = useState<HomeContent>(initialContent);
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(
    initialContent.hero.heroImageUrl || null
  );
  const [testimonialImages, setTestimonialImages] = useState<{ [key: number]: string | null }>(
    Object.fromEntries(
      initialContent.testimonials.items.map((item, index) => [index, item.authorImageUrl || null])
    )
  );

  const [isPending, startTransition] = useTransition();

  const handleHeroChange = (key: keyof HomeContent["hero"], value: string) => {
    setContent((prev) => ({
      ...prev,
      hero: { ...prev.hero, [key]: value },
    }));
  };

  const handleHeroImageChange = (base64: string | null) => {
    setHeroImagePreview(base64);
    console.log("Hero image updated");
    // TODO: Upload to server and get URL
  };

  const handleTestimonialImageChange = (index: number, base64: string | null) => {
    setTestimonialImages((prev) => ({ ...prev, [index]: base64 }));
    console.log(`Testimonial ${index} image updated`);
    // TODO: Upload to server and get URL
  };

  const handleImageError = (message: string) => {
    toast.error(message);
  };

  const handleOfferingsChange = (value: string) => {
    setContent((prev) => ({
      ...prev,
      offerings: { ...prev.offerings, title: value },
    }));
  };

  const handleTestimonialsTitleChange = (value: string) => {
    setContent((prev) => ({
      ...prev,
      testimonials: { ...prev.testimonials, title: value },
    }));
  };

  const handleTestimonialChange = <K extends keyof HomeContent["testimonials"]["items"][number]>(
    index: number,
    key: K,
    value: string,
  ) => {
    setContent((prev) => {
      const next = [...prev.testimonials.items];
      next[index] = { ...next[index], [key]: value };
      return {
        ...prev,
        testimonials: { ...prev.testimonials, items: next },
      };
    });
  };

  const addTestimonial = () => {
    const newIndex = content.testimonials.items.length;
    setContent((prev) => ({
      ...prev,
      testimonials: {
        ...prev.testimonials,
        items: [...prev.testimonials.items, newTestimonial()],
      },
    }));
    setTestimonialImages((prev) => ({
      ...prev,
      [newIndex]: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=200&q=80",
    }));
  };

  const removeTestimonial = (index: number) => {
    setContent((prev) => ({
      ...prev,
      testimonials: {
        ...prev.testimonials,
        items: prev.testimonials.items.filter((_, i) => i !== index),
      },
    }));
    setTestimonialImages((prev) => {
      const updated = { ...prev };
      delete updated[index];
      // Reindex remaining items
      const reindexed: { [key: number]: string | null } = {};
      Object.keys(updated)
        .map(Number)
        .sort((a, b) => a - b)
        .forEach((oldIndex, newIndex) => {
          if (oldIndex > index) {
            reindexed[newIndex] = updated[oldIndex];
          } else {
            reindexed[oldIndex] = updated[oldIndex];
          }
        });
      return reindexed;
    });
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      try {
        const payload = HomepageSchema.parse(content);
        await saveHomePage(payload);
        toast.success("Homepage saved.");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Something went wrong. Please try again.";
          toast.error(message);
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      <section className="grid gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">Hero</p>
          <h2 className="text-xl font-semibold text-zinc-900">Headline & CTA</h2>
          <p className="text-sm text-zinc-600">The first thing visitors see.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Label className="grid h-fit gap-2 text-sm font-medium text-zinc-800">
            Headline
            <Input
              value={content.hero.headline}
              onChange={(e) => handleHeroChange("headline", e.target.value)}
              maxLength={48}
              required
            />
          </Label>
          <Label className="grid gap-2 text-sm font-medium text-zinc-800">
            Subheadline
            <Textarea
              className="resize-none"
              value={content.hero.subheadline}
              onChange={(e) => handleHeroChange("subheadline", e.target.value)}
              maxLength={128}
              rows={3}
              required
            />
          </Label>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Label className="grid gap-2 text-sm font-medium text-zinc-800">
            CTA Text
            <Input
              value={content.hero.ctaText}
              onChange={(e) => handleHeroChange("ctaText", e.target.value)}
              maxLength={24}
              required
            />
          </Label>
          <Label className="grid gap-2 text-sm font-medium text-zinc-800 sm:col-span-2">
            CTA Link (URL)
            <Input
              type="url"
              value={content.hero.ctaLink}
              onChange={(e) => handleHeroChange("ctaLink", e.target.value)}
              required
            />
          </Label>
        </div>
        <div className="grid gap-2">
          <Label className="text-sm font-medium text-zinc-800">
            Hero Image
          </Label>
          <ImageUpload
            value={heroImagePreview}
            onChange={handleHeroImageChange}
            onError={handleImageError}
            maxSizeMB={4}
          />
        </div>
      </section>

      <section className="grid gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">Offerings</p>
          <h2 className="text-xl font-semibold text-zinc-900">Section title</h2>
          <p className="text-sm text-zinc-600">Offerings list is driven by the database; this only sets the section heading.</p>
        </div>
        <Label className="grid gap-2 text-sm font-medium text-zinc-800">
          Title
          <Input
            value={content.offerings.title}
            onChange={(e) => handleOfferingsChange(e.target.value)}
            maxLength={32}
            required
          />
        </Label>
      </section>

      <section className="grid gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">Testimonials</p>
          <h2 className="text-xl font-semibold text-zinc-900">Quotes</h2>
          <p className="text-sm text-zinc-600">Add social proof cards with author details and avatar URLs.</p>
        </div>
        <Label className="grid gap-2 text-sm font-medium text-zinc-800">
          Section title
          <Input
            value={content.testimonials.title}
            onChange={(e) => handleTestimonialsTitleChange(e.target.value)}
            maxLength={32}
            required
          />
        </Label>

        <div className="grid gap-4">
          {content.testimonials.items.map((item, index) => (
            <div key={index} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="grid flex-1 gap-3">
                  <Label className="grid gap-1 text-sm font-medium text-zinc-800">
                    Quote
                    <Textarea
                      className="resize-none"
                      value={item.quote}
                      onChange={(e) => handleTestimonialChange(index, "quote", e.target.value)}
                      maxLength={256}
                      rows={3}
                      required
                    />
                  </Label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Label className="grid gap-1 text-sm font-medium text-zinc-800">
                      Author
                      <Input
                        value={item.author}
                        onChange={(e) => handleTestimonialChange(index, "author", e.target.value)}
                        maxLength={64}
                        required
                      />
                    </Label>
                  </div>
                  <div className="grid gap-1">
                    <Label className="text-sm font-medium text-zinc-800">
                      Author Image
                    </Label>
                    <ImageUpload
                      value={testimonialImages[index] ?? null}
                      onChange={(base64) => handleTestimonialImageChange(index, base64)}
                      onError={handleImageError}
                      maxSizeMB={2}
                    />
                  </div>
                  <div className="hidden">
                    {/* Keep original structure for backward compatibility */}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeTestimonial(index)}
                  className="text-sm font-medium text-rose-600 hover:text-rose-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addTestimonial}
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-dashed border-amber-300 px-4 py-2 text-sm font-medium text-amber-700 hover:border-amber-400 hover:bg-amber-50"
          >
            + Add testimonial
          </button>
        </div>
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
