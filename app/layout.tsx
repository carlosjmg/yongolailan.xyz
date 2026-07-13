import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Mono, Inter } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Yongolailan — DJ · Producer · Live Electronic Performer",
    template: "%s · Yongolailan",
  },
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
  // Social preview images come from app/opengraph-image.tsx (generated card).
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Yongolailan — DJ · Producer · Live Electronic Performer",
    description:
      "Electronic ritual music shaped by Afro-diasporic rhythms and Caribbean roots. Cuban-born, based in New York City.",
    siteName: "Yongolailan",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yongolailan — DJ · Producer · Live Electronic Performer",
    description:
      "Electronic ritual music shaped by Afro-diasporic rhythms and Caribbean roots.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

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
