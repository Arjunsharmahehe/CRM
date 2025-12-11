"use client";

import { useState, useTransition } from "react";
import { saveTermsPage } from "@/server/actions";
import { TermsSchema, type TermsContent } from "@/types"
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function TermsForm({ initialContent }: { initialContent: TermsContent }) {
  const [content, setContent] = useState<TermsContent>(initialContent);
  const [isPending, startTransition] = useTransition();
  const [date, setDate ] = useState<Date | undefined>(new Date(content.effectiveDate))
  const [ open, setOpen ] = useState(false)

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(async () => {
      try {
        const payload = TermsSchema.parse(content);
        await saveTermsPage(payload);
        toast.success("Terms & Conditions saved.");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Something went wrong.";
        toast.error(message);
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      <section className="grid gap-4">
        <div className="grid gap-3">
          <Label htmlFor="title" className="text-sm font-medium text-zinc-900">
            Page Title
          </Label>
          <Input
            id="title"
            value={content.title}
            onChange={(e) => setContent({ ...content, title: e.target.value })}
            placeholder="Terms and Conditions"
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="effectiveDate" className="text-sm font-medium text-zinc-900">
            Effective Date
          </Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="w-48 justify-between font-normal"
              >
                {date ? date.toLocaleDateString() : "Select date"}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                captionLayout="dropdown"
                onSelect={(date) => {
                  setContent({ ...content, effectiveDate: date?.toDateString() as string})
                  setDate(date)
                  setOpen(false)
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="content" className="text-sm font-medium text-zinc-900">
              Content (Markdown)
            </Label>
            <a
              href="https://www.markdownguide.org/basic-syntax/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-amber-600 hover:text-amber-700"
            >
              Markdown Guide →
            </a>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Textarea
              id="content"
              value={content.content}
              onChange={(e) => setContent({ ...content, content: e.target.value })}
              placeholder="# Terms and Conditions&#10;&#10;## 1. Acceptance of Terms&#10;&#10;By accessing our service..."
              rows={20}
              className="font-mono text-sm"
            />
            <div className="rounded-lg border border-zinc-200 bg-white p-4 overflow-auto max-h-[500px]">
              <div className="prose prose-sm prose-zinc max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content.content || "*Preview will appear here...*"}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-end gap-3 border-t border-zinc-200 pt-6">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}