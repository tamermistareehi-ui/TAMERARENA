import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { eq } from "drizzle-orm";

const TO_EMAIL = "tamermistareehi@gmail.com";

async function sendEmail(name: string, email: string, note: string) {
  const subject = `📩 رسالة جديدة من ${name} — Portfolio`;
  const text = `الاسم: ${name}\nالبريد: ${email}\n\nالملاحظة:\n${note}`;
  const html = `
  <div style="font-family:Segoe UI,Tahoma,sans-serif;direction:rtl;background:#0a0f14;color:#e6f1ff;padding:24px;border-radius:12px">
    <h2 style="color:#00ffc3;margin:0 0 16px">رسالة جديدة من موقع البورتفوليو</h2>
    <p><b style="color:#7dd3fc">الاسم:</b> ${escapeHtml(name)}</p>
    <p><b style="color:#7dd3fc">البريد:</b> <a style="color:#00ffc3" href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
    <p><b style="color:#7dd3fc">الملاحظة:</b></p>
    <pre style="white-space:pre-wrap;background:#0f1a22;padding:16px;border-radius:8px;border:1px solid #1e3a4a">${escapeHtml(note)}</pre>
  </div>`;

  // Option 1: Resend API
  if (process.env.RESEND_API_KEY) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.MAIL_FROM || "Portfolio <onboarding@resend.dev>",
        to: [TO_EMAIL],
        reply_to: email,
        subject,
        html,
        text,
      }),
    });
    if (!res.ok) throw new Error(`Resend failed: ${await res.text()}`);
    return true;
  }

  // Option 2: SMTP (e.g. Gmail app password)
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    const port = Number(process.env.SMTP_PORT || 587);
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    await transporter.sendMail({
      from: process.env.MAIL_FROM || `"Portfolio" <${process.env.SMTP_USER}>`,
      to: TO_EMAIL,
      replyTo: email,
      subject,
      text,
      html,
    });
    return true;
  }

  return false;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const note = String(body.note || "").trim();

    if (!name || !email || !note) {
      return NextResponse.json({ ok: false, error: "جميع الحقول مطلوبة" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: "البريد الإلكتروني غير صالح" }, { status: 400 });
    }

    const [saved] = await db.insert(messages).values({ name, email, note }).returning();

    let emailed = false;
    let emailError: string | null = null;
    try {
      emailed = await sendEmail(name, email, note);
      if (emailed) {
        await db.update(messages).set({ emailed: true }).where(eq(messages.id, saved.id));
      }
    } catch (e) {
      emailError = e instanceof Error ? e.message : "email failed";
      console.error("Email error:", emailError);
    }

    return NextResponse.json({
      ok: true,
      emailed,
      message: emailed
        ? "تم إرسال رسالتك بنجاح! سأتواصل معك قريباً."
        : "تم استلام رسالتك وحفظها بنجاح! سأتواصل معك قريباً.",
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "حدث خطأ غير متوقع" }, { status: 500 });
  }
}
