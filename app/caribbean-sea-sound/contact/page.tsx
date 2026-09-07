import type { Metadata } from "next";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { getAllSettings } from "@/lib/settings";
import LabelContact from "@/components/site/LabelContact";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yongolailan.xyz";
// Same artwork as the label's own preview image.
const LABEL_SHARE_IMAGE = `${siteUrl}/images/caribbean-sea-sound-share.jpg`;
// This nested static route sits one level under /caribbean-sea-sound, whose
// icon.png already covers it via Next's file convention — but that cascade
// is known not to survive a dynamic [slug] boundary elsewhere in this app,
// so it's set explicitly here too, for certainty.
const LABEL_ICON = "/caribbean-sea-sound/icon.png";

export const metadata: Metadata = {
  title: { absolute: "Contact — Caribbean Sea Sound" },
  description: "Get in touch with Caribbean Sea Sound for collaborations, licensing, distribution and press.",
  alternates: { canonical: `${siteUrl}/caribbean-sea-sound/contact` },
  icons: { icon: LABEL_ICON },
  openGraph: {
    type: "website",
    url: `${siteUrl}/caribbean-sea-sound/contact`,
    title: "Contact — Caribbean Sea Sound",
    description: "Get in touch with Caribbean Sea Sound for collaborations, licensing, distribution and press.",
    siteName: "Caribbean Sea Sound",
    images: [{ url: LABEL_SHARE_IMAGE, width: 1200, height: 1198, alt: "Caribbean Sea Sound" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact — Caribbean Sea Sound",
    description: "Get in touch with Caribbean Sea Sound for collaborations, licensing, distribution and press.",
    images: [LABEL_SHARE_IMAGE],
  },
};

export default async function LabelContactPage() {
  noStore();
  const settings = await getAllSettings();

  const email = settings["label.contact.email"] || "caribbeanseasound@gmail.com";
  const phone = settings["label.contact.phone"] || "+1 646 547 7443";
  const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, "")}`;

  return (
    <main>
      <div className="cssound-shell">
        <Link href="/caribbean-sea-sound" className="cssound-back">
          ← Caribbean Sea Sound
        </Link>

        <section className="cssound-intro cssound-intro--notitle">
          <div className="cssound-eyebrow">Get in Touch</div>
          <p className="cssound-intro-lede">
            Open to collaborations, licensing, distribution and press inquiries — from anyone building something in
            the same spirit.
          </p>
        </section>

        <LabelContact email={email} phone={phone} whatsappUrl={whatsappUrl} />
      </div>
    </main>
  );
}
