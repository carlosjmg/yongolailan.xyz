import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { isAuthenticated } from "@/lib/session";

// Client-side direct upload to Vercel Blob. The browser uploads straight to
// storage, so this bypasses Vercel's 4.5 MB serverless request-body cap — the
// right path for audio files. Minting client tokens needs a read-write token
// (OIDC covers server-side `put`, not client tokens), so this route stays
// disabled with a clear message until BLOB_READ_WRITE_TOKEN is set.
export async function POST(request: Request): Promise<NextResponse> {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Audio upload isn't enabled yet. Add a BLOB_READ_WRITE_TOKEN in Vercel (Storage → your Blob store → .env) and redeploy.",
      },
      { status: 501 }
    );
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        // Re-checked here because this callback runs before a token is minted.
        if (!(await isAuthenticated())) throw new Error("Unauthorized");
        return {
          allowedContentTypes: [
            "audio/mpeg", // mp3
            "audio/mp4", // m4a
            "audio/aac",
            "audio/x-m4a",
            "audio/ogg",
            "audio/wav",
            "audio/x-wav",
          ],
          addRandomSuffix: true,
          maximumSizeInBytes: 30 * 1024 * 1024, // 30 MB is plenty for a web MP3
        };
      },
      // No DB write needed here — the admin form saves the returned URL.
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(jsonResponse);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Upload failed." },
      { status: 400 }
    );
  }
}
