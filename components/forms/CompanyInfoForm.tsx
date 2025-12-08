"use client";

import { useState, useTransition } from "react";
import { saveCompanyInfo } from "@/server/actions";
import { CompanyInfoSchema } from "@/types";
import { cn } from "@/lib/utils";
import type { z } from "zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { ImageUpload } from "@/components/image-upload";
import { toast } from "sonner";

type CompanyInfo = z.infer<typeof CompanyInfoSchema>;

type Props = {
  initialContent: CompanyInfo;
};


export default function CompanyInfoForm({ initialContent }: Props) {
  const [content, setContent] = useState<CompanyInfo>(initialContent);
  const [logoPreview, setLogoPreview] = useState<string | null>(
    initialContent.logoUrl || null
  );
  const [isPending, startTransition] = useTransition();

  const handleLogoChange = (base64: string | null) => {
    setLogoPreview(base64);
    console.log("Logo image updated");
    // TODO: Upload to server and get URL
    // For now, we're not updating content.logoUrl
  };

  const handleImageError = (message: string) => {
    toast.error(message);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      try {
        const payload = CompanyInfoSchema.parse(content);
        await saveCompanyInfo(payload);
        toast.success("Company info saved.");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Something went wrong.";
        toast.error(message);
      }
    });
  };

  return (
    <form id="company-info-form" onSubmit={onSubmit} className="flex flex-col gap-8">
      <section className="grid gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">
            Company
          </p>
          <h2 className="text-xl font-semibold text-zinc-900">Basic information</h2>
          <p className="text-sm text-zinc-600">
            Your company's core details and branding.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Label className="grid gap-2 text-sm font-medium text-zinc-800">
            Company Name
            <Input
              value={content.name}
              onChange={(e) => setContent((prev) => ({ ...prev, name: e.target.value }))}
              maxLength={64}
              required
            />
          </Label>
          <Label className="grid gap-2 text-sm font-medium text-zinc-800">
            Email
            <Input
              type="email"
              value={content.email}
              onChange={(e) => setContent((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
          </Label>
        </div>
        <Label className="grid gap-2 text-sm font-medium text-zinc-800">
          Tagline
          <Textarea
            className="resize-none"
            value={content.tagline}
            onChange={(e) => setContent((prev) => ({ ...prev, tagline: e.target.value }))}
            maxLength={128}
            rows={2}
            required
          />
        </Label>
      </section>

      <section className="grid gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">
            Branding
          </p>
          <h2 className="text-xl font-semibold text-zinc-900">Logo</h2>
          <p className="text-sm text-zinc-600">
            Upload your company logo for consistent branding.
          </p>
        </div>
        <div className="grid gap-2">
          <Label className="text-sm font-medium text-zinc-800">Company Logo</Label>
          <ImageUpload
            value={logoPreview}
            onChange={handleLogoChange}
            onError={handleImageError}
            maxSizeMB={2}
          />
        </div>
      </section>

      <div className="flex items-center justify-end gap-3">
        <button
          type="submit"
          form="company-info-form"
          disabled={isPending}
          className={cn(
            "inline-flex items-center justify-center rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500",
            isPending && "opacity-70"
          )}
        >
          {isPending ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}
