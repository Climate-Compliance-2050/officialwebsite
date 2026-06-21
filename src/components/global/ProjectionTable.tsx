import { type ProjectionCol } from "@/content/global";

/** Coverage outlook — responsive cards (one per horizon year). */
export function ProjectionTable({ cols }: { cols: ProjectionCol[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cols.map((c) => (
        <div
          key={c.year}
          className={`corners relative flex flex-col border p-5 ${
            c.today ? "border-green-500/40 bg-green-50/40" : "corners-faint border-navy-900/10 bg-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="tnum font-mono text-sm font-semibold tracking-wide text-navy-900">
              {c.year}
            </span>
            {c.today ? (
              <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-green-700">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Today
              </span>
            ) : (
              <span className="font-mono text-[10px] uppercase tracking-wider text-navy-900/40">
                Projection
              </span>
            )}
          </div>

          <p className="tnum mt-4 font-serif text-3xl font-semibold text-navy-900">{c.coverage}</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-navy-900/45">
            of world GHG emissions
          </p>

          <div className="mt-4 border-t border-navy-900/10 pt-3">
            <p className="text-sm leading-6 text-navy-900/70">{c.driver}</p>
          </div>

          <div className="mt-auto flex items-baseline gap-2 pt-4">
            <span className="tnum font-mono text-xl font-semibold text-blue-600">{c.instruments}</span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-navy-900/45">
              instruments in operation
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
