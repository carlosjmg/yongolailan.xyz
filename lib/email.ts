import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

const FROM = process.env.EMAIL_FROM || "Yongolailan <onboarding@resend.dev>";

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

/**
 * Send an email via Resend. When RESEND_API_KEY is not set (local dev), the
 * email is logged to the console instead of being sent, so nothing breaks.
 */
export async function sendEmail(opts: SendEmailOptions) {
  if (!resend) {
    console.log("\n[email:dev] RESEND_API_KEY not set — email not sent:");
    console.log("  to:", opts.to);
    console.log("  subject:", opts.subject);
    console.log("  replyTo:", opts.replyTo ?? "(none)");
    return { id: "dev-log", dev: true as const };
  }

  const { data, error } = await resend.emails.send({
    from: FROM,
    to: Array.isArray(opts.to) ? opts.to : [opts.to],
    subject: opts.subject,
    html: opts.html,
    replyTo: opts.replyTo,
  });

  if (error) {
    throw new Error(
      typeof error === "string" ? error : error.message || "Email send failed"
    );
  }
  return data;
}

export function isEmailConfigured() {
  return Boolean(apiKey);
}
