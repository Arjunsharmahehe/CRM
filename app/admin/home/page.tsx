import { getHomePage } from "@/server/actions";
import { HomepageSchema } from "@/types";
import type { z } from "zod";
import HomeForm from "./HomeForm";
import { Suspense } from "react";
import { cacheTag } from "next/cache";
import AdminPageWrapper from "@/components/AdminPageWrapper";

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

async function Form(){
    "use cache"
    cacheTag("home-page");
	const existing = await getHomePage();
	const initialContent = existing?.content ?? defaultHomeContent;

    return <HomeForm initialContent={initialContent} />
}

export default async function AdminHomePage() {

	return (
		<AdminPageWrapper pageName="Homepage" headline="Homepage content" subheadline="Edit the hero copy, section titles, and testimonials. Offerings come directly from the offerings table; manage them separately.">
			<Suspense fallback={<div>Loading form...</div>}>
                <Form />
            </Suspense>
		</AdminPageWrapper>
	);
}
