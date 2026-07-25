import { Resend } from "resend";

// Read the API key defensively: strip ALL whitespace/newlines. Resend keys
// have no internal spaces, so this safely repairs a key that was pasted with
// line breaks (which otherwise makes the Authorization header invalid).
function getApiKey(): string | undefined {
  const key = process.env.RESEND_API_KEY?.replace(/\s+/g, "");
  return key || undefined;
}

// Lazily construct the Resend client *inside* the send call (never at module
// load) so importing this file — e.g. while Next.js collects route data during
// the build — can never throw on a malformed key.
function getResend(): Resend | null {
  const apiKey = getApiKey();
  if (!apiKey) return null;
  try {
    return new Resend(apiKey);
  } catch (e) {
    console.error("[email] invalid RESEND_API_KEY — emails disabled:", e);
    return null;
  }
}

const FROM = (process.env.EMAIL_FROM || "Yongolailan <onboarding@resend.dev>").trim();

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

/**
 * Send an email via Resend. When the key is missing/invalid (e.g. local dev),
 * the email is logged to the console instead of sent, so nothing breaks.
 */
export async function sendEmail(opts: SendEmailOptions) {
  const resend = getResend();
  if (!resend) {
    console.log("\n[email:dev] RESEND_API_KEY not set/invalid — email not sent:");
    console.log("  to:", opts.to);
    console.log("  subject:", opts.subject);
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
  return Boolean(getApiKey());
}
