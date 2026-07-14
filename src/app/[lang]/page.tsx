import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { IntroStatement } from "@/components/home/IntroStatement";
import { Problem } from "@/components/home/Problem";
import { DataCubeStack } from "@/components/home/DataCubeStack";
import { WorkflowStrip } from "@/components/home/WorkflowStrip";
import { Audiences } from "@/components/home/Audiences";
import { GlobalTeaser } from "@/components/home/GlobalTeaser";
import { ClarifierBanner } from "@/components/home/ClarifierBanner";
import { PartnersStrip } from "@/components/home/PartnersStrip";
import { HomeCta } from "@/components/home/HomeCta";
import { site } from "@/content/site";

export function generateMetadata(): Metadata {
  return { alternates: { canonical: `${site.url}/en` } };
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <IntroStatement />
      <Problem />
      <DataCubeStack />
      <WorkflowStrip />
      <Audiences />
      <GlobalTeaser />
      <ClarifierBanner />
      <PartnersStrip />
      <HomeCta />
    </>
  );
}
