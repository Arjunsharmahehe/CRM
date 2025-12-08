import { getCompanyInfo } from "@/server/actions";
import { cacheTag } from "next/cache"
import CompanyInfoForm from "@/components/forms/CompanyInfoForm";
import { Suspense } from "react";
import AdminPageWrapper from "@/components/AdminPageWrapper";

const defaultCompanyInfo = {
  name: "SRM Enterprise",
  tagline: "Your go-to stop for comfort and trust",
  email: "info@srmenterprise.com",
  logoUrl: "https://placehold.co/600x400.png?text=SRM",
};

async function Form() {
    "use cache"
    cacheTag("company-info-form");
    const data = await getCompanyInfo();
    const initialContent = data?.content ?? defaultCompanyInfo;

    return <CompanyInfoForm initialContent={initialContent} />
}

export default async function AdminCompanyInfoPage() {
    return (
        <AdminPageWrapper pageName="Company Info" headline="Company Information" subheadline="Update the company name, tagline, email, and logo for your website.">
            <Suspense fallback={<div>Loading form...</div>}>
                <Form />
            </Suspense>
        </AdminPageWrapper>
    )
}