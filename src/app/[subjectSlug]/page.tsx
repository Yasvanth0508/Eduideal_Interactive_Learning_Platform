import type { Metadata } from "next";
import { SubjectView } from "@/features/subjects/components/subject-view";

interface DynamicSubjectPageProps {
  params: Promise<{
    subjectSlug: string;
  }>;
}

export async function generateMetadata({
  params,
}: DynamicSubjectPageProps): Promise<Metadata> {
  const { subjectSlug } = await params;
  const capitalized =
    subjectSlug.charAt(0).toUpperCase() + subjectSlug.slice(1);

  return {
    title: `CBSE Class 12 ${capitalized} — Lessons & Topics | Learnova`,
    description: `Explore interactive ${subjectSlug} concepts, dynamic formulas, scientific charts, 3D simulations, and topic-wise practice problems for CBSE Class 12.`,
  };
}

export default async function DynamicSubjectPage({ params }: DynamicSubjectPageProps) {
  const { subjectSlug } = await params;
  const capitalized =
    subjectSlug.charAt(0).toUpperCase() + subjectSlug.slice(1);

  return <SubjectView subjectSlug={subjectSlug} subjectName={capitalized} />;
}
