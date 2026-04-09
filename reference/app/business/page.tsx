import type { Metadata } from "next";
import { getDomain } from "@/lib/taxonomy";
import { DomainOverview } from "@/components/topics/DomainOverview";

export function generateMetadata(): Metadata {
  const domain = getDomain("business");
  return {
    title: `${domain?.label} | PROCPA`,
    description: domain?.description,
  };
}

export default function BusinessPage() {
  return <DomainOverview domainKey="business" />;
}
