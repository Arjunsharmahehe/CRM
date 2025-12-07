import { z } from "zod";

export const ContactSchema = z.object({
  headline: z.string().max(64, "Headline must be at most 64 characters"),
  subheadline: z.string().max(160, "Subheadline must be at most 160 characters"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().max(32, "Phone must be at most 32 characters"),
  address: z.string().max(200, "Address must be at most 200 characters"),
  ctaText: z.string().max(40, "CTA text must be at most 40 characters"),
  ctaLink: z.string().url("CTA link must be a valid URL"),
});

export type ContactContent = z.infer<typeof ContactSchema>;
