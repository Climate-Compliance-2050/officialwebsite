/**
 * Centralized site copy. English only for launch; keep all user-facing
 * strings here so a pt-BR locale can be added without touching components.
 *
 * Copy source of truth: legal counsel rewrite (June 2026). Never reintroduce
 * banned phrases — see CLAUDE.md banned-language table.
 */

export const site = {
  name: "C2050",
  legalName: "Climate Compliance 2050",
  tagline: "Global intelligence infrastructure for environmental asset integrity.",
  description:
    "C2050 integrates geospatial, scientific, technical, legal and regulatory intelligence to assess, structure and monitor environmental assets, starting with carbon credits, emission reductions and removals.",
  url: "https://www.c2050.com",
  linkedin: "https://www.linkedin.com/company/climatecompliance2050",
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
  ],
  cta: { label: "Assess an Asset", href: "/contact" },
};

export const hero = {
  eyebrow: "Legal RegTech · Geospatial Intelligence",
  headline: "Global intelligence infrastructure for environmental asset integrity.",
  subheadline:
    "C2050 integrates geospatial, scientific, technical, legal and regulatory intelligence to assess, structure and monitor environmental assets, starting with carbon credits, emission reductions and removals.",
  primaryCta: { label: "Assess an Asset", href: "/contact" },
  secondaryCta: { label: "Explore the Platform", href: "/about" },
  caption: "From territory to trusted environmental asset intelligence.",
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

export const fiveLayers = {
  eyebrow: "The Platform",
  headline: "Five intelligence layers. One asset view.",
  body: "Every environmental asset is assessed across five integrated layers, from the territory it occupies to the rules that govern it, producing a single, evidence-based integrity profile.",
  layers: [
    {
      name: "Territory",
      title: "Geospatial Intelligence",
      body: "Satellite imagery, boundary verification, land-use dynamics and overlap detection for the physical asset base.",
    },
    {
      name: "Science",
      title: "Scientific Intelligence",
      body: "Carbon-stock models, baselines, additionality indicators and MRV evidence assessed against current science.",
    },
    {
      name: "Technical",
      title: "Technical Intelligence",
      body: "Methodology conformance, data quality and quantification integrity across the project's technical documentation.",
    },
    {
      name: "Legal",
      title: "Legal Intelligence",
      body: "Land tenure, carbon rights, contractual chains and benefit-sharing structures mapped to applicable law.",
    },
    {
      name: "Regulatory",
      title: "Regulatory Intelligence",
      body: "Article 6, CORSIA, national frameworks and registry rules: eligibility and compliance status, monitored as rules evolve.",
    },
  ],
  outcome: {
    name: "Asset Intelligence",
    body: "An integrated, evidence-based integrity assessment, structured for decisions and ready for independent validation.",
  },
};

export const dataCube = {
  eyebrow: "The Data Cube",
  headline: "One territory. Every layer. A single point of truth.",
  body: "The C2050 Data Cube anchors an environmental asset to its territory, then integrates every layer of data around it. Where the layers intersect, value is validated: one secure point of evidence for intelligence-based, data-driven decisions.",
  layers: [
    { label: "Territory", detail: "Coordinates, boundaries & plotted points" },
    { label: "Geospatial", detail: "Footprint, terrain & land-use layers" },
    { label: "Scientific", detail: "Models, baselines & MRV evidence" },
    { label: "Legal", detail: "Rights, tenure & ownership" },
    { label: "Regulatory", detail: "Rules, eligibility & compliance" },
    { label: "Technical", detail: "Lifecycle, methodology & market readiness" },
  ],
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
    },
    {
      name: "Demanders",
      title: "Buyers, investors & compliance entities",
      body: "Screen before you commit. Decision-grade confidence on integrity, legal rights and regulatory eligibility, before capital moves.",
      examples: ["Corporate buyers", "Investors & funds", "Compliance entities"],
      icon: "buyers" as const,
    },
    {
      name: "Facilitators",
      title: "Brokers, auditors, insurers & advisors",
      body: "Serve clients on a shared evidence base. Structured asset intelligence that plugs into diligence, audit and advisory workflows.",
      examples: ["Brokers & exchanges", "VVBs & auditors", "Insurers, banks & legal advisors"],
      icon: "brokers" as const,
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
};

export const homeCta = {
  headline: "Bring decision-grade confidence to your next environmental asset.",
  body: "Talk to our team about screening a territory, assessing a project, or integrating C2050 intelligence into your workflow.",
  primaryCta: { label: "Assess an Asset", href: "/contact" },
  secondaryCta: { label: "Explore the Platform", href: "/about" },
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
      ],
    },
  ],
  legal: [
    { label: "Code of Ethics", href: "/code-of-ethics" },
    { label: "Privacy Policy", href: "/privacy-policy" },
  ],
  disclaimer:
    "C2050 is not a carbon standard, registry, broker, verification and validation body, or investment adviser. C2050 provides decision-support intelligence and compliance infrastructure.",
  copyright: `© ${new Date().getFullYear()} Climate Compliance 2050. All rights reserved.`,
};
