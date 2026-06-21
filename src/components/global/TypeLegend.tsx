import { globalPage } from "@/content/global";
import { TypeCode, TypeTick } from "./TypeMark";

const { legend } = globalPage;

/** Instrument-type taxonomy + sources + coverage footnote. */
export function TypeLegend() {
  return (
    <div className="border-t border-navy-900/10 pt-8">
      <div className="grid gap-4 sm:grid-cols-3">
        {legend.types.map((t) => (
          <div key={t.type} className="flex items-start gap-3">
            <TypeTick type={t.type} className="mt-0.5 h-9 w-[3px]" />
            <div>
              <TypeCode type={t.type} />
              <p className="mt-1 text-sm font-semibold text-navy-900">{t.label}</p>
              <p className="mt-0.5 text-xs leading-5 text-navy-900/55">{t.note}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 space-y-1">
        <p className="font-mono text-xs text-navy-900/55">{legend.sources}</p>
        <p className="font-mono text-[11px] leading-5 text-navy-900/45">{legend.footnote}</p>
      </div>
    </div>
  );
}
