"use client";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import SpriteText from "three-spritetext";
import type { NodeObject, LinkObject, ForceGraphMethods } from "react-force-graph-3d";

const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), { ssr: false });

type NodeT = NodeObject & {
  id: string | number;
  kind?: "agent" | "system" | string;
  fx?: number; fy?: number; fz?: number;
};
type LinkT = LinkObject & {
  source: string | number | NodeT;
  target: string | number | NodeT;
  weight?: number;
  label?: string;
};
type GraphData = { nodes: NodeT[]; links: LinkT[] };

type Props = {
  data?: GraphData;
  src?: string;                      // defaults to /graph.json
  height?: number | string;          // container height (e.g., 600 or "80vh")
  dagMode?: "td" | "bu" | "lr" | "rl";
  layoutKey?: string;                // localStorage key for layouts
  editable?: boolean;                // allow drag + pin
  persistLayout?: boolean;           // save on drag end / click toggle
};

const DEFAULT_LAYOUT_KEY = "boardroomai-graph-layout";

export default function BoardroomGraph3D({
  data: dataProp,
  src = "/graph.json",
  height = "80vh",
  dagMode,
  layoutKey = DEFAULT_LAYOUT_KEY,
  editable = true,
  persistLayout = true
}: Props): JSX.Element {
  const [data, setData] = useState<GraphData | null>(dataProp || null);
  const [hover, setHover] = useState<NodeT | null>(null);
  const fgRef = useRef<ForceGraphMethods<NodeObject, LinkObject>>();

  // ---- Fetch default data if no prop provided (cache-busted in dev)
  useEffect(() => {
    if (dataProp) return;
    (async () => {
      const bust = process.env.NODE_ENV !== "production" ? `?t=${Date.now()}` : "";
      const res = await fetch(src + bust, { cache: "no-store" });
      const json = (await res.json()) as GraphData;
      setData(json);
    })().catch(console.error);
  }, [src, dataProp]);

  // ---- Load saved layout (if exists). If none, start unpinned.
  useEffect(() => {
    if (!data) return;
    try {
      const raw = localStorage.getItem(layoutKey);
      if (raw) {
        const saved: Record<string, { x: number; y: number; z: number }> = JSON.parse(raw);
        data.nodes.forEach(n => {
          const s = saved[String(n.id)];
          if (s) {
            n.x = s.x; n.y = s.y; n.z = s.z;
            n.fx = s.x; n.fy = s.y; n.fz = s.z; // keep pinned if saved
          } else {
            n.fx = n.fy = n.fz = undefined;     // nodes not in saved layout start free
          }
        });
      } else {
        // No saved layout → everyone unpinned
        data.nodes.forEach(n => (n.fx = n.fy = n.fz = undefined));
      }
      setData({ ...data, nodes: [...data.nodes], links: [...data.links] });
      fgRef.current?.d3ReheatSimulation();
    } catch {
      data.nodes.forEach(n => (n.fx = n.fy = n.fz = undefined));
    }
  }, [data, layoutKey]);

  // ---- Initial forces for ~3s, then freeze (disable forces)
  useEffect(() => {
    if (!data || !fgRef.current) return;

    // Mild spread to start
    const charge = fgRef.current.d3Force?.("charge");
    if (charge && typeof (charge as any).strength === "function") {
      (charge as any).strength(-200);
    }
    const linkF = fgRef.current.d3Force?.("link");
    if (linkF && typeof (linkF as any).distance === "function") {
      (linkF as any).distance(120);
    }

    const fitTimer = setTimeout(() => {
      try { fgRef.current?.zoomToFit(600, 80); } catch {}
    }, 600);

    // After 3s, turn forces off so nodes stop snapping
    const freezeTimer = setTimeout(() => {
      fgRef.current?.d3Force("charge", null);
      fgRef.current?.d3Force("link", null);
      fgRef.current?.d3Force("center", null);
      fgRef.current?.d3Force("collision", null);
    }, 3000);

    return () => { clearTimeout(fitTimer); clearTimeout(freezeTimer); };
  }, [data]);

  // ---- Ensure OrbitControls (rotate/zoom/pan) are enabled
  useEffect(() => {
    const ctrls = (fgRef.current as any)?.controls?.();
    if (ctrls) {
      ctrls.enabled = true;
      ctrls.enableRotate = true;
      ctrls.enableZoom = true;
      ctrls.enablePan = true;
      ctrls.rotateSpeed = 0.8;
      ctrls.zoomSpeed = 1.0;
      ctrls.panSpeed = 0.8;
    }
  }, [data]);

  // ---- Colors
  const colors = useMemo(
    () => ({
      agent: 0x3fb950,
      system: 0x58a6ff,
      edge: 0x8b949e,
      highlight: 0xf78166
    }),
    []
  );

  // ---- Node visuals
  const nodeThreeObject = (node: NodeObject) => {
    const group = new THREE.Group();
    const id = String(node.id ?? "");
    const kind = (node as NodeT).kind ?? "";
    const isAgent = kind.toLowerCase() === "agent";

    const geo = new THREE.SphereGeometry(isAgent ? 7 : 5, 16, 16);
    const mat = new THREE.MeshBasicMaterial({ color: isAgent ? colors.agent : colors.system });
    group.add(new THREE.Mesh(geo, mat));

    const label = new SpriteText(id);
    label.color = "#e6edf3";
    label.textHeight = 3.2;
    label.position.set(0, 8, 0);
    group.add(label);

    return group as THREE.Object3D;
  };

  // ---- Layout persistence helpers
  const saveLayout = () => {
    if (!data) return;
    const out: Record<string, { x: number; y: number; z: number }> = {};
    data.nodes.forEach(n => {
      out[String(n.id)] = { x: n.x ?? 0, y: n.y ?? 0, z: n.z ?? 0 };
    });
    localStorage.setItem(layoutKey, JSON.stringify(out));
  };
  const clearLayout = () => localStorage.removeItem(layoutKey);
  const unpinAll = () => {
    if (!data) return;
    data.nodes.forEach(n => { n.fx = undefined; n.fy = undefined; n.fz = undefined; });
    setData({ ...data, nodes: [...data.nodes], links: [...data.links] });
    fgRef.current?.d3ReheatSimulation();
  };

  return (
    <div style={{ height, width: "100%", background: "#0d1117", borderRadius: 12, position: "relative" }}>
      {/* controls (container ignores pointer events so canvas can rotate) */}
      <div style={{ position: "absolute", right: 12, top: 12, display: "flex", gap: 8, zIndex: 10, pointerEvents: "none" }}>
        <button onClick={saveLayout} style={{ ...btnStyle, pointerEvents: "auto" }}>Save</button>
        <button onClick={unpinAll}  style={{ ...btnStyle, pointerEvents: "auto" }}>Unpin</button>
        <button onClick={clearLayout} style={{ ...btnStyle, pointerEvents: "auto" }}>Clear</button>
      </div>

      {data && (
        <ForceGraph3D
  ref={fgRef as any}
  graphData={data}
  backgroundColor="#0d1117"
  nodeThreeObject={nodeThreeObject}
  warmupTicks={100}
  cooldownTicks={200}
  nodeRelSize={6}
  linkCurvature={0.2}
  linkWidth={(l) => ((l as any).weight ?? 0.5) * 3}
  linkColor={(l) => (((l as any).weight ?? 0.5) > 0.7 ? "#f78166" : "#8b949e")}
  linkDirectionalParticles={2}
  linkDirectionalParticleSpeed={0.01}
  linkDirectionalArrowLength={3}
  linkDirectionalArrowRelPos={0.5}
  enableNodeDrag={editable}
  // 🔁 unpin while dragging so it moves freely
  onNodeDrag={(n: any) => {
    if (n.fx != null || n.fy != null || n.fz != null) {
      n.fx = undefined; n.fy = undefined; n.fz = undefined;
    }
    fgRef.current?.d3ReheatSimulation();
  }}
  // 📍 re-pin exactly where you drop it
  onNodeDragEnd={(n: any) => {
    n.fx = n.x; n.fy = n.y; n.fz = n.z;
    if (persistLayout) saveLayout();
  }}
  // 👆 click toggles pin/unpin
  onNodeClick={(n: any) => {
    if (!editable) return;
    const pinned = n.fx != null || n.fy != null || n.fz != null;
    if (pinned) { n.fx = n.fy = n.fz = undefined; }
    else { n.fx = n.x; n.fy = n.y; n.fz = n.z; }
    if (persistLayout) saveLayout();
  }}
  onNodeHover={(n) => setHover((n as NodeT) ?? null)}
  onBackgroundClick={() => setHover(null)}
  // ✅ only pass dagMode when defined
  {...(dagMode ? { dagMode } : {})}
/>

      )}

      {hover && (
        <div style={hoverStyle}>
          <strong>{String(hover.id)}</strong> <span>({hover.kind ?? "node"})</span>
        </div>
      )}
    </div>
  );
}

// --- tiny inline styles
const btnStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "#e6edf3",
  padding: "6px 10px",
  borderRadius: 8,
  fontSize: 12,
  cursor: "pointer"
};

const hoverStyle: React.CSSProperties = {
  position: "absolute",
  left: 16,
  bottom: 16,
  padding: "8px 10px",
  borderRadius: 8,
  background: "rgba(255,255,255,0.06)",
  color: "#e6edf3",
  fontFamily: "ui-sans-serif, system-ui",
  fontSize: 12
};
