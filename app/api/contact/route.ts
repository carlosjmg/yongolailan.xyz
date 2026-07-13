import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { escapeHtml, nl2br } from "@/lib/utils";

const schema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(200),
  type: z.string().trim().min(1).max(60),
  message: z.string().trim().min(1).max(5000),
});

export async function POST(req: Request) {
  try {
    const data = schema.parse(await req.json());

    await prisma.contactMessage.create({ data });

    const to = process.env.CONTACT_TO_EMAIL || "yongolailan.official@gmail.com";
    await sendEmail({
      to,
      replyTo: data.email,
      subject: `New ${data.type} inquiry — ${data.name}`,
      html: `
        <h2 style="font-family:sans-serif">New ${escapeHtml(data.type)} inquiry</h2>
        <p style="font-family:sans-serif"><strong>Name:</strong> ${escapeHtml(data.name)}</p>
        <p style="font-family:sans-serif"><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        <p style="font-family:sans-serif"><strong>Type:</strong> ${escapeHtml(data.type)}</p>
        <p style="font-family:sans-serif"><strong>Message:</strong></p>
        <p style="font-family:sans-serif;white-space:pre-wrap">${nl2br(escapeHtml(data.message))}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Please fill in all fields correctly." }, { status: 400 });
    }
    console.error("[contact] error:", e);
    return NextResponse.json(
      { error: "Could not send right now. Please email directly." },
      { status: 500 }
    );
  }
}
