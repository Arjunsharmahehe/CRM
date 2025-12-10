import z from "zod";

export const HomepageSchema = z.object({
    hero: z.object({
        headline: z.string().max(48, "Headline must be at most 48 characters long"),
        subheadline: z.string().max(128, "Subheadline must be at most 128 characters long"),
        ctaText: z.string().max(24, "CTA Text must be at most 24 characters long"),
        ctaLink: z.url("CTA Link must be a valid URL"),
        heroImageUrl: z.url("Hero Image URL must be a valid URL"),
    }),
    offerings: z.object({
        title: z.string().max(32, "Title must be at most 32 characters long"),
    }),
    testimonials: z.object({
        title: z.string().max(32, "Title must be at most 32 characters long"),
        items: z.array(z.object({
            quote: z.string().max(256, "Quote must be at most 256 characters long"),
            author: z.string().max(64, "Author name must be at most 64 characters long"),
            authorImageUrl: z.url("Author image URL must be a valid URL"),
        }))
    }),
})

export const CompanyInfoSchema = z.object({
    name: z.string().max(64, "Company name must be at most 64 characters long"),
    tagline: z.string().max(128, "Tagline must be at most 128 characters long").optional(),
    email: z.email("Email must be a valid email address"),
    logoUrl: z.url("Logo URL must be a valid URL"),
})

export const TermsSchema = z.object({
    title: z.string().max(100, "Title must be at most 100 characters long"),
    content: z.string(),
    effectiveDate: z.string().min(1, "Effective date is required")
})

export const PrivacySchema = z.object({
  title: z.string().max(128, "Title must be at most 128 characters"),
  content: z.string().min(1, "Content is required"),
  effectiveDate: z.string().min(1, "Effective date is required"),
});

export type HomepageContent = z.infer<typeof HomepageSchema>;
export type CompanyInfoContent = z.infer<typeof CompanyInfoSchema>;
export type TermsContent = z.infer<typeof TermsSchema>;
export type PrivacyContent = z.infer<typeof PrivacySchema>;

