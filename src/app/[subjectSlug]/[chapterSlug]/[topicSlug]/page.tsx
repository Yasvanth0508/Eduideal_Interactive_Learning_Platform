import type { Metadata } from "next";
import { getTopicBySlug } from "@/features/subjects/queries";
import { TopicDetailView } from "@/features/subjects/components/topic-detail-view";

interface DynamicTopicPageProps {
  params: Promise<{
    subjectSlug: string;
    chapterSlug: string;
    topicSlug: string;
  }>;
}

export async function generateMetadata({
  params,
}: DynamicTopicPageProps): Promise<Metadata> {
  const { subjectSlug, chapterSlug, topicSlug } = await params;
  const topic = await getTopicBySlug(subjectSlug, chapterSlug, topicSlug);

  if (!topic) {
    return {
      title: "Topic Not Found | Learnova",
    };
  }

  return {
    title: `${topic.name} — ${topic.chapterName} | ${topic.subjectName} | Learnova`,
    description: topic.description || undefined,
  };
}

export default async function DynamicTopicPage({ params }: DynamicTopicPageProps) {
  const { subjectSlug, chapterSlug, topicSlug } = await params;

  return (
    <TopicDetailView
      subjectSlug={subjectSlug}
      chapterSlug={chapterSlug}
      topicSlug={topicSlug}
    />
  );
}
