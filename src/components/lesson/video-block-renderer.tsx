"use client";

import React from "react";
import { Video, Clock } from "lucide-react";
import { VideoBlock, VideoBlockData, ContentBlockWithDetails } from "@/types/content";

interface VideoBlockRendererProps {
  block: VideoBlock | ContentBlockWithDetails;
}

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com")) {
      const v = parsed.searchParams.get("v");
      if (v) return `https://www.youtube-nocookie.com/embed/${v}`;
    }
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.slice(1);
      if (id) return `https://www.youtube-nocookie.com/embed/${id}`;
    }
    if (url.includes("/embed/")) {
      return url;
    }
  } catch {
    // If not a full URL or parsing fails
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
      return `https://www.youtube-nocookie.com/embed/${url}`;
    }
  }
  return null;
}

function getVimeoEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("vimeo.com")) {
      const id = parsed.pathname.split("/").filter(Boolean).pop();
      if (id && /^\d+$/.test(id)) {
        return `https://player.vimeo.com/video/${id}`;
      }
    }
  } catch {
    if (/^\d+$/.test(url)) {
      return `https://player.vimeo.com/video/${url}`;
    }
  }
  return null;
}

export function VideoBlockRenderer({ block }: VideoBlockRendererProps) {
  const videoData: VideoBlockData | undefined =
    ("data" in block && block.data ? (block.data as VideoBlockData) : undefined) ||
    ("videoConfig" in block && block.videoConfig ? block.videoConfig : undefined);

  if (!videoData || !videoData.url) {
    return (
      <div className="w-full p-8 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] text-center text-sm text-[#555555] flex flex-col items-center gap-3">
        <Video className="w-8 h-8 text-slate-400" />
        <p>No video source specified for this block.</p>
      </div>
    );
  }

  const { url, provider, title, durationSeconds, caption } = videoData;

  const formattedDuration = durationSeconds
    ? `${Math.floor(durationSeconds / 60)}:${String(durationSeconds % 60).padStart(2, "0")}`
    : null;

  return (
    <div className="my-8 w-full max-w-4xl mx-auto rounded-3xl bg-white border border-[#E5E5E5] shadow-xs overflow-hidden transition-all hover:shadow-sm">
      <div className="px-6 py-4 border-b border-[#E5E5E5] bg-[#FAFAFA] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Video className="w-4 h-4 text-[#C0222E]" />
          <h3 className="text-sm font-bold text-black uppercase tracking-wide">
            {title || block.title || "Video Lesson"}
          </h3>
        </div>
        {formattedDuration && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{formattedDuration}</span>
          </span>
        )}
      </div>

      <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
        {provider === "youtube" ? (
          <iframe
            src={getYouTubeEmbedUrl(url) || url}
            title={title || "YouTube video player"}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : provider === "vimeo" ? (
          <iframe
            src={getVimeoEmbedUrl(url) || url}
            title={title || "Vimeo video player"}
            className="w-full h-full border-0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            controls
            className="w-full h-full object-contain"
            preload="metadata"
          >
            <source src={url} />
            Your browser does not support the video tag.
          </video>
        )}
      </div>

      {(caption || block.description) && (
        <div className="px-6 py-3.5 bg-white border-t border-[#E5E5E5] text-xs text-[#555555] text-center font-medium">
          {caption || block.description}
        </div>
      )}
    </div>
  );
}
