import type { Metadata } from "next";
import { getTopicBySlug } from "@/features/subjects/queries";
import { TopicDetailView } from "@/features/subjects/components/topic-detail-view";

interface TopicPageProps {
  params: Promise<{
    topicSlug: string;
  }>;
}

export async function generateMetadata({
  params,
}: TopicPageProps): Promise<Metadata> {
  const { topicSlug } = await params;
  const topic = await getTopicBySlug("chemistry", "solutions", topicSlug);

  if (!topic) {
    return {
      title: "Topic Not Found | Learnova",
    };
  }

  return {
    title: `${topic.name} — Solutions | CBSE Class 12 Chemistry | Learnova`,
    description: topic.description || undefined,
  };
}

export default async function ChemistrySolutionsTopicPage({ params }: TopicPageProps) {
  const { topicSlug } = await params;

  return (
    <TopicDetailView
      subjectSlug="chemistry"
      chapterSlug="solutions"
      topicSlug={topicSlug}
    />
  );
}
