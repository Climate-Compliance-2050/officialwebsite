/**
 * Evidence-chain instrument (Alan Barry, July 2026): the platform's immutable
 * information chain rendered as linked evidence milestones — Data through Asset,
 * each block welded to the next. Static by design; nothing to pause for
 * reduced motion.
 */

type ChainLink = { code: string; label: string; note: string };

export function EvidenceChain({
  chain,
}: {
  chain: { aside: string; caption: string; links: ChainLink[] };
}) {
  const last = chain.links.length - 1;
  return (
    <figure className="corners-faint relative border border-navy-900/10 bg-slate-50 px-5 py-6 sm:px-8">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-navy-900/50">
          {chain.aside}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-green-700">
          {chain.caption}
        </span>
      </figcaption>

      {/* the chain — scrolls sideways on narrow viewports instead of wrapping */}
      <div className="mt-5 overflow-x-auto pb-1">
        <ol className="flex min-w-max items-stretch">
          {chain.links.map((link, i) => (
            <li key={link.code} className="flex items-center">
              <div
                className={`relative w-36 shrink-0 rounded-sm border bg-white px-4 py-3 ${
                  i === last ? "corners border-green-600/40" : "border-navy-900/12"
                }`}
              >
                <span
                  className={`tnum font-mono text-[10px] font-semibold ${
                    i === last ? "text-green-700" : "text-blue-600"
                  }`}
                >
                  {link.code}
                </span>
                <p className="mt-1 text-sm font-semibold text-navy-900">{link.label}</p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-navy-900/50">
                  {link.note}
                </p>
              </div>
              {i < last && (
                <span aria-hidden className="relative mx-1 flex w-8 items-center sm:w-10">
                  <span className="h-px w-full bg-gradient-to-r from-blue-600/40 to-green-600/40" />
                  {/* weld node — the immutable link between milestones */}
                  <span className="absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 rotate-45 border border-navy-900/30 bg-white" />
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </figure>
  );
}
