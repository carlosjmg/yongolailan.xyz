// Fonts offered in the admin for the section headers. Each maps to a CSS
// variable declared by next/font in app/layout.tsx. The site sets
// --header-font to the chosen one; SectionHeader reads it for the big title.
export const HEADER_FONTS: { key: string; label: string; cssVar: string }[] = [
  { key: "cormorant", label: "Cormorant — elegant serif (current)", cssVar: "--font-display" },
  { key: "playfair", label: "Playfair Display — dramatic serif", cssVar: "--font-playfair" },
  { key: "ebgaramond", label: "EB Garamond — classic serif", cssVar: "--font-ebgaramond" },
  { key: "jost", label: "Jost — geometric / Bauhaus", cssVar: "--font-bauhaus" },
  { key: "inter", label: "Inter — clean sans", cssVar: "--font-body" },
  { key: "spacegrotesk", label: "Space Grotesk — modern sans", cssVar: "--font-spacegrotesk" },
  { key: "oswald", label: "Oswald — condensed", cssVar: "--font-oswald" },
  { key: "bebas", label: "Bebas Neue — tall display", cssVar: "--font-bebas" },
  { key: "anton", label: "Anton — bold display", cssVar: "--font-anton" },
];

export const HEADER_FONT_KEYS = HEADER_FONTS.map((f) => f.key);

/** CSS variable for a chosen font key (falls back to the current display font). */
export function headerFontVar(key: string | undefined): string {
  return (HEADER_FONTS.find((f) => f.key === key) || HEADER_FONTS[0]).cssVar;
}
