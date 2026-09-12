import { NextResponse } from "next/server";
import { getSettings, setSetting } from "@/lib/data";

export async function GET() {
  return NextResponse.json(await getSettings());
}

export async function POST(req: Request) {
  const body = (await req.json()) as Record<string, unknown>;
  const entries = Object.entries(body).filter(
    ([k, v]) => typeof k === "string" && typeof v === "string",
  ) as [string, string][];
  for (const [k, v] of entries) await setSetting(k, v);
  return NextResponse.json(await getSettings());
}
