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
      { id: "geo", name: "Geospatial module", short: "Geospatial", body: "Boundary verification, overlap detection, land-use dynamics and advanced geoprocessing.", icon: "geographical" as BrandIconName, core: true },
      { id: "legal", name: "Legal module", short: "Legal", body: "Land tenure, carbon rights and contractual chains mapped to applicable law.", icon: "legal-regulatory" as BrandIconName, core: true },
      { id: "regulatory", name: "Regulatory module", short: "Regulatory", body: "Article 6, CORSIA, national frameworks and registry rules, monitored as they evolve.", icon: "jurisdictional" as BrandIconName, core: true },
      { id: "scientific", name: "Scientific module", short: "Scientific", body: "Carbon-stock models, baselines and emission-reduction metrics benchmarked against standards.", icon: "co2" as BrandIconName },
      { id: "compliance", name: "Compliance module", short: "Compliance", body: "Smart Compliance Badges, audit trails and structured evidence packages.", icon: "badges" as BrandIconName },
      { id: "data", name: "Data integration", short: "Data API", body: "API-first: REST, Python ETL pipelines and webhooks for your own data and systems.", icon: "data" as BrandIconName },
    ],
  },
  tiersIntro: {
    headline: "Platform licensing tiers",
    body: "Four tiers of analytical depth, from the standard C2050 interface to a fully customised white-label deployment. Seat licences run on annual or monthly terms; pay-as-you-go per-study credits sit alongside for occasional use. Every tier is quoted to scope.",
  },
  /** Billing model. Seat licences (annual/monthly) for the tiers; PAYG is a separate lane. */
  billing: {
    intro: "How access is priced",
    modes: [
      {
        id: "annual",
        label: "Annual",
        note: "Committed seats on a yearly term — the standard institutional engagement, best rate.",
      },
      {
        id: "monthly",
        label: "Monthly",
        note: "Rolling seats billed monthly — for pilots and shorter engagements, no annual commitment.",
      },
    ],
    payg: {
      eyebrow: "Separate lane",
      label: "Pay-as-you-go",
      note: "No seat licence. Buy per-study credits and draw on the platform's intelligence study by study — for one-off due diligence or occasional checks.",
    },
    quote: "Prices depend on scope and seats. Every tier is quoted directly — no list pricing.",
  },
  /**
   * Shared DNA — the four intelligence layers present in every licence, bound to
   * coordinates by the Data Cube. This is what does NOT change between tiers; tiers
   * differ only in what you can do and who they suit (see `tiers`). Notes are drawn
   * from the module bodies above — no new claims.
   */
  dna: {
    eyebrow: "In every licence",
    aside: "Four layers · all tiers",
    pillars: [
      { label: "Legal", note: "Land tenure, carbon rights, contractual chains, applicable law." },
      { label: "Regulatory", note: "Article 6, CORSIA, national frameworks and registry rules." },
      { label: "Scientific", note: "Carbon-stock models, baselines and emission-reduction metrics." },
      { label: "Compliance", note: "Audit trails, evidence packages and Smart Compliance Badges." },
    ],
    bind: "Every record carries the same bind: legal and regulatory status locked to geospatial coordinates through the Data Cube. Competitors do geospatial or legal — C2050 holds both as one record.",
  },
  /**
   * Tiers. The DNA above is identical across all four — these differ only in what the
   * licence lets you do (`access`, `features`) and who it suits (`bestFor`). `access`
   * is the HUD verb shown on each tablet box.
   */
  tiers: [
    {
      code: "01",
      name: "Asset Viewer",
      access: "Read · shared",
      modules: ["geo", "legal", "regulatory"],
      tagline: "The entry-level gateway for market participants exploring the platform.",
      features: [
        "Standard SaaS intelligence",
        "Basic spatial analysis tools",
        "Receive and view project data shared by license holders",
      ],
      bestFor: "Prospects, stakeholders and secondary buyers interacting with assessed project information.",
    },
    {
      code: "02",
      name: "Asset Manager",
      access: "Manage",
      modules: ["geo", "legal", "regulatory", "compliance"],
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
      code: "03",
      name: "Asset Expert",
      access: "Full · upload",
      modules: ["geo", "legal", "regulatory", "scientific", "compliance", "data"],
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
      code: "04",
      name: "Sovereign & Enterprise (White Label)",
      access: "Deploy · govern",
      modules: ["geo", "legal", "regulatory", "scientific", "compliance", "data"],
      admin: true,
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
    /* Evidence plaques — rectangular, instrument-style. Deliberately NOT seals or
       rosettes: C2050 does not certify, and the visual must not imply it. Strings
       are drawn from `body` above — no new claims. */
    aside: "Configurable indicators · not accreditation",
    plaques: [
      { code: "GEO", label: "Geospatial criteria", signal: "Geospatial integrity" },
      { code: "JUR", label: "Jurisdictional criteria", signal: "Jurisdictional alignment" },
      { code: "LEG", label: "Legal criteria", signal: "Legal review status" },
    ],
    evidence: "Data Cube record",
  },
};

/** Depth tier of a study — how far the analysis goes. Ordered shallow → deep. */
export type StudyDepth = "Screening" | "Feasibility" | "Comprehensive" | "Territorial";
/** Which funnel a study belongs to: a single project, or a whole territory. */
export type StudyAudience = "project" | "territory";

export type Study = {
  /** Two-digit funnel index, shallow → deep. */
  code: string;
  name: string;
  /** Descriptive copy (legal-counsel voice). What the study examines. */
  body: string;
  /** "What you get" — framed as a study/information product, never a verdict. */
  deliverable: string;
  depth: StudyDepth;
  /** Spatial grain the study can resolve to, e.g. "Parcel", "Country · State · Municipality". */
  granularity: string;
  audience: StudyAudience;
  /** Lifecycle phase, for the home WorkflowStrip dial. Matches a `workflow.steps` name. */
  stage: string;
  /** Territory-scale work for governments/jurisdictions. */
  jurisdictional?: boolean;
};

export const servicesPage = {
  hero: {
    eyebrow: "Services",
    headline: "Hard information on land, projects and territories.",
    body: "C2050 studies integrate legal and regulatory analysis with geospatial intelligence — georeferenced, decision-grade. From a rapid first screening to a validation-ready evidence base, at scales from a single parcel to an entire municipality.",
  },
  /** Value-proposition band: two disciplines, one integrated study. */
  valueProp: {
    eyebrow: "What a C2050 study is",
    headline: "Studied with two kinds of expert eyes.",
    body: "Every study integrates legal and regulatory analysis — the rigour of a specialised environmental-law firm — with geospatial intelligence from satellite and sensory data. Georeferenced and decision-grade: hard information, evidence not assertions.",
    lenses: [
      {
        label: "Legal & Regulatory",
        note: "Carbon rights · tenure · jurisdiction · Article 6",
        tone: "blue" as const,
      },
      {
        label: "Geospatial",
        note: "Satellite · sensing · land-use · boundaries",
        tone: "green" as const,
      },
    ],
    converge: "One integrated study",
  },
  catalogue: {
    eyebrow: "The studies",
    headline: "Screen wide, then go deep.",
    body: "Nine studies along one funnel. Filter by who you are and how far you need to go — each can be requested directly.",
  },
  /** Filter predicates, single-select. Mirrors the funnel's two axes. */
  filters: [
    { id: "all", label: "All studies" },
    { id: "project", label: "Project" },
    { id: "territory", label: "Territory" },
    { id: "screening", label: "Screening" },
    { id: "deep", label: "In-depth" },
  ],
  /** Ordered shallow → deep for the core-sample descent. */
  studies: [
    {
      code: "01",
      name: "Land Eligibility",
      body: "Georeferenced analysis of a land parcel against environmental and land-tenure layers — the first study of whether the land suits your project.",
      deliverable: "A screening study mapping the parcel's environmental and land-tenure fragilities.",
      depth: "Screening",
      granularity: "Parcel",
      audience: "project",
      stage: "Screen",
    },
    {
      code: "02",
      name: "Preliminary Project Eligibility",
      body: "Georeferenced analysis of an existing project area against environmental and land-tenure layers — an early study of whether the project meets the basic conditions.",
      deliverable: "A screening study of the project area's environmental and land-tenure standing.",
      depth: "Screening",
      granularity: "Project area",
      audience: "project",
      stage: "Screen",
    },
    {
      code: "03",
      name: "Target Potential",
      body: "A regional study that pinpoints the areas with the highest credit-generation potential: REDD+ spatial filtering combined with legal review of property compliance.",
      deliverable: "A priority-area study: REDD+ eligibility mapped, property compliance reviewed.",
      depth: "Screening",
      granularity: "Region",
      audience: "territory",
      stage: "Screen",
      jurisdictional: true,
    },
    {
      code: "04",
      name: "Pre-Feasibility",
      body: "A preliminary scientific feasibility study and a deeper compliance-risk assessment for your project pipeline.",
      deliverable: "A preliminary feasibility study setting out the project's compliance risks.",
      depth: "Feasibility",
      granularity: "Project",
      audience: "project",
      stage: "Assess",
    },
    {
      code: "05",
      name: "Preliminary Know Your Carbon",
      body: "A preliminary carbon-potential study via spatial analysis and emission-reduction calculations, benchmarked against standard metrics, with a preliminary legal review of land and project.",
      deliverable: "A preliminary carbon-potential study, benchmarked, with a first legal review.",
      depth: "Feasibility",
      granularity: "Project",
      audience: "project",
      stage: "Assess",
    },
    {
      code: "06",
      name: "Full Feasibility",
      body: "A full scientific feasibility study — a depth of analysis unique in the market, addressing the most complex compliance gaps.",
      deliverable: "A full scientific feasibility study covering the hardest compliance gaps.",
      depth: "Feasibility",
      granularity: "Project",
      audience: "project",
      stage: "Assess",
    },
    {
      code: "07",
      name: "Know Your Carbon",
      body: "A comprehensive study: PDD-aligned emission metrics and a complete legal review of land tenure and project structure, producing an evidence base ready for independent validation.",
      deliverable: "A validation-ready evidence base: PDD-aligned metrics and full legal review.",
      depth: "Comprehensive",
      granularity: "Project",
      audience: "project",
      stage: "Validate",
    },
    {
      code: "08",
      name: "Baseline Assessment",
      body: "A study defining the deforestation baseline and risk factors, delivering spatially explicit maps to support jurisdictional strategy and planning — for countries, states or municipalities.",
      deliverable: "A baseline study with spatially explicit deforestation and risk maps.",
      depth: "Territorial",
      granularity: "Country · State · Municipality",
      audience: "territory",
      stage: "Monitor",
      jurisdictional: true,
    },
    {
      code: "09",
      name: "Locally Determined Contribution",
      body: "A study calculating a jurisdiction's specific contribution to Brazil's NDC, aligning local results with National GHG Inventory standards.",
      deliverable: "A study of the jurisdiction's NDC contribution, aligned to the National GHG Inventory.",
      depth: "Territorial",
      granularity: "Jurisdiction",
      audience: "territory",
      stage: "Transact & Report",
      jurisdictional: true,
    },
  ] satisfies Study[],
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
