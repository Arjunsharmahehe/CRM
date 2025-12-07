import type { ReactNode } from "react";
import Navbar from "./Navbar";
import SidebarNav from "./SidebarNav";

const navItems = [
  { title: "Home", href: "/admin/home", description: "Homepage hero, offerings title, testimonials" },
  { title: "About", href: "/admin/about", description: "About page hero and body copy" },
  { title: "Contact", href: "/admin/contact", description: "Contact details and call-to-action" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <Navbar />
      <div className="mx-auto flex max-w-6xl gap-6 px-6 py-8">
        <aside className="w-64 shrink-0">
          <SidebarNav items={navItems} />
        </aside>
        <main className="flex-1 pb-12">{children}</main>
      </div>
    </div>
  );
}

export { navItems };
