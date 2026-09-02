import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().trim().email().max(200),
  source: z.string().trim().max(60).optional(),
});

export async function POST(req: Request) {
  try {
    const { email } = schema.parse(await req.json());
    // Upsert so a repeat sign-up is a no-op rather than an error.
    await prisma.subscriber.upsert({
      where: { email: email.toLowerCase() },
      update: {},
      create: { email: email.toLowerCase() },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
    }
    console.error("[subscribe] error:", e);
    return NextResponse.json({ error: "Could not subscribe right now." }, { status: 500 });
  }
}
