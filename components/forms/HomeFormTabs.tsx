"use client";

import { cn } from "@/lib/utils";

type Tab = "hero" | "offerings" | "testimonials";

type Props = {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
};

const tabs: { id: Tab; label: string }[] = [
  { id: "hero", label: "Hero Section" },
  { id: "offerings", label: "Offerings" },
  { id: "testimonials", label: "Testimonials" },
];

export function HomeFormTabs({ activeTab, onTabChange }: Props) {
  return (
    <div className="border-b border-zinc-200">
      <div className="flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-colors relative",
              activeTab === tab.id
                ? "text-amber-700"
                : "text-zinc-600 hover:text-zinc-900"
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
