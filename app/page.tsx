import { getAllSettings, sectionState } from "@/lib/settings";
import {
  getAwards,
  getFeaturedReleases,
  getLinks,
  getMerch,
  getPhotos,
  getPortfolio,
  getReleases,
} from "@/lib/data";
import Nav, { type NavItem } from "@/components/site/Nav";
import Hero from "@/components/site/Hero";
import Featured from "@/components/site/Featured";
import Catalog from "@/components/site/Catalog";
import Portfolio from "@/components/site/Portfolio";
import Photos from "@/components/site/Photos";
import Merch from "@/components/site/Merch";
import About from "@/components/site/About";
import Contact from "@/components/site/Contact";
import Links from "@/components/site/Links";
import Footer from "@/components/site/Footer";
import MobileBookingBar from "@/components/site/MobileBookingBar";
import NewsletterSignup from "@/components/site/NewsletterSignup";
import ComingSoon from "@/components/site/ComingSoon";
import { unstable_noStore as noStore } from "next/cache";

// Always render fresh so admin edits appear immediately.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  noStore();
  const [settings, releases, featured, portfolio, photos, links, awards, merch] = await Promise.all([
    getAllSettings(),
    getReleases(),
    getFeaturedReleases(),
    getPortfolio(),
    getPhotos(),
    getLinks(),
    getAwards(),
    getMerch(),
  ]);
  void awards;

  const st = (k: Parameters<typeof sectionState>[1]) => sectionState(settings, k);
  const email = settings["contact.email"];
  const epkPdf = settings["epk.pdfUrl"];

  const primaryDefs: (NavItem & { key?: Parameters<typeof sectionState>[1] })[] = [
    { id: "home", label: "Home" },
    { id: "catalog", label: "Catalog", key: "catalog" },
    { id: "portfolio", label: "Portfolio", key: "portfolio" },
    { id: "epk", label: "EPK", key: "epk" },
    { id: "about", label: "About", key: "about" },
    { id: "contact", label: "Contact", key: "contact" },
  ];
  const primary: NavItem[] = primaryDefs
    .filter((d) => {
      // EPK only appears when a PDF is set — the link opens it directly.
      if (d.id === "epk") return Boolean(epkPdf);
      return !d.key || st(d.key) !== "off";
    })
    .map(({ id, label }) => ({ id, label, href: id === "epk" ? epkPdf : undefined }));

  const secondaryDefs = [
    { id: "photos", label: "Photos", key: "photos" as const },
    { id: "merch", label: "Merch", key: "merch" as const },
    { id: "links", label: "Links", key: "links" as const },
  ];
  const secondary: NavItem[] = secondaryDefs
    .filter((d) => st(d.key) !== "off")
    .map(({ id, label }) => ({ id, label }));

  return (
    <>
      <Nav primary={primary} secondary={secondary} logo={settings["site.logo"]} logoSize={settings["site.logoSize"]} />

      <Hero image={settings["hero.image"]} name={settings["hero.name"]} />

      <Featured
        releases={featured}
        pressQuote={settings["epk.pressQuote"]}
        pressAttribution={settings["epk.pressAttribution"]}
      />

      {st("catalog") === "on" && <Catalog releases={releases} />}
      {st("catalog") === "soon" && <ComingSoon id="catalog" eyebrow="Discography" title="Catalog" />}

      {st("portfolio") === "on" && <Portfolio items={portfolio} />}
      {st("portfolio") === "soon" && <ComingSoon id="portfolio" eyebrow="Portfolio" title="Creative Work" />}

      {st("photos") === "on" && <Photos photos={photos} email={email} />}
      {st("photos") === "soon" && <ComingSoon id="photos" eyebrow="Visual Assets" title="Photos & Branding" />}

      {st("merch") !== "off" && <Merch items={merch} />}

      {st("about") === "on" && (
        <About
          p1={settings["about.p1"]}
          p2={settings["about.p2"]}
          stats={settings["about.stats"]}
          showEpk={false}
        />
      )}
      {st("about") === "soon" && <ComingSoon id="about" eyebrow="About" title="The Artist" />}

      {st("contact") !== "off" && (
        <Contact
          email={email}
          whatsapp={settings["contact.whatsapp"]}
          whatsappUrl={settings["contact.whatsappUrl"]}
          labelName={settings["label.name"]}
          labelLocation={settings["label.location"]}
        />
      )}

      <NewsletterSignup />

      {st("links") === "on" && <Links links={links} />}
      {st("links") === "soon" && <ComingSoon id="links" eyebrow="Official Links" title="Everywhere" />}

      <Footer
        navItems={primary}
        email={email}
        whatsapp={settings["contact.whatsapp"]}
        whatsappUrl={settings["contact.whatsappUrl"]}
        labelName={settings["label.name"]}
        labelLocation={settings["label.location"]}
        domain={settings["site.domain"]}
        logo={settings["site.logo"]}
        oneLiner={settings["hero.oneLiner"]}
      />

      <MobileBookingBar email={email} />
    </>
  );
}
