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
  return generateDomainStaticParams("business");
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  return generateRouteMetadata(["business", ...slug]);
}

export default async function BusinessCatchAll(props: Props) {
  const { slug } = await props.params;
  return renderRoute(["business", ...slug]);
}
