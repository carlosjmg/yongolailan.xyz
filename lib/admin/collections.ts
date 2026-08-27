// Configuration that drives the generic admin CRUD screens. Each "collection"
// maps a URL key (e.g. /admin/catalog) to a Prisma model and a set of fields.

export type FieldType =
  | "text"
  | "textarea"
  | "url"
  | "boolean"
  | "color"
  | "image"
  | "audio"
  | "select";

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  /**
   * For a select whose choices are other records (e.g. picking which artist a
   * production belongs to). The edit screen loads these at render time.
   */
  optionsFrom?: { model: string; labelField: string };
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
  /** Pulled into the list view so a column can show a related record's name. */
  include?: Record<string, unknown>;
  /** When set, saveRecord keeps a URL-safe slug in sync with this field. */
  slugFrom?: string;
  /** List the records A–Z by titleField (and hide manual reordering). */
  alphabetical?: boolean;
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
      { name: "releaseType", label: "Type" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "year", label: "Year", type: "text", required: true, placeholder: "2024" },
      {
        name: "releaseType",
        label: "Type",
        type: "select",
        options: ["Single", "EP", "Album"],
        help: "Used for the Album / EP / Single filter on the site.",
      },
      { name: "description", label: "Description (optional)", type: "textarea" },
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
      { name: "featured", label: "Featured (show first)", type: "boolean", help: "Featured videos are highlighted and sorted to the front." },
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
    label: "Live",
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

  // ── Caribbean Sea Sound (own page, /caribbean-sea-sound) ──
  "label-artists": {
    key: "label-artists",
    model: "labelArtist",
    label: "Label — Artists",
    singular: "artist",
    titleField: "name",
    imageField: "image",
    hasPublished: true,
    slugFrom: "name",
    alphabetical: true,
    listColumns: [
      { name: "name", label: "Artist" },
      { name: "role", label: "Role / origin" },
    ],
    fields: [
      { name: "name", label: "Artist name", type: "text", required: true, placeholder: "Arema Arega" },
      { name: "role", label: "Role / origin", type: "text", placeholder: "Vocals · Havana, Cuba" },
      {
        name: "shortDescription",
        label: "Short description (directory)",
        type: "textarea",
        help: "One line shown under the photo in the artist directory. Keep it short.",
      },
      { name: "bio", label: "Full biography", type: "textarea", help: "Longer bio shown on the artist's own page." },
      {
        name: "image",
        label: "Directory image",
        type: "image",
        help: "Shown when someone hovers/taps the artist in the directory.",
      },
      {
        name: "profileImage",
        label: "Profile image (artist page)",
        type: "image",
        help: "A second, larger photo used on the artist's own page. Optional.",
      },
      { name: "websiteUrl", label: "Website", type: "url", placeholder: "https://…" },
      { name: "instagramUrl", label: "Instagram", type: "url", placeholder: "https://instagram.com/…" },
      { name: "merchUrl", label: "Merch link", type: "url", placeholder: "https://… (where fans buy their merch)" },
      { name: "linkUrl", label: "Listen link", type: "url", placeholder: "https://open.spotify.com/artist/…" },
      { name: "published", label: "Visible on site", type: "boolean" },
    ],
  },

  "label-productions": {
    key: "label-productions",
    model: "labelProduction",
    label: "Label — Songs",
    singular: "song",
    titleField: "title",
    imageField: "cover",
    hasPublished: true,
    include: { artist: true },
    listColumns: [
      { name: "title", label: "Song" },
      { name: "artist.name", label: "Artist" },
      { name: "year", label: "Year" },
    ],
    fields: [
      {
        name: "artistId",
        label: "Artist",
        type: "select",
        optionsFrom: { model: "labelArtist", labelField: "name" },
        required: true,
        help: "Add the artist first under Label — Artists, then pick them here.",
      },
      { name: "title", label: "Song title", type: "text", required: true },
      { name: "featuredArtists", label: "Featured artists", type: "text", placeholder: "feat. Someone", help: "Optional." },
      { name: "cover", label: "Cover artwork", type: "image", help: "Square works best. Optimised automatically." },
      {
        name: "audioFile",
        label: "Audio file",
        type: "audio",
        help: "Upload an MP3 or M4A. It plays in the on-site player. Large files upload straight to storage.",
      },
      { name: "year", label: "Year", type: "text", placeholder: "2023" },
      { name: "releaseDate", label: "Release date (optional)", type: "text", placeholder: "2023-06-15" },
      { name: "credit", label: "Your credit", type: "text", placeholder: "Produced, mixed & mastered" },
      { name: "description", label: "Description (optional)", type: "textarea" },
      { name: "releaseType", label: "Type", type: "select", options: ["Single", "EP", "Album", "Remix", "Feature"] },
      { name: "linkUrl", label: "External link (optional)", type: "url", placeholder: "https://open.spotify.com/track/…" },
      { name: "published", label: "Visible on site", type: "boolean" },
    ],
  },
};

export function getCollection(key: string): Collection | undefined {
  return COLLECTIONS[key];
}

export const COLLECTION_KEYS = Object.keys(COLLECTIONS);
