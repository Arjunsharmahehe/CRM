import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import SidebarNav from "@/components/SidebarNav";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SRM | Admin",
  description: "Admin panel for SRM Enterprise",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SidebarProvider>
            <SidebarNav />
            <main className="flex-1 pb-12">
                <div className="px-6 pt-2">
                    <SidebarTrigger />
                </div>
                {children}
            </main>
            <Toaster position="top-right" />
        </SidebarProvider>
      </body>
    </html>
  );
}

