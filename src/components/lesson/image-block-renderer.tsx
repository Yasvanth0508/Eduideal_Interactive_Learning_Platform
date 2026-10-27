"use client";

import React, { useState } from "react";
import { ImageIcon, AlertCircle } from "lucide-react";
import { ImageBlock, ImageBlockData, ContentBlockWithDetails } from "@/types/content";

interface ImageBlockRendererProps {
  block: ImageBlock | ContentBlockWithDetails;
}

export function ImageBlockRenderer({ block }: ImageBlockRendererProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Extract payload from either block.data or block.image
  const imageData: ImageBlockData | undefined =
    ("data" in block && block.data ? (block.data as ImageBlockData) : undefined) ||
    ("image" in block && block.image ? block.image : undefined);

  if (!imageData || !imageData.url) {
    return (
      <div className="w-full p-8 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] text-center text-sm text-[#555555] flex flex-col items-center gap-3">
        <ImageIcon className="w-8 h-8 text-slate-400" />
        <p>No image URL specified for this block.</p>
      </div>
    );
  }

  const { url, altText, caption, width, height, aspectRatio } = imageData;

  return (
    <figure className="my-8 w-full max-w-4xl mx-auto rounded-3xl bg-white border border-[#E5E5E5] shadow-xs overflow-hidden transition-all hover:shadow-sm">
      {block.title && (
        <div className="px-6 py-4 border-b border-[#E5E5E5] bg-[#FAFAFA] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#C0222E]" />
            <h3 className="text-sm font-bold text-black uppercase tracking-wide">
              {block.title}
            </h3>
          </div>
          {block.description && (
            <span className="text-xs text-[#555555]">{block.description}</span>
          )}
        </div>
      )}

      <div
        className="relative w-full flex items-center justify-center bg-slate-50 overflow-hidden"
        style={{
          minHeight: height ? `${Math.min(height, 500)}px` : "280px",
          aspectRatio: aspectRatio || undefined,
        }}
      >
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100 animate-pulse text-xs text-[#555555]">
            <ImageIcon className="w-6 h-6 mr-2 opacity-50 animate-bounce" />
            <span>Loading image...</span>
          </div>
        )}

        {hasError ? (
          <div className="p-8 text-center text-xs text-[#555555] flex flex-col items-center gap-2">
            <AlertCircle className="w-6 h-6 text-amber-500" />
            <p>Unable to load image resource.</p>
            <span className="text-[10px] text-slate-400 font-mono truncate max-w-xs">{url}</span>
          </div>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={url}
            alt={altText || block.title || "Lesson illustration"}
            width={width}
            height={height}
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={`max-w-full h-auto object-contain transition-opacity duration-300 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
      </div>

      {caption && (
        <figcaption className="px-6 py-3.5 bg-white border-t border-[#E5E5E5] text-xs text-[#555555] text-center font-medium">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
