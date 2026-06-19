import { Info } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { clarifier, missionVision } from "@/content/site";

/** Counsel-mandated clarifier: what C2050 is and is not, plus the principles
 *  the work is held to (absorbed from the former Mission/Vision section). */
export function ClarifierBanner() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="rounded-2xl border border-blue-600/15 bg-blue-50 p-8 sm:p-10">
          <div className="flex items-start gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600">
              <Info className="h-5 w-5 text-white" aria-hidden />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-navy-900">{clarifier.headline}</h2>
              <p className="mt-3 text-sm leading-6 text-navy-900/75">{clarifier.is}</p>
              <p className="mt-2 text-sm leading-6 text-navy-900/75">{clarifier.isNot}</p>

              <div className="mt-6 border-t border-blue-600/15 pt-5">
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-navy-900/55">
                  {clarifier.valuesEyebrow}
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {missionVision.values.map((value) => (
                    <li
                      key={value}
                      className="rounded-sm border border-blue-600/20 bg-white px-3 py-1.5 text-xs font-medium text-navy-800"
                    >
                      {value}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
