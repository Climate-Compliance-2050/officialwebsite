import type { Metadata } from "next";
import Image from "next/image";
import { Quote } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { storyPage } from "@/content/about";

export const metadata: Metadata = {
  title: "Our Story",
  description: storyPage.hero.body,
};

export default function OurStoryPage() {
  return (
    <>
      <PageHero {...storyPage.hero} />

      {/* Timeline */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <ol className="relative space-y-12 border-l-2 border-green-500/25 pl-8">
                {storyPage.timeline.map((item, i) => (
                  <Reveal as="li" key={item.title} delay={i * 0.08} className="relative">
                    <span
                      aria-hidden
                      className="absolute -left-[2.45rem] top-3 h-[2px] w-4 bg-green-500"
                    />
                    <p className="text-sm font-semibold uppercase tracking-wider text-green-700">
                      {item.period}
                    </p>
                    <h2 className="mt-1.5 text-xl font-semibold text-navy-900">{item.title}</h2>
                    <p className="mt-2.5 max-w-xl text-sm leading-6 text-navy-900/65">
                      {item.body}
                    </p>
                  </Reveal>
                ))}
              </ol>
            </div>
            <div className="lg:col-span-5">
              <Reveal delay={0.15} className="lg:sticky lg:top-28">
                <div className="relative overflow-hidden rounded-2xl">
                  <Image
                    src="/images/story-aerial.webp"
                    alt="Aerial view of a river winding through tropical forest"
                    width={1400}
                    height={930}
                    className="aspect-[2/3] w-full object-cover sm:aspect-[3/2] lg:aspect-[2/3]"
                  />
                  {/* brand 80% overlay treatment */}
                  <div aria-hidden className="absolute inset-0 bg-green-700/20" />
                </div>
                <figcaption className="mt-3 text-xs text-navy-900/45">
                  From territory to trusted environmental asset intelligence.
                </figcaption>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Founder quotes */}
      <section className="dark-section bg-navy-950 py-20 text-white lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          {storyPage.quotes.map((quote, i) => (
            <Reveal
              key={quote.author}
              delay={i * 0.1}
              className="rounded-2xl border border-white/10 bg-white/5 p-9"
            >
              <Quote className="h-7 w-7 text-green-400" aria-hidden />
              <blockquote className="mt-4">
                <p className="text-lg font-medium leading-relaxed text-white/90">
                  “{quote.text}”
                </p>
                <footer className="mt-5 text-sm text-white/55">
                  <span className="font-semibold text-white">{quote.author}</span> · {quote.role}
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Scale */}
      <section className="bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-tight text-navy-900 sm:text-4xl">
              {storyPage.scale.headline}
            </h2>
            <p className="mt-5 text-base leading-7 text-navy-900/70 sm:text-lg sm:leading-8">
              {storyPage.scale.body}
            </p>
            <div className="mt-9">
              <ButtonLink href="/about" arrow>
                More about us
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
