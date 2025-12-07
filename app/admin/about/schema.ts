import { z } from "zod";

export const AboutSchema = z.object({
  heroTitle: z.string().max(64, "Title must be at most 64 characters"),
  heroSubtitle: z.string().max(160, "Subtitle must be at most 160 characters"),
  heroImageUrl: z.string().url("Hero image must be a valid URL"),
  body: z.string().max(1200, "Body must be at most 1200 characters"),
});

export type AboutContent = z.infer<typeof AboutSchema>;
