// Browser-only: turns a big audio file (typically a WAV) into an MP3 small
// enough to upload through the server route, whose request body is capped at
// ~4.5 MB on Vercel. Picks the highest standard bitrate that still fits.

const STANDARD_KBPS = [192, 160, 128, 112, 96, 80, 64];
const SAMPLE_RATE = 44100;
const BLOCK = 1152;

function toInt16(src: Float32Array): Int16Array {
  const out = new Int16Array(src.length);
  for (let i = 0; i < src.length; i++) {
    const s = Math.max(-1, Math.min(1, src[i]));
    out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return out;
}

export async function compressToMp3(
  file: File,
  maxBytes: number,
  onProgress?: (pct: number) => void
): Promise<File> {
  const Ctx: typeof AudioContext =
    window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  let ctx: AudioContext;
  try {
    ctx = new Ctx({ sampleRate: SAMPLE_RATE });
  } catch {
    ctx = new Ctx();
  }

  let audio: AudioBuffer;
  try {
    audio = await ctx.decodeAudioData(await file.arrayBuffer());
  } catch {
    throw new Error("Couldn't read that audio file. Try an MP3 or WAV.");
  } finally {
    void ctx.close();
  }

  const affordableKbps = (maxBytes * 0.95 * 8) / audio.duration / 1000;
  const kbps = STANDARD_KBPS.find((k) => k <= affordableKbps);
  if (!kbps) {
    throw new Error("This track is too long to fit. Export a shorter or lower-bitrate MP3 and upload that.");
  }

  const channels = Math.min(2, audio.numberOfChannels);
  const left = toInt16(audio.getChannelData(0));
  const right = channels === 2 ? toInt16(audio.getChannelData(1)) : undefined;

  const { Mp3Encoder } = await import("@breezystack/lamejs");
  const encoder = new Mp3Encoder(channels, audio.sampleRate, kbps);
  const parts: Uint8Array[] = [];

  for (let i = 0, n = 0; i < left.length; i += BLOCK, n++) {
    const chunk = encoder.encodeBuffer(
      left.subarray(i, i + BLOCK),
      right ? right.subarray(i, i + BLOCK) : undefined
    );
    if (chunk.length) parts.push(chunk);
    // Give the page a moment to breathe so the progress number can update.
    if (n % 200 === 0) {
      onProgress?.(Math.round((i / left.length) * 100));
      await new Promise((r) => setTimeout(r, 0));
    }
  }
  const tail = encoder.flush();
  if (tail.length) parts.push(tail);
  onProgress?.(100);

  const name = file.name.replace(/\.[^.]+$/, "") + ".mp3";
  return new File(parts as BlobPart[], name, { type: "audio/mpeg" });
}
