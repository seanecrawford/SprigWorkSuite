import { NextResponse } from "next/server";
import { saveProfile } from "@/lib/core/agent_profiles";

export async function POST(req: Request) {
  const body = await req.json();
  if (!body?.id || !body?.role || !body?.weights) {
    return NextResponse.json({ error: "Missing id/role/weights" }, { status: 400 });
  }
  await saveProfile(body);
  return NextResponse.json({ ok: true });
}
