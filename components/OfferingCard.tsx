import Image from "next/image";
import Link from "next/link";

type OfferingCardProps = {
  offering: {
    id: number;
    title: string;
    description: string;
    imageUrl: string | null;
    href: string | null;
    isActive: boolean | null;
  };
  index: number;
};

export function OfferingCard({ offering }: OfferingCardProps) {
  return (
    <div className="group relative h-64 overflow-hidden">
      {/* Background Image */}
      {offering.imageUrl ? (
        <Image
          src={"/fallback.png"}
          alt={offering.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-amber-400 to-amber-600" />
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
        <h3 className="mb-4 text-3xl font-bold text-white">
          {offering.title}
        </h3>
        <p className="mb-6 text-base text-white/90">
          {offering.description}
        </p>
        {offering.href && (
          <Link
            href={offering.href}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition-all hover:bg-amber-50 hover:gap-3"
          >
            Visit
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}
