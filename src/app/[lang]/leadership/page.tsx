import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { getDictionary } from "@/content/dictionaries";
import type { Locale } from "@/content/locales";
import { site } from "@/content/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const { leadershipPage } = await getDictionary(lang as Locale);
  return {
    title: "Leadership",
    description: leadershipPage.hero.body,
    alternates: { canonical: `${site.url}/en/leadership` },
  };
}

/** Territory (green) → Science (blue) accent ramp — one tone per person, in order. */
const ACCENT = [
  { rail: "#00b050", role: "text-green-700" },
  { rail: "#16a36a", role: "text-green-700" },
  { rail: "#2c8bca", role: "text-blue-700" },
  { rail: "#317ec0", role: "text-blue-700" },
  { rail: "#345faa", role: "text-blue-700" },
  { rail: "#2a4d8c", role: "text-blue-700" },
] as const;

/** Editorial divider that labels a team tier with a trailing hairline. */
function TierHeader({ label }: { label: string }) {
  return (
    <Reveal className="mb-8 mt-16 flex items-center gap-4">
      <span className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-navy-900/70">
        {label}
      </span>
      <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-navy-900/15 to-transparent" />
    </Reveal>
  );
}

export default async function LeadershipPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const { leadershipPage } = await getDictionary(lang as Locale);
  const { hero, executive, team } = leadershipPage;
  return (
    <>
      <PageHero eyebrow={hero.eyebrow} headline={hero.headline} body={hero.body} />

      <section className="hairline-top relative bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="The Team"
            headline="The people behind the infrastructure."
            body="A cross-disciplinary leadership team spanning law, finance, geospatial science and operations — aligned around a single platform for the environmental asset market."
          />

          {/* Tier 1 — Executive Committee: dossier cards with a crisp bracketed avatar plate.
              Photos are native 200×200, so the avatar is kept small (112px) to stay sharp —
              the card earns its Tier-1 weight from the tinted/gridded plate + typography, not a blown-up portrait. */}
          <TierHeader label="Executive Committee" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {executive.map((m, i) => {
              const a = ACCENT[i];
              return (
                <Reveal key={m.name} delay={i * 0.08} className="h-full">
                  <a
                    href={m.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${m.name} on LinkedIn`}
                    className="block h-full"
                  >
                  <article className="group relative flex h-full flex-col overflow-hidden border border-navy-900/10 bg-white shadow-sm transition duration-300 hover:border-navy-900/20 hover:shadow-lg hover:shadow-navy-900/10">
                    <span
                      aria-hidden
                      className="absolute inset-y-0 left-0 z-10 w-[3px] transition-all duration-300 group-hover:w-1"
                      style={{ backgroundColor: a.rail }}
                    />
                    {/* dossier header plate — accent tint + fine grid framing the avatar */}
                    <div
                      className="relative flex items-center gap-5 border-b border-navy-900/10 p-6"
                      style={{ backgroundColor: `${a.rail}0d` }}
                    >
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 opacity-50"
                        style={{
                          backgroundImage:
                            "linear-gradient(rgba(15,23,42,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.05) 1px, transparent 1px)",
                          backgroundSize: "22px 22px",
                        }}
                      />
                      <div
                        className="corners relative shrink-0 overflow-hidden"
                        style={{ ["--corner-color" as string]: a.rail }}
                      >
                        <Image
                          src={m.photo}
                          alt={`Portrait of ${m.name}, ${m.role}`}
                          width={200}
                          height={200}
                          className="h-28 w-28 object-cover object-top grayscale-[0.15] transition duration-500 group-hover:scale-[1.04] group-hover:grayscale-0"
                        />
                      </div>
                      <div className="relative min-w-0">
                        <span className="font-mono text-[0.7rem] font-semibold tracking-[0.18em] text-navy-900/50">
                          {`0${i + 1}`}
                        </span>
                        <h3 className="mt-1 text-lg font-semibold leading-tight text-navy-900">{m.name}</h3>
                        <p className={`mt-0.5 text-sm font-semibold ${a.role}`}>{m.role}</p>
                      </div>
                    </div>
                    {/* body — bio */}
                    <div className="flex flex-1 flex-col p-6">
                      <p className="text-sm leading-6 text-navy-900/65">{m.bio}</p>
                    </div>
                  </article>
                  </a>
                </Reveal>
              );
            })}
          </div>

          {/* Tier 2 — Operating Team: compact dossiers */}
          <TierHeader label="Operating Team" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m, i) => {
              const a = ACCENT[executive.length + i];
              return (
                <Reveal key={m.name} delay={i * 0.08} className="h-full">
                  <a
                    href={m.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${m.name} on LinkedIn`}
                    className="block h-full"
                  >
                  <article className="group relative flex h-full flex-col overflow-hidden border border-navy-900/10 bg-white p-5 shadow-sm transition duration-300 hover:border-navy-900/20 hover:shadow-md hover:shadow-navy-900/10">
                    <span
                      aria-hidden
                      className="absolute inset-y-0 left-0 w-[3px] transition-all duration-300 group-hover:w-1"
                      style={{ backgroundColor: a.rail }}
                    />
                    {/* header row — avatar + name/role */}
                    <div className="flex items-center gap-4 sm:gap-5">
                      <div
                        className="corners relative shrink-0 overflow-hidden"
                        style={{ ["--corner-color" as string]: a.rail }}
                      >
                        <Image
                          src={m.photo}
                          alt={`Portrait of ${m.name}, ${m.role}`}
                          width={160}
                          height={160}
                          className="h-16 w-16 object-cover object-top grayscale-[0.15] transition duration-500 group-hover:scale-[1.04] group-hover:grayscale-0 sm:h-20 sm:w-20"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-semibold text-navy-900">{m.name}</h3>
                        <p className={`mt-0.5 text-[0.8rem] font-semibold ${a.role}`}>{m.role}</p>
                      </div>
                    </div>
                    {/* full-width bio — no clamp, nothing cut */}
                    <p className="mt-4 text-sm leading-6 text-navy-900/60">{m.bio}</p>
                  </article>
                  </a>
                </Reveal>
              );
            })}
          </div>

          {/* closing CTA — back into the dark mission-control register */}
          <Reveal delay={0.1} className="hairline-top grain relative mt-20 overflow-hidden border border-navy-900/10 bg-navy-950 px-6 py-12 text-center sm:px-10 sm:py-14">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                backgroundSize: "56px 56px",
              }}
            />
            <div className="relative">
              <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-green-400">
                Work with us
              </p>
              <h2 className="mx-auto mt-3 max-w-2xl font-serif text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl">
                Assessing assets across your portfolio? This is the team to talk to.
              </h2>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <ButtonLink href="/contact" arrow>
                  Get in touch
                </ButtonLink>
                <ButtonLink href="/our-story" variant="ghost-dark">
                  Read our story
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
