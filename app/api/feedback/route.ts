import { NextResponse } from "next/server";
import { saveTrainingExample } from "@/lib/core/training_store";
import { learnWeights } from "@/lib/core/learn";
import { saveProfile } from "@/lib/core/agent_profiles";

export async function POST(req: Request) {
  const { role, features, outcome, memberId } = await req.json();
  if (!role || !features || (outcome !== 0 && outcome !== 1)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  await saveTrainingExample({ role, features, outcome });
  const learned = await learnWeights(role);
  if (learned && memberId) {
    await saveProfile({ id: memberId, role, weights: learned, voteWeight: 1.0, style: "learned" });
  }
  return NextResponse.json({ ok: true, learned: learned || null });
}
