/**
 * Locale → copy resolver. Dictionaries are loaded with dynamic `import()` so
 * only the requested locale's copy is pulled in.
 *
 * Server-side only by convention: call `getDictionary(lang)` from a layout /
 * page (Server Component), then hand the result to the client `LocaleProvider`.
 * (The `server-only` guard package isn't installed in this repo, so this is a
 * convention, not an enforced boundary — don't import this into a Client
 * Component.)
 */
import type { Locale } from "./locales";
import type { Dictionary } from "./en";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./en").then((m) => m.default),
  pt: () => import("./pt").then((m) => m.default),
};

export function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
