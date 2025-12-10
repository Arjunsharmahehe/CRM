"use client";

import Link from "next/link";
import { ArrowBigLeft, ArrowLeft, Building2, Gavel, GlobeLock, Home, Info, MessageSquare } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader } from "@/components/ui/sidebar";
import { LucideIcon } from "lucide-react";


export default function SidebarNav() {
    const items = [
        { title: "Back to site", href: "/", icon: ArrowLeft },
        { title: "Home", href: "/admin/home", icon: Home},
        { title: "About", href: "/admin/about", icon: Info },
        { title: "Contact", href: "/admin/contact", icon: MessageSquare },
        { title: "Company Info", href: "/admin/company-info", icon: Building2 },
        { title: "Terms & Conditions", href: "/admin/terms-and-conditions", icon: Gavel },
        { title: "Privacy Policy", href: "/admin/privacy-policy", icon: GlobeLock },
    ];


  const pathname = usePathname();

  return (
    <Sidebar className="text-neutral-800">
      <SidebarHeader>
        <div className="flex items-center gap-2 py-4 px-4">
          <div className="h-9 w-9 rounded-xl bg-amber-500" />
          <div className="leading-tight">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Admin</p>
            <p className="text-sm font-semibold text-zinc-900">Site CMS</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
          <SidebarMenu className="px-2">
            {items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link href={item.href} className="px-4">
                      <item.icon className="mr-2 size-5" aria-hidden="true" />
                      {item.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
