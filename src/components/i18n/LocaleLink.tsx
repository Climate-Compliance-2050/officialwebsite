"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useLang } from "./LocaleProvider";

type LinkProps = ComponentProps<typeof Link>;

/**
 * Drop-in replacement for `next/link` that prefixes the active locale onto
 * internal hrefs (`/about` → `/en/about`). External, protocol-relative, anchor
 * and non-string hrefs pass through untouched. Use this anywhere a link is
 * built from content hrefs so navigation keeps the locale.
 */
export function LocaleLink({ href, ...rest }: LinkProps) {
  const lang = useLang();
  const localized = typeof href === "string" ? withLang(href, lang) : href;
  return <Link href={localized} {...rest} />;
}

export function withLang(href: string, lang: string): string {
  // Only internal absolute paths get prefixed. Leaves "#", "mailto:", "https://",
  // "//cdn…" and already-relative hrefs alone.
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  return `/${lang}${href}`;
}
