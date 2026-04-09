import type { Metadata } from "next";
import { getDomain } from "@/lib/taxonomy";
import { DomainOverview } from "@/components/topics/DomainOverview";

export function generateMetadata(): Metadata {
  const domain = getDomain("tech");
  return {
    title: `${domain?.label} | PROCPA`,
    description: domain?.description,
  };
}

export default function TechPage() {
  return <DomainOverview domainKey="tech" />;
}
