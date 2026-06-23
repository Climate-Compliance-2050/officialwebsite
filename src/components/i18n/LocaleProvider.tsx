"use client";

import { createContext, useContext } from "react";
import type { Locale } from "@/content/locales";
import type { Dictionary } from "@/content/en";

type LocaleContextValue = { dict: Dictionary; lang: Locale };

const LocaleContext = createContext<LocaleContextValue | null>(null);

/**
 * Provides the resolved dictionary + active locale to client components.
 * Mounted once in the `[lang]` root layout with the server-resolved dictionary.
 */
export function LocaleProvider({
  dict,
  lang,
  children,
}: {
  dict: Dictionary;
  lang: Locale;
  children: React.ReactNode;
}) {
  return (
    <LocaleContext.Provider value={{ dict, lang }}>
      {children}
    </LocaleContext.Provider>
  );
}

function useLocaleContext(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useContent / useLang must be used within a LocaleProvider");
  }
  return ctx;
}

/** Copy for the active locale. Replaces direct `@/content/*` imports in client components. */
export function useContent(): Dictionary {
  return useLocaleContext().dict;
}

/** The active locale code (e.g. for building locale-prefixed hrefs). */
export function useLang(): Locale {
  return useLocaleContext().lang;
}
