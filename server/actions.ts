"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "../db";
import { offerings, pages } from "../db/schema";
import { HomepageSchema, CompanyInfoSchema } from "../types";
import { AboutSchema } from "@/types";
import { ContactSchema } from "@/types";
import { TermsSchema } from "@/types";
import { PrivacySchema } from "@/types";
import { updateTag } from "next/cache";

type HomepageContent = z.infer<typeof HomepageSchema>;

const PageSlugSchema = z.string().min(1, "Slug is required");

const OfferingInputSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().min(1, "Description is required"),
	imageUrl: z.url().optional().or(z.literal("")).nullable(),
	href: z.url().optional().or(z.literal("")).nullable(),
	isActive: z.boolean().optional().default(true),
});

const OfferingUpdateSchema = OfferingInputSchema.partial().refine(
	(value) => Object.keys(value).length > 0,
	"At least one field must be provided for update",
);

function validatePageContent(slug: string, content: unknown) {
	if (slug === "home") {
		return HomepageSchema.parse(content);
	}

	return content;
}

export async function getPage(slug: string) {
	const safeSlug = PageSlugSchema.parse(slug);
	const rows = await db
		.select()
		.from(pages)
		.where(eq(pages.slug, safeSlug))
		.limit(1);

	if (rows.length === 0) {
		return null;
	}

	const validatedContent = validatePageContent(safeSlug, rows[0].content);

	return { slug: safeSlug, content: validatedContent as HomepageContent | unknown };
}

export async function upsertPage(slug: string, content: unknown) {
	const safeSlug = PageSlugSchema.parse(slug);
	const validatedContent = validatePageContent(safeSlug, content);

	await db
		.insert(pages)
		.values({ slug: safeSlug, content: validatedContent })
		.onConflictDoUpdate({
			target: pages.slug,
			set: { content: validatedContent },
		});

	return { slug: safeSlug, content: validatedContent };
}

export async function updatePage(slug: string, content: unknown) {
	const safeSlug = PageSlugSchema.parse(slug);
	const validatedContent = validatePageContent(safeSlug, content);

	const updated = await db
		.update(pages)
		.set({ content: validatedContent })
		.where(eq(pages.slug, safeSlug))
		.returning({ slug: pages.slug });

	if (updated.length === 0) {
		throw new Error(`Page "${safeSlug}" does not exist`);
	}

	return { slug: safeSlug, content: validatedContent };
}

export async function getHomePage() {
	const page = await getPage("home");

	if (!page) return null;

	return page as { slug: "home"; content: HomepageContent };
}

export async function saveHomePage(content: unknown) {
	const validatedContent = HomepageSchema.parse(content);

	await db
		.insert(pages)
		.values({ slug: "home", content: validatedContent })
		.onConflictDoUpdate({
			target: pages.slug,
			set: { content: validatedContent },
		});
    updateTag("home-page");
	updateTag("home-form");
	return { slug: "home", content: validatedContent };
}

export async function getAboutPage() {
	const rows = await db.select().from(pages).where(eq(pages.slug, "about")).limit(1);
	if (rows.length === 0) return null;

	const content = AboutSchema.parse(rows[0].content);
	return { slug: "about" as const, content };
}

export async function saveAboutPage(content: unknown) {
	const validatedContent = AboutSchema.parse(content);

	await db
		.insert(pages)
		.values({ slug: "about", content: validatedContent })
		.onConflictDoUpdate({
			target: pages.slug,
			set: { content: validatedContent },
		});
	updateTag("about-page");
	updateTag("about-form");
	return { slug: "about" as const, content: validatedContent };
}

export async function getContactPage() {
	const rows = await db.select().from(pages).where(eq(pages.slug, "contact")).limit(1);
	if (rows.length === 0) return null;

	const content = ContactSchema.parse(rows[0].content);
	return { slug: "contact" as const, content };
}

export async function saveContactPage(content: unknown) {
	const validatedContent = ContactSchema.parse(content);

	await db
		.insert(pages)
		.values({ slug: "contact", content: validatedContent })
		.onConflictDoUpdate({
			target: pages.slug,
			set: { content: validatedContent },
		});
	updateTag("contact-page");
	updateTag("contact-form");
	return { slug: "contact" as const, content: validatedContent };
}

export async function getCompanyInfo() {
	const rows = await db.select().from(pages).where(eq(pages.slug, "company-info")).limit(1);
	if (rows.length === 0) return null;

	const content = CompanyInfoSchema.parse(rows[0].content);
	return { slug: "company-info" as const, content };
}

export async function saveCompanyInfo(content: unknown) {
	const validatedContent = CompanyInfoSchema.parse(content);

	await db
		.insert(pages)
		.values({ slug: "company-info", content: validatedContent })
		.onConflictDoUpdate({
			target: pages.slug,
			set: { content: validatedContent },
		});
	updateTag("company-info-form");
	updateTag("public-footer");
	return { slug: "company-info" as const, content: validatedContent };
}

export async function listActiveOfferings() {
	const rows = await db
		.select()
		.from(offerings)
		.where(eq(offerings.isActive, true))
		.orderBy(offerings.id);

	return rows;
}

export async function listAllOfferings() {
	const rows = await db
		.select()
		.from(offerings)
		.orderBy(offerings.id);

	return rows;
}

export async function deleteOffering(id: number) {
	const safeId = z.number().int().positive().parse(id);
	
	const [row] = await db
		.delete(offerings)
		.where(eq(offerings.id, safeId))
		.returning();

	if (!row) {
		throw new Error(`Offering with id ${safeId} not found.`);
	}

	updateTag("home-form");
	updateTag("home-page");
	updateTag("public-footer");
	return row;
}

export async function createOffering(input: unknown) {
	const parsed = OfferingInputSchema.parse(input);
	const [row] = await db.insert(offerings).values(parsed).returning();
	
	updateTag("home-form");
	updateTag("home-page");
	updateTag("public-footer");
	return row ?? parsed;
}

export async function updateOffering(id: number, patch: unknown) {
	const safeId = z.number().int().positive().parse(id);
	const parsedPatch = OfferingUpdateSchema.parse(patch);
	const updates = Object.fromEntries(
		Object.entries(parsedPatch).filter(([, value]) => value !== undefined),
	);

	if (Object.keys(updates).length === 0) {
		throw new Error("No fields provided to update.");
	}

	const [row] = await db
		.update(offerings)
		.set(updates)
		.where(eq(offerings.id, safeId))
		.returning();

	if (!row) {
		throw new Error(`Offering with id ${safeId} not found.`);
	}

	updateTag("home-form");
	updateTag("home-page");

	return row;
}

export async function getTermsPage() {
  const page = await getPage("terms");
  if (!page) return null;
  const content = TermsSchema.parse(page.content);
  return { slug: "terms" as const, content };
}

export async function saveTermsPage(content: unknown) {
  const validatedContent = TermsSchema.parse(content);
  await db
    .insert(pages)
    .values({ slug: "terms", content: validatedContent })
    .onConflictDoUpdate({
      target: pages.slug,
      set: { content: validatedContent },
    });
  updateTag("terms-form");
  updateTag("terms-page");
  return { slug: "terms" as const, content: validatedContent };
}

export async function getPrivacyPage() {
  const page = await getPage("privacy");
  if (!page) return null;
  const content = PrivacySchema.parse(page.content);
  return { slug: "privacy" as const, content };
}

export async function savePrivacyPage(content: unknown) {
  const validatedContent = PrivacySchema.parse(content);
  await db
    .insert(pages)
    .values({ slug: "privacy", content: validatedContent })
    .onConflictDoUpdate({
      target: pages.slug,
      set: { content: validatedContent },
    });
  updateTag("privacy-form");
  updateTag("privacy-page");
  return { slug: "privacy" as const, content: validatedContent };
}
