"use client";

/**
 * Opens the background loop full-screen — turning the ambient visualizer into
 * a piece of content without leaving the page. Uses the standard Fullscreen
 * API, with the iOS video-specific fallback.
 */
export default function VisualizerButton({ label }: { label: string }) {
  const open = () => {
    const v = document.querySelector<HTMLVideoElement>(".jad-bg");
    if (!v) return;
    const el = v as HTMLVideoElement & {
      webkitRequestFullscreen?: () => void;
      webkitEnterFullscreen?: () => void;
    };
    if (el.requestFullscreen) void el.requestFullscreen().catch(() => {});
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.webkitEnterFullscreen) el.webkitEnterFullscreen();
    try {
      void v.play();
    } catch {
      /* already playing */
    }
  };

  return (
    <button type="button" className="jad-visualizer" onClick={open}>
      {label} <span aria-hidden>→</span>
    </button>
  );
}
