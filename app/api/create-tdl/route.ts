import { NextResponse } from "next/server";
import { createTasksTDL } from "@/lib/connectors/mock/asana";
export async function POST(req:Request){ const {tasks}=await req.json(); const res = await createTasksTDL(tasks||[]); return NextResponse.json(res); }
