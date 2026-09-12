import { NextResponse } from "next/server";
import { db } from "@/db";
import { certificates } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCertificates } from "@/lib/data";

export async function GET() {
  const rows = await getCertificates();
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const b = await req.json();
  if (!b.title || !b.issuer) {
    return NextResponse.json({ error: "title, issuer مطلوبة" }, { status: 400 });
  }
  const [row] = await db
    .insert(certificates)
    .values({
      title: String(b.title),
      issuer: String(b.issuer),
      year: String(b.year || ""),
      imageUrl: b.imageUrl ? String(b.imageUrl) : null,
      link: b.link ? String(b.link) : null,
      sortOrder: Number(b.sortOrder || 0),
    })
    .returning();
  return NextResponse.json(row, { status: 201 });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "id مطلوب" }, { status: 400 });
  await db.delete(certificates).where(eq(certificates.id, id));
  return NextResponse.json({ ok: true });
}
