"use client";

import React from "react";
import dynamic from "next/dynamic";
import { AlertCircle } from "lucide-react";
import { ContentBlock, ContentBlockWithDetails } from "@/types/content";
import { TheoryBlockRenderer } from "./theory-block-renderer";
import { QuestionsBlockRenderer } from "./questions-block-renderer";
import { FormulaBlockRenderer } from "./formula-block-renderer";
import { ImageBlockRenderer } from "./image-block-renderer";
import { VideoBlockRenderer } from "./video-block-renderer";

// Dynamically import heavy renderers so ECharts and Three.js are kept out of initial page bundles
const DynamicGraphBlockRenderer = dynamic(
  () => import("./graph-block-renderer").then((m) => m.GraphBlockRenderer),
  {
    loading: () => (
      <div className="w-full h-[360px] my-6 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] flex items-center justify-center type-caption text-[#555555] animate-pulse">
        Loading scientific graph module...
      </div>
    ),
    ssr: false,
  }
);

const DynamicThreeDBlockRenderer = dynamic(
  () => import("./three-d-block-renderer").then((m) => m.ThreeDBlockRenderer),
  {
    loading: () => (
      <div className="w-full h-[360px] my-6 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] flex items-center justify-center type-caption text-[#555555] animate-pulse">
        Loading 3D visualization engine...
      </div>
    ),
    ssr: false,
  }
);

interface ContentBlockRendererProps {
  block: ContentBlock | ContentBlockWithDetails;
}

export function ContentBlockRenderer({ block }: ContentBlockRendererProps) {
  switch (block.type) {
    case "THEORY":
      return <TheoryBlockRenderer block={block} />;

    case "IMAGE":
      return <ImageBlockRenderer block={block} />;

    case "FORMULA":
      return <FormulaBlockRenderer block={block} />;

    case "GRAPH":
      return <DynamicGraphBlockRenderer block={block} />;

    case "THREE_D":
      return <DynamicThreeDBlockRenderer block={block} />;

    case "VIDEO":
      return <VideoBlockRenderer block={block} />;

    case "QUESTIONS":
      return <QuestionsBlockRenderer block={block} />;

    default: {
      const exhaustiveCheck: string = (block as { type?: string }).type || "UNKNOWN";
      return (
        <div className="p-6 my-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 type-caption flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div>
            <p className="font-semibold">Unsupported Content Block</p>
            <p className="type-metadata text-amber-700">
              The content block type &ldquo;{exhaustiveCheck}&rdquo; does not have an active renderer configured.
            </p>
          </div>
        </div>
      );
    }
  }
}
