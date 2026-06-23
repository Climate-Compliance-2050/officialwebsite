/**
 * Supported locales — the one place the EN/PT set is declared. Plain module
 * (no server-only / no content imports) so it is safe to import from the proxy,
 * client components and server code alike.
 */
export const locales = ["en", "pt"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
