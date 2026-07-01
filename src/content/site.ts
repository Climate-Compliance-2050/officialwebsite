/**
 * Centralized site copy. English only for launch; keep all user-facing
 * strings here so a pt-BR locale can be added without touching components.
 *
 * Copy source of truth: legal counsel rewrite (June 2026). Never reintroduce
 * banned phrases — see CLAUDE.md banned-language table.
 */

export const site = {
  name: "C2050 - Climate Compliance 2050",
  legalName: "Climate Compliance 2050",
  tagline: "Global intelligence infrastructure for environmental asset integrity.",
  description:
    "C2050 integrates geospatial, scientific, technical, legal and regulatory intelligence to assess, structure and monitor environmental assets, starting with carbon credits, emission reductions and removals.",
  url: "https://www.c2050.com",
  linkedin: "https://www.linkedin.com/company/climate-compliance-2050/posts/?feedView=all",
};

export const nav = {
  links: [
    {
      label: "About",
      href: "/about",
      children: [
        { label: "About Us", href: "/about", description: "The Data Cube and our technological foundation" },
        { label: "Leadership", href: "/leadership", description: "The team behind C2050" },
        { label: "Our Story", href: "/our-story", description: "From Dublin, 2024, to a global platform" },
      ],
    },
    {
      label: "Ecosystem",
      href: "/ecosystem",
      children: [
        { label: "Ecosystem", href: "/ecosystem", description: "A connected network for environmental asset integrity" },
        { label: "Products", href: "/products", description: "Platform access tiers and Smart Compliance Badges" },
        { label: "Services", href: "/services", description: "Intelligence across the asset lifecycle" },
        { label: "Partners", href: "/partners", description: "Organizations we work with" },
      ],
    },
    {
      label: "Global",
      href: "/global",
    },
  ],
  cta: { label: "Submit a Territory", href: "/contact" },
};

export const hero = {
  eyebrow: "Trust runs on evidence. Evidence runs on legal & regulatory",
  headline: "Every coordinate is subject to a law.",
  subheadline:
    "C2050 integrates legal and regulatory intelligence with geospatial coordinates, so every point on the map carries the rules that govern it, from carbon rights to Article 6 eligibility.",
  primaryCta: { label: "Submit a Territory", href: "/contact" },
  secondaryCta: { label: "See How It Works", href: "/products" },
  caption: "Other platforms map the territory. We map the law that governs it.",
};

/** Hero "Global Asset Monitor" console chrome. */
export const monitor = {
  title: "Global Asset Monitor",
  survey: "Survey · global · 8 sites",
};

/** Survey datum labels etched into dark-section backdrops — the two operational hubs. */
export const surveyDatum = {
  dublin: "53.3498° N · 6.2603° W",
  saoPaulo: "23.5505° S · 46.6333° W",
};

export const stats = [
  { value: 900, suffix: "+", label: "Project records screened" },
  { value: 5, suffix: "", label: "Intelligence layers integrated" },
  { value: 2, suffix: "", label: "Operational hubs" },
  { valueText: "Global", label: "Datasets integrated" },
];

export const problem = {
  eyebrow: "The Integrity Gap",
  headline: "Environmental markets run on trust. Trust runs on evidence.",
  body: "Carbon markets have faced a crisis of confidence. Independent research has questioned the integrity of a large share of issued credits: projects with unclear land rights, unverifiable baselines, and regulatory exposure that surfaces only after transactions close.",
  points: [
    {
      title: "Fragmented evidence",
      body: "Geospatial data, scientific models, legal title and regulatory status live in disconnected silos, with no single view of an asset's integrity.",
      icon: "data" as const,
    },
    {
      title: "Jurisdictional complexity",
      body: "Rights to carbon and nature-based outcomes depend on national, regional and local law that changes faster than market practice.",
      icon: "jurisdictional" as const,
    },
    {
      title: "Risk discovered too late",
      body: "Integrity issues are typically found after investment, during diligence, dispute or audit, when remediation is most expensive.",
      icon: "audit" as const,
    },
  ],
  resolution:
    "C2050 closes this gap with decision-grade confidence: structured risk visibility across every dimension of an environmental asset, before decisions are made.",
};

export const dataCube = {
  eyebrow: "The Data Cube",
  headline: "One coordinate. Every pillar. A financial asset.",
  body: "The Data Cube takes a point from the territory — its coordinates — then binds every pillar to it: geospatial, legal, regulatory, scientific, technical. Legal and regulatory standing, locked to the coordinate. Competitors do geospatial or legal; C2050 binds them — the evidence base that lets an environmental asset stand as a financial one.",
  /* Order matches the slab stack in DataCubeStack (SLABS), bottom → top.
     Territory is the base — the point taken from the land; the five pillars
     stack and bind to it. Geospatial (green) sitting under Legal + Regulatory
     (blue) is the bind seam — C2050's differentiator. */
  layers: [
    { label: "Territory", detail: "The point we take — coordinates, boundaries & plotted assets" },
    { label: "Geospatial", detail: "Footprint, terrain & land-use — the geospatial fact" },
    { label: "Legal", detail: "Tenure, carbon rights & ownership — locked to the coordinate" },
    { label: "Regulatory", detail: "Article 6, CORSIA & eligibility — locked to the coordinate" },
    { label: "Scientific", detail: "Carbon-stock models, baselines & MRV evidence" },
    { label: "Technical", detail: "Methodology, lifecycle & market readiness" },
  ],
  /* Left narrative axis (from Ludovino's slide) — three rungs the stacked
     instrument lights as it assembles: foundation → intelligence → transformation.
     Copy carried verbatim from his "EDGE CUBE" reference. */
  axis: [
    { key: "foundation", label: "Foundation", note: "Geospatial reality as the single source of truth" },
    { key: "intelligence", label: "Intelligence", note: "Integrated insights across 5 dimensions" },
    { key: "transformation", label: "Transformation", note: "Territorial data becomes a tradable asset" },
  ],
  /* Instrument chrome — the brand-bearing strings the Data Cube renders.
     Neutral phase verbs ("extracting…") stay inline in the component. */
  hud: {
    payoff: { from: "Environmental asset", to: "Financial asset" },
    pickHint: "Pick a pillar to inspect",
    play: "Play walkthrough",
    pause: "Pause walkthrough",
  },
  cta: { label: "Inside the Data Cube", href: "/about" },
};

export const audiences = {
  eyebrow: "Who We Serve",
  headline: "Built for every side of the market.",
  segments: [
    {
      name: "Suppliers",
      title: "Project developers, landowners & governments",
      body: "Structure assets correctly from day one. Demonstrate integrity with evidence, not assertions, and reach qualified demand.",
      examples: ["Project developers", "Landowners", "Governments & jurisdictions"],
      icon: "landowners" as const,
      cta: { label: "Structure your asset", href: "/contact?intent=supplier" },
    },
    {
      name: "Demanders",
      title: "Buyers, investors & compliance entities",
      body: "Screen before you commit. Decision-grade confidence on integrity, legal rights and regulatory eligibility, before capital moves.",
      examples: ["Corporate buyers", "Investors & funds", "Compliance entities"],
      icon: "buyers" as const,
      cta: { label: "Screen before you commit", href: "/contact?intent=demander" },
    },
    {
      name: "Facilitators",
      title: "Brokers, auditors, insurers & advisors",
      body: "Serve clients on a shared evidence base. Structured asset intelligence that plugs into diligence, audit and advisory workflows.",
      examples: ["Brokers & exchanges", "VVBs & auditors", "Insurers, banks & legal advisors"],
      icon: "brokers" as const,
      cta: { label: "Integrate C2050 into your workflow", href: "/contact?intent=facilitator" },
    },
  ],
};

export const missionVision = {
  mission: {
    title: "Mission",
    body: "To provide the intelligence and compliance infrastructure required to assess, structure and monitor high-integrity environmental assets across jurisdictions and markets.",
  },
  vision: {
    title: "Vision",
    body: "To enable a global environmental asset economy where nature-based and climate-related outcomes are supported by reliable data, clear legal rights, scientific credibility and regulatory alignment.",
  },
  values: ["Integrity", "Scientific rigor", "Legal precision", "Transparency", "Interoperability", "Market confidence"],
};

export const workflow = {
  eyebrow: "How It Works",
  headline: "Intelligence across the asset lifecycle.",
  body: "C2050 services follow the life of an environmental asset, from first screening to ongoing monitoring and reporting.",
  steps: [
    {
      name: "Screen",
      body: "Rapid preliminary screening of a territory or project against geospatial, legal and regulatory red flags.",
    },
    {
      name: "Assess",
      body: "Deep multi-layer assessment: carbon rights, tenure, scientific basis, methodology conformance and regulatory eligibility.",
    },
    {
      name: "Validate",
      body: "Evidence packages structured for independent validation by accredited third parties.",
    },
    {
      name: "Structure",
      body: "Legal and contractual structuring support so rights, obligations and benefit-sharing hold across jurisdictions.",
    },
    {
      name: "Monitor",
      body: "Continuous geospatial and regulatory monitoring, with alerts when facts on the ground or rules in force change.",
    },
    {
      name: "Transact & Report",
      body: "Asset intelligence profiles and compliance documentation that support transactions, disclosure and reporting.",
    },
  ],
};

export const clarifier = {
  headline: "What C2050 is, and is not",
  is: "C2050 is decision-support intelligence and compliance infrastructure. We give market participants the evidence base to act with confidence.",
  isNot:
    "C2050 is not a carbon standard, registry, broker, verification and validation body, or investment adviser. We do not issue credits, certify projects or provide investment advice.",
  valuesEyebrow: "Operating principles",
};

export const homeCta = {
  headline: "Bring decision-grade confidence to your next environmental asset.",
  body: "Talk to our team about screening a territory, assessing a project, or integrating C2050 intelligence into your workflow.",
  primaryCta: { label: "Submit a Territory", href: "/contact" },
  secondaryCta: { label: "See How It Works", href: "/products" },
};

export const footer = {
  blurb:
    "Global intelligence and compliance infrastructure for high-integrity environmental assets.",
  offices: [
    { city: "Dublin", country: "Ireland", note: "Headquarters" },
    { city: "São Paulo", country: "Brazil", note: "Latin America hub" },
  ],
  columns: [
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Leadership", href: "/leadership" },
        { label: "Our Story", href: "/our-story" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Platform",
      links: [
        { label: "Ecosystem", href: "/ecosystem" },
        { label: "Products", href: "/products" },
        { label: "Services", href: "/services" },
        { label: "Partners", href: "/partners" },
        { label: "Global", href: "/global" },
      ],
    },
  ],
  legal: [
    { label: "Code of Conduct", href: "/documents/code-of-conduct.pdf", external: true },
    { label: "Terms of Use", href: "/documents/terms-of-use.pdf", external: true },
    { label: "Privacy Policy", href: "/documents/privacy-policy.pdf", external: true },
  ],
  disclaimer:
    "C2050 is not a carbon standard, registry, broker, verification and validation body, or investment adviser. C2050 provides decision-support intelligence and compliance infrastructure.",
  copyright: `© ${new Date().getFullYear()} Climate Compliance 2050. All rights reserved.`,
};

export const consent = {
  // Bumping this version re-prompts every visitor (e.g. when the policy changes).
  version: "2026-06-21",
  eyebrow: "Cookie notice",
  message:
    "C2050 uses only the essential cookies the site needs to function. We set no advertising or tracking cookies. Continuing to browse confirms you accept this and our policies below.",
  accept: "Accept",
  links: [
    { label: "Privacy Policy", href: "/documents/privacy-policy.pdf", external: true },
    { label: "Code of Conduct", href: "/documents/code-of-conduct.pdf", external: true },
    { label: "Terms of Use", href: "/documents/terms-of-use.pdf", external: true },
  ],
};
