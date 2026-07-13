import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/session";
import { uploadFile } from "@/lib/blob";

const MAX_BYTES = 15 * 1024 * 1024; // 15 MB

export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File is too large (max 15 MB)." }, { status: 400 });
  }

  try {
    const url = await uploadFile(file);
    return NextResponse.json({ url });
  } catch (e) {
    console.error("[upload] error:", e);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}
