import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import type { LabelProduction, Release } from "@prisma/client";
import { getLabelArtistBySlug } from "@/lib/data";
import AudioPlayer from "@/components/site/AudioPlayer";

type ProductionWithRelease = LabelProduction & { release: Release | null };

/** Same priority as the main Music Catalog: Bandcamp first, then whichever
 *  streaming link the release actually has. */
function releaseListenLink(r: Release): string | undefined {
  return r.bandcampUrl || r.spotifyUrl || r.appleUrl || r.soundcloudUrl || r.youtubeUrl || undefined;
}

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yongolailan.xyz";
// Same asset as the label page's preview image — the fallback here when an
// artist has no photo of their own.
const LABEL_SHARE_IMAGE = `${siteUrl}/images/caribbean-sea-sound-share.jpg`;

// Next 14 doesn't carry a route segment's file-based icon.png across a
// dynamic [slug] boundary, so it's set explicitly here instead.
const LABEL_ICON = "/caribbean-sea-sound/icon.png";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const artist = await getLabelArtistBySlug(params.slug);
  if (!artist) return { title: { absolute: "Artist — Caribbean Sea Sound" }, icons: { icon: LABEL_ICON } };

  const title = `${artist.name} — Caribbean Sea Sound`;
  const description =
    artist.shortDescription ||
    (artist.bio ? artist.bio.slice(0, 155) : `${artist.name} on Caribbean Sea Sound, the Brooklyn record label.`);
  // The artist's own photo when there is one; otherwise the label's shared
  // preview image, so every subpage still shows something on share.
  const image = artist.profileImage || artist.image || LABEL_SHARE_IMAGE;
  const url = `${siteUrl}/caribbean-sea-sound/artists/${artist.slug}`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    icons: { icon: LABEL_ICON },
    openGraph: {
      type: "profile",
      url,
      title,
      description,
      siteName: "Caribbean Sea Sound",
      images: [{ url: image, alt: artist.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

// Songs with their own dedicated page on the site, keyed by normalised title.
// Clicking the song title in the artist page opens it.
const SONG_PAGES: Record<string, string> = {
  justanotherday: "/just-another-day",
};
const songKey = (t: string) => t.toLowerCase().replace(/[^a-z0-9]/g, "");

function Song({ song }: { song: ProductionWithRelease }) {
  // A linked Music Catalog release supplies title/cover/credits/description/
  // year/type/listen-link; the production's own fields are the fallback for
  // songs entered by hand. Featured artists and the audio file always stay
  // the production's own — they're specific to this label credit.
  const r = song.release;
  const title = r?.title || song.title;
  const cover = r?.coverImage || song.cover;
  const credit = r?.credits || song.credit;
  const description = r?.description || song.description;
  const releaseType = r?.releaseType || song.releaseType;
  const year = r?.year || song.releaseDate || song.year;
  const listenUrl = r ? releaseListenLink(r) : song.linkUrl || undefined;

  const meta = [releaseType, year].filter(Boolean);
  const pageHref = SONG_PAGES[songKey(title)];

  return (
    <div className="cssound-song">
      {cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="cssound-song-cover" src={cover} alt={`${title} cover`} loading="lazy" />
      ) : (
        <div className="cssound-song-cover cssound-song-cover--empty mono" aria-hidden>
          ♪
        </div>
      )}

      <div style={{ minWidth: 0 }}>
        <div className="cssound-song-title">
          {pageHref ? (
            <Link href={pageHref} className="cssound-song-link">
              {title}
            </Link>
          ) : (
            title
          )}
          {song.featuredArtists ? <span className="cssound-song-feat"> {song.featuredArtists}</span> : null}
        </div>

        <div className="cssound-song-meta mono">
          {meta.map((m) => (
            <span key={m}>{m}</span>
          ))}
          {credit ? <span className="credit">{credit}</span> : null}
        </div>

        {description ? <p className="cssound-song-desc">{description}</p> : null}

        {song.audioFile ? <AudioPlayer src={song.audioFile} title={title} /> : null}

        {listenUrl ? (
          <a href={listenUrl} target="_blank" rel="noopener noreferrer" className="cssound-song-ext mono">
            Listen elsewhere ↗
          </a>
        ) : null}
      </div>
    </div>
  );
}

export default async function ArtistPage({ params }: { params: { slug: string } }) {
  noStore();
  const artist = await getLabelArtistBySlug(params.slug);
  if (!artist) notFound();

  const photo = artist.profileImage || artist.image;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: artist.name,
    url: `${siteUrl}/caribbean-sea-sound/artists/${artist.slug}`,
    ...(photo ? { image: photo } : {}),
    ...(artist.bio ? { description: artist.bio } : {}),
    memberOf: {
      "@type": "Organization",
      name: "Caribbean Sea Sound",
      url: `${siteUrl}/caribbean-sea-sound`,
    },
    ...(artist.productions.length
      ? { track: artist.productions.map((p) => ({ "@type": "MusicRecording", name: p.release?.title || p.title })) }
      : {}),
  };

  return (
    <main className="cssound-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="cssound-artist">
        <Link href="/caribbean-sea-sound" className="cssound-artist-back mono">
          ← All artists
        </Link>

        <div className="cssound-artist-head">
          <div>
            <h1 className="cssound-artist-name">{artist.name}</h1>
            {artist.role ? <div className="cssound-artist-role mono">{artist.role}</div> : null}

            {/* Songs sit right under the Role / Origin (and, on phones, before
                the bio and photo). No "Produced by …" label. */}
            <section className="cssound-songs">
              {artist.productions.length === 0 ? (
                <p className="cssound-songs-empty">Songs coming soon.</p>
              ) : (
                artist.productions.map((p) => <Song key={p.id} song={p} />)
              )}
            </section>

            {artist.bio ? <p className="cssound-artist-bio">{artist.bio}</p> : null}

            {(artist.websiteUrl || artist.instagramUrl || artist.merchUrl || artist.linkUrl) && (
              <div className="cssound-artist-links">
                {artist.websiteUrl ? (
                  <a className="cssound-artist-link mono" href={artist.websiteUrl} target="_blank" rel="noopener noreferrer">
                    Website ↗
                  </a>
                ) : null}
                {artist.instagramUrl ? (
                  <a className="cssound-artist-link mono" href={artist.instagramUrl} target="_blank" rel="noopener noreferrer">
                    Instagram ↗
                  </a>
                ) : null}
                {artist.merchUrl ? (
                  <a className="cssound-artist-link mono" href={artist.merchUrl} target="_blank" rel="noopener noreferrer">
                    Merch ↗
                  </a>
                ) : null}
                {artist.linkUrl ? (
                  <a className="cssound-artist-link mono" href={artist.linkUrl} target="_blank" rel="noopener noreferrer">
                    Listen ↗
                  </a>
                ) : null}
              </div>
            )}
          </div>

          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="cssound-artist-photo" src={photo} alt={artist.name} />
          ) : null}
        </div>
      </div>
    </main>
  );
}
