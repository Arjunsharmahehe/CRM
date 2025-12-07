import { getHomePage } from "@/server/actions";
import { HomepageSchema } from "@/types";
import type { z } from "zod";
import HomeForm from "./HomeForm";

const defaultHomeContent: z.infer<typeof HomepageSchema> = {
	hero: {
		headline: "Build with confidence",
		subheadline: "Manage your site content from one place and publish instantly.",
		ctaText: "Get started",
		ctaLink: "https://example.com/contact",
		heroImageUrl: "https://images.unsplash.com/photo-1522199710521-72d69614c702?auto=format&fit=crop&w=1200&q=80",
	},
	offerings: {
		title: "What we do",
	},
	testimonials: {
		title: "What customers say",
		items: [],
	},
};

export default async function AdminHomePage() {
	const existing = await getHomePage();
	const initialContent = existing?.content ?? defaultHomeContent;

	return (
		<div className="flex flex-col gap-6 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
			<div className="flex flex-col gap-2">
				<p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">Homepage</p>
				<h1 className="text-3xl font-bold tracking-tight text-zinc-900">Homepage content</h1>
				<p className="text-sm text-zinc-600">
					Edit the hero copy, section titles, and testimonials. Offerings come directly from the
					offerings table; manage them separately.
				</p>
			</div>

			<HomeForm initialContent={initialContent} />
		</div>
	);
}
