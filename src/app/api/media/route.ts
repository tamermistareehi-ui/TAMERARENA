import { NextResponse } from "next/server";
import { db } from "@/db";
import { media } from "@/db/schema";

const MAX_BYTES = 6 * 1024 * 1024; // 6MB

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "ملف مطلوب" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "الحد الأقصى لحجم الملف 6MB" }, { status: 400 });
  }
  const buf = Buffer.from(await file.arrayBuffer());
  const [row] = await db
    .insert(media)
    .values({
      filename: file.name,
      mimeType: file.type || "application/octet-stream",
      data: buf.toString("base64"),
    })
    .returning({ id: media.id });
  return NextResponse.json({ url: `/api/media/${row.id}`, id: row.id });
}
