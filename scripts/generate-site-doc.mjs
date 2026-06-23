/**
 * Generates c2050-website-text.docx from all site content files.
 * Run: node scripts/generate-site-doc.mjs
 */
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  BorderStyle, TableOfContents, ShadingType,
} from "docx";
import { writeFileSync } from "fs";

// ── helpers ─────────────────────────────────────────────────────────────────

function h1(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 480, after: 120 },
  });
}

function h2(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 360, after: 80 },
  });
}

function h3(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 240, after: 60 },
  });
}

function body(text, { italic = false, bold = false } = {}) {
  return new Paragraph({
    children: [new TextRun({ text, italics: italic, bold })],
    spacing: { before: 60, after: 60 },
  });
}

function label(key, value) {
  return new Paragraph({
    children: [
      new TextRun({ text: `${key}: `, bold: true }),
      new TextRun({ text: value }),
    ],
    spacing: { before: 40, after: 40 },
  });
}

function bullet(text) {
  return new Paragraph({
    children: [new TextRun({ text })],
    bullet: { level: 0 },
    spacing: { before: 40, after: 40 },
  });
}

function divider() {
  return new Paragraph({
    text: "",
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } },
    spacing: { before: 200, after: 200 },
  });
}

function eyebrow(text) {
  return new Paragraph({
    children: [new TextRun({ text: text.toUpperCase(), size: 18, color: "345FAA" })],
    spacing: { before: 120, after: 40 },
  });
}

// ── document sections ────────────────────────────────────────────────────────

const children = [];

// Cover
children.push(
  new Paragraph({
    children: [new TextRun({ text: "C2050 — Website Text", bold: true, size: 48 })],
    spacing: { before: 800, after: 200 },
  }),
  new Paragraph({
    children: [new TextRun({ text: "Climate Compliance 2050", size: 28, color: "345FAA" })],
    spacing: { after: 80 },
  }),
  new Paragraph({
    children: [new TextRun({ text: `Extracted ${new Date().toLocaleDateString("en-IE", { day: "numeric", month: "long", year: "numeric" })}`, color: "888888" })],
    spacing: { after: 800 },
  }),
  divider(),
);

// ── 1. GLOBAL / SHARED ──────────────────────────────────────────────────────
children.push(h1("1. Global / Shared"));

children.push(h2("Site Identity"));
children.push(label("Legal name", "Climate Compliance 2050"));
children.push(label("Tagline", "Global intelligence infrastructure for environmental asset integrity."));
children.push(label("Description", "C2050 integrates geospatial, scientific, technical, legal and regulatory intelligence to assess, structure and monitor environmental assets, starting with carbon credits, emission reductions and removals."));

children.push(h2("Navigation"));
children.push(body("Assess an Asset  (CTA button)"));
children.push(body("About  →  About Us · Leadership · Our Story"));
children.push(body("Ecosystem  →  Ecosystem · Products · Services · Partners"));

children.push(h2("Footer"));
children.push(label("Blurb", "Global intelligence and compliance infrastructure for high-integrity environmental assets."));
children.push(label("Offices", "Dublin, Ireland (Headquarters) · São Paulo, Brazil (Latin America hub)"));
children.push(label("Disclaimer", "C2050 is not a carbon standard, registry, broker, verification and validation body, or investment adviser. C2050 provides decision-support intelligence and compliance infrastructure."));

// ── 2. HOME PAGE ────────────────────────────────────────────────────────────
children.push(divider(), h1("2. Home Page  (/)" ));

children.push(h2("Hero"));
children.push(eyebrow("Trust runs on evidence. Evidence runs on legal & regulatory"));
children.push(h3("Every coordinate is subject to a law."));
children.push(body("C2050 integrates legal and regulatory intelligence with geospatial coordinates, so every point on the map carries the rules that govern it, from carbon rights to Article 6 eligibility."));
children.push(body("Caption: Other platforms map the territory. We map the law that governs it.", { italic: true }));

children.push(h2("Stats"));
children.push(bullet("900+ Project records screened"));
children.push(bullet("5 Intelligence layers integrated"));
children.push(bullet("2 Operational hubs"));
children.push(bullet("Global Datasets integrated"));

children.push(h2("The Integrity Gap"));
children.push(eyebrow("The Integrity Gap"));
children.push(h3("Environmental markets run on trust. Trust runs on evidence."));
children.push(body("Carbon markets have faced a crisis of confidence. Independent research has questioned the integrity of a large share of issued credits: projects with unclear land rights, unverifiable baselines, and regulatory exposure that surfaces only after transactions close."));
children.push(h3("Fragmented evidence"));
children.push(body("Geospatial data, scientific models, legal title and regulatory status live in disconnected silos, with no single view of an asset's integrity."));
children.push(h3("Jurisdictional complexity"));
children.push(body("Rights to carbon and nature-based outcomes depend on national, regional and local law that changes faster than market practice."));
children.push(h3("Risk discovered too late"));
children.push(body("Integrity issues are typically found after investment, during diligence, dispute or audit, when remediation is most expensive."));
children.push(body("Resolution: C2050 closes this gap with decision-grade confidence: structured risk visibility across every dimension of an environmental asset, before decisions are made.", { italic: true }));

children.push(h2("The Data Cube"));
children.push(eyebrow("The Data Cube"));
children.push(h3("One coordinate. Every pillar. A financial asset."));
children.push(body("The Data Cube takes a point from the territory — its coordinates — then binds every pillar to it: geospatial, legal, regulatory, scientific, technical. Legal and regulatory standing, locked to the coordinate. Competitors do geospatial or legal; C2050 binds them — the evidence base that lets an environmental asset stand as a financial one."));
children.push(body("Layers:", { bold: true }));
children.push(bullet("Territory — The point we take: coordinates, boundaries & plotted assets"));
children.push(bullet("Geospatial — Footprint, terrain & land-use: the geospatial fact"));
children.push(bullet("Legal — Tenure, carbon rights & ownership: locked to the coordinate"));
children.push(bullet("Regulatory — Article 6, CORSIA & eligibility: locked to the coordinate"));
children.push(bullet("Scientific — Carbon-stock models, baselines & MRV evidence"));
children.push(bullet("Technical — Methodology, lifecycle & market readiness"));

children.push(h2("Who We Serve"));
children.push(eyebrow("Who We Serve"));
children.push(h3("Built for every side of the market."));

children.push(h3("Suppliers — Project developers, landowners & governments"));
children.push(body("Structure assets correctly from day one. Demonstrate integrity with evidence, not assertions, and reach qualified demand."));
children.push(bullet("Project developers · Landowners · Governments & jurisdictions"));

children.push(h3("Demanders — Buyers, investors & compliance entities"));
children.push(body("Screen before you commit. Decision-grade confidence on integrity, legal rights and regulatory eligibility, before capital moves."));
children.push(bullet("Corporate buyers · Investors & funds · Compliance entities"));

children.push(h3("Facilitators — Brokers, auditors, insurers & advisors"));
children.push(body("Serve clients on a shared evidence base. Structured asset intelligence that plugs into diligence, audit and advisory workflows."));
children.push(bullet("Brokers & exchanges · VVBs & auditors · Insurers, banks & legal advisors"));

children.push(h2("Mission & Vision"));
children.push(h3("Mission"));
children.push(body("To provide the intelligence and compliance infrastructure required to assess, structure and monitor high-integrity environmental assets across jurisdictions and markets."));
children.push(h3("Vision"));
children.push(body("To enable a global environmental asset economy where nature-based and climate-related outcomes are supported by reliable data, clear legal rights, scientific credibility and regulatory alignment."));
children.push(label("Values", "Integrity · Scientific rigor · Legal precision · Transparency · Interoperability · Market confidence"));

children.push(h2("How It Works"));
children.push(eyebrow("How It Works"));
children.push(h3("Intelligence across the asset lifecycle."));
children.push(body("C2050 services follow the life of an environmental asset, from first screening to ongoing monitoring and reporting."));
children.push(bullet("Screen — Rapid preliminary screening of a territory or project against geospatial, legal and regulatory red flags."));
children.push(bullet("Assess — Deep multi-layer assessment: carbon rights, tenure, scientific basis, methodology conformance and regulatory eligibility."));
children.push(bullet("Validate — Evidence packages structured for independent validation by accredited third parties."));
children.push(bullet("Structure — Legal and contractual structuring support so rights, obligations and benefit-sharing hold across jurisdictions."));
children.push(bullet("Monitor — Continuous geospatial and regulatory monitoring, with alerts when facts on the ground or rules in force change."));
children.push(bullet("Transact & Report — Asset intelligence profiles and compliance documentation that support transactions, disclosure and reporting."));

children.push(h2("What C2050 Is, and Is Not"));
children.push(body("C2050 is decision-support intelligence and compliance infrastructure. We give market participants the evidence base to act with confidence."));
children.push(body("C2050 is not a carbon standard, registry, broker, verification and validation body, or investment adviser. We do not issue credits, certify projects or provide investment advice."));

children.push(h2("Home CTA"));
children.push(h3("Bring decision-grade confidence to your next environmental asset."));
children.push(body("Talk to our team about screening a territory, assessing a project, or integrating C2050 intelligence into your workflow."));

// ── 3. ABOUT US ─────────────────────────────────────────────────────────────
children.push(divider(), h1("3. About Us  (/about)"));

children.push(eyebrow("About Us"));
children.push(h2("Intelligence infrastructure for the environmental asset economy."));
children.push(body("C2050 is a product, service and advisory platform delivering flexible, scalable infrastructure to assess, structure and monitor environmental assets, their value spanning ecological, social, economic, political and territorial dimensions."));

children.push(h2("The Data Cube"));
children.push(eyebrow("The Data Cube"));
children.push(h3("Every asset, a structured information object."));
children.push(body("C2050's fundamental innovation is the Data Cube: a conceptual and operational framework that treats each unit of environmental asset (one tonne of carbon, one kWh of clean energy, one cubic metre of clean water) as a structured, multi-dimensional information object. A C2050-assessed environmental asset derives its credibility from an immutable information chain linking every data input (geographical, legal, scientific, social) to its verified origin."));

children.push(h3("Intelligence pyramid:"));
children.push(bullet("Data — Raw geospatial, legal and environmental data from satellite imagery, remote sensing, public registries, scientific models and proprietary databases."));
children.push(bullet("Information — Data processed into structured, comparable information within the asset's information chain."));
children.push(bullet("Knowledge — Information analysed into actionable knowledge: risks, gaps, eligibility and compliance posture."));
children.push(bullet("Intelligence — Knowledge communicated as decision-grade intelligence, structured for buyers, regulators and partners."));
children.push(bullet("Asset — An evidence-based, legally structured environmental asset profile that markets can rely on."));
children.push(label("Principles", "Origin · Impact · Legality · Veracity · Integrity"));

children.push(h2("Technological Foundation"));
children.push(eyebrow("Technological Foundation"));
children.push(h3("Enterprise infrastructure, built for sovereignty."));
children.push(body("The platform layer that lets every participant in the environmental asset market (developers, landowners, buyers, governments, rating agencies, insurers, legal firms, financial institutions) operate with structured visibility into the integrity, quality and regulatory compliance of the assets they generate, fund, acquire or trade."));
children.push(h3("Multi-tenant cloud architecture"));
children.push(body("A highly scalable multi-tenant SaaS hosted natively on AWS. Clients share a robust codebase while proprietary data remains isolated and ring-fenced in customized environments: data privacy and sovereignty for governments and large corporates."));
children.push(h3("Hybrid geospatial integration"));
children.push(body("Esri ArcGIS Enterprise for secure internal data processing, integrated with ArcGIS Online for cloud customer dashboards, with real-time synchronization of complex geodatabases across global markets."));
children.push(h3("API-first interoperability"));
children.push(body("REST APIs, Python ETL and webhooks let external systems programmatically query, analyse and publish geospatial data, flowing into corporate ERPs (SAP), BI tools (Power BI) and real-time sensors (SCADA/IoT)."));
children.push(h3("Institutional-grade security"));
children.push(body("SSO and MFA centralized through Amazon Cognito, with strict Role-Based Access Control. Every interaction is governed by a Tenant + Role + Permission rule set: granular administrator control and strict data segregation."));
children.push(h3("Blockchain & digital twins"));
children.push(body("Key elements of the information chain are recorded on blockchain, creating a traceable, immutable digital twin for every asset, helping detect, prevent and mitigate double-counting and data-tampering risks."));
children.push(h3("AI-enriched legal library"));
children.push(body("AI continuously enriches territorial intelligence and dynamically updates the proprietary Legal Library, keeping compliance databases aligned with shifting global environmental regulations."));

children.push(h2("Starting with nature. Built to expand."));
children.push(body("Initial focus on nature-based solutions (carbon credits, emission reductions and removals), evolving in time to energy, transportation and the broader environmental asset economy. Insights are delivered through a SaaS platform designed to support digital monitoring, reporting and verification (D-MRV)."));

// ── 4. LEADERSHIP ───────────────────────────────────────────────────────────
children.push(divider(), h1("4. Leadership  (/leadership)"));

children.push(eyebrow("Leadership"));
children.push(h2("Scientific, legal and operational mastery."));
children.push(body("Solving the climate crisis requires more than capital. Our leadership unites experience from global finance, international environmental law and advanced geospatial science to build infrastructure for the environmental asset market."));

children.push(h2("Executive Team"));
const exec = [
  { name: "Ludovino Lopes", role: "Chairman & CEO", bio: "International climate and environmental lawyer with over 30 years' experience in legal and regulatory interpretation of environmental assets and services." },
  { name: "Alan Barry", role: "COO & CFO", bio: "Senior chartered accountant with over 25 years of banking, asset management and real-estate private equity experience." },
  { name: "Mauricio Meira", role: "CCO & CSO", bio: "Engineer and Master of Science with over 20 years of experience using geospatial technology for natural resource monitoring." },
];
for (const p of exec) {
  children.push(h3(`${p.name} — ${p.role}`));
  children.push(body(p.bio));
}

children.push(h2("Operating Team"));
const team = [
  { name: "Guilherme Lopes", role: "Head of Operations", bio: "Specialist in climate operations and value investing, driving the operational cost frameworks for projects." },
  { name: "Giovani Bino", role: "Head of Product", bio: "Expert in physical geography with over a decade of experience coordinating advanced geospatial intelligence and remote sensing projects." },
  { name: "Raul Barros", role: "Operations Analyst", bio: "Experience in regulatory intelligence and operational efficiency, integrating scientific rigor with strategic business management." },
];
for (const p of team) {
  children.push(h3(`${p.name} — ${p.role}`));
  children.push(body(p.bio));
}

// ── 5. OUR STORY ────────────────────────────────────────────────────────────
children.push(divider(), h1("5. Our Story  (/our-story)"));

children.push(eyebrow("Our Story"));
children.push(h2("A Legal RegTech company leveling the international playing field."));
children.push(body("Climate Compliance 2050 was created by founders with deep knowledge of environmental asset and services markets, and a clear view of the gap between how assets are generated and how their integrity is evidenced."));

children.push(h2("Timeline"));
const timeline = [
  { period: "The gap", title: "A market without an evidence layer", body: "Carbon credits and other environmental assets are generated across different geographies and a multitude of international standards. Assessing their veracity and quality demands consistent, timely and reliable intelligence, which the market lacked." },
  { period: "June 2024", title: "Founded in Dublin", body: "Following comprehensive international legal and tax advice, the C2050 holding company was formally established in Dublin, Ireland, a trusted regulatory framework positioning the company on the international stage." },
  { period: "2024–2025", title: "Five disciplines, one platform", body: "C2050 combined geospatial, legal, regulatory, scientific and technical knowledge into a single intelligence platform, with operational hubs established in Latin America." },
  { period: "Today", title: "Restoring market trust", body: "A fully aligned, cross-disciplinary global team, building the infrastructure designed to restore market trust, unlock the flow of sustainable finance, and support verifiable global climate action." },
];
for (const t of timeline) {
  children.push(h3(`${t.period} — ${t.title}`));
  children.push(body(t.body));
}

children.push(h2("Quotes"));
children.push(body("\"The standards used to generate carbon credits and other environmental assets only pay lip service to the legal, regulatory and compliance steps necessary to deliver legitimate and high-quality offset solutions.\" — Alan Barry, Co-Founder & Director", { italic: true }));
children.push(body("\"We are delivering the definitive infrastructure designed to restore market trust, unlock the flow of sustainable finance, and catalyze verifiable global climate action.\" — Mauricio Meira, CCO & CSO", { italic: true }));

children.push(h2("Why Scale Matters"));
children.push(body("International environmental asset markets must scale to make a meaningful contribution to climate change and nature imbalances. Every stakeholder, whether buy side, sell side or market facilitator, needs access to insightful intelligence to have the confidence to scale these markets. Deeper understanding of the legal, regulatory and compliance steps also enables interoperability between voluntary credits and emerging regulated and compliance markets."));

// ── 6. ECOSYSTEM ────────────────────────────────────────────────────────────
children.push(divider(), h1("6. Ecosystem  (/ecosystem)"));

children.push(eyebrow("Ecosystem"));
children.push(h2("A collaborative global network for climate compliance."));
children.push(body("Scaling market integrity takes more than software. C2050 connects a multidisciplinary network of scientists, legal experts and technology providers, delivering structured risk visibility and decision-grade confidence for environmental asset decisions."));

children.push(h2("The C2050 Ecosystem"));
children.push(body("No single entity can solve the complexities of the global carbon market in isolation. C2050 operates a controlled digital ecosystem where qualified partners offer complementary services directly through the platform, integrating standard-setters, Validation and Verification Bodies (VVBs) and certified auditors in a single environment that mitigates conflicts of interest and gives clients access to high-quality intelligence."));
children.push(body("The ecosystem is technology- and standard-agnostic: each participant configures the providers, standards and data sources that fit their needs. The network expands continuously as the platform grows into new markets."));

children.push(h2("Ecosystem Actors"));
const actors = ["Standards & methodologies","Registries","VVBs & auditors","Governments & jurisdictions","Project developers","Buyers & corporates","Insurers","Banks & funders","Legal advisors","Geospatial providers","D-MRV providers","Exchanges & brokers"];
for (const a of actors) children.push(bullet(a));

// ── 7. PRODUCTS ─────────────────────────────────────────────────────────────
children.push(divider(), h1("7. Products  (/products)"));

children.push(eyebrow("Products"));
children.push(h2("Actionable intelligence for high-integrity environmental assets."));
children.push(body("The infrastructure layer that turns fragmented environmental data into structured, evidence-based asset intelligence, from first screening to ongoing monitoring."));

children.push(h2("The Platform"));
children.push(body("At the core of C2050 is a highly scalable SaaS platform built on our proprietary Data Cube framework. Raw geospatial, legal and environmental data moves through an immutable information chain, so every conclusion traces back to its source evidence."));
children.push(body("Whether you originate, manage or retire carbon credits, the platform's sandbox environment supports evidence-based integrity assessment of any underlying nature-based project: regulatory compliance, legal rights and scientific credibility in one view."));

children.push(h2("Platform Modules"));
const modules = [
  { name: "Geospatial module", body: "Boundary verification, overlap with protected and tenure layers, land-use dynamics and advanced geoprocessing.", core: true },
  { name: "Legal module", body: "Land tenure, carbon rights and contractual chains mapped to applicable law.", core: true },
  { name: "Regulatory module", body: "Article 6, CORSIA, national frameworks and registry rules, monitored as they evolve.", core: true },
  { name: "Scientific module", body: "Carbon-stock models, baselines and emission-reduction metrics benchmarked against standards." },
  { name: "Compliance module", body: "Smart Compliance Badges, audit trails and structured evidence packages." },
  { name: "Data integration", body: "API-first: REST, Python ETL pipelines and webhooks for your own data and systems." },
];
for (const m of modules) {
  children.push(h3(`${m.name}${m.core ? " (Core — all tiers)" : ""}`));
  children.push(body(m.body));
}

children.push(h2("Platform Licensing Tiers"));
children.push(body("Four tiers of analytical depth, from the standard C2050 interface to a fully customised white-label deployment. Seat licences run on annual or monthly terms; pay-as-you-go per-study credits sit alongside for occasional use. Every tier is quoted to scope."));
children.push(label("Billing", "Annual (committed seats) · Monthly (rolling seats) · Pay-as-you-go (per-study credits, no seat licence)"));
children.push(body("Prices depend on scope and seats. Every tier is quoted directly — no list pricing.", { italic: true }));

const tiers = [
  { code: "01", name: "Asset Viewer", tagline: "The entry-level gateway for market participants exploring the platform.", features: ["Standard SaaS intelligence","Basic spatial analysis tools","Receive and view project data shared by license holders"], bestFor: "Prospects, stakeholders and secondary buyers interacting with assessed project information." },
  { code: "02", name: "Asset Manager", tagline: "For project developers and asset managers tracking environmental portfolios.", features: ["Select target assets and apply geospatial filters","Portfolio management in a secure, user-controlled database","Trace the original source of every data point","Interact with publicly accessible Smart Compliance Badges"], bestFor: "Organizations that need to track, organize and evidence the compliance of their environmental asset holdings." },
  { code: "03", name: "Asset Expert", tagline: "The premium tier for technical professionals demanding maximum platform depth.", features: ["Full access to all intelligence modules","Sophisticated mapping and advanced geoprocessing","Upload proprietary datasets to enrich asset records","Independent due-diligence workflows"], bestFor: "Advanced investors, scientists and auditors requiring in-depth territorial analysis and maximum data flexibility." },
  { code: "04", name: "Sovereign & Enterprise (White Label)", tagline: "For large enterprises, financial institutions and sovereign governments requiring complete oversight.", features: ["C2050 software deployed in your own branded environment","Administrator license: user access, data geofencing and layout control","Smart Compliance Badges: build proprietary rating frameworks on custom criteria (ESG policies, legal audits, nesting procedures)"], bestFor: "Institutions running jurisdictional programs or internal market infrastructure on C2050 rails." },
];
for (const t of tiers) {
  children.push(h3(`Tier ${t.code} — ${t.name}`));
  children.push(body(t.tagline, { italic: true }));
  for (const f of t.features) children.push(bullet(f));
  children.push(label("Best for", t.bestFor));
}

children.push(h2("Smart Compliance Badges"));
children.push(body("Configurable indicators, not accreditation. Badges signal that an asset meets criteria you define: geospatial integrity, jurisdictional alignment or legal review status. Every badge traces to the underlying evidence in the Data Cube."));
children.push(bullet("GEO — Geospatial criteria · Geospatial integrity"));
children.push(bullet("JUR — Jurisdictional criteria · Jurisdictional alignment"));
children.push(bullet("LEG — Legal criteria · Legal review status"));

// ── 8. SERVICES ─────────────────────────────────────────────────────────────
children.push(divider(), h1("8. Services  (/services)"));

children.push(eyebrow("Services"));
children.push(h2("Hard information on land, projects and territories."));
children.push(body("C2050 studies integrate legal and regulatory analysis with geospatial intelligence — georeferenced, decision-grade. From a rapid first screening to a validation-ready evidence base, at scales from a single parcel to an entire municipality."));

children.push(h2("What a C2050 Study Is"));
children.push(h3("Studied with two kinds of expert eyes."));
children.push(body("Every study integrates legal and regulatory analysis — the rigour of a specialised environmental-law firm — with geospatial intelligence from satellite and sensory data. Georeferenced and decision-grade: hard information, evidence not assertions."));

children.push(h2("The Studies — Screen wide, then go deep."));
children.push(body("Nine studies along one funnel. Filter by who you are and how far you need to go — each can be requested directly."));

const studies = [
  { code: "01", name: "Land Eligibility", body: "Georeferenced analysis of a land parcel against environmental and land-tenure layers — the first study of whether the land suits your project.", deliverable: "A screening study mapping the parcel's environmental and land-tenure fragilities.", depth: "Screening", granularity: "Parcel" },
  { code: "02", name: "Preliminary Project Eligibility", body: "Georeferenced analysis of an existing project area against environmental and land-tenure layers — an early study of whether the project meets the basic conditions.", deliverable: "A screening study of the project area's environmental and land-tenure standing.", depth: "Screening", granularity: "Project area" },
  { code: "03", name: "Target Potential", body: "A regional study that pinpoints the areas with the highest credit-generation potential: REDD+ spatial filtering combined with legal review of property compliance.", deliverable: "A priority-area study: REDD+ eligibility mapped, property compliance reviewed.", depth: "Screening", granularity: "Region" },
  { code: "04", name: "Pre-Feasibility", body: "A preliminary scientific feasibility study and a deeper compliance-risk assessment for your project pipeline.", deliverable: "A preliminary feasibility study setting out the project's compliance risks.", depth: "Feasibility", granularity: "Project" },
  { code: "05", name: "Preliminary Know Your Carbon", body: "A preliminary carbon-potential study via spatial analysis and emission-reduction calculations, benchmarked against standard metrics, with a preliminary legal review of land and project.", deliverable: "A preliminary carbon-potential study, benchmarked, with a first legal review.", depth: "Feasibility", granularity: "Project" },
  { code: "06", name: "Full Feasibility", body: "A full scientific feasibility study — a depth of analysis unique in the market, addressing the most complex compliance gaps.", deliverable: "A full scientific feasibility study covering the hardest compliance gaps.", depth: "Feasibility", granularity: "Project" },
  { code: "07", name: "Know Your Carbon", body: "A comprehensive study: PDD-aligned emission metrics and a complete legal review of land tenure and project structure, producing an evidence base ready for independent validation.", deliverable: "A validation-ready evidence base: PDD-aligned metrics and full legal review.", depth: "Comprehensive", granularity: "Project" },
  { code: "08", name: "Baseline Assessment", body: "A study defining the deforestation baseline and risk factors, delivering spatially explicit maps to support jurisdictional strategy and planning — for countries, states or municipalities.", deliverable: "A baseline study with spatially explicit deforestation and risk maps.", depth: "Territorial", granularity: "Country · State · Municipality" },
  { code: "09", name: "Locally Determined Contribution", body: "A study calculating a jurisdiction's specific contribution to Brazil's NDC, aligning local results with National GHG Inventory standards.", deliverable: "A study of the jurisdiction's NDC contribution, aligned to the National GHG Inventory.", depth: "Territorial", granularity: "Jurisdiction" },
];
for (const s of studies) {
  children.push(h3(`Study ${s.code} — ${s.name}  [${s.depth} · ${s.granularity}]`));
  children.push(body(s.body));
  children.push(label("Deliverable", s.deliverable));
}

// ── 9. PARTNERS ─────────────────────────────────────────────────────────────
children.push(divider(), h1("9. Partners  (/partners)"));

children.push(eyebrow("Partners"));
children.push(h2("A global coalition for climate integrity."));
children.push(body("Solving the multi-dimensional challenges of the global carbon market cannot be achieved in isolation. We work with strategic partners who share our standards for governance and transparency."));
children.push(body("Building high-integrity environmental assets is a collaborative effort. By integrating deep legal expertise, secure trading environments and foundational climate education, our partner network covers every angle of the carbon market."));
children.push(body("\"True compliance is a collaborative achievement. We align leading expertise to bring clarity and security to the carbon market.\" — Ludovino Lopes, Chairman & CEO, C2050", { italic: true }));

const partners = [
  { name: "Ludovino Lopes Advogados", body: "A reference law firm in environmental, climate and carbon-market law, bringing deep legal expertise to the structuring and assessment of environmental assets." },
  { name: "GEAP", body: "Geospatial analysis and applied environmental intelligence supporting territorial assessment at scale." },
  { name: "Yakarana", body: "Climate education and market capacity-building, strengthening the foundations of a high-integrity carbon economy." },
];
for (const p of partners) {
  children.push(h3(p.name));
  children.push(body(p.body));
}

// ── 10. CONTACT ─────────────────────────────────────────────────────────────
children.push(divider(), h1("10. Contact  (/contact)"));

children.push(eyebrow("Contact"));
children.push(h2("Assess an asset. Explore the platform. Join the ecosystem."));
children.push(body("Tell us about your territory, project or portfolio."));
children.push(h2("Form Fields"));
children.push(bullet("Full name"));
children.push(bullet("Work email"));
children.push(bullet("Organization"));
children.push(bullet("What do you need? — Assess an asset or territory / Explore the platform (demo) / Partnership / join the ecosystem / Other"));
children.push(bullet("Your message — Tell us about your project, asset or jurisdiction…"));
children.push(body("Submit button: Send message"));

// ── 11. LEGAL PAGES ─────────────────────────────────────────────────────────
children.push(divider(), h1("11. Legal Pages"));

children.push(h2("Code of Ethics  (/code-of-ethics)"));
children.push(body("C2050 operates with integrity, scientific rigor, legal precision, transparency, interoperability and market confidence."));
children.push(body("The full Code of Ethics document is being finalized and will be published here.", { italic: true }));

children.push(h2("Privacy Policy  (/privacy-policy)"));
children.push(body("How Climate Compliance 2050 collects, uses and protects personal data."));
children.push(body("The full Privacy Policy is being finalized with counsel and will be published here.", { italic: true }));

// ── build ────────────────────────────────────────────────────────────────────
const doc = new Document({
  creator: "C2050",
  title: "C2050 Website Text",
  description: "All user-facing copy extracted from the C2050 website",
  styles: {
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        run: { size: 36, bold: true, color: "0A1628" },
      },
      {
        id: "Heading2",
        name: "Heading 2",
        run: { size: 28, bold: true, color: "345FAA" },
      },
      {
        id: "Heading3",
        name: "Heading 3",
        run: { size: 22, bold: true, color: "0A1628" },
      },
    ],
  },
  sections: [{ children }],
});

const buffer = await Packer.toBuffer(doc);
writeFileSync("c2050-website-text.docx", buffer);
console.log("✓ c2050-website-text.docx written");
