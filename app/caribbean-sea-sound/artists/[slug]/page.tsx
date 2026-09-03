import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import type { LabelProduction } from "@prisma/client";
import { getLabelArtistBySlug } from "@/lib/data";
import AudioPlayer from "@/components/site/AudioPlayer";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yongolailan.xyz";
// Same asset as the label page's preview image — the fallback here when an
// artist has no photo of their own.
const LABEL_SHARE_IMAGE = `${siteUrl}/images/caribbean-sea-sound-share.jpg`;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const artist = await getLabelArtistBySlug(params.slug);
  if (!artist) return { title: { absolute: "Artist — Caribbean Sea Sound" } };

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

function Song({ song }: { song: LabelProduction }) {
  const meta = [song.releaseType, song.releaseDate || song.year].filter(Boolean);
  const pageHref = SONG_PAGES[songKey(song.title)];

  return (
    <div className="cssound-song">
      {song.cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="cssound-song-cover" src={song.cover} alt={`${song.title} cover`} loading="lazy" />
      ) : (
        <div className="cssound-song-cover cssound-song-cover--empty mono" aria-hidden>
          ♪
        </div>
      )}

      <div style={{ minWidth: 0 }}>
        <div className="cssound-song-title">
          {pageHref ? (
            <Link href={pageHref} className="cssound-song-link">
              {song.title}
            </Link>
          ) : (
            song.title
          )}
          {song.featuredArtists ? <span className="cssound-song-feat"> {song.featuredArtists}</span> : null}
        </div>

        <div className="cssound-song-meta mono">
          {meta.map((m) => (
            <span key={m}>{m}</span>
          ))}
          {song.credit ? <span className="credit">{song.credit}</span> : null}
        </div>

        {song.description ? <p className="cssound-song-desc">{song.description}</p> : null}

        {song.audioFile ? <AudioPlayer src={song.audioFile} title={song.title} /> : null}

        {song.linkUrl ? (
          <a href={song.linkUrl} target="_blank" rel="noopener noreferrer" className="cssound-song-ext mono">
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
      ? { track: artist.productions.map((p) => ({ "@type": "MusicRecording", name: p.title })) }
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
