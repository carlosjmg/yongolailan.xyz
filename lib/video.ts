/**
 * Turn a normal YouTube/Vimeo link into an embeddable player URL.
 * Returns null when the link isn't recognised, so callers can fall back to a
 * thumbnail that simply opens the original link.
 */
export function toEmbedUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const url = raw.trim();

  // YouTube: watch?v=, youtu.be/, /embed/, /shorts/, /live/
  const yt =
    url.match(/[?&]v=([A-Za-z0-9_-]{11})/) ||
    url.match(/youtu\.be\/([A-Za-z0-9_-]{11})/) ||
    url.match(/youtube\.com\/(?:embed|shorts|live)\/([A-Za-z0-9_-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?rel=0`;

  // Vimeo
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;

  return null;
}
