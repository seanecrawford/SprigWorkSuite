import { NextResponse } from "next/server";
import { listDecisions } from "@/lib/core/store";
export async function GET(){ const items = await listDecisions(); return NextResponse.json(items); }
