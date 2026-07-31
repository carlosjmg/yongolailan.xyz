// Configuration that drives the generic admin CRUD screens. Each "collection"
// maps a URL key (e.g. /admin/catalog) to a Prisma model and a set of fields.

export type FieldType = "text" | "textarea" | "url" | "boolean" | "color" | "image" | "select";

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  required?: boolean;
  placeholder?: string;
  help?: string;
}

export interface ListColumn {
  name: string;
  label: string;
}

export interface Collection {
  key: string;
  model: string; // Prisma delegate name
  label: string; // plural, for headings
  singular: string;
  titleField: string;
  imageField?: string;
  hasPublished: boolean;
  fields: Field[];
  listColumns: ListColumn[];
}

export const COLLECTIONS: Record<string, Collection> = {
  catalog: {
    key: "catalog",
    model: "release",
    label: "Catalog / Music",
    singular: "release",
    titleField: "title",
    imageField: "coverImage",
    hasPublished: true,
    listColumns: [
      { name: "title", label: "Title" },
      { name: "year", label: "Year" },
      { name: "genre", label: "Genre" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "year", label: "Year", type: "text", required: true, placeholder: "2024" },
      { name: "genre", label: "Genre", type: "text", required: true, placeholder: "Afro-Cuban House" },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "credits", label: "Credits", type: "text", placeholder: "Produced by Yongolailan · Caribbean Sea Sound" },
      { name: "coverImage", label: "Cover art", type: "image" },
      { name: "accentColor", label: "Accent color", type: "color", help: "Used for this release's accents." },
      { name: "spotifyUrl", label: "Spotify link", type: "url" },
      { name: "appleUrl", label: "Apple Music link", type: "url" },
      { name: "soundcloudUrl", label: "SoundCloud link", type: "url" },
      { name: "youtubeUrl", label: "YouTube link", type: "url" },
      { name: "bandcampUrl", label: "Bandcamp link", type: "url" },
      { name: "featured", label: "Feature on home page", type: "boolean" },
      { name: "featuredType", label: "Featured label", type: "text", placeholder: "Latest Single", help: "Shown only when featured is on." },
      { name: "published", label: "Visible on site", type: "boolean" },
    ],
  },

  portfolio: {
    key: "portfolio",
    model: "portfolioItem",
    label: "Portfolio",
    singular: "portfolio item",
    titleField: "title",
    imageField: "image",
    hasPublished: true,
    listColumns: [
      { name: "title", label: "Title" },
      { name: "area", label: "Area" },
      { name: "tag", label: "Tag" },
    ],
    fields: [
      { name: "area", label: "Area", type: "select", options: ["music", "films", "games", "web"], required: true },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "subtitle", label: "Subtitle", type: "text" },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "tag", label: "Tag", type: "text", placeholder: "Record Label · Production" },
      { name: "linkUrl", label: "Link", type: "url" },
      { name: "image", label: "Image", type: "image" },
      { name: "color", label: "Accent color", type: "color" },
      { name: "published", label: "Visible on site", type: "boolean" },
    ],
  },

  videos: {
    key: "videos",
    model: "video",
    label: "Videos",
    singular: "video",
    titleField: "title",
    imageField: "thumbnail",
    hasPublished: true,
    listColumns: [{ name: "title", label: "Title" }],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "embedUrl", label: "Video link", type: "url", required: true, help: "YouTube or Vimeo link." },
      { name: "thumbnail", label: "Thumbnail", type: "image" },
      { name: "published", label: "Visible on site", type: "boolean" },
    ],
  },

  games: {
    key: "games",
    model: "game",
    label: "Games",
    singular: "game",
    titleField: "title",
    imageField: "cover",
    hasPublished: true,
    listColumns: [
      { name: "title", label: "Title" },
      { name: "platform", label: "Platform" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "cover", label: "Cover image", type: "image" },
      { name: "linkUrl", label: "Play / store link", type: "url" },
      { name: "platform", label: "Platform", type: "text", placeholder: "PC · itch.io" },
      { name: "published", label: "Visible on site", type: "boolean" },
    ],
  },

  photos: {
    key: "photos",
    model: "photo",
    label: "Live Performance",
    singular: "live item",
    titleField: "caption",
    imageField: "image",
    hasPublished: true,
    listColumns: [
      { name: "caption", label: "Caption" },
      { name: "category", label: "Category" },
    ],
    fields: [
      {
        name: "image",
        label: "Photo",
        type: "image",
        help: "Upload a photo — or leave this empty and paste a video link below instead.",
      },
      {
        name: "videoUrl",
        label: "Video link (optional)",
        type: "url",
        placeholder: "https://youtu.be/…",
        help: "YouTube or Vimeo. If set, this item shows as a video instead of a photo.",
      },
      { name: "caption", label: "Caption", type: "text", placeholder: "Live at Bellas Artes · 2025" },
      { name: "title", label: "Alt text / title", type: "text" },
      { name: "category", label: "Category", type: "select", options: ["live", "press", "artist", "other"] },
      { name: "published", label: "Visible on site", type: "boolean" },
    ],
  },

  links: {
    key: "links",
    model: "link",
    label: "Links",
    singular: "link",
    titleField: "name",
    hasPublished: true,
    listColumns: [
      { name: "name", label: "Platform" },
      { name: "handle", label: "Handle" },
      { name: "url", label: "URL" },
    ],
    fields: [
      { name: "name", label: "Platform", type: "text", required: true, placeholder: "Spotify" },
      { name: "handle", label: "Handle / username", type: "text", placeholder: "Yongolailan" },
      { name: "url", label: "URL", type: "url", required: true, placeholder: "https://open.spotify.com/artist/..." },
      { name: "color", label: "Accent color", type: "color" },
      { name: "published", label: "Visible on site", type: "boolean" },
    ],
  },

  awards: {
    key: "awards",
    model: "award",
    label: "Awards",
    singular: "award",
    titleField: "title",
    hasPublished: false,
    listColumns: [
      { name: "title", label: "Award" },
      { name: "year", label: "Year" },
      { name: "note", label: "Note" },
    ],
    fields: [
      { name: "title", label: "Award", type: "text", required: true, placeholder: "Cubadisco Award" },
      { name: "year", label: "Year", type: "text", required: true, placeholder: "2015" },
      { name: "note", label: "Note", type: "text", placeholder: "Electroacoustic category — Sueño Tropical" },
    ],
  },

  merch: {
    key: "merch",
    model: "merchItem",
    label: "Merch",
    singular: "merch item",
    titleField: "title",
    imageField: "image",
    hasPublished: true,
    listColumns: [
      { name: "title", label: "Title" },
      { name: "price", label: "Price" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true, placeholder: "Vinyl — Sueño Tropical" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "image", label: "Photo", type: "image" },
      { name: "linkUrl", label: "Buy link", type: "url", placeholder: "https://... (where people buy it)" },
      { name: "price", label: "Price", type: "text", placeholder: "$30" },
      { name: "published", label: "Visible on site", type: "boolean" },
    ],
  },
};

export function getCollection(key: string): Collection | undefined {
  return COLLECTIONS[key];
}

export const COLLECTION_KEYS = Object.keys(COLLECTIONS);
