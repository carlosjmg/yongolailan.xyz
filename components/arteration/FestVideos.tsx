"use client";

import { useState } from "react";
import { toEmbedUrl } from "@/lib/video";

type V = { id: string; title: string; embedUrl: string; thumbnail: string | null; edition: string };

function VideoCard({ v }: { v: V }) {
  const embed = toEmbedUrl(v.embedUrl);
  const poster = (v.thumbnail || "").trim();
  const [playing, setPlaying] = useState(false);
  const src = embed ? (poster ? embed + (embed.includes("?") ? "&" : "?") + "autoplay=1" : embed) : null;

  return (
    <figure className="af-video">
      <div className="af-video-frame">
        {embed && poster && !playing ? (
          <button
            type="button"
            className="af-video-poster"
            style={{ backgroundImage: `url(${poster})` }}
            onClick={() => setPlaying(true)}
            aria-label={`Play ${v.title}`}
          >
            <span className="af-play" aria-hidden="true" />
          </button>
        ) : src ? (
          <iframe
            src={src}
            title={v.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <a
            className="af-video-poster"
            href={v.embedUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={poster ? { backgroundImage: `url(${poster})` } : undefined}
            aria-label={`Watch ${v.title}`}
          >
            <span className="af-play" aria-hidden="true" />
          </a>
        )}
      </div>
      <figcaption>
        {v.edition ? <span className="af-video-year">{v.edition}</span> : null}
        <span className="af-video-title">{v.title}</span>
      </figcaption>
    </figure>
  );
}

export default function FestVideos({ videos }: { videos: V[] }) {
  return (
    <div className="af-video-grid">
      {videos.map((v) => (
        <VideoCard key={v.id} v={v} />
      ))}
    </div>
  );
}
