"use client";

import { useState, useTransition } from "react";
import { deleteOffering } from "@/server/actions";
import { Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

type Offering = {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  href: string | null;
  isActive: boolean | null;
};

type Props = {
  offerings: Offering[];
  onEdit: (offering: Offering) => void;
  onDelete: () => void;
};

export function OfferingsList({ offerings, onEdit, onDelete }: Props) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this offering?")) return;

    setDeletingId(id);
    startTransition(async () => {
      try {
        await deleteOffering(id);
        toast.success("Offering deleted successfully!");
        onDelete();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to delete offering.";
        toast.error(message);
      } finally {
        setDeletingId(null);
      }
    });
  };

  if (offerings.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 p-8 text-center">
        <p className="text-sm text-zinc-500">No offerings yet. Create your first offering above.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {offerings.map((offering) => (
        <div
          key={offering.id}
          className="flex items-start gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
        >
          {offering.imageUrl && (
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-zinc-100">
              <Image
                src={offering.imageUrl}
                alt={offering.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="text-sm font-semibold text-zinc-900">{offering.title}</h4>
                <p className="mt-1 text-xs text-zinc-600 line-clamp-2">{offering.description}</p>
                {offering.href && (
                  <a
                    href={offering.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-xs text-amber-600 hover:text-amber-700"
                  >
                    View link →
                  </a>
                )}
              </div>
              <div className="flex items-center gap-2">
                {!offering.isActive && offering.isActive !== null && (
                  <span className="rounded bg-zinc-100 px-2 py-1 text-xs text-zinc-600">
                    Inactive
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => onEdit(offering)}
                  className="rounded p-1.5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                  title="Edit offering"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(offering.id)}
                  disabled={deletingId === offering.id || isPending}
                  className="rounded p-1.5 text-zinc-600 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                  title="Delete offering"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
