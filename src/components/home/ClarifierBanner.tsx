import { Info } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { clarifier } from "@/content/site";

/** Counsel-mandated clarifier: what C2050 is and is not. */
export function ClarifierBanner() {
  return (
    <section className="bg-white pb-20 lg:pb-28">
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
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
