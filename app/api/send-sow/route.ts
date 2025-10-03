import { NextResponse } from "next/server";
import { requestSignature } from "@/lib/connectors/mock/docusign";
export async function POST(req:Request){ const {sow}=await req.json(); const res = await requestSignature(sow||""); return NextResponse.json(res); }
