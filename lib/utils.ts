export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function nl2br(input: string): string {
  return input.replace(/\r?\n/g, "<br>");
}

/**
 * URL-safe slug from a name. Strips accents (Rocío -> rocio), lowercases, and
 * collapses everything else to single hyphens.
 */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "") // drop combining accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
