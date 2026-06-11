/** Copy for the Ecosystem cluster: Ecosystem, Products, Services, Partners. */

import type { BrandIconName } from "@/components/ui/BrandIcon";

export const ecosystemPage = {
  hero: {
    eyebrow: "Ecosystem",
    headline: "A collaborative global network for climate compliance.",
    body: "Scaling market integrity takes more than software. C2050 connects a multidisciplinary network of scientists, legal experts and technology providers, delivering structured risk visibility and decision-grade confidence for environmental asset decisions.",
  },
  network: {
    headline: "The C2050 ecosystem",
    body: "No single entity can solve the complexities of the global carbon market in isolation. C2050 operates a controlled digital ecosystem where qualified partners offer complementary services directly through the platform, integrating standard-setters, Validation and Verification Bodies (VVBs) and certified auditors in a single environment that mitigates conflicts of interest and gives clients access to high-quality intelligence.",
    agnostic:
      "The ecosystem is technology- and standard-agnostic: each participant configures the providers, standards and data sources that fit their needs. The network expands continuously as the platform grows into new markets.",
  },
  actors: [
    { label: "Standards & methodologies", icon: "badges" as BrandIconName },
    { label: "Registries", icon: "data" as BrandIconName },
    { label: "VVBs & auditors", icon: "audit" as BrandIconName },
    { label: "Governments & jurisdictions", icon: "governments" as BrandIconName },
    { label: "Project developers", icon: "project-developers" as BrandIconName },
    { label: "Buyers & corporates", icon: "buyers" as BrandIconName },
    { label: "Insurers", icon: "insurance" as BrandIconName },
    { label: "Banks & funders", icon: "funders" as BrandIconName },
    { label: "Legal advisors", icon: "legal-regulatory" as BrandIconName },
    { label: "Geospatial providers", icon: "geographical" as BrandIconName },
    { label: "D-MRV providers", icon: "dmrv" as BrandIconName },
    { label: "Exchanges & brokers", icon: "exchange" as BrandIconName },
  ],
};

export const productsPage = {
  hero: {
    eyebrow: "Products",
    headline: "Actionable intelligence for high-integrity environmental assets.",
    body: "The infrastructure layer that turns fragmented environmental data into structured, evidence-based asset intelligence, from first screening to ongoing monitoring.",
  },
  platform: {
    headline: "The platform",
    body: "At the core of C2050 is a highly scalable SaaS platform built on our proprietary Data Cube framework. Raw geospatial, legal and environmental data moves through an immutable information chain, so every conclusion traces back to its source evidence.",
    sandbox:
      "Whether you originate, manage or retire carbon credits, the platform's sandbox environment supports evidence-based integrity assessment of any underlying nature-based project: regulatory compliance, legal rights and scientific credibility in one view.",
    modules: [
      { name: "Geospatial module", body: "Boundary verification, overlap detection, land-use dynamics and advanced geoprocessing.", icon: "geographical" as BrandIconName },
      { name: "Scientific module", body: "Carbon-stock models, baselines and emission-reduction metrics benchmarked against standards.", icon: "co2" as BrandIconName },
      { name: "Legal module", body: "Land tenure, carbon rights and contractual chains mapped to applicable law.", icon: "legal-regulatory" as BrandIconName },
      { name: "Regulatory module", body: "Article 6, CORSIA, national frameworks and registry rules, monitored as they evolve.", icon: "jurisdictional" as BrandIconName },
      { name: "Compliance module", body: "Smart Compliance Badges, audit trails and structured evidence packages.", icon: "badges" as BrandIconName },
      { name: "Data integration", body: "API-first: REST, Python ETL pipelines and webhooks for your own data and systems.", icon: "data" as BrandIconName },
    ],
  },
  tiersIntro: {
    headline: "Platform licensing tiers",
    body: "C2050 operates on annual subscription tiers, with analytical depth to match your organization's needs, from the standard C2050 interface to a fully customized White Label deployment.",
  },
  tiers: [
    {
      name: "Asset Viewer",
      tagline: "The entry-level gateway for market participants exploring the platform.",
      features: [
        "Standard SaaS intelligence",
        "Basic spatial analysis tools",
        "Receive and view project data shared by license holders",
      ],
      bestFor: "Prospects, stakeholders and secondary buyers interacting with assessed project information.",
    },
    {
      name: "Asset Manager",
      tagline: "For project developers and asset managers tracking environmental portfolios.",
      features: [
        "Select target assets and apply geospatial filters",
        "Portfolio management in a secure, user-controlled database",
        "Trace the original source of every data point",
        "Interact with publicly accessible Smart Compliance Badges",
      ],
      bestFor: "Organizations that need to track, organize and evidence the compliance of their environmental asset holdings.",
      highlight: true,
    },
    {
      name: "Asset Expert",
      tagline: "The premium tier for technical professionals demanding maximum platform depth.",
      features: [
        "Full access to all intelligence modules",
        "Sophisticated mapping and advanced geoprocessing",
        "Upload proprietary datasets to enrich asset records",
        "Independent due-diligence workflows",
      ],
      bestFor: "Advanced investors, scientists and auditors requiring in-depth territorial analysis and maximum data flexibility.",
    },
    {
      name: "Sovereign & Enterprise (White Label)",
      tagline: "For large enterprises, financial institutions and sovereign governments requiring complete oversight.",
      features: [
        "C2050 software deployed in your own branded environment",
        "Administrator license: user access, data geofencing and layout control",
        "Smart Compliance Badges: build proprietary rating frameworks on custom criteria (ESG policies, legal audits, nesting procedures)",
      ],
      bestFor: "Institutions running jurisdictional programs or internal market infrastructure on C2050 rails.",
    },
  ],
  badges: {
    headline: "Smart Compliance Badges",
    body: "Configurable indicators, not accreditation. Badges signal that an asset meets criteria you define: geospatial integrity, jurisdictional alignment or legal review status. Every badge traces to the underlying evidence in the Data Cube.",
    stamps: [
      { src: "/brand/stamp-geo.webp", label: "Geospatial criteria" },
      { src: "/brand/stamp-jurisdiction.webp", label: "Jurisdictional criteria" },
      { src: "/brand/stamp-legal.webp", label: "Legal criteria" },
    ],
  },
};

export type Service = {
  name: string;
  body: string;
  jurisdictional?: boolean;
};

export const servicesPage = {
  hero: {
    eyebrow: "Services",
    headline: "Intelligence services across the asset lifecycle.",
    body: "Beyond the platform, C2050 delivers technical, scientific, legal and regulatory assessments, organized along the life of an environmental asset, from first screening to ongoing reporting.",
  },
  stages: [
    {
      stage: "Screen",
      intro: "Rapid, low-cost checks before commitments are made.",
      services: [
        {
          name: "Land Eligibility",
          body: "Overlap analysis with environmental and land-tenure layers: the first step to determine whether the land is suitable for your project.",
        },
        {
          name: "Preliminary Project Eligibility",
          body: "Project-area overlap analysis with environmental and land-tenure layers: the first check that an existing project meets the basic conditions for existence.",
        },
        {
          name: "Target Potential",
          body: "Screen a region of interest to pinpoint areas with the highest credit-generation potential: spatial filtering for REDD+ eligibility combined with legal review of property compliance.",
          jurisdictional: true,
        },
      ],
    },
    {
      stage: "Assess",
      intro: "Deep multi-layer assessment of feasibility, carbon potential and compliance risk.",
      services: [
        {
          name: "Prefeasibility",
          body: "Preliminary scientific feasibility analysis: a deeper compliance risk assessment for your project pipeline.",
        },
        {
          name: "Full Feasibility",
          body: "Full scientific feasibility analysis: a unique solution in the market, addressing the most complex compliance gaps.",
        },
        {
          name: "Preliminary Know Your Carbon",
          body: "Preliminary carbon-potential assessment via spatial overlap analysis and emission-reduction calculations, benchmarked against standard metrics and combined with a preliminary legal review of land and project.",
        },
      ],
    },
    {
      stage: "Validate",
      intro: "Evidence packages structured for independent validation.",
      services: [
        {
          name: "Know Your Carbon",
          body: "A comprehensive assessment executing deep technical analysis (PDD-aligned emission metrics and a complete legal review of land tenure and project structure), producing an evidence base ready for independent validation.",
        },
      ],
    },
    {
      stage: "Structure",
      intro: "Making rights and obligations hold across jurisdictions.",
      services: [
        {
          name: "Asset Structuring Support",
          body: "Legal and contractual structuring support: carbon rights, benefit-sharing and transaction documentation aligned with applicable law in each jurisdiction.",
        },
      ],
    },
    {
      stage: "Monitor",
      intro: "Continuous visibility as facts on the ground and rules in force change.",
      services: [
        {
          name: "Baseline Assessment",
          body: "Define the deforestation baseline and risk factors, delivering spatially explicit maps to support jurisdictional strategies and planning for countries, states or municipalities.",
          jurisdictional: true,
        },
        {
          name: "Continuous Monitoring",
          body: "Ongoing geospatial and regulatory monitoring of assessed assets, with alerts when land-use, legal or regulatory conditions change.",
        },
      ],
    },
    {
      stage: "Transact & Report",
      intro: "Documentation that supports transactions, disclosure and national reporting.",
      services: [
        {
          name: "Locally Determined Contribution",
          body: "Calculate a jurisdiction's specific contribution to Brazil's NDC, aligning local results with National GHG Inventory standards.",
          jurisdictional: true,
        },
        {
          name: "Compliance Reporting",
          body: "Asset intelligence profiles and structured compliance documentation supporting transactions, audits and disclosure obligations.",
        },
      ],
    },
  ],
};

export const partnersPage = {
  hero: {
    eyebrow: "Partners",
    headline: "A global coalition for climate integrity.",
    body: "Solving the multi-dimensional challenges of the global carbon market cannot be achieved in isolation. We work with strategic partners who share our standards for governance and transparency.",
  },
  body: "Building high-integrity environmental assets is a collaborative effort. By integrating deep legal expertise, secure trading environments and foundational climate education, our partner network covers every angle of the carbon market.",
  quote: {
    text: "True compliance is a collaborative achievement. We align leading expertise to bring clarity and security to the carbon market.",
    author: "Ludovino Lopes",
    role: "Chairman & CEO, C2050",
  },
  partners: [
    {
      name: "Ludovino Lopes Advogados",
      logo: "/partners/ludovino-lopes.webp",
      url: "https://www.ludovinolopes.com.br/",
      body: "A reference law firm in environmental, climate and carbon-market law, bringing deep legal expertise to the structuring and assessment of environmental assets.",
    },
    {
      name: "GEAP",
      logo: "/partners/geap.webp",
      url: "https://geap.global/",
      body: "Geospatial analysis and applied environmental intelligence supporting territorial assessment at scale.",
    },
    {
      name: "Yakarana",
      logo: "/partners/yakarana.webp",
      url: "https://www.yakarana.com/",
      body: "Climate education and market capacity-building, strengthening the foundations of a high-integrity carbon economy.",
    },
  ],
};
