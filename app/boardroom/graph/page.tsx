import dynamic from "next/dynamic";

const BoardroomGraph3D = dynamic(() => import("@/components/BoardroomGraph3D"), { ssr: false });

export default function GraphPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">BoardRoomAI – Decision Map</h1>
      <BoardroomGraph3D src="/graph.json" height={700} dagMode="td" />
    </main>
  );
}
