import { NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getProjects } from "@/lib/data";

export async function GET() {
  const rows = await getProjects();
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const b = await req.json();
  if (!b.title || !b.category || !b.imageUrl) {
    return NextResponse.json({ error: "title, category, imageUrl مطلوبة" }, { status: 400 });
  }
  const [row] = await db
    .insert(projects)
    .values({
      title: String(b.title),
      description: String(b.description || ""),
      category: String(b.category),
      imageUrl: String(b.imageUrl),
      fileType: String(b.fileType || "image"),
      fileName: b.fileName ? String(b.fileName) : null,
      link: b.link ? String(b.link) : null,
      tags: String(b.tags || ""),
      featured: Boolean(b.featured),
      sortOrder: Number(b.sortOrder || 0),
    })
    .returning();
  return NextResponse.json(row, { status: 201 });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "id مطلوب" }, { status: 400 });
  await db.delete(projects).where(eq(projects.id, id));
  return NextResponse.json({ ok: true });
}
