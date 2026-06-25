import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono, IBM_Plex_Serif } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ConsentBanner } from "@/components/layout/ConsentBanner";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { getDictionary } from "@/content/dictionaries";
import { hasLocale, locales } from "@/content/locales";

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

/* Display voice only: H1/H2 and the hero caption. Body stays Plex Sans. */
const plexSerif = IBM_Plex_Serif({
  variable: "--font-plex-serif",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { site } = await getDictionary(lang);
  return {
    title: {
      default: site.name,
      template: `%s · ${site.name}`,
    },
    description: site.description,
    metadataBase: new URL(site.url),
    verification: {
      google: "3Dcu1Nxl_2YT8tg5BTNOPyOpnNfBG0paQ9jzQWgGkDw",
      other: {
        "msvalidate.01": "F197987F60CEA97176E86581B096D094",
      },
    },
    ...(lang !== "en" && {
      robots: { index: false, follow: false },
    }),
    openGraph: {
      siteName: site.legalName,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <html
      lang={lang}
      className={`${plexSans.variable} ${plexMono.variable} ${plexSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-blue-900 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <LocaleProvider dict={dict} lang={lang}>
          <Navbar />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <ConsentBanner />
        </LocaleProvider>
      </body>
    </html>
  );
}
