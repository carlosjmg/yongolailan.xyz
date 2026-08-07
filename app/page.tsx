import {
  getAllSettings,
  parseListSetting,
  sectionState,
  sectionText,
  safeHexColor,
  HERO_ROLE_COLOR_FALLBACK,
} from "@/lib/settings";
import {
  getAwards,
  getFeaturedReleases,
  getLinks,
  getMerch,
  getPhotos,
  getPortfolio,
  getReleases,
  getVideos,
} from "@/lib/data";
import Nav, { type NavItem } from "@/components/site/Nav";
import Hero from "@/components/site/Hero";
import Featured from "@/components/site/Featured";
import Catalog from "@/components/site/Catalog";
import Portfolio from "@/components/site/Portfolio";
import Videos from "@/components/site/Videos";
import Photos from "@/components/site/Photos";
import Awards from "@/components/site/Awards";
import Merch from "@/components/site/Merch";
import About from "@/components/site/About";
import Contact from "@/components/site/Contact";
import Links from "@/components/site/Links";
import Footer from "@/components/site/Footer";
import MobileBookingBar from "@/components/site/MobileBookingBar";
import ComingSoon from "@/components/site/ComingSoon";
import { unstable_noStore as noStore } from "next/cache";

// Always render fresh so admin edits appear immediately.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  noStore();
  const [settings, releases, featured, portfolio, videos, photos, links, awards, merch] = await Promise.all([
    getAllSettings(),
    getReleases(),
    getFeaturedReleases(),
    getPortfolio(),
    getVideos(),
    getPhotos(),
    getLinks(),
    getAwards(),
    getMerch(),
  ]);

  const st = (k: Parameters<typeof sectionState>[1]) => sectionState(settings, k);
  const txt = (k: string) => sectionText(settings, k);
  const email = settings["contact.email"];
  const epkPdf = settings["epk.pdfUrl"];

  // Menu order mirrors the order the sections appear on the page.
  const primaryDefs: (NavItem & { key?: Parameters<typeof sectionState>[1] })[] = [
    { id: "photos", label: "Live", key: "photos" },
    { id: "catalog", label: "Catalog", key: "catalog" },
    { id: "videos", label: "Films", key: "videos" },
    { id: "merch", label: "Merch", key: "merch" },
    { id: "about", label: "About", key: "about" },
    { id: "contact", label: "Contact", key: "contact" },
    // Only appears once an EPK PDF is uploaded; the link opens it directly.
    { id: "epk", label: "EPK", key: "epk" },
  ];
  const primary: NavItem[] = primaryDefs
    .filter((d) => {
      // EPK only appears when a PDF is set — the link opens it directly.
      if (d.id === "epk") return Boolean(epkPdf);
      return !d.key || st(d.key) !== "off";
    })
    .map(({ id, label }) => ({ id, label, href: id === "epk" ? epkPdf : undefined }));

  const secondaryDefs = [
    { id: "awards", label: "Awards", key: "awards" as const },
    { id: "portfolio", label: "Portfolio", key: "portfolio" as const },
    { id: "links", label: "Links", key: "links" as const },
  ];
  const secondary: NavItem[] = secondaryDefs
    .filter((d) => st(d.key) !== "off")
    .map(({ id, label }) => ({ id, label }));

  return (
    <>
      <Nav primary={primary} secondary={secondary} logo={settings["site.logo"]} logoSize={settings["site.logoSize"]} />

      <Hero
        image={settings["hero.image"]}
        name={settings["hero.name"]}
        roleLine={settings["hero.roleLine"]}
        roleColor={safeHexColor(settings["hero.roleColor"], HERO_ROLE_COLOR_FALLBACK)}
      />

      {/* 2 — Live performances */}
      {st("photos") === "on" && <Photos photos={photos} email={email} {...txt("photos")} />}
      {st("photos") === "soon" && <ComingSoon id="photos" {...txt("photos")} />}

      {/* 3 — Latest release + selected catalog */}
      <Featured releases={featured} />
      {st("catalog") === "on" && <Catalog releases={releases} {...txt("catalog")} />}
      {st("catalog") === "soon" && <ComingSoon id="catalog" {...txt("catalog")} />}

      {/* 4 — Films & videos */}
      {st("videos") === "on" && <Videos videos={videos} {...txt("videos")} />}
      {st("videos") === "soon" && <ComingSoon id="videos" {...txt("videos")} />}

      {/* 5 — Merch */}
      {st("merch") !== "off" && <Merch items={merch} {...txt("merch")} />}

      {/* 6 — About, with the EPK download */}
      {st("about") === "on" && (
        <About
          p1={settings["about.p1"]}
          p2={settings["about.p2"]}
          image={settings["about.image"]}
          epkPdf={epkPdf}
          {...txt("about")}
        />
      )}
      {st("about") === "soon" && <ComingSoon id="about" {...txt("about")} />}

      {/* 7 — Awards & recognition, closing out the artist's story */}
      {st("awards") === "on" && <Awards awards={awards} {...txt("awards")} />}

      {/* Portfolio still exists but sits after About, off the main flow. */}
      {st("portfolio") === "on" && <Portfolio items={portfolio} {...txt("portfolio")} />}
      {st("portfolio") === "soon" && <ComingSoon id="portfolio" {...txt("portfolio")} />}

      {/* 8 — Contact / booking */}
      {st("contact") !== "off" && (
        <Contact
          email={email}
          whatsapp={settings["contact.whatsapp"]}
          whatsappUrl={settings["contact.whatsappUrl"]}
          labelName={settings["label.name"]}
          labelLocation={settings["label.location"]}
          inquiryTypes={parseListSetting(settings["contact.inquiryTypes"])}
          {...txt("contact")}
        />
      )}

      {st("links") === "on" && <Links links={links} {...txt("links")} />}
      {st("links") === "soon" && <ComingSoon id="links" {...txt("links")} />}

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
