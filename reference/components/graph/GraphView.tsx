"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { GraphData, GraphNode } from "@/lib/graph";

// Dynamically import ForceGraph2D to avoid SSR issues
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center p-10">Loading Graph...</div>,
});

interface GraphViewProps {
  data: GraphData;
}

export function GraphView({ data }: GraphViewProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const fgRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Responsive width
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight || 600,
        });
      }
    };

    window.addEventListener("resize", updateDimensions);
    updateDimensions();

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const isDark = theme === "dark";
  const linkColor = isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)";
  const nodeColor = (node: any) => {
      switch(node.group) {
          case 1: return isDark ? "#60a5fa" : "#2563eb"; // Original Post: Blue
          case 2: return isDark ? "#34d399" : "#059669"; // Series: Green
          case 3: return isDark ? "#a78bfa" : "#7c3aed"; // Reference: Purple
          case 4: return isDark ? "#fbbf24" : "#d97706"; // Reference Post: Amber
          case 5: return isDark ? "#2dd4bf" : "#0d9488"; // Resource: Teal
          default: return isDark ? "#9ca3af" : "#4b5563"; // Gray
      }
  };

  return (
    <div ref={containerRef} className="w-full h-[600px] border rounded-lg overflow-hidden bg-card">
      <ForceGraph2D
        ref={fgRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={data}
        nodeLabel="title"
        nodeColor={nodeColor}
        linkColor={() => linkColor}
        backgroundColor={isDark ? "#09090b" : "#f8f9fb"}
        onNodeClick={(node: any) => {
            if (node.id) {
                router.push(`/${node.id}`);
            }
        }}
        nodeRelSize={6}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.005}
      />
    </div>
  );
}
