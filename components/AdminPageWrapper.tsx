export default function AdminPageWrapper({ children, pageName, headline, subheadline }: { children: React.ReactNode; pageName: string; headline: string; subheadline: string }){
    return (
        <div className="flex flex-col gap-6 bg-white px-8 pb-8 pt-3">
            <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">{pageName}</p>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">{headline}</h1>
            <p className="text-sm text-zinc-600">{subheadline}</p>
            </div>
            {children}
        </div>
    )
}