"use client";

import { GraphView } from "./GraphView";
import { GraphLegend } from "./GraphLegend";
import type { GraphData } from "@/lib/graph";

interface LocalGraphViewProps {
  data: GraphData;
  title?: string;
}

export function LocalGraphView({ data, title = "Knowledge Map" }: LocalGraphViewProps) {
  if (data.nodes.length === 0) return null;

  return (
    <section className="mt-10">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div className="relative h-[350px] border border-border/50 rounded-xl overflow-hidden bg-card/30">
        <GraphView data={data} />
      </div>
      <GraphLegend className="mt-3 justify-center" />
    </section>
  );
}
