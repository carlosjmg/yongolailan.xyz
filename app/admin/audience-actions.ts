"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/session";
import { sendEmail } from "@/lib/email";

async function assertAdmin() {
  if (!(await isAuthenticated())) throw new Error("Unauthorized");
}

function renderEmail(bodyHtml: string, site: string, token: string): string {
  return `
  <div style="font-family:system-ui,-apple-system,sans-serif;max-width:580px;margin:0 auto;color:#1a1a1a;line-height:1.7;padding:8px">
    ${bodyHtml}
    <hr style="border:none;border-top:1px solid #e6e6e6;margin:28px 0">
    <p style="font-size:12px;color:#999">
      You're receiving this because you subscribed at ${site}.<br>
      <a href="${site}/api/unsubscribe?token=${token}" style="color:#999">Unsubscribe</a>
    </p>
  </div>`;
}

// Sends the newsletter to every subscriber. For modest lists this runs inline;
// for large lists this should move to a queued/batched job.
export async function sendCampaign(formData: FormData) {
  await assertAdmin();
  const subject = String(formData.get("subject") || "").trim();
  const body = String(formData.get("body") || "").trim();
  if (!subject || !body) redirect("/admin/newsletter?error=empty");

  const subs = await prisma.subscriber.findMany();
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://yongolailan.xyz";

  const campaign = await prisma.campaign.create({
    data: { subject, body, status: "sending", recipients: subs.length },
  });

  let sent = 0;
  for (const sub of subs) {
    try {
      await sendEmail({ to: sub.email, subject, html: renderEmail(body, site, sub.unsubscribeToken) });
      sent++;
    } catch (e) {
      console.error(`[campaign] failed for ${sub.email}:`, e);
    }
  }

  await prisma.campaign.update({
    where: { id: campaign.id },
    data: { status: "sent", sentAt: new Date(), recipients: sent },
  });

  revalidatePath("/admin/newsletter");
  redirect(`/admin/newsletter?sent=${sent}`);
}

export async function deleteSubscriber(id: string) {
  await assertAdmin();
  await prisma.subscriber.delete({ where: { id } });
  revalidatePath("/admin/newsletter");
}

export async function markMessage(id: string, read: boolean) {
  await assertAdmin();
  await prisma.contactMessage.update({ where: { id }, data: { read } });
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string) {
  await assertAdmin();
  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath("/admin/messages");
}
