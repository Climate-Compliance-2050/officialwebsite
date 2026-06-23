import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { LocaleLink } from "@/components/i18n/LocaleLink";

export const metadata: Metadata = {
  title: "Code of Ethics",
  description: "The principles that govern how C2050 operates.",
};

export default function CodeOfEthicsPage() {
  return (
    <>
      <PageHero
        eyebrow="Governance"
        headline="Code of Ethics"
        body="C2050 operates with integrity, scientific rigor, legal precision, transparency, interoperability and market confidence."
      />
      <section className="bg-white py-20">
        <div className="prose mx-auto max-w-3xl px-4 text-navy-900/75 sm:px-6">
          <p>
            The full Code of Ethics document is being finalized and will be published here.
            For governance questions in the meantime, please{" "}
            <LocaleLink href="/contact" className="font-medium text-blue-600 hover:text-blue-700">
              contact our team
            </LocaleLink>
            .
          </p>
        </div>
      </section>
    </>
  );
}
