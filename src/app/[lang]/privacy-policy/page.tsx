import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { LocaleLink } from "@/components/i18n/LocaleLink";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How C2050 collects, uses and protects personal data.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        headline="Privacy Policy"
        body="How Climate Compliance 2050 collects, uses and protects personal data."
      />
      <section className="bg-white py-20">
        <div className="prose mx-auto max-w-3xl px-4 text-navy-900/75 sm:px-6">
          <p>
            The full Privacy Policy is being finalized with counsel and will be published here.
            For data-protection questions in the meantime, please{" "}
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
