/** Copy for the About cluster: About Us, Leadership, Our Story, Contact. */

export const aboutPage = {
  hero: {
    eyebrow: "About Us",
    headline: "Intelligence infrastructure for the environmental asset economy.",
    body: "C2050 is a product, service and advisory platform delivering flexible, scalable infrastructure to assess, structure and monitor environmental assets, their value spanning ecological, social, economic, political and territorial dimensions.",
  },
  dataCube: {
    eyebrow: "The Data Cube",
    headline: "Every asset, a structured information object.",
    body: "C2050's fundamental innovation is the Data Cube: a conceptual and operational framework that treats each unit of environmental asset (one tonne of carbon, one kWh of clean energy, one cubic metre of clean water) as a structured, multi-dimensional information object. A C2050-assessed environmental asset derives its credibility from an immutable information chain linking every data input (geographical, legal, scientific, social) to its verified origin.",
    pyramid: [
      { level: "Data", body: "Raw geospatial, legal and environmental data from satellite imagery, remote sensing, public registries, scientific models and proprietary databases." },
      { level: "Information", body: "Data processed into structured, comparable information within the asset's information chain." },
      { level: "Knowledge", body: "Information analysed into actionable knowledge: risks, gaps, eligibility and compliance posture." },
      { level: "Intelligence", body: "Knowledge communicated as decision-grade intelligence, structured for buyers, regulators and partners." },
      { level: "Asset", body: "An evidence-based, legally structured environmental asset profile that markets can rely on." },
    ],
    principles: ["Origin", "Impact", "Legality", "Veracity", "Integrity"],
  },
  techFoundation: {
    eyebrow: "Technological Foundation",
    headline: "Enterprise infrastructure, built for sovereignty.",
    body: "The platform layer that lets every participant in the environmental asset market (developers, landowners, buyers, governments, rating agencies, insurers, legal firms, financial institutions) operate with structured visibility into the integrity, quality and regulatory compliance of the assets they generate, fund, acquire or trade.",
    pillars: [
      {
        name: "Multi-tenant cloud architecture",
        body: "A highly scalable multi-tenant SaaS hosted natively on AWS. Clients share a robust codebase while proprietary data remains isolated and ring-fenced in customized environments: data privacy and sovereignty for governments and large corporates.",
      },
      {
        name: "Hybrid geospatial integration",
        body: "Esri ArcGIS Enterprise for secure internal data processing, integrated with ArcGIS Online for cloud customer dashboards, with real-time synchronization of complex geodatabases across global markets.",
      },
      {
        name: "API-first interoperability",
        body: "REST APIs, Python ETL and webhooks let external systems programmatically query, analyse and publish geospatial data, flowing into corporate ERPs (SAP), BI tools (Power BI) and real-time sensors (SCADA/IoT).",
      },
      {
        name: "Institutional-grade security",
        body: "SSO and MFA centralized through Amazon Cognito, with strict Role-Based Access Control. Every interaction is governed by a Tenant + Role + Permission rule set: granular administrator control and strict data segregation.",
      },
      {
        name: "Blockchain & digital twins",
        body: "Key elements of the information chain are recorded on blockchain, creating a traceable, immutable digital twin for every asset, helping detect, prevent and mitigate double-counting and data-tampering risks.",
      },
      {
        name: "AI-enriched legal library",
        body: "AI continuously enriches territorial intelligence and dynamically updates the proprietary Legal Library, keeping compliance databases aligned with shifting global environmental regulations.",
      },
    ],
  },
  focus: {
    headline: "Starting with nature. Built to expand.",
    body: "Initial focus on nature-based solutions (carbon credits, emission reductions and removals), evolving in time to energy, transportation and the broader environmental asset economy. Insights are delivered through a SaaS platform designed to support digital monitoring, reporting and verification (D-MRV).",
  },
};

export const leadershipPage = {
  hero: {
    eyebrow: "Leadership",
    headline: "Scientific, legal and operational mastery.",
    body: "Solving the climate crisis requires more than capital. Our leadership unites experience from global finance, international environmental law and advanced geospatial science to build infrastructure for the environmental asset market.",
  },
  // Tier 1 — C-suite, direction & strategy.
  executive: [
    {
      name: "Ludovino Lopes",
      role: "Chairman & CEO",
      bio: "International climate and environmental lawyer with over 30 years' experience in legal and regulatory interpretation of environmental assets and services.",
      photo: "/team/ludovino-lopes.webp",
      linkedin: "https://www.linkedin.com/in/ludovinolopes/",
    },
    {
      name: "Alan Barry",
      role: "COO & CFO",
      bio: "Senior chartered accountant with over 25 years of banking, asset management and real-estate private equity experience.",
      photo: "/team/alan-barry.webp",
      linkedin: "https://www.linkedin.com/in/alan-barry-450a4434/",
    },
    {
      name: "Mauricio Meira",
      role: "CCO & CSO",
      bio: "Engineer and Master of Science with over 20 years of experience using geospatial technology for natural resource monitoring.",
      photo: "/team/mauricio-meira.webp",
      linkedin: "https://www.linkedin.com/in/mbmeira/",
    },
  ],
  // Tier 2 — operating team, delivery & analysis.
  team: [
    {
      name: "Guilherme Lopes",
      role: "Head of Operations",
      bio: "Specialist in climate operations and value investing, driving the operational cost frameworks for projects.",
      photo: "/team/guilherme-lopes.webp",
      linkedin: "https://www.linkedin.com/in/guilherme-ludovino-lopes/",
    },
    {
      name: "Giovani Bino",
      role: "Head of Product",
      bio: "Expert in physical geography with over a decade of experience coordinating advanced geospatial intelligence and remote sensing projects.",
      photo: "/team/giovani-bino.webp",
      linkedin: "https://www.linkedin.com/in/giovani-bino/",
    },
    {
      name: "Raul Barros",
      role: "Operations Analyst",
      bio: "Experience in regulatory intelligence and operational efficiency, integrating scientific rigor with strategic business management.",
      photo: "/team/raul-barros.webp",
      linkedin: "https://www.linkedin.com/in/raulpaesdebarros/",
    },
  ],
};

export const storyPage = {
  hero: {
    eyebrow: "Our Story",
    headline: "A Legal RegTech company leveling the international playing field.",
    body: "Climate Compliance 2050 was created by founders with deep knowledge of environmental asset and services markets, and a clear view of the gap between how assets are generated and how their integrity is evidenced.",
  },
  timeline: [
    {
      period: "The gap",
      title: "A market without an evidence layer",
      body: "Carbon credits and other environmental assets are generated across different geographies and a multitude of international standards. Assessing their veracity and quality demands consistent, timely and reliable intelligence, which the market lacked.",
    },
    {
      period: "June 2024",
      title: "Founded in Dublin",
      body: "Following comprehensive international legal and tax advice, the C2050 holding company was formally established in Dublin, Ireland, a trusted regulatory framework positioning the company on the international stage.",
    },
    {
      period: "2024–2025",
      title: "Five disciplines, one platform",
      body: "C2050 combined geospatial, legal, regulatory, scientific and technical knowledge into a single intelligence platform, with operational hubs established in Latin America.",
    },
    {
      period: "Today",
      title: "Restoring market trust",
      body: "A fully aligned, cross-disciplinary global team, building the infrastructure designed to restore market trust, unlock the flow of sustainable finance, and support verifiable global climate action.",
    },
  ],
  quotes: [
    {
      text: "The standards used to generate carbon credits and other environmental assets only pay lip service to the legal, regulatory and compliance steps necessary to deliver legitimate and high-quality offset solutions.",
      author: "Alan Barry",
      role: "Co-Founder & Director",
    },
    {
      text: "We are delivering the definitive infrastructure designed to restore market trust, unlock the flow of sustainable finance, and catalyze verifiable global climate action.",
      author: "Mauricio Meira",
      role: "CCO & CSO",
    },
  ],
  scale: {
    headline: "Why scale matters",
    body: "International environmental asset markets must scale to make a meaningful contribution to climate change and nature imbalances. Every stakeholder, whether buy side, sell side or market facilitator, needs access to insightful intelligence to have the confidence to scale these markets. Deeper understanding of the legal, regulatory and compliance steps also enables interoperability between voluntary credits and emerging regulated and compliance markets.",
  },
};

export const contactPage = {
  hero: {
    eyebrow: "Contact",
    headline: "Tell us about your asset.",
    body: "Tell us about your territory, project or portfolio.",
  },
  form: {
    name: { label: "Full name", placeholder: "Your name" },
    email: { label: "Work email", placeholder: "you@company.com" },
    organization: { label: "Organization", placeholder: "Company or institution" },
    interest: {
      label: "What do you need?",
      options: [
        "Assess an asset or territory",
        "Explore the platform (demo)",
        "Partnership / join the ecosystem",
        "Other",
      ],
    },
    message: { label: "Your message", placeholder: "Tell us about your project, asset or jurisdiction…" },
    submit: "Send message",
    errors: {
      required: "This field is required.",
      email: "Enter a valid email address, e.g. you@company.com.",
    },
    status: {
      sending: "Sending…",
      sent: "Thank you! Your message is on its way.",
      // The contact email is appended as a mailto link after this sentence.
      error: "Something went wrong sending your message. Please retry, or email us directly at",
    },
  },
  offices: [
    { city: "Dublin, Ireland", note: "Headquarters" },
    { city: "São Paulo, Brazil", note: "Latin America hub" },
  ],
};
