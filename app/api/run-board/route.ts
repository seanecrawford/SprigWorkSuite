import { NextResponse } from "next/server";
import { runOrchestrator } from "@/lib/core/orchestrator";
import { saveDecision } from "@/lib/core/store";
import { mergeProfiles } from "@/lib/core/agent_profiles";

export async function POST(req: Request) {
  const { proposal, members } = await req.json();
  if (!proposal || !Array.isArray(members)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const merged = await mergeProfiles(members); // <-- loads tuned weights
  const result = await runOrchestrator({ title: "User Proposal", description: proposal }, merged);
  await saveDecision(result);
  return NextResponse.json(result);
}
