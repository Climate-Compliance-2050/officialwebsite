import { Hero } from "@/components/home/Hero";
import { Problem } from "@/components/home/Problem";
import { FiveLayers } from "@/components/home/FiveLayers";
import { DataCubeTeaser } from "@/components/home/DataCubeTeaser";
import { Audiences } from "@/components/home/Audiences";
import { MissionVision } from "@/components/home/MissionVision";
import { WorkflowStrip } from "@/components/home/WorkflowStrip";
import { ClarifierBanner } from "@/components/home/ClarifierBanner";
import { PartnersStrip } from "@/components/home/PartnersStrip";
import { HomeCta } from "@/components/home/HomeCta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Problem />
      <FiveLayers />
      <DataCubeTeaser />
      <Audiences />
      <MissionVision />
      <WorkflowStrip />
      <ClarifierBanner />
      <PartnersStrip />
      <HomeCta />
    </>
  );
}
