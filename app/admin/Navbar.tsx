import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-amber-500" />
          <div className="leading-tight">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Admin</p>
            <p className="text-sm font-semibold text-zinc-900">Site CMS</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm font-semibold">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-800 shadow-sm transition hover:border-amber-200 hover:text-amber-700"
          >
            View site
          </Link>
        </div>
      </div>
    </header>
  );
}
