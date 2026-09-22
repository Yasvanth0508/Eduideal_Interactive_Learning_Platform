import type { Metadata } from "next";
import { ChapterDetailView } from "@/features/subjects/components/chapter-detail-view";

export const metadata: Metadata = {
  title: "Solutions — CBSE Class 12 Chemistry Topics | Learnova",
  description:
    "Learn the concepts of solutions step by step. Master concentration units, Raoult's law, colligative properties, and abnormal molar masses.",
};

export default async function SolutionsChapterPage() {
  return <ChapterDetailView subjectSlug="chemistry" chapterSlug="solutions" />;
}
