"use client";

import { useRef, useState } from "react";

/**
 * A very discreet audio preview: a play/pause circle, "PREVIEW", and a thin
 * progress line. Plays only the fragment [start, start+duration] of the hosted
 * track (nothing loads until pressed), then stops on its own.
 */
export default function PreviewButton({
  src,
  start,
  duration,
}: {
  src: string;
  start: number;
  duration: number;
}) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1 within the fragment

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      const begin = () => {
        try {
          el.currentTime = start;
        } catch {
          /* not seekable yet — timeupdate will correct */
        }
        void el.play();
      };
      if (el.readyState >= 1) begin();
      else {
        el.load();
        el.addEventListener("loadedmetadata", begin, { once: true });
      }
    } else {
      el.pause();
    }
  };

  const onTime = () => {
    const el = ref.current;
    if (!el) return;
    const t = el.currentTime - start;
    if (t >= duration) {
      el.pause();
      el.currentTime = start;
      setProgress(0);
      return;
    }
    setProgress(Math.min(1, Math.max(0, t / duration)));
  };

  return (
    <div className="jad-preview">
      <button
        type="button"
        className="jad-preview-btn"
        onClick={toggle}
        aria-label={playing ? "Pause preview" : "Play preview"}
      >
        {playing ? (
          <svg width="10" height="11" viewBox="0 0 10 11" aria-hidden>
            <rect x="0.5" y="0.5" width="3" height="10" fill="currentColor" />
            <rect x="6.5" y="0.5" width="3" height="10" fill="currentColor" />
          </svg>
        ) : (
          <svg width="10" height="11" viewBox="0 0 10 11" aria-hidden>
            <path d="M0.5 0.5 L9.5 5.5 L0.5 10.5 Z" fill="currentColor" />
          </svg>
        )}
      </button>
      <span className="jad-preview-label">Preview</span>
      <span className="jad-preview-bar">
        <span style={{ width: `${progress * 100}%` }} />
      </span>
      <audio
        ref={ref}
        src={src}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setProgress(0);
        }}
        onTimeUpdate={onTime}
      />
    </div>
  );
}
