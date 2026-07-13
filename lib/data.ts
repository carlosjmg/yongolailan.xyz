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

export async function getPortfolio() {
  try {
    return await prisma.portfolioItem.findMany({
      where: { published: true },
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
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
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
