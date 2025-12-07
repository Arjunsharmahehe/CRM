"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavItem = {
  title: string;
  href: string;
  description?: string;
};

type Props = {
  items: NavItem[];
};

export default function SidebarNav({ items }: Props) {
  const pathname = usePathname();

  return (
    <nav className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-4 px-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
        Pages
      </div>
      <ul className="space-y-2">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "block rounded-xl border border-transparent px-3 py-2 transition",
                  active
                    ? "border-amber-200 bg-amber-50 text-amber-900 shadow-sm"
                    : "hover:border-amber-100 hover:bg-zinc-50",
                )}
              >
                <div className="text-sm font-semibold">{item.title}</div>
                {item.description ? (
                  <p className="text-xs text-zinc-600">{item.description}</p>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
