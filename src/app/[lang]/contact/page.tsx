import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { getDictionary } from "@/content/dictionaries";
import type { Locale } from "@/content/locales";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const { contactPage } = await getDictionary(lang as Locale);
  return { title: "Contact", description: contactPage.hero.body };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const { contactPage, clarifier } = await getDictionary(lang as Locale);
  return (
    <>
      <PageHero {...contactPage.hero} />

      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <ContactForm />
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-5">
              <div className="rounded-2xl bg-slate-50 p-8">
                <h2 className="text-lg font-semibold text-navy-900">Offices</h2>
                <ul className="mt-5 space-y-4">
                  {contactPage.offices.map((office) => (
                    <li key={office.city} className="flex items-start gap-3 text-sm">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-green-600" aria-hidden />
                      <span>
                        <span className="font-semibold text-navy-900">{office.city}</span>
                        <span className="block text-navy-900/60">{office.note}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 border-t border-navy-900/8 pt-6">
                  <h3 className="text-sm font-semibold text-navy-900">{clarifier.headline}</h3>
                  <p className="mt-2.5 text-xs leading-5 text-navy-900/60">{clarifier.isNot}</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
