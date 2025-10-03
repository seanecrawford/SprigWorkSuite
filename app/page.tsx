import dynamic from "next/dynamic";

// Import with dynamic/ssr:false so the page never tries to SSR WebGL bits
const BoardroomGraph3D = dynamic(() => import("../components/BoardroomGraph3D"), {
  ssr: false
});

export default function Page() {
  return (
    <main style={{ padding: 20 }}>
      <h1 style={{ color: "#e6edf3" }}>BoardroomAI Graph</h1>
      <BoardroomGraph3D height={600} />
    </main>
  );
}
