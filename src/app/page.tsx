import { Hero } from "@/components/home/Hero";
import { Problem } from "@/components/home/Problem";
import { DataCubeTeaser } from "@/components/home/DataCubeTeaser";
import { WorkflowStrip } from "@/components/home/WorkflowStrip";
import { Audiences } from "@/components/home/Audiences";
import { ClarifierBanner } from "@/components/home/ClarifierBanner";
import { PartnersStrip } from "@/components/home/PartnersStrip";
import { HomeCta } from "@/components/home/HomeCta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Problem />
      <DataCubeTeaser />
      <WorkflowStrip />
      <Audiences />
      <ClarifierBanner />
      <PartnersStrip />
      <HomeCta />
    </>
  );
}
