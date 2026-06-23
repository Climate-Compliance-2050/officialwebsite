"use client";

import { Compass, Eye } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { useContent } from "@/components/i18n/LocaleProvider";

export function MissionVision() {
  const { missionVision } = useContent();
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <Reveal className="rounded-2xl bg-gradient-to-br from-green-700 to-green-900 p-8 text-white sm:p-10">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
              <Compass className="h-6 w-6" aria-hidden />
            </span>
            <h2 className="mt-6 text-2xl font-semibold">{missionVision.mission.title}</h2>
            <p className="mt-4 text-base leading-7 text-white/85">{missionVision.mission.body}</p>
          </Reveal>
          <Reveal delay={0.08} className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-900 p-8 text-white sm:p-10">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
              <Eye className="h-6 w-6" aria-hidden />
            </span>
            <h2 className="mt-6 text-2xl font-semibold">{missionVision.vision.title}</h2>
            <p className="mt-4 text-base leading-7 text-white/85">{missionVision.vision.body}</p>
          </Reveal>
        </div>
        <Reveal delay={0.15} className="mt-10">
          <ul className="flex flex-wrap items-center justify-center gap-3">
            {missionVision.values.map((value) => (
              <li
                key={value}
                className="rounded-sm border border-navy-900/10 bg-slate-50 px-5 py-2 text-sm font-medium text-navy-800"
              >
                {value}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
