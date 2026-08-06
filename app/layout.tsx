import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Mono, Inter } from "next/font/google";
import "./globals.css";
import { getAllSettings } from "@/lib/settings";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const mono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yongolailan.xyz";

/**
 * Social preview: use the artwork set in the admin ("Social preview image",
 * falling back to the hero image). When neither is set, Next falls back to the
 * generated card in app/opengraph-image.tsx.
 */
export async function generateMetadata(): Promise<Metadata> {
  let art = "";
  try {
    const s = await getAllSettings();
    art = s["site.ogImage"] || s["hero.image"] || "";
  } catch {
    /* database unavailable — fall through to the generated card */
  }
  const absolute = art ? (art.startsWith("http") ? art : `${siteUrl}${art.startsWith("/") ? "" : "/"}${art}`) : null;
  const images = absolute ? [{ url: absolute, width: 1200, height: 630, alt: "Yongolailan" }] : undefined;

  const title = "Yongolailan — DJ · Producer · Live Electronic Performer";
  const description =
    "Electronic ritual music shaped by Afro-diasporic rhythms and Caribbean roots. Cuban-born, based in New York City.";

  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: "%s · Yongolailan" },
    description:
      "Yongolailan is a Cuban DJ, producer, and live electronic performer based in New York City. Electronic ritual music shaped by Afro-diasporic rhythms and Caribbean roots.",
    keywords: [
      "Yongolailan",
      "Cuban DJ",
      "electronic producer",
      "Afro-Cuban",
      "Caribbean Sea Sound",
      "New York",
      "live electronic",
    ],
    authors: [{ name: "Yongolailan" }],
    openGraph: {
      type: "website",
      url: siteUrl,
      title,
      description,
      siteName: "Yongolailan",
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(images ? { images: images.map((i) => i.url) } : {}),
    },
    icons: { icon: "/favicon.ico" },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
