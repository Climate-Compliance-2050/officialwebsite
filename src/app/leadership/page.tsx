import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { leadershipPage } from "@/content/about";

export const metadata: Metadata = {
  title: "Leadership",
  description: leadershipPage.hero.body,
};

export default function LeadershipPage() {
  return (
    <>
      <PageHero {...leadershipPage.hero} />

      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {leadershipPage.team.map((member, i) => (
              <Reveal
                key={member.name}
                delay={i * 0.07}
                className="group rounded-2xl border border-navy-900/8 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-navy-900/8"
              >
                <div className="relative overflow-hidden rounded-xl">
                  <Image
                    src={member.photo}
                    alt={`Portrait of ${member.name}`}
                    width={480}
                    height={480}
                    className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  {/* brand overlay treatment on hover */}
                  <div
                    aria-hidden
                    className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-20 ${
                      i % 2 === 0 ? "bg-green-500" : "bg-blue-600"
                    }`}
                  />
                </div>
                <h2 className="mt-5 text-lg font-semibold text-navy-900">{member.name}</h2>
                <p
                  className={`mt-0.5 text-sm font-medium ${
                    i % 2 === 0 ? "text-green-700" : "text-blue-600"
                  }`}
                >
                  {member.role}
                </p>
                <p className="mt-3 text-sm leading-6 text-navy-900/65">{member.bio}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2} className="mt-16 text-center">
            <p className="text-base text-navy-900/70">
              Want to work with this team?
            </p>
            <div className="mt-5">
              <ButtonLink href="/contact" arrow>
                Get in touch
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
