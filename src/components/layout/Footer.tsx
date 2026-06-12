import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45z" />
    </svg>
  );
}
import { footer, site } from "@/content/site";

export function Footer() {
  return (
    <footer className="dark-section hairline-top relative bg-navy-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-5">
            <Image
              src="/brand/logo-horizontal-white.webp"
              alt={`${site.legalName} logo`}
              width={160}
              height={42}
              className="h-9 w-auto"
            />
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/65">
              {footer.blurb}
            </p>
            <div className="mt-6 space-y-3">
              {footer.offices.map((office) => (
                <div key={office.city} className="flex items-start gap-2.5 text-sm text-white/65">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-green-400" aria-hidden />
                  <span>
                    <span className="font-medium text-white/85">
                      {office.city}, {office.country}
                    </span>{" "}
                    · {office.note}
                  </span>
                </div>
              ))}
            </div>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="C2050 on LinkedIn"
              className="mt-6 inline-flex h-11 w-11 items-center justify-center rounded-sm border border-white/15 text-white/70 transition-colors hover:border-green-400 hover:text-green-400"
            >
              <LinkedInIcon className="h-5 w-5" />
            </a>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-4">
            {footer.columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/55">
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/70 transition-colors hover:text-green-400"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/55">
              Important
            </h3>
            <p className="mt-4 text-xs leading-5 text-white/65">{footer.disclaimer}</p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/60">{footer.copyright}</p>
          <div className="flex gap-6">
            {footer.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-white/60 transition-colors hover:text-white/90"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
