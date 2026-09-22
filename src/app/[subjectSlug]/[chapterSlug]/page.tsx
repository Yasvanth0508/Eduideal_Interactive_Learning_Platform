import type { Metadata } from "next";
import { getChapterWithTopics } from "@/features/subjects/queries";
import { ChapterDetailView } from "@/features/subjects/components/chapter-detail-view";

interface DynamicChapterPageProps {
  params: Promise<{
    subjectSlug: string;
    chapterSlug: string;
  }>;
}

export async function generateMetadata({
  params,
}: DynamicChapterPageProps): Promise<Metadata> {
  const { subjectSlug, chapterSlug } = await params;
  const chapterData = await getChapterWithTopics(subjectSlug, chapterSlug);

  if (!chapterData) {
    return {
      title: "Chapter Not Found | Learnova",
    };
  }

  return {
    title: `${chapterData.name} — ${chapterData.subjectName} Topics | Learnova`,
    description: chapterData.description || undefined,
  };
}

export default async function DynamicChapterPage({ params }: DynamicChapterPageProps) {
  const { subjectSlug, chapterSlug } = await params;

  return <ChapterDetailView subjectSlug={subjectSlug} chapterSlug={chapterSlug} />;
}
