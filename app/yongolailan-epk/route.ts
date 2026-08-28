import { getAllSettings } from "@/lib/settings";

// Clean, branded URL for the EPK: /yongolailan-epk streams the PDF that's
// stored in Vercel Blob (whose real URL is long and changes on re-upload), so
// the address people see and share stays yongolailan.xyz/yongolailan-epk.
export const dynamic = "force-dynamic";

export async function GET() {
  let url = "";
  try {
    const s = await getAllSettings();
    url = s["epk.pdfUrl"] || "";
  } catch {
    /* fall through to the not-available response */
  }

  if (!url) {
    return new Response("EPK is not available yet.", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  let upstream: Response;
  try {
    upstream = await fetch(url, { cache: "no-store" });
  } catch {
    return new Response("EPK could not be loaded.", { status: 502 });
  }
  if (!upstream.ok || !upstream.body) {
    return new Response("EPK could not be loaded.", { status: 502 });
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "application/pdf",
      // inline = view in the browser; the filename is used if they save it.
      "Content-Disposition": 'inline; filename="Yongolailan-EPK.pdf"',
      // Light caching; a re-upload shows through within a few minutes.
      "Cache-Control": "public, max-age=60, s-maxage=300",
    },
  });
}
