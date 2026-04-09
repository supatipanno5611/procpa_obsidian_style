/* ── Obsidian-style Graph View SVG ── */
export function GraphIllustration() {
  // Node positions (x, y, radius) — arranged in a brain-like cluster
  const nodes = [
    // Hub nodes (large)
    { x: 200, y: 180, r: 14, type: "hub" },
    { x: 300, y: 220, r: 12, type: "hub" },
    // L1 nodes (medium)
    { x: 130, y: 120, r: 8, type: "l1" },
    { x: 280, y: 100, r: 9, type: "l1" },
    { x: 350, y: 150, r: 8, type: "l1" },
    { x: 160, y: 270, r: 9, type: "l1" },
    { x: 340, y: 300, r: 8, type: "l1" },
    { x: 100, y: 210, r: 7, type: "l1" },
    // L2 nodes (small)
    { x: 70, y: 150, r: 5, type: "l2" },
    { x: 230, y: 60, r: 5, type: "l2" },
    { x: 380, y: 100, r: 4, type: "l2" },
    { x: 390, y: 240, r: 5, type: "l2" },
    { x: 250, y: 330, r: 4, type: "l2" },
    { x: 80, y: 290, r: 4, type: "l2" },
    { x: 180, y: 340, r: 5, type: "l2" },
    // L3 nodes (tiny)
    { x: 50, y: 80, r: 3, type: "l3" },
    { x: 330, y: 50, r: 3, type: "l3" },
    { x: 420, y: 180, r: 3, type: "l3" },
    { x: 400, y: 330, r: 3, type: "l3" },
    { x: 120, y: 340, r: 3, type: "l3" },
  ];

  // Edges (from → to index)
  const edges = [
    // Hub to hub
    [0, 1],
    // Hub 0 connections
    [0, 2], [0, 3], [0, 5], [0, 7],
    // Hub 1 connections
    [1, 3], [1, 4], [1, 6],
    // L1 cross connections
    [2, 7], [3, 4], [5, 6], [5, 7],
    // L1 to L2
    [2, 8], [3, 9], [4, 10], [4, 11], [6, 12], [5, 13], [6, 14],
    // L2 to L3
    [8, 15], [9, 16], [10, 16], [11, 17], [12, 18], [13, 19],
    // Extra cross links for density
    [7, 8], [1, 11], [0, 9], [14, 12],
  ];

  const nodeColors: Record<string, { fill: string; glow: string }> = {
    hub: { fill: "var(--primary)", glow: "var(--primary)" },
    l1: { fill: "var(--primary)", glow: "var(--primary)" },
    l2: { fill: "var(--primary)", glow: "var(--primary)" },
    l3: { fill: "var(--primary)", glow: "var(--primary)" },
  };

  const nodeOpacity: Record<string, number> = {
    hub: 1,
    l1: 0.7,
    l2: 0.45,
    l3: 0.25,
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Subtle background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="h-64 w-64 rounded-full opacity-20 dark:opacity-10 blur-[80px]"
          style={{ backgroundColor: "var(--primary)" }}
        />
      </div>

      <svg
        viewBox="0 0 450 400"
        className="w-full max-w-[360px] h-auto"
        aria-hidden="true"
      >
        {/* Edge lines */}
        {edges.map(([from, to], i) => (
          <line
            key={`e-${i}`}
            x1={nodes[from].x}
            y1={nodes[from].y}
            x2={nodes[to].x}
            y2={nodes[to].y}
            stroke="var(--primary)"
            strokeOpacity={0.15}
            strokeWidth={1}
          />
        ))}

        {/* Nodes */}
        {nodes.map((node, i) => (
          <g key={`n-${i}`}>
            {/* Glow for hub/l1 nodes */}
            {(node.type === "hub" || node.type === "l1") && (
              <circle
                cx={node.x}
                cy={node.y}
                r={node.r * 2.5}
                fill={nodeColors[node.type].glow}
                opacity={node.type === "hub" ? 0.08 : 0.04}
                className={node.type === "hub" ? "animate-[pulse_4s_ease-in-out_infinite]" : ""}
                style={node.type === "l1" ? { animationDelay: `${i * 0.5}s` } : undefined}
              />
            )}
            {/* Node circle */}
            <circle
              cx={node.x}
              cy={node.y}
              r={node.r}
              fill={nodeColors[node.type].fill}
              opacity={nodeOpacity[node.type]}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
