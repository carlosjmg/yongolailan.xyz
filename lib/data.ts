import { prisma } from "./prisma";

// Public data-access helpers. Each returns published rows in display order,
// and degrades to an empty list if the database is momentarily unavailable.

export async function getReleases() {
  try {
    return await prisma.release.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
  } catch {
    return [];
  }
}

export async function getFeaturedReleases() {
  try {
    return await prisma.release.findMany({
      where: { published: true, featured: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
  } catch {
    return [];
  }
}

export async function getVideos() {
  try {
    return await prisma.video.findMany({
      where: { published: true },
      // Featured curation floats to the front; manual order breaks ties.
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
    });
  } catch {
    return [];
  }
}

export async function getGames() {
  try {
    return await prisma.game.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
  } catch {
    return [];
  }
}

export async function getPhotos() {
  try {
    return await prisma.photo.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
  } catch {
    return [];
  }
}

export async function getLinks() {
  try {
    return await prisma.link.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
  } catch {
    return [];
  }
}

export async function getAwards() {
  try {
    return await prisma.award.findMany({ orderBy: { sortOrder: "asc" } });
  } catch {
    return [];
  }
}

export async function getMerch() {
  try {
    return await prisma.merchItem.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
  } catch {
    return [];
  }
}

/**
 * Caribbean Sea Sound roster: every published artist, alphabetical by name so
 * new artists slot in automatically. Productions are attached for anywhere that
 * needs them (the directory itself only uses the artist fields).
 */
export async function getLabelRoster() {
  try {
    const artists = await prisma.labelArtist.findMany({
      where: { published: true },
      include: {
        productions: {
          where: { published: true },
          orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        },
      },
    });
    // Sort in the app, locale-aware and accent-insensitive, so the order is
    // identical on SQLite and Postgres (DB collations disagree on í vs i).
    return artists.sort((a, b) => a.name.localeCompare(b.name, "es", { sensitivity: "base" }));
  } catch {
    return [];
  }
}

/** A single published artist by slug, with their published songs. */
export async function getLabelArtistBySlug(slug: string) {
  try {
    return await prisma.labelArtist.findFirst({
      where: { slug, published: true },
      include: {
        productions: {
          where: { published: true },
          orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        },
      },
    });
  } catch {
    return null;
  }
}

/** Slugs of published artists — for the sitemap. */
export async function getLabelArtistSlugs(): Promise<string[]> {
  try {
    const rows = await prisma.labelArtist.findMany({
      where: { published: true, NOT: { slug: "" } },
      select: { slug: true },
    });
    return rows.map((r) => r.slug);
  } catch {
    return [];
  }
}
