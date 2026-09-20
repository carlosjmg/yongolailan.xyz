"use client";

import React, { useRef, useState } from "react";

function fmt(s: number) {
  if (!isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
}

/**
 * Minimal audio player for the label pages. Nothing loads until the visitor
 * presses play (preload="none"), so a page full of songs stays light.
 */
export default function AudioPlayer({ src, title }: { src: string; title: string }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      void el.play();
    } else {
      el.pause();
    }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !dur) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    el.currentTime = ratio * dur;
  };

  const pct = dur ? (cur / dur) * 100 : 0;

  return (
    <div className="cssound-player">
      <button
        type="button"
        className="cssound-player-btn"
        onClick={toggle}
        aria-label={playing ? `Pause ${title}` : `Play ${title}`}
      >
        {playing ? (
          <svg width="12" height="13" viewBox="0 0 12 13" aria-hidden>
            <rect x="1" y="1" width="3.5" height="11" fill="currentColor" />
            <rect x="7.5" y="1" width="3.5" height="11" fill="currentColor" />
          </svg>
        ) : (
          <svg width="12" height="13" viewBox="0 0 12 13" aria-hidden>
            <path d="M1 1 L11 6.5 L1 12 Z" fill="currentColor" />
          </svg>
        )}
      </button>

      <div className="cssound-player-track">
        <div
          className="cssound-player-bar"
          onClick={seek}
          role="slider"
          aria-label={`Seek ${title}`}
          aria-valuemin={0}
          aria-valuemax={Math.round(dur)}
          aria-valuenow={Math.round(cur)}
          tabIndex={0}
          onKeyDown={(e) => {
            const el = ref.current;
            if (!el || !dur) return;
            if (e.key === "ArrowRight") el.currentTime = Math.min(dur, el.currentTime + 5);
            if (e.key === "ArrowLeft") el.currentTime = Math.max(0, el.currentTime - 5);
          }}
        >
          <div className="cssound-player-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="cssound-player-time mono">
          <span>{fmt(cur)}</span>
          <span>{fmt(dur)}</span>
        </div>
      </div>

      <audio
        ref={ref}
        src={src}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(e) => setCur(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
      />
    </div>
  );
}
