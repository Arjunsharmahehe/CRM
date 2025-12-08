import Link from "next/link";
import { getCompanyInfo, listActiveOfferings } from "@/server/actions";
import { Suspense } from "react";
import { cacheTag } from "next/cache";

const navRoutes = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

async function CompanyInfoAndOfferings(){
    "use cache"
    cacheTag("public-footer");

  const [companyInfo, offerings] = await Promise.all([
    getCompanyInfo(),
    listActiveOfferings(),
  ]);

  const companyName = companyInfo?.content.name || "SRM Enterprise";
  const companyTagline =
  companyInfo?.content.tagline || "Your go-to stop for comfort and trust";

    return (
    <>
        <div className="lg:col-span-1">
            <h3 className="text-xl font-bold text-zinc-900">{companyName}</h3>
            <p className="mt-4 text-sm leading-relaxed text-zinc-600">
              {companyTagline}
            </p>
        </div>

          {/* Offerings Links */}
        <div>
        <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-900">
            Our Offerings
        </h4>
        <ul className="mt-4 space-y-3">
            {offerings.length > 0 ? (
            offerings.map((offering) => (
                <li key={offering.id}>
                {offering.href ? (
                    <Link
                    href={offering.href}
                    className="text-sm text-zinc-600 transition-colors hover:text-amber-600"
                    >
                    {offering.title}
                    </Link>
                ) : (
                    <span className="text-sm text-zinc-600">
                    {offering.title}
                    </span>
                )}
                </li>
            ))
            ) : (
            <li className="text-sm text-zinc-500">No offerings available</li>
            )}
        </ul>
        </div>
    </>
    )
}

export default async function Footer() {

  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Company Info */}
            <Suspense fallback={<div>Loading...</div>}>
                <CompanyInfoAndOfferings />
            </Suspense>

          {/* Navigation Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-900">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-3">
              {navRoutes.map((route) => (
                <li key={route.href}>
                  <Link
                    href={route.href}
                    className="text-sm text-zinc-600 transition-colors hover:text-amber-600"
                  >
                    {route.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-zinc-200 pt-8">
          <p className="text-center text-sm text-zinc-500">
            © 2025 SRM Enterprise. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
