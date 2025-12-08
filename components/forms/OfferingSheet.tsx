"use client";

import { useState, useTransition, useEffect } from "react";
import { createOffering, updateOffering } from "@/server/actions";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/image-upload";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

type Offering = {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  href: string | null;
  isActive: boolean | null;
};

type OfferingFormData = {
  title: string;
  description: string;
  imageUrl: string;
  href: string;
  isActive: boolean;
};

const initialFormData: OfferingFormData = {
  title: "",
  description: "",
  imageUrl: "",
  href: "",
  isActive: true,
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offering?: Offering | null;
  onSuccess?: () => void;
};

export function OfferingSheet({ open, onOpenChange, offering, onSuccess }: Props) {
  const [formData, setFormData] = useState<OfferingFormData>(initialFormData);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const isEditing = !!offering;

  useEffect(() => {
    if (offering) {
      setFormData({
        title: offering.title,
        description: offering.description,
        imageUrl: offering.imageUrl || "",
        href: offering.href || "",
        isActive: offering.isActive ?? true,
      });
      setImagePreview(offering.imageUrl);
    } else {
      setFormData(initialFormData);
      setImagePreview(null);
    }
  }, [offering]);

  const handleImageChange = (base64: string | null) => {
    setImagePreview(base64);
    console.log("Offering image updated");
    // TODO: Upload to server and get URL
  };

  const handleImageError = (message: string) => {
    toast.error(message);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        const offeringData = {
          ...formData,
          imageUrl: imagePreview || formData.imageUrl || "https://placehold.co/600x400",
        };

        if (isEditing) {
          await updateOffering(offering.id, offeringData);
          toast.success("Offering updated successfully!");
        } else {
          await createOffering(offeringData);
          toast.success("Offering created successfully!");
        }
        
        setFormData(initialFormData);
        setImagePreview(null);
        onOpenChange(false);
        onSuccess?.();
      } catch (error) {
        const message = error instanceof Error ? error.message : `Failed to ${isEditing ? 'update' : 'create'} offering.`;
        toast.error(message);
        console.error(error);
      }
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setFormData(initialFormData);
      setImagePreview(null);
    }
    onOpenChange(newOpen);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isEditing ? "Edit Offering" : "Create New Offering"}</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="mt-6 px-3 flex flex-col gap-6">
          <div className="grid gap-4">
            <Label className="grid gap-2 text-sm font-medium text-zinc-800">
              Title
              <Input
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Web Development"
                maxLength={100}
                required
              />
            </Label>

            <Label className="grid gap-2 text-sm font-medium text-zinc-800">
              Description
              <Textarea
                className="resize-none"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this offering includes..."
                rows={4}
                maxLength={500}
                required
              />
            </Label>

            <div className="grid gap-2">
              <Label className="text-sm font-medium text-zinc-800">
                Image
              </Label>
              <ImageUpload
                value={imagePreview}
                onChange={handleImageChange}
                onError={handleImageError}
                maxSizeMB={2}
              />
            </div>

            <Label className="grid gap-2 text-sm font-medium text-zinc-800">
              Link (Optional)
              <Input
                type="url"
                value={formData.href}
                onChange={(e) => setFormData((prev) => ({ ...prev, href: e.target.value }))}
                placeholder="https://example.com/service"
              />
            </Label>

            <Label className="flex items-center gap-2 text-sm font-medium text-zinc-800">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                className="h-4 w-4 rounded border-zinc-300 text-amber-600 focus:ring-amber-500"
              />
              Active (visible on site)
            </Label>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-zinc-200 pt-4">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 text-sm font-medium text-zinc-700 hover:text-zinc-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className={cn(
                "inline-flex items-center justify-center rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500",
                isPending && "opacity-70"
              )}
            >
              {isPending ? <Spinner className="mr-2" /> : null}
              {isPending ? (isEditing ? "Updating" : "Creating") : (isEditing ? "Update Offering" : "Create Offering")}
            </button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
