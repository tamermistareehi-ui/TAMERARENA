import { NextResponse } from "next/server";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  const rows = await db.select().from(messages).orderBy(desc(messages.createdAt));
  return NextResponse.json(rows);
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "id مطلوب" }, { status: 400 });
  await db.delete(messages).where(eq(messages.id, id));
  return NextResponse.json({ ok: true });
}
