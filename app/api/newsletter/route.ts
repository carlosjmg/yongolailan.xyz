import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

const schema = z.object({
  email: z.string().trim().email().max(200),
  name: z.string().trim().max(200).optional(),
});

export async function POST(req: Request) {
  try {
    const { email, name } = schema.parse(await req.json());

    const existing = await prisma.subscriber.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ ok: true, message: "You're already on the list." });
    }

    const sub = await prisma.subscriber.create({ data: { email, name } });

    // Best-effort welcome email (never blocks the signup).
    const site = process.env.NEXT_PUBLIC_SITE_URL || "https://yongolailan.xyz";
    sendEmail({
      to: email,
      subject: "Welcome to Yongolailan",
      html: `
        <div style="font-family:sans-serif;line-height:1.6">
          <p>Thank you for subscribing to <strong>Yongolailan</strong>.</p>
          <p>You'll get new releases, live sessions, and special art — nothing else.</p>
          <p style="color:#888;font-size:12px">
            Not you? <a href="${site}/api/unsubscribe?token=${sub.unsubscribeToken}">Unsubscribe</a>.
          </p>
        </div>
      `,
    }).catch((err) => console.error("[newsletter] welcome email failed:", err));

    return NextResponse.json({ ok: true, message: "You're on the list. Welcome." });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
    }
    console.error("[newsletter] error:", e);
    return NextResponse.json({ error: "Could not subscribe right now." }, { status: 500 });
  }
}
