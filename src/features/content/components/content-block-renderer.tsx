"use client";

import React from "react";
import { ContentBlockWithDetails } from "../types";
import { TheoryBlockRenderer } from "./theory-block-renderer";
import { QuestionsBlockRenderer } from "./questions-block-renderer";

interface ContentBlockRendererProps {
  block: ContentBlockWithDetails;
}

export function ContentBlockRenderer({ block }: ContentBlockRendererProps) {
  switch (block.type) {
    case "THEORY":
      return <TheoryBlockRenderer block={block} />;
    case "QUESTIONS":
      return <QuestionsBlockRenderer block={block} />;
    default:
      return (
        <div className="p-6 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] text-center text-xs text-[#555555]">
          Block type <code className="font-mono">{block.type}</code> is not supported for this topic.
        </div>
      );
  }
}
