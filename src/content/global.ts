/**
 * "Global" page copy & data — the evolution and future of regulated carbon
 * markets worldwide. Re-expresses the source infographic
 * (assets/requests/ludo-image.png) as a responsive dashboard.
 *
 * Data verbatim from the infographic; figures attributed to ICAP (2025),
 * World Bank (2026) and IEA (2025). This page reports on the external market
 * landscape — it is not a C2050 service claim. Keep copy within the
 * banned-language table (CLAUDE.md) and the legal guardrails (C2050 is not a
 * registry, standard, broker, VVB or investment adviser).
 */

export type InstrumentType = "ETS" | "TAX" | "OTHER";

export type EraId =
  | "e1992"
  | "e2005"
  | "e2008"
  | "e2013"
  | "e2017"
  | "e2021"
  | "e2024";

export type Market = {
  /** Chronological key from the infographic. */
  key: number;
  /** Display name as printed (carries the instrument, e.g. "Portugal Carbon Tax"). */
  name: string;
  /** ISO 3166-1 alpha-2 for the flag. Subnational entries use the national flag. */
  cc: string;
  /** Start year of operation. */
  year: number;
  type: InstrumentType;
  era: EraId;
};

export type Era = {
  id: EraId;
  /** Range label as printed, e.g. "2005–2007". */
  range: string;
  /** Whether this is the present-day band. */
  today?: boolean;
  /** Policy/legal milestone for the era (framework track). */
  milestone: string;
  /** One-line characterisation of the era. */
  note: string;
  /** Coverage of world GHG emissions reached by the end of this era (from §1.2). */
  coverage: string;
  /** Summary figures shown in place of market chips (the present-day band). */
  summary?: { value: string; label: string }[];
};

export type CoveragePoint = {
  /** Short x-axis label. */
  label: string;
  /** Coverage as a single % (history) or [min,max] range (projection). */
  pct: number | [number, number];
  projected?: boolean;
  today?: boolean;
};

export type ProjectionCol = {
  year: string;
  today?: boolean;
  coverage: string;
  driver: string;
  instruments: string;
};

export type PipelineItem = {
  cc: string;
  jurisdiction: string;
  type: InstrumentType | InstrumentType[];
  detail: string;
};

export const globalPage = {
  hero: {
    eyebrow: "Global Carbon Market Intelligence",
    headline: "The evolution and future of regulated carbon markets",
    body: "From the 1992 Rio Earth Summit toward 2050 — how legally binding carbon pricing has expanded across jurisdictions, and where it is heading. Compiled from ICAP, World Bank and IEA data.",
  },

  /**
   * Hero readout — coverage is the signature figure (the source infographic's
   * hero badge), with the instrument/system counts as supporting telemetry.
   */
  readout: {
    eyebrow: "Coverage today · 2026",
    value: "~29%",
    caption: "of world GHG emissions under regulated carbon pricing",
    secondary: [
      { value: "87", label: "Regulated instruments" },
      { value: "41", label: "ETS live" },
    ],
  },

  coverage: {
    eyebrow: "Coverage trajectory",
    headline: "Share of world GHG emissions under regulated carbon pricing",
    body: "Solid line: covered share to date. Banded projection: expected range as markets under development come into force.",
    points: [
      { label: "1992", pct: 0 },
      { label: "2005–07", pct: 5 },
      { label: "2008–12", pct: 7 },
      { label: "2013–16", pct: 12 },
      { label: "2017–20", pct: 17 },
      { label: "2021–23", pct: 21 },
      { label: "2024–26", pct: 29, today: true },
      { label: "2030", pct: [33, 40], projected: true },
      { label: "2040", pct: [55, 65], projected: true },
      { label: "2050", pct: [75, 90], projected: true },
    ] satisfies CoveragePoint[],
  },

  timeline: {
    eyebrow: "1992 → today",
    headline: "Regulated carbon markets in operation",
    body: "Each market is a regulated, legally binding carbon-pricing system, grouped by the adoption wave that brought it about. Year shown is the start of operation.",
    eras: [
      {
        id: "e1992",
        range: "1992",
        milestone: "UNFCCC adopted (Rio Earth Summit)",
        note: "Foundation for global climate cooperation.",
        coverage: "~0%",
      },
      {
        id: "e2005",
        range: "2005–2007",
        milestone: "Kyoto Protocol adopted and in force (2005)",
        note: "Market-based mechanisms launched — CDM, JI, EU ETS.",
        coverage: "~5%",
      },
      {
        id: "e2008",
        range: "2008–2012",
        milestone: "Global expansion of carbon-pricing mechanisms",
        note: "National, regional and subnational systems emerge.",
        coverage: "~7%",
      },
      {
        id: "e2013",
        range: "2013–2016",
        milestone: "Paris Agreement (2015)",
        note: "Stronger ambition and broader use of carbon markets.",
        coverage: "~12%",
      },
      {
        id: "e2017",
        range: "2017–2020",
        milestone: "Mainstreaming carbon pricing and linkages",
        note: "More jurisdictions adopt and connect systems.",
        coverage: "~17%",
      },
      {
        id: "e2021",
        range: "2021–2023",
        milestone: "Accelerated momentum toward net zero",
        note: "New markets, sector expansion and policy strengthening.",
        coverage: "~21%",
      },
      {
        id: "e2024",
        range: "2024–2026",
        today: true,
        milestone: "Maturing and integrating markets",
        note: "Greater alignment, coverage and market integration.",
        coverage: "~29%",
        summary: [
          { value: "87", label: "Regulated instruments in operation" },
          { value: "41", label: "Emissions trading systems live" },
          { value: "~29%", label: "World GHG emissions covered" },
        ],
      },
    ] satisfies Era[],
    markets: [
      { key: 1, name: "EU ETS", cc: "EU", year: 2005, type: "ETS", era: "e1992" },

      { key: 2, name: "Australia — CPRS", cc: "AU", year: 2012, type: "ETS", era: "e2005" },
      { key: 3, name: "Saitama ETS", cc: "JP", year: 2011, type: "ETS", era: "e2005" },
      { key: 4, name: "New Zealand ETS", cc: "NZ", year: 2008, type: "ETS", era: "e2005" },
      { key: 5, name: "RGGI (USA)", cc: "US", year: 2009, type: "ETS", era: "e2005" },

      { key: 6, name: "Shenzhen", cc: "CN", year: 2013, type: "ETS", era: "e2008" },
      { key: 7, name: "Shanghai", cc: "CN", year: 2013, type: "ETS", era: "e2008" },
      { key: 8, name: "Beijing", cc: "CN", year: 2013, type: "ETS", era: "e2008" },
      { key: 9, name: "Korea ETS", cc: "KR", year: 2015, type: "ETS", era: "e2008" },
      { key: 10, name: "Guangdong", cc: "CN", year: 2013, type: "ETS", era: "e2008" },
      { key: 11, name: "Tianjin", cc: "CN", year: 2013, type: "ETS", era: "e2008" },
      { key: 12, name: "Hubei", cc: "CN", year: 2014, type: "ETS", era: "e2008" },
      { key: 13, name: "Chongqing", cc: "CN", year: 2014, type: "ETS", era: "e2008" },

      { key: 14, name: "Fujian", cc: "CN", year: 2016, type: "ETS", era: "e2013" },
      { key: 15, name: "Shanxi", cc: "CN", year: 2016, type: "ETS", era: "e2013" },
      { key: 16, name: "Sichuan", cc: "CN", year: 2016, type: "ETS", era: "e2013" },
      { key: 17, name: "Hainan", cc: "CN", year: 2016, type: "ETS", era: "e2013" },
      { key: 18, name: "Henan", cc: "CN", year: 2017, type: "ETS", era: "e2013" },
      { key: 19, name: "Chongqing (exp.)", cc: "CN", year: 2017, type: "ETS", era: "e2013" },
      { key: 20, name: "Alberta TIER", cc: "CA", year: 2017, type: "ETS", era: "e2013" },
      { key: 21, name: "Quebec Cap-and-Trade", cc: "CA", year: 2013, type: "ETS", era: "e2013" },
      { key: 22, name: "California Cap-and-Trade", cc: "US", year: 2013, type: "ETS", era: "e2013" },
      { key: 23, name: "Ontario Cap-and-Trade", cc: "CA", year: 2017, type: "ETS", era: "e2013" },

      { key: 24, name: "Germany nEHS", cc: "DE", year: 2021, type: "ETS", era: "e2017" },
      { key: 25, name: "UK ETS", cc: "GB", year: 2021, type: "ETS", era: "e2017" },
      { key: 26, name: "National ETS (China)", cc: "CN", year: 2021, type: "ETS", era: "e2017" },
      { key: 27, name: "Mexico ETS", cc: "MX", year: 2020, type: "ETS", era: "e2017" },
      { key: 28, name: "Portugal Carbon Tax", cc: "PT", year: 2022, type: "TAX", era: "e2017" },
      { key: 29, name: "Singapore Carbon Tax", cc: "SG", year: 2019, type: "TAX", era: "e2017" },
      { key: 30, name: "Switzerland ETS", cc: "CH", year: 2020, type: "ETS", era: "e2017" },
      { key: 31, name: "Kazakhstan ETS", cc: "KZ", year: 2021, type: "ETS", era: "e2017" },

      { key: 32, name: "Brazil ETS", cc: "BR", year: 2024, type: "ETS", era: "e2021" },
      { key: 33, name: "Indonesia ETS", cc: "ID", year: 2023, type: "ETS", era: "e2021" },
      { key: 34, name: "UAE ETS", cc: "AE", year: 2023, type: "ETS", era: "e2021" },
      { key: 35, name: "Thailand ETS", cc: "TH", year: 2025, type: "ETS", era: "e2021" },
      { key: 36, name: "Vietnam ETS (Pilot)", cc: "VN", year: 2024, type: "ETS", era: "e2021" },
      { key: 37, name: "Türkiye ETS", cc: "TR", year: 2024, type: "ETS", era: "e2021" },
      { key: 38, name: "India Carbon Market (Pilot)", cc: "IN", year: 2026, type: "OTHER", era: "e2021" },
    ] satisfies Market[],
  },

  projection: {
    eyebrow: "Coverage outlook",
    headline: "Global coverage projection — regulated carbon pricing",
    cols: [
      {
        year: "2026",
        today: true,
        coverage: "~29%",
        driver: "ETS expansion and carbon taxes",
        instruments: "87",
      },
      {
        year: "2030",
        coverage: "~33–40%",
        driver: "Markets under development come into force",
        instruments: "100–115",
      },
      {
        year: "2040",
        coverage: "~55–65%",
        driver: "G20 and major emerging-economy coverage",
        instruments: "130–160",
      },
      {
        year: "2050",
        coverage: "~75–90%",
        driver: "Net-zero-aligned universal carbon-pricing architecture",
        instruments: "170–220",
      },
    ] satisfies ProjectionCol[],
  },

  pipeline: {
    eyebrow: "Instruments under development",
    headline: "Expected future regulated carbon markets",
    body: "Jurisdictions with regulated carbon pricing in design, legislation or pilot phase.",
    items: [
      { cc: "BR", jurisdiction: "Brazil — SBCE", type: "ETS", detail: "ETS + crediting interface" },
      { cc: "IN", jurisdiction: "India", type: "ETS", detail: "ETS / carbon-credit trading scheme" },
      { cc: "VN", jurisdiction: "Vietnam", type: "ETS", detail: "ETS (mandatory national system)" },
      { cc: "JP", jurisdiction: "Japan — GX-ETS", type: "ETS", detail: "Mandatory national ETS" },
      { cc: "TR", jurisdiction: "Türkiye", type: "ETS", detail: "ETS / hybrid" },
      { cc: "CO", jurisdiction: "Colombia", type: "ETS", detail: "ETS in development" },
      { cc: "CL", jurisdiction: "Chile", type: "ETS", detail: "ETS (sector expansion, absolute cap)" },
      { cc: "CN", jurisdiction: "China — ETS expansion", type: "ETS", detail: "ETS (sector expansion, absolute cap)" },
      { cc: "EU", jurisdiction: "EU — ETS 2", type: "ETS", detail: "ETS 2 (buildings & road transport)" },
      { cc: "ID", jurisdiction: "Indonesia", type: ["ETS", "TAX"], detail: "ETS + carbon tax (complementary)" },
      { cc: "MY", jurisdiction: "Malaysia", type: "ETS", detail: "Legal framework adopted; implementation phase" },
      { cc: "PH", jurisdiction: "Philippines", type: "OTHER", detail: "National system launching in 2026" },
      { cc: "ZA", jurisdiction: "South Africa (expansion)", type: "TAX", detail: "National system launching in 2026" },
      { cc: "MX", jurisdiction: "Mexico (states / national)", type: "TAX", detail: "Mandatory system from 2026" },
      { cc: "CA", jurisdiction: "Canada (subnational)", type: "OTHER", detail: "Pilot / implementation preparation" },
      { cc: "US", jurisdiction: "US States (RGGI, California, WCI, WA, OR)", type: "OTHER", detail: "ETS legislation and preparation; carbon-tax base" },
      { cc: "AE", jurisdiction: "Middle East (UAE & Gulf pilots)", type: "OTHER", detail: "Expansion to more sectors; absolute cap by 2027; launch ~2028" },
    ] satisfies PipelineItem[],
  },

  legend: {
    types: [
      { type: "ETS" as const, label: "Emissions Trading System", note: "Cap-and-trade" },
      { type: "TAX" as const, label: "Carbon Tax", note: "Price per tonne CO₂e" },
      {
        type: "OTHER" as const,
        label: "Other carbon pricing",
        note: "Crediting mechanism, offset compliance, CBAM-type instrument, hybrid framework",
      },
    ],
    sources: "Sources: ICAP (2025), World Bank (2026), IEA (2025).",
    footnote:
      "Coverage refers to share of global GHG emissions (CO₂e). Baseline: 2022 global GHG emissions ≈ 52.4 GtCO₂e (IEA).",
  },

  /** Compact teaser for the Home page — points to this page, same legal frame. */
  homeTeaser: {
    eyebrow: "Global Carbon Market Intelligence",
    headline: "A fragmenting map. One binding problem.",
    body: "Every regulated carbon market carries its own tenure law, carbon rights and eligibility rules. C2050 locks legal and regulatory standing to the coordinate — the bind that lets an environmental asset stand as a financial one across borders.",
    stat: {
      value: "~29%",
      caption: "of world GHG emissions under regulated carbon pricing today",
    },
    chips: [
      "87 regulated instruments",
      "41 ETS live",
      "75–90% projected by 2050",
    ],
    cta: { label: "Explore the global market", href: "/global" },
  },

  tieIn: {
    eyebrow: "Why this matters for C2050",
    headline: "A fragmenting map. One binding problem.",
    body: "Every jurisdiction on this map carries its own tenure law, carbon rights and eligibility rules. C2050 locks legal and regulatory standing to the coordinate through the Data Cube — the geospatial ⊕ legal bind that lets an environmental asset stand as a financial one across borders.",
    primaryCta: { label: "Assess an Asset", href: "/contact" },
    secondaryCta: { label: "Inside the Data Cube", href: "/about" },
  },
};

/** Badge colours for the instrument-type taxonomy (accent fills, never body text). */
export const typeColor: Record<InstrumentType, string> = {
  ETS: "#00b050",
  TAX: "#e08507",
  OTHER: "#7b3fa0",
};
