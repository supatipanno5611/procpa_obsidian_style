import type { Metadata } from "next";
import {
  generateDomainStaticParams,
  generateRouteMetadata,
  renderRoute,
} from "@/lib/route-resolver";

interface Props {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  return generateDomainStaticParams("tech");
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  return generateRouteMetadata(["tech", ...slug]);
}

export default async function TechCatchAll(props: Props) {
  const { slug } = await props.params;
  return renderRoute(["tech", ...slug]);
}
