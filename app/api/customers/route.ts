import { NextResponse } from "next/server";
import { fetchCustomersMock } from "@/lib/connectors/mock/hubspot";
export async function GET(){ const data = await fetchCustomersMock(); return NextResponse.json(data); }
