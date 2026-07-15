import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import { site } from "@/content/site";

export function generateMetadata(): Metadata {
  return {
    title: "Privacy Policy",
    description: "How C2050 collects, uses and protects personal data.",
    alternates: { canonical: `${site.url}/en/privacy-policy` },
  };
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        headline="Privacy Policy"
        body="How Climate Compliance 2050 collects, uses and protects personal data."
      />
      <section className="bg-white py-20">
        {/* letterhead lockup — the legal-document register: mark + issuing desk */}
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="flex items-center gap-2.5 border-b border-navy-900/10 pb-5">
            <Image src="/brand/mark.webp" alt="" aria-hidden width={18} height={18} />
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-navy-900/55">
              C2050 · Legal
            </span>
          </div>
        </div>
        <div className="prose mx-auto mt-8 max-w-3xl px-4 text-navy-900/75 sm:px-6">
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
