import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { getAllSettings } from "@/lib/settings";
import { getLabelRoster } from "@/lib/data";
import LabelDirectory, { type DirectoryArtist } from "@/components/site/LabelDirectory";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yongolailan.xyz";

export const metadata: Metadata = {
  title: { absolute: "Caribbean Sea Sound — Independent Music Label" },
  description:
    "Caribbean Sea Sound is an independent music platform and label founded in Brooklyn in 2016, showcasing artists from the Caribbean and across the Americas.",
  keywords: [
    "Caribbean Sea Sound",
    "Caribbean Sea Sound record label",
    "independent music label Brooklyn",
    "Caribbean music label",
    "Yongolailan label",
  ],
  alternates: { canonical: `${siteUrl}/caribbean-sea-sound` },
  openGraph: {
    type: "website",
    url: `${siteUrl}/caribbean-sea-sound`,
    title: "Caribbean Sea Sound — Independent Music Label",
    description:
      "An independent music platform and label founded in Brooklyn in 2016. Artists from the Caribbean and across the Americas.",
    siteName: "Caribbean Sea Sound",
  },
};

export default async function CaribbeanSeaSoundPage() {
  noStore();
  const [settings, artists] = await Promise.all([getAllSettings(), getLabelRoster()]);

  const name = settings["label.name"] || "Caribbean Sea Sound";
  const location = settings["label.location"] || "Brooklyn, New York";
  const tagline = settings["label.tagline"] || "Independent label & music platform · Brooklyn · Est. 2016";
  const intro = settings["label.intro"] || "";

  const directory: DirectoryArtist[] = artists.map((a) => ({
    id: a.id,
    name: a.name,
    slug: a.slug,
    role: a.role,
    shortDescription: a.shortDescription,
    image: a.image ?? null,
  }));

  // Entity data: the label plus every artist as a sub-organization.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name,
    alternateName: "Caribbean Sea Sound Records",
    url: `${siteUrl}/caribbean-sea-sound`,
    description: intro,
    foundingLocation: { "@type": "Place", name: location },
    foundingDate: "2016",
    founder: { "@type": "Person", name: "Yongolailan", url: siteUrl },
    subOrganization: artists.map((a) => ({
      "@type": "MusicGroup",
      name: a.name,
      url: `${siteUrl}/caribbean-sea-sound/artists/${a.slug}`,
    })),
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="cssound-shell">
        {/* The big name moved to the header wordmark (top-right). */}
        <section className="cssound-intro cssound-intro--notitle">
          <div className="cssound-eyebrow">{tagline}</div>
          <p className="cssound-intro-lede">{intro}</p>
        </section>

        <LabelDirectory artists={directory} />
      </div>
    </main>
  );
}
